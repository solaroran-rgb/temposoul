// 可复用 PDF 渲染管线入口：renderReportPdf()
// 输入：报告对象 + 输出路径 + 整份 CJK 字体 buffer。
// 内部：收集用到的字符 → 子集化字体 → pdfkit 内嵌子集字体 → 排版输出。
//
// 这是 E-08 的服务端/脚本侧可复用模块；未来 N-07 异步报告 job 可直接 import renderReportPdf。
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { subsetCjkFont, collectUsedChars } from './subset.mjs';

const INK = '#1f2328';
const ACCENT = '#9b2c2c'; // 暗红（中式印章感）
const MUTED = '#57606a';
const RULE = '#d0d7de';

/**
 * @param {{report: object, outPath: string, fullFontBuffer: Buffer, fontName?: string, subset?: boolean}} opts
 * @returns {Promise<{outPath:string, embeddedFontBuffer:Buffer, embeddedFontSize:number, usedCharCount:number, fileSize:number, subset:boolean}>}
 */
export async function renderReportPdf({ report, outPath, fullFontBuffer, fontName = 'SimHei-CJK', subset = true }) {
  // 1) 收集报告全部字符（含标题/正文/证据/建议），用于字体子集
  const usedChars = collectUsedChars(report);

  // 2) 子集化（或保留整字体做对比）
  let embeddedFontBuffer;
  let charCount = usedChars.length;
  if (subset) {
    const r = await subsetCjkFont(fullFontBuffer, usedChars);
    embeddedFontBuffer = r.buffer;
  } else {
    embeddedFontBuffer = fullFontBuffer;
  }

  // 3) 建 PDF
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 64, bottom: 64, left: 60, right: 60 },
    info: {
      Title: `${report.meta?.person ?? '命主'} · ${report.meta?.product ?? '洞察报告'}`,
      Author: '命律 TempoSoul',
      Subject: '十维深度洞察报告',
    },
    bufferPages: true,
  });

  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  // 内嵌子集字体（直接吃 Buffer，不落临时文件）
  doc.registerFont('CJK', embeddedFontBuffer);
  doc.font('CJK');

  const pageWidth = doc.page.width;
  const margin = doc.page.margins;
  const contentWidth = pageWidth - margin.left - margin.right;

  // ---- 封面/头部 ----
  doc.fillColor(ACCENT).fontSize(11).text(report.meta?.product ?? '命律 · 深度洞察报告', {
    characterSpacing: 1,
  });
  doc.moveDown(0.3);
  doc.fillColor(INK).fontSize(24).text(report.meta?.title ?? '十维深度洞察报告');
  doc.moveDown(0.6);
  doc.strokeColor(RULE).lineWidth(1).moveTo(margin.left, doc.y).lineTo(pageWidth - margin.right, doc.y).stroke();
  doc.moveDown(0.6);

  // 排盘信息块
  doc.fillColor(MUTED).fontSize(10.5);
  const metaLines = [
    `命主：${report.meta?.person ?? ''}    ${report.meta?.gender ?? ''}`,
    `生辰：${report.meta?.birth ?? ''}`,
    `格局：${report.meta?.dayMaster ?? ''}`,
    `生成时间：${report.meta?.generatedAt ?? ''}`,
  ];
  for (const line of metaLines) {
    doc.text(line);
    doc.moveDown(0.25);
  }
  doc.moveDown(0.6);

  // ---- 十维 ----
  const dims = report.dimensions ?? [];
  for (let i = 0; i < dims.length; i++) {
    const dim = dims[i];
    // 维度标题：序号 + 标题
    doc.fillColor(ACCENT).fontSize(14).text(`${String(i + 1).padStart(2, '0')}  ${dim.title}`);
    doc.moveDown(0.35);

    doc.fillColor(INK).fontSize(10.5);
    doc.text(dim.summary ?? '');
    doc.moveDown(0.5);

    if (Array.isArray(dim.evidence) && dim.evidence.length) {
      doc.fillColor(MUTED).fontSize(10).text('【依据】');
      doc.fillColor(INK).fontSize(10.5);
      for (const ev of dim.evidence) {
        doc.text(`• ${ev}`, { indent: 12 });
      }
      doc.moveDown(0.4);
    }

    if (dim.advice) {
      doc.fillColor(MUTED).fontSize(10).text('【建议】');
      doc.fillColor(INK).fontSize(10.5).text(dim.advice);
    }
    doc.moveDown(0.9);
  }

  // ---- 页脚 ----
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8.5).fillColor(MUTED);
    doc.text(
      `命律 TempoSoul · 十维深度洞察报告    第 ${i + 1} / ${range.count} 页    本报告仅供参考，不构成决策依据`,
      margin.left,
      doc.page.height - 44,
      { width: contentWidth, align: 'center' },
    );
  }

  doc.end();
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return {
    outPath,
    embeddedFontBuffer,
    embeddedFontSize: embeddedFontBuffer.length,
    usedCharCount: charCount,
    fileSize: fs.statSync(outPath).size,
    fontName,
    subset,
  };
}
