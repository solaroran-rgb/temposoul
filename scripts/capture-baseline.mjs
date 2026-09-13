import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = (process.argv.find((a) => a.startsWith('--base='))?.split('=')[1] || 'http://localhost:5173') + '/sky';
const OUT_DIR = path.resolve(__dirname, '../docs/sky');

async function capture() {
  // 使用 headless: true 保证 CI 可用，强制 viewport 与 dpr=1 确保渲染上下文正确
  const browser = await chromium.launch({ headless: true }); 

  const contexts = [
    { name: 'desktop', viewport: { width: 1920, height: 1080 }, dpr: 1 },
    // R-E4-1 修复：mobile dpr 统一为 1，与 E1 audit 及 diff 门禁对齐
    { name: 'mobile', viewport: { width: 390, height: 844 }, dpr: 1 } 
  ];

  for (const ctx of contexts) {
    const context = await browser.newContext({
      viewport: ctx.viewport,
      deviceScaleFactor: ctx.dpr,
    });
    const page = await context.newPage();

    console.log(`[Baseline] Capturing ${ctx.name} (${ctx.viewport.width}x${ctx.viewport.height} @${ctx.dpr}x)...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // 等待 Three.js 渲染循环稳定 (2.5s 覆盖 2s 硬约束 + 0.5s fade in)
    await page.waitForTimeout(2500); 

    await page.screenshot({ 
      path: path.join(OUT_DIR, `baseline-${ctx.name}.png`),
      fullPage: false
    });
    console.log(`[Baseline] Saved baseline-${ctx.name}.png`);
    await context.close();
  }

  await browser.close();
  console.log('[Baseline] Capture complete. Please commit to git.');
}

capture().catch(console.error);