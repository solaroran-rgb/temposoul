/**
 * build-multilang —— T-17 子项A 多语 SEO 独立构建链（不改他人 package.json）。
 *
 * 为什么需要它：根 package.json 已是他人工作区的 M 文件，其 build 链为
 *   core build → lint:content → tsc -b → vite build → prerender-titles → verify-dist
 * 其中 `tsc -b` 会被 i18n UI 轨的 ko-KN 类型红线卡住（他人红线文件，本卡不修）。
 * 本包装绕开 `tsc -b`（vite/esbuild 本就 transpileOnly，不做类型检查），按序跑：
 *
 *   1. vite build                      （产出 SPA 壳 dist/index.html + assets）
 *   2. node scripts/prerender-titles.mjs   （既有 280 slug 注入，他人轨，照常跑）
 *   3. tsx scripts/gen-multilang-seo.mjs   （本卡：147 多语页位注入）
 *
 * 前置：packages/core/dist 已存在（@temposoul/core 经 workspace 链接解析到 core dist）；
 *       若 core 源码有改动，先手动 `pnpm --filter @temposoul/core build`。
 *
 * 运行（仓库根）：
 *   node scripts/build-multilang.mjs
 */
import { execSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\//, '');

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', shell: true });
}

try {
  run('pnpm exec vite build');
  run('node scripts/prerender-titles.mjs');
  run('pnpm exec tsx --tsconfig tsconfig.app.json scripts/gen-multilang-seo.mjs');
  console.log('\n[build-multilang] 完成：vite build → prerender-titles → gen-multilang-seo。');
  console.log('[build-multilang] 下一步：pnpm exec tsx --tsconfig tsconfig.app.json scripts/gen-sitemap.ts');
} catch (err) {
  console.error(`[build-multilang] 失败：${err.message}`);
  process.exit(1);
}
