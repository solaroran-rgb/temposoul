/**
 * T07 · 编译五语正文译文 → 前端模块 + UI 覆盖层 + 覆盖率报告
 *
 * 输入：docs/i18n/T07/translated/<locale>[-pN|-ui].json（子代理分片产出）
 *       docs/i18n/T07/queue.json（权威键表，来自 src/data 语料抽取）
 * 输出：
 *   src/i18n/body/<file>.ts          —— 该语言「中文原文 → 译文」映射
 *   src/i18n/body/ui-overlays.ts     —— UI 词典点位覆盖（点路径 → 译文）
 *   docs/i18n/T07/_coverage.json     —— 各语言覆盖率与缺失清单
 *
 * 用法：node scripts/i18n/build-body-modules.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const T07 = path.join(ROOT, 'docs/i18n/T07');
const TRANSLATED = path.join(T07, 'translated');
const BODY_DIR = path.join(ROOT, 'src/i18n/body');

const LANGS = [
  { locale: 'ja', file: 'ja', module: 'jaBodyMap' },
  { locale: 'ko-KN', file: 'koKN', module: 'koKNBodyMap' },
  { locale: 'vi-VN', file: 'viVN', module: 'viVNBodyMap' },
  { locale: 'th-TH', file: 'thTH', module: 'thTHBodyMap' },
  { locale: 'es-ES', file: 'esES', module: 'esESBodyMap' },
];

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.warn(`  ! 读取失败/非法 JSON：${path.basename(p)} —— ${e.message}`);
    return {};
  }
}

const queue = JSON.parse(fs.readFileSync(path.join(T07, 'queue.json'), 'utf8'));
const uiKeys = JSON.parse(fs.readFileSync(path.join(T07, 'ui-fallback-keys.json'), 'utf8'));
const queueKeys = queue.map((q) => q.zh);
const uiKeyList = uiKeys.map((k) => k.key);

fs.mkdirSync(BODY_DIR, { recursive: true });

const coverage = {};
const uiOverlays = {};

for (const { locale, file, module } of LANGS) {
  // 1) 合并正文分片
  const map = {};
  for (const part of ['-p1', '-p2', '-p3', '-p4', '-extra']) {
    const p = path.join(TRANSLATED, `${locale}${part}.json`);
    if (!fs.existsSync(p)) continue;
    Object.assign(map, readJsonSafe(p));
  }
  const missing = queueKeys.filter((k) => !(k in map));
  const empty = Object.keys(map).filter((k) => typeof map[k] !== 'string' || !map[k].trim());
  const extra = Object.keys(map).filter((k) => !queueKeys.includes(k));

  // 2) UI 覆盖层（首次补译落 -ui.json，定点补译落 -extra.json，两份都合并）
  const uiMap = {};
  for (const part of ['-ui', '-ui-extra']) {
    const p = path.join(TRANSLATED, `${locale}${part}.json`);
    if (!fs.existsSync(p)) continue;
    Object.assign(uiMap, readJsonSafe(p));
  }
  const uiMissing = uiKeyList.filter((k) => !(k in uiMap));
  uiOverlays[locale] = uiMap;

  // 3) 落盘合并稿（便于 diff 与人工复核）
  const mergedPath = path.join(TRANSLATED, `${locale}.json`);
  fs.writeFileSync(mergedPath, JSON.stringify(map, null, 2), 'utf8');

  // 4) 生成 TS 模块（键排序 → 确定性输出）
  const entries = Object.keys(map)
    .sort()
    .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(map[k])},`);
  const ts = [
    '/**',
    ` * T07 · ${locale} 正文译文映射（自动生成，勿手改）`,
    ` * 源：docs/i18n/T07/translated/${locale}.json ／ 生成：scripts/i18n/build-body-modules.mjs`,
    ` * 条目：${entries.length}`,
    ' */',
    `export const ${module}: Record<string, string> = {`,
    ...entries,
    '};',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(BODY_DIR, `${file}.ts`), ts, 'utf8');

  const chars = Object.values(map).reduce((s, v) => s + (typeof v === 'string' ? v.length : 0), 0);
  coverage[locale] = {
    entries: queueKeys.length,
    translated: queueKeys.length - missing.length,
    missing: missing.length,
    emptyValues: empty.length,
    extraKeys: extra.length,
    targetChars: chars,
    uiKeys: uiKeyList.length,
    uiTranslated: uiKeyList.length - uiMissing.length,
    uiMissing,
    missingSample: missing.slice(0, 10),
  };
  console.log(
    `${locale.padEnd(6)} 正文 ${String(queueKeys.length - missing.length).padStart(4)}/${queueKeys.length}` +
      `  译文 ${String(chars).padStart(6)} 字   UI ${uiKeyList.length - uiMissing.length}/${uiKeyList.length}` +
      (extra.length ? `  (多余键 ${extra.length})` : ''),
  );
}

// UI 覆盖层 TS
const uiLines = [
  '/**',
  ' * T07 · UI 词典点位覆盖（自动生成，勿手改）',
  ' * 说明：补齐第 4 轮新增 block 键在五语下的英文占位值；zh-CN / en 不受影响。',
  ' * 源：docs/i18n/T07/translated/<locale>-ui.json ／ 生成：scripts/i18n/build-body-modules.mjs',
  ' */',
  'export const UI_OVERLAYS: Record<string, Record<string, string>> = {',
  ...LANGS.map(
    ({ locale }) => `  ${JSON.stringify(locale)}: ${JSON.stringify(uiOverlays[locale] ?? {}, null, 2)},`,
  ),
  '};',
  '',
];
fs.writeFileSync(path.join(BODY_DIR, 'ui-overlays.ts'), uiLines.join('\n'), 'utf8');

fs.writeFileSync(
  path.join(T07, '_coverage.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      queueEntries: queueKeys.length,
      queueChars: queueKeys.reduce((s, k) => s + k.length, 0),
      uiKeys: uiKeyList.length,
      langs: coverage,
    },
    null,
    2,
  ),
  'utf8',
);
console.log('\n覆盖率报告：docs/i18n/T07/_coverage.json');
