// 用本机 Chromium 打开生成的 PDF 并逐页截图，用于肉眼核验中文渲染。
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = process.argv[2] ?? path.join(__dirname, 'out', '命律-十维报告样例.pdf');
const outDir = path.join(__dirname, 'out', 'preview');
fs.mkdirSync(outDir, { recursive: true });

const CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\oran\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].find((p) => p && fs.existsSync(p));

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
const url = 'file:///' + path.resolve(pdfPath).replace(/\\/g, '/');
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1500);
// PDF viewer 里每一页是 embed；直接整页截图即可
const shot = path.join(outDir, 'page.png');
await page.screenshot({ path: shot, fullPage: true });
console.log('截图:', shot);
await browser.close();
