// 样例入口：node gen-sample.mjs
// 产出：
//   out/命律-十维报告样例.pdf        —— 交付样例（内嵌子集字体）
//   out/_证据_全字体嵌入对比.pdf      —— 同内容但内嵌整字体，用于体积对比
//   out/assets/simhei.subset.ttf     —— 子集字体实体
//   out/subset-evidence.json         —— 体积/字体证据
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locateCjkFont, readFontBuffer } from './fontSource.mjs';
import { renderReportPdf } from './renderReportPdf.mjs';
import { inspectPdfFonts } from './verify-subset.mjs';
import { sampleReport } from './sample-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'out');
const ASSETS_DIR = path.join(OUT_DIR, 'assets');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const fontPath = locateCjkFont();
  const fullFont = readFontBuffer(fontPath);
  console.log(`[字体源] ${fontPath}  (${fullFont.length} bytes)`);

  // 1) 子集版（交付样例）
  const subsetPdf = path.join(OUT_DIR, '命律-十维报告样例.pdf');
  const r1 = await renderReportPdf({
    report: sampleReport,
    outPath: subsetPdf,
    fullFontBuffer: fullFont,
    subset: true,
  });
  console.log(`[样例·子集] ${subsetPdf}  (${r1.fileSize} bytes)`);

  // 落盘子集字体实体（证据）
  const subsetTtf = path.join(ASSETS_DIR, 'simhei.subset.ttf');
  fs.writeFileSync(subsetTtf, r1.embeddedFontBuffer);

  // 2) 全字体版（对比证据）
  const fullPdf = path.join(OUT_DIR, '_证据_全字体嵌入对比.pdf');
  const r2 = await renderReportPdf({
    report: sampleReport,
    outPath: fullPdf,
    fullFontBuffer: fullFont,
    subset: false,
  });
  console.log(`[对比·全字体] ${fullPdf}  (${r2.fileSize} bytes)`);

  // 3) 提取内嵌字体证据
  const evSubset = inspectPdfFonts(subsetPdf);
  const evFull = inspectPdfFonts(fullPdf);

  const evidence = {
    generatedAt: new Date().toISOString(),
    fontSource: fontPath,
    sourceFontBytes: fullFont.length,
    usedCharCount: r1.usedCharCount,
    subsetFontBytesOnDisk: r1.embeddedFontSize,
    subsetTtfArtifact: subsetTtf,
    subsetPdf: {
      path: subsetPdf,
      bytes: r1.fileSize,
      embeddedFontProgramBytes: evSubset.embeddedPrograms,
      baseFonts: evSubset.baseFonts,
      subsetTagged: evSubset.subsetTagged,
      hasFontFile2: evSubset.hasFontFile2,
    },
    fullFontPdf: {
      path: fullPdf,
      bytes: r2.fileSize,
      embeddedFontProgramBytes: evFull.embeddedPrograms,
      baseFonts: evFull.baseFonts,
    },
    // 内嵌字体程序（解压后）相对整份字体的比例：证明只嵌了子集
    embeddedVsFullRatio:
      evSubset.embeddedPrograms[0]?.inflatedFontProgramBytes / fullFont.length,
  };

  const evidencePath = path.join(OUT_DIR, 'subset-evidence.json');
  fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
  console.log(`\n[证据] ${evidencePath}`);
  console.log(JSON.stringify(evidence, null, 2));
}

main().catch((e) => {
  console.error('[gen-sample] 失败：', e);
  process.exit(1);
});
