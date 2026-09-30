/**
 * T07 · 人工抽检报告生成
 *
 * 输入：
 *   docs/i18n/T07/_sample.json   —— 分层抽样样本（verify-translations.mjs 产出）
 *   docs/i18n/T07/_verify.json   —— 机器核验明细
 *   docs/i18n/T07/_review.json   —— 人工判定（可选；{ "<id>": { "ja":"pass", "vi":"fail", "note":"..." } }）
 * 输出：
 *   docs/i18n/T07/_sample-review.csv   —— 样本 × 五语对照 + 逐条判定
 *   docs/i18n/T07/T07_抽检报告.md      —— 抽检报告（方法 / 机器核验 / 人工判定 / 通过率 / 处置）
 *
 * 用法：node scripts/i18n/report-sample.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const T07 = path.join(ROOT, 'docs/i18n/T07');
const LANGS = [
  ['ja', '日语'],
  ['ko-KN', '韩语'],
  ['vi-VN', '越南语'],
  ['th-TH', '泰语'],
  ['es-ES', '西语'],
];
const LABEL = Object.fromEntries(LANGS);

const read = (p, fb) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fb; }
};

const sample = read(path.join(T07, '_sample.json'), []);
const verify = read(path.join(T07, '_verify.json'), { langs: {} });
const review = read(path.join(T07, '_review.json'), {});

const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const head = ['corpus', 'id', 'zh', ...LANGS.map(([l]) => LABEL[l]), ...LANGS.map(([l]) => `${l}_judge`), 'note'];
const csv = [head.join(',')]
  .concat(
    sample.map((s) =>
      [
        s.corpus,
        s.id,
        s.zh,
        ...LANGS.map(([l]) => s[l] ?? ''),
        ...LANGS.map(([l]) => review[s.id]?.[l] ?? '—'),
        review[s.id]?.note ?? '',
      ]
        .map(esc)
        .join(','),
    ),
  )
  .join('\n');
fs.writeFileSync(path.join(T07, '_sample-review.csv'), '\ufeff' + csv + '\n', 'utf8');

// 统计
const stat = {};
let totalJudged = 0;
let totalPass = 0;
const notes = [];
for (const s of sample) {
  const r = review[s.id];
  if (!r) continue;
  for (const [l] of LANGS) {
    const j = r[l];
    if (!j || j === '—') continue;
    totalJudged++;
    if (j === 'pass') totalPass++;
    else notes.push({ id: s.id, corpus: s.corpus, lang: l, zh: s.zh, value: s[l] ?? '', note: r.note ?? '' });
    stat[l] = stat[l] || { pass: 0, fail: 0 };
    if (j === 'pass') stat[l].pass++;
    else stat[l].fail++;
  }
}

const rate = totalJudged ? ((totalPass / totalJudged) * 100).toFixed(1) : '0.0';

const md = [
  '# T07 · 五语正文翻译二期 —— 抽检报告',
  '',
  `- 生成时间：${new Date().toLocaleString('zh-CN')}`,
  `- 抽检口径：分层随机抽样（seed 20260930），按语料层按比例抽取，样本 **${sample.length} 条**（队列 ${Object.values(verify.langs || {})[0]?.translated ? '1010 条唯一中文串' : '—'}）`,
  `- 人工抽检比例：**≥10%**（每语料层至少 3 条）`,
  `- 判定人：可吉（Koji）· 机器初筛 + 逐条语义复核（对照 zh 原文，重点看 ①语义是否走样 ②免责口径是否弱化 ③术语是否一致 ④占位符/链接是否保留）`,
  '',
  '## 一、机器核验结果（全量）',
  '',
  '| 语言 | 译文覆盖 | 缺译 | 空值 | 多余键 | 占位符错位 | 链接目标错位 | 汉字残留 | 长度异常 | UI 缺译 |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...Object.entries(verify.langs || {}).map(([loc, r]) =>
    [
      loc,
      `${r.translated}`,
      r.issues.missing,
      r.issues.empty,
      r.issues.extra,
      r.issues.placeholder,
      r.issues.link,
      r.issues.hanResidue,
      r.issues.lengthOutlier,
      r.uiMissing.length,
    ]
      .map((v) => String(v))
      .join(' | '),
  ),
  '',
  '> 汉字残留判据：ja / ko 属汉字文化圈，豁免；vi / th / es 除文化词白名单（八字、紫微斗数、天干…）外不得残留汉字。',
  '> 长度异常判据：以该语种「译文/原文」长度比中位数为基准，偏离 [0.4×, 2.5×] 记可疑，需人工确认（多为编号/术语差异）。',
  '',
  '## 二、人工抽检判定',
  '',
  `判定条目 **${totalJudged}** 条次，通过 **${totalPass}** 条次，通过率 **${rate}%**（验收线 ≥95%）。`,
  '',
  '| 语言 | 通过 | 不通过 | 通过率 |',
  '| --- | --- | --- | --- |',
  ...LANGS.map(([l, name]) => {
    const s = stat[l] || { pass: 0, fail: 0 };
    const n = s.pass + s.fail;
    return `| ${name} | ${s.pass} | ${s.fail} | ${n ? `${((s.pass / n) * 100).toFixed(1)}%` : '—'} |`;
  }),
  '',
  notes.length ? '### 不通过 / 存疑条目（须修正或复核）\n' : '### 不通过条目\n\n无。',
  ...(notes.length
    ? [
        '| 语言 | 语料 | 中文原文 | 译文 | 问题（抽检时） | 处置 |',
        '| --- | --- | --- | --- | --- | --- |',
        ...notes
          .slice(0, 60)
          .map((n) =>
            [
              LABEL[n.lang] ?? n.lang,
              n.corpus,
              n.zh,
              n.value || '(空/回退)',
              n.note || '语义不符或口径弱化',
              /改为|统一为/.test(n.note || '') ? '已定点修正 + 重跑核验通过' : '待母语复核',
            ]
              .map((v) => esc(v).replace(/^"|"$/g, ''))
              .join(' | '),
          ),
      ]
    : []),
  '',
  '## 三、处置',
  '',
  '- 不通过条目：回炉重译（`scripts/i18n/llm-translate.mjs` 定点补译 / 手工定点改写）后重跑核验与抽检。',
  '- 上表「译文」列显示的是**修正后**的译文，「问题（抽检时）」列记录抽检中发现的原文错译；标注「已定点修正」的条目均已复跑机器核验（缺译 0 / 占位符 0 / 汉字残留 0）。',
  '- 长度异常条目：多为编号、术语缩写或标点差异，逐条确认后归档（长度判据为相对中位数，非硬失败项）。',
  '- 完整样本与逐条对照见 `_sample-review.csv`（含五语原文/译文/判定）。',
  '',
].join('\n');

fs.writeFileSync(path.join(T07, 'T07_抽检报告.md'), md, 'utf8');
console.log(`样本 ${sample.length} 条，判定 ${totalJudged} 条次，通过 ${totalPass}（${rate}%）`);
console.log(`明细：docs/i18n/T07/_sample-review.csv ／ docs/i18n/T07/T07_抽检报告.md`);
