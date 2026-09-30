/**
 * F01 · 深度游标 L0-L4 功能验证（Playwright 无头）
 * 验证点：
 * 1. /result 页渲染深度游标（role=slider，aria-label=深度游标 L0-L4）
 * 2. 默认 L2 白话层渲染（深度面板标题）
 * 3. 点击 L0 档 → 面板切到事实层
 * 4. 键盘 ArrowRight → 从 L0 步进到 L1
 * 5. 拖动：pointer 事件从 L1 拖到 L4 → 面板切到决策层
 * 6. 页面无 console/page error
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:5299';
const RESULT_URL = `${BASE}/result?gender=male&year=1990&month=6&day=15&timeIndex=6`;

const results = [];
function check(name, pass, extra = '') {
  results.push({ name, pass, extra });
  console.log(`${pass ? 'PASS' : 'FAIL'} · ${name}${extra ? ` · ${extra}` : ''}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(String(err)));

try {
  await page.goto(RESULT_URL, { waitUntil: 'networkidle', timeout: 45000 });

  // 1. 深度游标存在
  const slider = page.locator('[role="slider"][aria-label="深度游标 L0-L4"]');
  const sliderCount = await slider.count();
  check('深度游标渲染（role=slider）', sliderCount === 1, `count=${sliderCount}`);

  if (sliderCount === 1) {
    // aria 属性
    const ariaNow = await slider.getAttribute('aria-valuenow');
    const ariaText = await slider.getAttribute('aria-valuetext');
    check('aria-valuenow 存在', ariaNow !== null, `now=${ariaNow}`);
    check('aria-valuetext 描述档位', (ariaText ?? '').includes('白话层'), `text=${ariaText}`);

    // 2. 默认 L2 白话层
    const panelTitle = page.locator('section[aria-label] h3').first();
    const panelText = await panelTitle.textContent().catch(() => '');
    check('默认深度面板 = 白话层', (panelText ?? '').includes('白话层'), `title=${panelText}`);

    // 3. 点击 L0 档
    const l0Btn = page.locator('button', { hasText: /^L0/ }).first();
    await l0Btn.click();
    await page.waitForTimeout(400);
    const panelTextL0 = await page.locator('section[aria-label] h3').first().textContent().catch(() => '');
    check('点击 L0 → 事实层面板', (panelTextL0 ?? '').includes('事实层'), `title=${panelTextL0}`);

    // 4. 键盘 ArrowRight → L1
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    const panelTextL1 = await page.locator('section[aria-label] h3').first().textContent().catch(() => '');
    check('键盘 → 术语层面板', (panelTextL1 ?? '').includes('术语层'), `title=${panelTextL1}`);

    // 5. 拖动：从游标中段按下，水平拖到右端 → L4 决策层
    const box = await slider.boundingBox();
    if (box) {
      const startX = box.x + box.width * 0.15; // L1 附近
      const endX = box.x + box.width * 0.92;   // L4 附近
      const y = box.y + box.height * 0.4;
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      const panelTextDrag = await page.locator('section[aria-label] h3').first().textContent().catch(() => '');
      check('拖动 → 决策层面板', (panelTextDrag ?? '').includes('决策层'), `title=${panelTextDrag}`);
    } else {
      check('拖动 → 决策层面板', false, '无法获取游标 boundingBox');
    }

    // 6. L3 散文层（点击 L3 档验证散文卡）
    const l3Btn = page.locator('button', { hasText: /^L3/ }).first();
    await l3Btn.click();
    await page.waitForTimeout(600);
    const panelTextL3 = await page.locator('section[aria-label] h3').first().textContent().catch(() => '');
    check('点击 L3 → 散文层卡片', (panelTextL3 ?? '').includes('散文层'), `title=${panelTextL3}`);
  }
} catch (e) {
  check('页面访问', false, String(e).slice(0, 200));
}

// 页面错误检查
const realErrors = consoleErrors.filter((e) => !e.includes('favicon'));
check('无 console/page error', realErrors.length === 0, realErrors.slice(0, 2).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n=== 结果：${results.length - failed.length}/${results.length} 通过 ===`);
process.exit(failed.length > 0 ? 1 : 0);
