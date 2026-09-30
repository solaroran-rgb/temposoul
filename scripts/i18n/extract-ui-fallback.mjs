/**
 * T07 · 抽取五语 locale 词典中的「英文占位」正文键（UI 层回退点）
 *
 * 判据：五语（ja/ko-KN/vi-VN/th-TH/es-ES）在该键上的取值彼此相同，且等于 en 取值，且含 ≥3 个连续拉丁字母。
 * 排除：语言名（lang.*）、idio 保留 ASCII（lang.en）。
 * 产物：docs/i18n/T07/ui-fallback-keys.json —— [{ key, zh, en }]
 *
 * 用法：node scripts/i18n/extract-ui-fallback.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const LOCALES = path.resolve(import.meta.dirname, '../../src/i18n/locales');
const MRG = ['ja', 'ko-KN', 'vi-VN', 'th-TH', 'es-ES'];
const FILES = {
  'zh-CN': 'zh-CN.ts',
  en: 'en.ts',
  ja: 'ja.ts',
  'ko-KN': 'ko-KN.ts',
  'vi-VN': 'vi-VN.ts',
  'th-TH': 'th-TH.ts',
  'es-ES': 'es-ES.ts',
};

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const data = {};
for (const [loc, fn] of Object.entries(FILES)) {
  const mod = await import(pathToFileURL(path.join(LOCALES, fn)).href);
  data[loc] = flatten(Object.values(mod).find((v) => v && typeof v === 'object'));
}

const list = [];
for (const key of Object.keys(data['zh-CN'])) {
  if (key.startsWith('lang.')) continue;
  const zhv = data['zh-CN'][key];
  const env = data.en[key];
  if (typeof zhv !== 'string' || typeof env !== 'string') continue;
  if (!/[A-Za-z]{3,}/.test(env)) continue;
  const fiveSameToEn = MRG.every((l) => data[l][key] === env);
  if (!fiveSameToEn) continue;
  list.push({ key, zh: zhv, en: env });
}

const OUT = path.resolve(import.meta.dirname, '../../docs/i18n/T07');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'ui-fallback-keys.json'), JSON.stringify(list, null, 2), 'utf8');
console.log(`UI 层英文占位键：${list.length}`);
console.log(list.map((x) => x.key).join('\n'));
