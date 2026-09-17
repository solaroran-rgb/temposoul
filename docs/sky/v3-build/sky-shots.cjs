// sky-shots.cjs —— 经 CDP 连续截取 /sky 多张图
// 用法: node sky-shots.cjs <cdpPort> <outDir> <url1> [url2 ...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

(async () => {
  const [, , PORT, OUTDIR, ...urls] = process.argv;
  if (!PORT || !OUTDIR || !urls.length) { console.error('usage: node sky-shots.cjs <port> <outDir> <url...>'); process.exit(1); }
  fs.mkdirSync(OUTDIR, { recursive: true });
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
  const ctx = browser.contexts()[0] || await browser.newContext();
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e && e.message || e)));
    page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(9000);
    const out = path.join(OUTDIR, `shot${i + 1}.png`);
    await page.screenshot({ path: out });
    // WebGL 是否真的画出了东西（非全黑）
    const nonBlack = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      if (!c) return -1;
      return c.width * c.height;
    });
    results.push({ i: i + 1, url, out, canvasPixels: nonBlack, errors: errors.slice(0, 6) });
    await page.close();
  }
  fs.writeFileSync(path.join(OUTDIR, '_shots.json'), JSON.stringify(results, null, 1), 'utf8');
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(0);
})();
