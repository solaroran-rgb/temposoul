/**
 * 构建期标题注入 prerender（Blocker 1 / smoke 0/280 根治）。
 *
 * 背景：index.html 的 <title> 全局固定为"命律 · 东方智慧排盘与 AI 解读"，
 * 280 个内容 slug 走 SPA 客户端渲染 → 构建产物里没有每 slug 的 <title>，
 * 导致 smoke-runner（断言 html.includes(slugTitle)）0/280，且搜索引擎抓到的是
 * 千篇一律的 title（SEO 严重受损）。
 *
 * 方案：vite build 之后，读取 build/smoke-expectations.json 的 expectations[]，
 * 为每个 slug 复制 dist/index.html、注入该 slug 的 <title>（及 og/twitter title、
 * canonical），写入 dist/<slug>/index.html。CF Pages 把 dist 当静态资源服务，
 * /wiki/ten-gods 直接返回带正确 title 的页面 → smoke 通过 + SEO 修复 + LCP 不退化
 * （body 仍是完整 SPA，客户端照常接管水合）。
 *
 * 幂等：可重复运行；slug 数量与 smoke-expectations 一致才视为完整。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const SMOKE = join(ROOT, 'build', 'smoke-expectations.json');
const BASE_INDEX = join(DIST, 'index.html');

function fail(msg) {
  console.error(`[prerender-titles] ${msg}`);
  process.exit(1);
}

// ── 前置检查 ──
if (!existsSync(SMOKE)) fail(`smoke-expectations 不存在：${SMOKE}`);
if (!existsSync(BASE_INDEX)) fail(`dist/index.html 不存在：${BASE_INDEX}（请先 vite build）`);

const smoke = JSON.parse(readFileSync(SMOKE, 'utf8'));
const expectations = smoke.expectations;
if (!Array.isArray(expectations) || expectations.length === 0) {
  fail('smoke.expectations 不是非空数组');
}
const total = smoke.total ?? expectations.length;

const baseHtml = readFileSync(BASE_INDEX, 'utf8');

// 注入工具：把 slug 专属 title 写进 <title> / og:title / twitter:title / canonical
function injectTitle(src, title, slug) {
  const canonical = `https://www.temposoul.com${slug}`;
  let out = src;

  // 1) 主 <title>（smoke 断言的关键：html 必须包含 slug title）
  out = out.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeHtml(title)}</title>`,
  );

  // 2) og:title / twitter:title
  out = out.replace(
    /(<meta property="og:title" content=")([^"]*)(")/,
    `$1${escapeHtml(title)}$3`,
  );
  out = out.replace(
    /(<meta name="twitter:title" content=")([^"]*)(")/,
    `$1${escapeHtml(title)}$3`,
  );

  // 3) canonical 指到该 slug
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  // 4) og:url / twitter 主 url 指到该 slug
  out = out.replace(
    /(<meta property="og:url" content=")([^"]*)(")/,
    `$1${canonical}$3`,
  );

  // 5) 注入 prerender 标记注释，便于审计
  out = out.replace(
    /(<body)/i,
    `$1<!-- prerendered:prerender-titles ${slug} -->`,
  );
  return out;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── 主流程 ──
let written = 0;
for (const e of expectations) {
  const { slug, title } = e;
  if (typeof slug !== 'string' || typeof title !== 'string') continue;
  // slug 形如 /wiki/ten-goods → dist/wiki/ten-gods/index.html
  // 跳过根 /（已有 index.html，title 保持全局默认）
  if (slug === '/' || slug === '') continue;

  const rel = slug.replace(/^\/+/, ''); // 去掉前导斜杠
  const outDir = join(DIST, rel);
  const outFile = join(outDir, 'index.html');

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, injectTitle(baseHtml, title, slug), 'utf8');
  written += 1;
}

console.log(`[prerender-titles] 注入 ${written} / ${total} 个 slug（期望 ${smoke.total ?? '?'}）`);
if (written < total) {
  fail(`注入数量 ${written} 小于期望 ${total}，检查 smoke-expectations`);
}
console.log('[prerender-titles] 完成：smoke / SEO title 已就绪。');
