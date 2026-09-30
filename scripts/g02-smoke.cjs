/* G02 冒烟验证：/result 页 L3 散文层真实渲染（playwright） */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));

  const url = 'http://localhost:5210/result?g=male&y=1990&m=6&d=15&ti=0';
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

  // 等待解盘结果卡出现
  await page.waitForSelector('text=散文层', { timeout: 30000 }).catch(() => {});

  // 点击 L3 散文层
  const clicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const l3 = btns.find((b) => b.textContent && b.textContent.includes('散文层'));
    if (l3) { l3.click(); return true; }
    return false;
  });
  console.log('L3_BUTTON_CLICKED=' + clicked);

  // 等待散文层卡片渲染
  await page.waitForTimeout(1500);

  const poemText = await page.evaluate(() => {
    const section = [...document.querySelectorAll('section')].find((s) =>
      (s.getAttribute('aria-label') || '').includes('散文层'));
    return section ? section.textContent : null;
  });
  console.log('POEM_SECTION_FOUND=' + (poemText !== null));
  if (poemText) console.log('POEM_TEXT_PREVIEW=' + poemText.replace(/\s+/g, ' ').slice(0, 300));

  // 校验：应包含诗行内容与意象锚定徽标
  const hasLines = poemText && !poemText.includes('暂未生成专属散文诗');
  const hasMeta = poemText && poemText.includes('意象锚定');
  console.log('HAS_POEM_LINES=' + !!hasLines);
  console.log('HAS_ANCHOR_META=' + !!hasMeta);

  await page.screenshot({ path: 'docs/g02-result-l3-smoke.png', fullPage: false });
  console.log('SCREENSHOT_SAVED=docs/g02-result-l3-smoke.png');
  console.log('CONSOLE_ERRORS=' + JSON.stringify(errors.slice(0, 5)));

  await browser.close();
  process.exit(hasLines && hasMeta && errors.length === 0 ? 0 : 1);
})();
