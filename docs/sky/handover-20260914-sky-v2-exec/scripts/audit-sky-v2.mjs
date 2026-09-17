/**
 * audit-sky-v2.mjs —— /sky 视觉标准 v2 落地门禁（§12 对拍与门禁）
 * 1) 内置静态服务（dist/ + SPA history fallback + AVIF/WebP/JSON MIME）
 * 2) playwright chromium 双视口截图（1920×1080 桌面 / 390×844 移动竖屏）
 * 3) 采集 console error / pageerror / 导航与 paint 时序
 * 产物：docs/sky/visual-v2-20260914/raw/{desktop,mobile}.png + shoot.json
 * 用法：node scripts/audit-sky-v2.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'docs', 'sky', 'visual-v2-20260914', 'raw');
const PORT = 4399;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let fp = path.join(DIST, url);
  if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    const alt = path.join(DIST, url + '.html');
    fp = fs.existsSync(alt) ? alt : path.join(DIST, 'index.html'); // SPA fallback
  }
  try {
    const buf = fs.readFileSync(fp);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404); res.end('404');
  }
});

const SHOTS = [
  { tag: 'desktop', width: 1920, height: 1080, wait: 4200 },
  { tag: 'mobile', width: 390, height: 844, wait: 4200 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  console.log('[serve] http://127.0.0.1:' + PORT + '/sky  (dist=' + DIST + ')');

  const browser = await chromium.launch({ headless: true });
  const report = [];
  for (const s of SHOTS) {
    const ctx = await browser.newContext({
      viewport: { width: s.width, height: s.height }, deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 300)); });
    page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 300)));

    await page.goto('http://127.0.0.1:' + PORT + '/sky', { waitUntil: 'load', timeout: 60000 });
    await page.waitForSelector('canvas', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(s.wait);

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = {};
      for (const p of performance.getEntriesByType('paint')) paints[p.name] = Math.round(p.startTime);
      const cv = document.querySelector('canvas');
      const dom = document.body.innerText.replace(/\s+/g, ' ').trim();
      const h1 = document.querySelectorAll('h1');
      return {
        nav: { domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0) },
        paints,
        canvas: cv ? { w: cv.width, h: cv.height, cw: cv.clientWidth, ch: cv.clientHeight } : null,
        bodyText: dom.slice(0, 160),
        h1Count: h1.length,
        canvases: document.querySelectorAll('canvas').length,
      };
    });

    const file = path.join(OUT, s.tag + '.png');
    await page.screenshot({ path: file });
    report.push({ tag: s.tag, viewport: [s.width, s.height], timing, errors, file });
    console.log('[' + s.tag + '] ' + s.width + 'x' + s.height + '  canvas=' + JSON.stringify(timing.canvas)
      + '  errors=' + errors.length + '  paints=' + JSON.stringify(timing.paints));
    if (errors.length) errors.slice(0, 5).forEach((e) => console.log('   ERR ' + e));
    await ctx.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync(path.join(OUT, 'shoot.json'), JSON.stringify(report, null, 2), 'utf-8');
  console.log('[done] evidence -> ' + OUT);
})().catch((e) => { console.error('[FATAL]', e); process.exit(1); });
