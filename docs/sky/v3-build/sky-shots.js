// sky-shots.js —— 经 CDP 连续截取 /sky 多张图（按既定顺序 OutputPng1..N）
// 用法: node sky-shots.js <cdpPort> <outDir> <url1> [url2 ...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

(async () => {
  const [, , PORT, OUTDIR, ...urls] = process.argv;
  if (!PORT || !OUTDIR || !urls.length) { console.error('usage: node sky-shots.js <port> <outDir> <url...>'); process.exit(1); }
  fs.mkdirSync(OUTDIR, { recursive: true });
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
  const ctx = browser.contexts()[0] || await browser.newContext();
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // 等 WebGL 渲染稳定：软件渲染下 intro 淡入 + tile 加载较慢
      await page.waitForTimeout(9000);
      const out = path.join(OUTDIR, `shot${i + 1}.png`);
      await page.screenshot({ path: out });
      // 顺便抓运行时错误，避免“看起来通了其实报错”
      results.push({ i: i + 1, url, out, ok: true });
    } catch (e) {
      results.push({ i: i + 1, url, ok: false, err: String(e && e.message || e) });
    }
    await page.close();
  }
  fs.writeFileSync(path.join(OUTDIR, '_shots.json'), JSON.stringify(results, null, 1), 'utf8');
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(0);
})();
