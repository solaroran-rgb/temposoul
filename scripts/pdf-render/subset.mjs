// 字体子集化：把整份中文字体裁剪为只含本次报告用到的字形。
// 用 harfbuzz（经 subset-font）做子集，输出 sfnt(ttf) buffer 供 pdfkit 内嵌。
import subsetFont from 'subset-font';

// 安全兜底字符集：ASCII 可见字符 + 常用中文标点 + 全角符号，
// 避免报告里出现子集未覆盖的标点/数字导致缺字。
const SAFETY_CHARS =
  // ASCII 32..126
  Array.from({ length: 127 - 32 + 1 }, (_, i) => String.fromCharCode(32 + i)).join('') +
  // 常用中英文标点 / 全角符号
  '。，、；：？！“”‘’（）《》〈〉【】—…·～￥％℃→←↑↓★☆○●◎◇◆□■▲△▼▽';

/**
 * 收集一段内容里出现过的所有字符（去重）。
 * @param {*} data 任意 JSON 可序列化内容
 * @returns {string} 去重后的字符串
 */
export function collectUsedChars(data) {
  const set = new Set(SAFETY_CHARS.split(''));
  const walk = (v) => {
    if (v == null) return;
    if (typeof v === 'string') {
      for (const ch of v) set.add(ch);
    } else if (Array.isArray(v)) {
      v.forEach(walk);
    } else if (typeof v === 'object') {
      Object.values(v).forEach(walk);
    }
  };
  walk(data);
  return Array.from(set).join('');
}

/**
 * @param {Buffer} fullFontBuffer 整份 TTF
 * @param {string} usedChars 报告用到的全部字符
 * @returns {Promise<{buffer: Buffer, charCount: number}>} 子集字体 buffer
 */
export async function subsetCjkFont(fullFontBuffer, usedChars) {
  const subsetBuffer = await subsetFont(fullFontBuffer, usedChars, {
    targetFormat: 'sfnt',
    // 去掉 hinting 进一步瘦身；PDF 屏幕/打印渲染对 hinting 依赖低
    noHinting: true,
  });
  return { buffer: subsetBuffer, charCount: usedChars.length };
}
