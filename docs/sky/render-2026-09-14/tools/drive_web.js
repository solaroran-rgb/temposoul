const { chromium } = require('playwright-core');
const fs = require('fs');
const OUTDIR = 'C:/temp/tsprev';
const BASE = 'http://127.0.0.1:8903/';

const SCENES = [
  { tag: 'W1-fixed1920-good', url: BASE + 'home-web-fixed1920.html', kbps: 8000, lat: 40,  vp: [1920,969],  dom: true },
  { tag: 'W2-auto-good',      url: BASE + 'home-web.html?net=good', kbps: 8000, lat: 40,  vp: [1920,969],  dom: true },
  { tag: 'W3-auto-weak',      url: BASE + 'home-web.html?net=weak', kbps: 1600, lat: 150, vp: [1920,969],  dom: false },
  { tag: 'W4-auto-slow',      url: BASE + 'home-web.html?net=weak', kbps: 400,  lat: 400, vp: [1920,969],  dom: false },
  { tag: 'W5-portrait-390x844', url: BASE + 'home-web.html',        kbps: 8000, lat: 40,  vp: [390,844],   dom: true },
  { tag: 'W6-tablet-834x1112',  url: BASE + 'home-web.html',        kbps: 8000, lat: 40,  vp: [834,1112],  dom: true }
];

(async () => {
  const port = process.env.CDP_PORT || '9395';
  const browser = await chromium.connectOverCDP('http://127.0.0.1:' + port, { timeout: 25000 });
  const out = [];
  for (const s of SCENES) {
    const r = { tag: s.tag, kbps: s.kbps, lat: s.lat, errors: [] };
    try {
      const ctx = await browser.newContext({
        viewport: { width: s.vp[0], height: s.vp[1] },
        deviceScaleFactor: 1
      });
      const page = await ctx.newPage();
      page.on('pageerror', e => r.errors.push(e.message.slice(0, 240)));
      page.on('console', m => { if (m.type() === 'error') r.errors.push('console: ' + m.text().slice(0, 160)); });
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: s.lat,
        downloadThroughput: s.kbps * 1024 / 8, uploadThroughput: 512 * 1024 / 8
      });
      const t0 = Date.now();
      await page.goto(s.url, { waitUntil: 'load', timeout: 180000 });
      r.wallLoadMs = Date.now() - t0;
      await page.waitForFunction(() => window.__PERF && window.__PERF.firstFromNav,
                                 { timeout: 60000 }).catch(() => {});
      r.perf = await page.evaluate(() => window.__PERF || null);
      r.nav = await page.evaluate(() => {
        const n = performance.getEntriesByType('navigation')[0];
        const rs = performance.getEntriesByType('resource') || [];
        return n ? { responseEnd: +n.responseEnd.toFixed(1), load: +n.loadEventEnd.toFixed(1),
                     transfer: n.transferSize,
                     res: rs.map(x => ({ n: (x.name || '').split('/').pop(), sz: x.transferSize,
                                         dur: +x.duration.toFixed(0) })).slice(0, 6) } : null;
      });
      if (s.dom) r.dom = await page.evaluate(() => window.__DOMINFO ? window.__DOMINFO() : null);
      await page.waitForTimeout(700);
      // ① 带动态层（真实用户体验）
      if (s.dom) await page.screenshot({ path: OUTDIR + '/webLIVE_' + s.tag + '.png' });
      // ② 关动态层（纯静态对拍：页面静态态 vs 设计稿）
      await page.evaluate(() => window.__SETLIVE && window.__SETLIVE(false));
      await page.waitForTimeout(400);
      await page.screenshot({ path: OUTDIR + '/web_' + s.tag + '.png' });
      await ctx.close();
    } catch (e) { r.fatal = e.message; }
    out.push(r);
    console.log(JSON.stringify(r));
  }
  fs.writeFileSync(OUTDIR + '/_web.json', JSON.stringify(out, null, 2), 'utf8');
  await browser.close().catch(() => {});
})();
