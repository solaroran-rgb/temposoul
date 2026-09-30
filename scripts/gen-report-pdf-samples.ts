/**
 * 三类报告（流年 / 合婚 / 起名）PDF 样例生成器 —— 验收用。
 *
 * 走的是生产同一条打印路径：headless 打开真实页面 → page.pdf()（应用 @media print）。
 * 浏览器直接用本机已装的 Chrome（找不到再退 Edge），不下载 Chromium，装包即可跑。
 *
 * 用法（需先起 dev server，边缘函数不走 vite dev，故 /api/v1/bazi/calculate 用内核直算打桩）：
 *   node_modules/.bin/vite --port 5199
 *   node_modules/.bin/tsx scripts/gen-report-pdf-samples.ts
 */
import { chromium, type Page } from 'playwright';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { baziCalculator } from '../packages/core/src/bazi/baziCalculator';
import { analyzeBaziCompatibility } from '../packages/core/src/bazi/compatibilityEvidence';

type PersonInput = {
  name?: string;
  gender?: 'male' | 'female';
  dateType?: 'solar' | 'lunar';
  year?: number;
  month?: number;
  day?: number;
  timeIndex?: number;
};

function toPerson(input: PersonInput | undefined) {
  return {
    name: input?.name ?? '',
    gender: input?.gender === 'female' ? ('female' as const) : ('male' as const),
    dateType: input?.dateType === 'lunar' ? ('lunar' as const) : ('solar' as const),
    year: Number(input?.year ?? 1990),
    month: Number(input?.month ?? 1),
    day: Number(input?.day ?? 1),
    timeIndex: Number(input?.timeIndex ?? 6),
  };
}

const BASE = process.env.SAMPLE_BASE_URL ?? 'http://localhost:5199';
const OUT_DIR = path.resolve(process.cwd(), 'artifacts/report-pdf-samples');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\oran\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean) as string[];

const PDF_OPTIONS = {
  format: 'A4' as const,
  printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
};

function stamp(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

/** dev server 不跑 Cloudflare Functions，用与线上同一个内核函数打桩 */
async function stubBazeCalculate(page: Page): Promise<void> {
  await page.route('**/api/v1/bazi/calculate', async (route) => {
    const body = (route.request().postDataJSON?.() ?? {}) as Record<string, unknown>;
    const result = baziCalculator.calculateBazi({
      name: String(body.name ?? ''),
      gender: body.gender === 'female' ? 'female' : 'male',
      dateType: body.dateType === 'lunar' ? 'lunar' : 'solar',
      year: Number(body.year),
      month: Number(body.month),
      day: Number(body.day),
      timeIndex: Number(body.timeIndex),
    });
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify({ ok: true, data: result }),
    });
  });
}

async function stubBaziCompatibility(page: Page): Promise<void> {
  await page.route('**/api/v1/bazi/compatibility/prompt', async (route) => {
    const body = (route.request().postDataJSON?.() ?? {}) as {
      person1?: PersonInput;
      person2?: PersonInput;
    };
    const chart1 = baziCalculator.calculateBazi(toPerson(body.person1));
    const chart2 = baziCalculator.calculateBazi(toPerson(body.person2));
    const compatibility = analyzeBaziCompatibility(chart1, chart2, {
      person1Name: body.person1?.name ?? '',
      person2Name: body.person2?.name ?? '',
    });
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify({
        ok: true,
        data: {
          resultSummary: {
            people: compatibility.people,
            dayMasterRelation: compatibility.dayMasterRelation,
            spousePalaceRelations: compatibility.spousePalaceRelations,
            evidence: compatibility.evidence,
          },
        },
      }),
    });
  });
}

async function fillNumber(page: Page, index: number, value: string): Promise<void> {
  await page.locator('main input[type="number"]').nth(index).fill(value);
}

async function genLiunian(page: Page): Promise<string> {
  await stubBazeCalculate(page);
  await page.goto(`${BASE}/bazi/liunian`, { waitUntil: 'domcontentloaded' });
  await page.locator('main input:not([type])').first().fill('李承泽');
  await fillNumber(page, 0, '1990');
  await fillNumber(page, 1, '6');
  await fillNumber(page, 2, '15');
  await fillNumber(page, 3, '6');
  await fillNumber(page, 4, '2026');
  await page.locator('button.ts-btn--primary').click();
  await page.waitForSelector('[data-testid="report-export-btn"]', { timeout: 30_000 });
  const file = path.join(OUT_DIR, `命律-流年报告-李承泽-${stamp()}.pdf`);
  await page.pdf({ path: file, ...PDF_OPTIONS });
  return file;
}

async function genHehun(page: Page): Promise<string> {
  await stubBaziCompatibility(page);
  await page.goto(`${BASE}/bazi/compatibility`, { waitUntil: 'domcontentloaded' });
  const fieldsets = page.locator('fieldset.ts-fieldset');
  await fieldsets.first().waitFor();
  const people: Array<[string, number, number, number, number]> = [
    ['张若曦', 1993, 8, 12, 7],
    ['李承泽', 1995, 3, 22, 8],
  ];
  for (let i = 0; i < people.length; i++) {
    const [name, year, month, day, timeIndex] = people[i];
    const inputs = fieldsets.nth(i).locator('input');
    await inputs.nth(0).fill(name);
    await inputs.nth(1).fill(String(year));
    await inputs.nth(2).fill(String(month));
    await inputs.nth(3).fill(String(day));
    await inputs.nth(4).fill(String(timeIndex));
  }
  await page.locator('button.ts-btn--primary').click();
  await page.waitForSelector('[data-testid="report-export-btn"]', { timeout: 30_000 });
  const file = path.join(OUT_DIR, `命律-合婚报告-张若曦李承泽-${stamp()}.pdf`);
  await page.pdf({ path: file, ...PDF_OPTIONS });
  return file;
}

async function genNaming(page: Page): Promise<string> {
  await page.goto(`${BASE}/name-report?name=${encodeURIComponent('李昭元')}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('.name-report__block', { timeout: 30_000 });
  const file = path.join(OUT_DIR, `命律-起名报告-李昭元-${stamp()}.pdf`);
  await page.pdf({ path: file, ...PDF_OPTIONS });
  return file;
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    executablePath: CHROME_CANDIDATES.find((p) => existsSync(p)),
  });
  const page = await browser.newPage();

  const gen = [
    ['流年', genLiunian],
    ['合婚', genHehun],
    ['起名', genNaming],
  ] as const;

  for (const [label, fn] of gen) {
    try {
      console.log(`[样例] ${label} → ${await fn(page)}`);
    } catch (err) {
      console.error(`[样例] ${label} 失败：${err instanceof Error ? err.message : String(err)}`);
      process.exitCode = 1;
    }
  }

  await browser.close();
}

void main();
