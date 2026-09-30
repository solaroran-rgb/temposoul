// verify-dist-integrity.mjs
// 产物完整性断言 ** Gate A（硬门禁）**：保证 dist/ 构建产物完整，
// 防止 assets 被剥离/丢失导致线上白屏。
// 用法：node scripts/verify-dist-integrity.mjs [distDir]
// 退出码：0 = 通过；非 0 = 断言失败（build/CI 应据此中止部署）。
//
// 为什么这是硬门禁：本文件只断言「产物完整性」—— dist/index.html 存在、
// 它引用的 assets 全部真实存在、assets/ 非空。一个成功的构建必然满足这三条，
// 不存在任何「合法变更导致其失败」的路径，误报成本为 0；而一旦失败就是全站白屏，
// 灾难级且 100% 用户可见（2026-09-26 事故即此）。故硬阻断，不设 continue-on-error。
//
// SEO / 元数据口径（canonical、hreflang、OG、title·description 唯一性、JSON-LD、
// robots/sitemap）不在这里 —— 那些会随内容/路由/语种正常漂移，属内容工单而非事故，
// 已拆分到 scripts/verify-dist-seo.mjs ** Gate B（软门禁）**，避免与白屏事故
// 共用同一个报警铃而稀释信号。

import fs from 'node:fs';
import path from 'node:path';

const DIST = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('dist');

const errors = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => { errors.push(msg); console.log(`  ✗ ${msg}`); };

console.log(`\n[verify-dist-integrity] 校验产物: ${DIST}\n`);

// 1) dist 存在
if (!fs.existsSync(DIST)) {
  console.error(`[verify-dist-integrity] dist 目录不存在: ${DIST}`);
  process.exit(1);
}

// 2) index.html 存在
const indexPath = path.join(DIST, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('[verify-dist-integrity] dist/index.html 不存在');
  process.exit(1);
}
ok(`index.html 存在 (${fs.statSync(indexPath).size} bytes)`);

// 3) 解析 index.html 引用的 asset（js/css/png/svg/ico/webmanifest），断言每个都真实存在
const html = fs.readFileSync(indexPath, 'utf8');
const assetRefs = new Set();
const refRe = /(?:src|href)=["']([^"']+\.(?:js|css|png|svg|jpe?g|webp|ico|webmanifest|json))["']/g;
let m;
while ((m = refRe.exec(html)) !== null) {
  let ref = m[1];
  // 去掉查询串/hash
  ref = ref.split('?')[0].split('#')[0];
  // 只校验本地引用（排除 http/https、// 开头的绝对外链）
  if (/^https?:\/\//.test(ref)) continue;
  assetRefs.add(ref);
}

let localRefs = [...assetRefs].filter((r) => r.startsWith('assets/') || !r.startsWith('/'));
// 统计本地 asset 引用数
const localAssetRefs = [...assetRefs].filter((r) => r.includes('assets/'));

if (localAssetRefs.length === 0) {
  fail('index.html 未引用任何 assets/ 资源 —— 可能构建异常或被剥离');
} else {
  ok(`index.html 引用 ${localAssetRefs.length} 个 assets/ 资源`);
}

// 逐个断言存在
let missing = 0;
for (const ref of localAssetRefs) {
  const fp = path.join(DIST, ref);
  if (!fs.existsSync(fp)) {
    fail(`缺失: ${ref}`);
    missing++;
  }
}
if (missing === 0 && localAssetRefs.length > 0) {
  ok(`全部 ${localAssetRefs.length} 个引用资源均存在`);
}

// 4) assets 目录本身存在且非空
const assetsDir = path.join(DIST, 'assets');
if (!fs.existsSync(assetsDir)) {
  fail('dist/assets/ 目录不存在');
} else {
  const entries = fs.readdirSync(assetsDir);
  if (entries.length === 0) {
    fail('dist/assets/ 目录为空 —— 产物被剥离');
  } else {
    ok(`dist/assets/ 含 ${entries.length} 个产物文件`);
  }
}

// 5) 生产域正确性（Gate A 中唯一的非完整性断言，经主理人裁定纳入硬门禁）
//
// 为什么必须放产物侧（不能放生成器侧）：
//   prerender-titles.mjs 里 canonical = `${SITE}${slug}`，而 SITE 是其 L20 的
//   硬编码常量。在生成器侧断言 startsWith(SITE) 是一条恒真的废断言 —— 值就是从
//   这个常量拼出来的，零拦截力。只有在这里把期望域名「独立」硬编码，才能抓住
//   「SITE 常量被误改成 pages.dev / localhost」这类构建配置回归。
//   误报路径已排查：全仓 pages.dev 只出现在探活脚本（promote-gate / rewarm /
//   warmup，均为 --base 传参），不生成 canonical。
//
// 为什么只查首页、不扫全站 280 页：
//   首页 canonical / og:url 由同一次构建确定性产出；若扫全站，则「某页面未被
//   prerender 因而没有 canonical」会被误判成硬失败 —— 那属于内容工单，不该由
//   硬门禁拦。逐页口径仍由 Gate B（软）覆盖。
const PROD_ORIGIN = 'https://www.temposoul.com';
// 严格匹配 origin：等于该域或以该域 + "/" 开头，
// 避免 https://www.temposoul.com.evil.com 这类同前缀异域名蒙混过关。
const isProdOrigin = (url) => url === PROD_ORIGIN || url.startsWith(`${PROD_ORIGIN}/`);

const canonicalHref =
  html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i)?.[0]?.match(/\bhref="([^"]*)"/i)?.[1] ?? '';
const ogUrlHref =
  html.match(/<meta\b(?=[^>]*\bproperty="og:url")[^>]*>/i)?.[0]?.match(/\bcontent="([^"]*)"/i)?.[1] ?? '';

if (!isProdOrigin(canonicalHref)) {
  fail(`首页 canonical 未指向生产域 ${PROD_ORIGIN}：${canonicalHref || '(缺失)'}`);
} else {
  ok(`首页 canonical 指向生产域 (${canonicalHref})`);
}
if (!isProdOrigin(ogUrlHref)) {
  fail(`首页 og:url 未指向生产域 ${PROD_ORIGIN}：${ogUrlHref || '(缺失)'}`);
} else {
  ok(`首页 og:url 指向生产域 (${ogUrlHref})`);
}

// 汇总
console.log('');
if (errors.length > 0) {
  console.error(`[verify-dist-integrity] ✗ 校验失败，共 ${errors.length} 项:`);
  for (const e of errors) console.error(`    - ${e}`);
  process.exit(1);
}
console.log('[verify-dist-integrity] ✓ 全部断言通过');
