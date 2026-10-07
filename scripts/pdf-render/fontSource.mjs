// 定位 CJK 字体源。优先级：env 覆盖 > 仓库内 assets > Windows 系统字体常见路径。
// 注意：不把整份系统字体（simhei.ttf ~9.7MB）提交进仓库（许可 + 体积）；
// 管线在运行时按路径读取，子集化后仅把用到的字形嵌入 PDF。
import { existsSync } from 'node:fs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 候选中文字体（单文件 TTF 优先；pdfkit/fontkit 对 .ttf 支持最稳，.ttc 需指定 collection index）
const FONT_CANDIDATES = [
  process.env.TEMPOSoul_CJK_FONT, // 显式覆盖
  path.join(__dirname, 'assets', 'fonts', 'simhei.ttf'), // 仓库内打包（如存在）
  'C:\\Windows\\Fonts\\simhei.ttf', // 黑体，单 TTF，9.7MB
  'C:\\Windows\\Fonts\\Deng.ttf', // 等线，单 TTF，16MB
  'C:\\Windows\\Fonts\\simkai.ttf', // 楷体，单 TTF
].filter(Boolean);

export function locateCjkFont() {
  for (const p of FONT_CANDIDATES) {
    if (p && existsSync(p)) return p;
  }
  throw new Error(
    '未找到 CJK 字体。请设置环境变量 TEMPOSoul_CJK_FONT 指向一个 .ttf 中文字体，' +
      '或将字体放到 scripts/pdf-render/assets/fonts/。已检索：\n' +
      FONT_CANDIDATES.join('\n'),
  );
}

export function readFontBuffer(fontPath) {
  return fs.readFileSync(fontPath);
}
