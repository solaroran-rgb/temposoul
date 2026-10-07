// 从生成的 PDF 中提取内嵌字体证据。
// pdfkit 不写 /Length1，因此直接定位 FontFile2 流、FlateDecode 解压后量出真实内嵌字体程序字节数。
// 用法：node verify-subset.mjs <pdfPath>
import fs from 'node:fs';
import zlib from 'node:zlib';

export function inspectPdfFonts(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const text = buf.toString('latin1');

  const baseFonts = [...text.matchAll(/\/BaseFont\s*\/([^\s\/>\]]+)/g)].map((m) => m[1]);
  // PDF 子集字体惯例名：6 个大写字母 + '+' 前缀（如 ABCDEF+SimHei）
  const subsetTagged = baseFonts.filter((n) => /^[A-Z]{6}\+/.test(n));

  // 定位 FontFile2 流并解压，量出内嵌字体程序真实字节
  const embeddedPrograms = [];
  let m;
  const refRe = /\/FontFile2\s+(\d+)\s+0\s+R/g;
  while ((m = refRe.exec(text))) {
    const objNum = m[1];
    const objRe = new RegExp(`${objNum} 0 obj`);
    const om = objRe.exec(text);
    if (!om) continue;
    const dictEnd = text.indexOf('stream', om.index);
    const dict = text.slice(om.index, dictEnd);
    const s0 = dictEnd + 'stream'.length;
    let s = s0;
    if (text[s] === '\r') s++;
    if (text[s] === '\n') s++;
    const e = text.indexOf('endstream', s);
    const raw = buf.slice(s, e);
    let inflatedBytes = null;
    try {
      inflatedBytes = zlib.inflateSync(raw).length;
    } catch {
      inflatedBytes = null;
    }
    embeddedPrograms.push({
      object: `${objNum} 0`,
      compressedStreamBytes: raw.length,
      inflatedFontProgramBytes: inflatedBytes,
      filter: (dict.match(/\/Filter\s*\/(\w+)/) || [])[1] || null,
    });
  }

  return {
    pdfSize: buf.length,
    baseFonts,
    subsetTagged,
    hasFontFile2: /\/FontFile2/.test(text),
    embeddedPrograms,
  };
}

if (process.argv[1] && process.argv[1].endsWith('verify-subset.mjs')) {
  const p = process.argv[2];
  if (!p) {
    console.error('用法：node verify-subset.mjs <pdfPath>');
    process.exit(1);
  }
  console.log(JSON.stringify(inspectPdfFonts(p), null, 2));
}
