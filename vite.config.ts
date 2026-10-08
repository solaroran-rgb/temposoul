import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { getManualChunk } from './build/chunking';

/**
 * 解析 .dev.vars 文件为 key-value 对象
 */
function parseDevVars(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const result: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

/**
 * 构建期把落地页路由 chunk（InputPage）注入 <link rel="modulepreload">。
 *
 * 背景：InputPage 在 App.tsx 中用 React.lazy 包裹，作为默认路由 "/"。
 * 未预载时，浏览器必须先下载并执行 entry chunk，才会发起 InputPage 的
 * 动态 import，形成「entry 完成 → 再拉 InputPage」的二次网络瀑布，
 * 直接推高 LCP 与 Speed Index（g1 实测 SI=2.3s，FCP=0.8s）。
 *
 * 此插件在构建产物里找到 assets/InputPage-*.js，在 index.html 的 entry
 * <script> 之前插入 modulepreload，使浏览器在下载 entry 的同时并行拉取
 * 落地页 chunk，消除二次瀑布。不改业务逻辑，不影响其它路由的懒加载。
 */
function preloadLandingChunkPlugin(): Plugin {
  return {
    name: 'preload-landing-chunk',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        let landingFile = '';
        for (const file of Object.keys(bundle)) {
          if (file.startsWith('assets/InputPage-') && file.endsWith('.js')) {
            landingFile = '/' + file;
            break;
          }
        }
        if (!landingFile) return html;
        const hint = `<link rel="modulepreload" crossorigin href="${landingFile}">`;
        // 插在 entry module script 之前，让浏览器尽早并行发起请求。
        return html.replace(
          '<script type="module" crossorigin',
          `${hint}<script type="module" crossorigin`,
        );
      },
    },
  };
}

/**
 * Vite 开发服务器中间件：在本地开发时处理 /api/v1/ai/* 请求。
 * 生产环境由 Cloudflare Pages Functions 处理，此插件不生效。
 */
function aiProxyDevPlugin(): Plugin {
  return {
    name: 'ai-proxy-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/v1/ai/')) return next();
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          res.end();
          return;
        }
        if (req.method !== 'POST') return next();

        // 动态导入共享代理逻辑
        const { handleAiAnalyze, handleAiModels } = await import('./src/lib/ai/proxy');

        // 读取 .dev.vars 环境变量
        const devVars = parseDevVars(path.resolve(__dirname, '.dev.vars'));

        // 将 Node.js IncomingMessage 转换为 Web Request
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        const body = Buffer.concat(chunks).toString('utf-8');
        const request = new Request(`http://localhost${req.url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });

        const response = req.url.startsWith('/api/v1/ai/models')
          ? await handleAiModels(request, devVars)
          : await handleAiAnalyze(request, devVars);

        // 将 Web Response 写回 Node.js ServerResponse
        res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
        if (response.body) {
          const reader = response.body.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          } catch {
            // 流中断
          }
        }
        res.end();
      });
    },
  };
}

// ── AI 功能开关 ──────────────────────────────────────
// AI_BUILTIN_ENABLED=true 且配置了 AI_API_KEY 时，页面显示内置 AI 选项。
// AI_DEFAULT_ENABLED=true 只表示默认打开 AI 解读；默认关闭时仍保留提示词模式。
const devVars = parseDevVars(path.resolve(__dirname, '.dev.vars'));
function readBuildEnv(name: string) {
  return process.env[name] ?? devVars[name];
}

const hasAiApiKey = Boolean(readBuildEnv('AI_API_KEY'));
const aiBuiltinFlag = readBuildEnv('AI_BUILTIN_ENABLED') ?? readBuildEnv('AI_DEFAULT_ENABLED');
const isAiBuiltinEnabled = aiBuiltinFlag === 'true' && hasAiApiKey;
const isAiDefaultEnabled = isAiBuiltinEnabled && readBuildEnv('AI_DEFAULT_ENABLED') === 'true';
const aiProviderName = readBuildEnv('AI_PROVIDER_NAME') ?? '';
const isDonationBoxEnabled = readBuildEnv('VITE_ENABLE_DONATION_BOX') === 'true';
// dev-only 标注工具栏开关（默认关闭；开启时由 AgentationHost 动态 import 包，
// 关闭时整分支被 tree-shake，产物不含 agentation 代码）
const isAgentationEnabled = readBuildEnv('VITE_ENABLE_AGENTATION') === 'true';

/**
 * iztro-vendor 是 CommonJS 整包（无 ESM 子路径），main build 与 worker build
 * 各自产出内容相同的 474KB chunk。用无哈希文件名让两次 build 覆盖到同一路径，
 * 浏览器只下载一次。其余 chunk 保留内容哈希以利用长效缓存。
 *
 * Worker build 的 manualChunks 只提取 iztro-vendor；其余依赖（tyme4ts、celestine、
 * 自身计算代码）保持内联，避免为每个 worker 再复制一份 tyme-vendor/ziwei-engine。
 */
function sharedChunkFileNames(chunkInfo: { name: string }) {
  if (chunkInfo.name === 'iztro-vendor') {
    return 'assets/iztro-vendor.js';
  }
  return 'assets/[name]-[hash].js';
}

/** Worker build 专用 manualChunks：只隔离 iztro，其余内联到 worker 入口。 */
function workerManualChunks(id: string) {
  if (id.includes('node_modules/iztro')) {
    return 'iztro-vendor';
  }
  return undefined;
}

export default defineConfig({
  define: {
    'import.meta.env.VITE_AI_ENABLED': JSON.stringify(isAiDefaultEnabled ? 'true' : 'false'),
    'import.meta.env.VITE_AI_BUILTIN_ENABLED': JSON.stringify(
      isAiBuiltinEnabled ? 'true' : 'false',
    ),
    'import.meta.env.VITE_AI_DEFAULT_ENABLED': JSON.stringify(
      isAiDefaultEnabled ? 'true' : 'false',
    ),
    'import.meta.env.VITE_AI_PROVIDER_NAME': JSON.stringify(aiProviderName),
    'import.meta.env.VITE_ENABLE_DONATION_BOX': JSON.stringify(
      isDonationBoxEnabled ? 'true' : 'false',
    ),
    'import.meta.env.VITE_ENABLE_AGENTATION': JSON.stringify(
      isAgentationEnabled ? 'true' : 'false',
    ),
  },
  plugins: [react(), aiProxyDevPlugin(), preloadLandingChunkPlugin()],
  worker: {
    format: 'es',
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          return workerManualChunks(id);
        },
        chunkFileNames: sharedChunkFileNames,
        inlineDynamicImports: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'packages/core/src'),
    },
  },
  build: {
    // three-vendor 已独立成块后，阈值收回 Vite 默认 500，让其余超块暴露出来
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return getManualChunk(id);
        },
        chunkFileNames: sharedChunkFileNames,
      },
    },
  },
});
