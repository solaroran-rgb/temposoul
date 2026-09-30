// 盘点 ja/ko/th/vi/es 五语 locale 相对 zh-CN/en 的缺失 key 与疑似回退值
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const LOCALES = path.resolve(import.meta.dirname, '../../src/i18n/locales');

const files = {
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
for (const [loc, fn] of Object.entries(files)) {
  const mod = await import(pathToFileURL(path.join(LOCALES, fn)).href);
  const dict = Object.values(mod).find((v) => v && typeof v === 'object');
  data[loc] = flatten(dict);
}

const base = data['zh-CN'];
const en = data['en'];
const asciiRe = /^[\x00-\x7F]*$/;

const summary = {};
for (const loc of ['ja', 'ko-KN', 'vi-VN', 'th-TH', 'es-ES']) {
  const d = data[loc];
  const missing = Object.keys(base).filter((k) => !(k in d));
  const missingEn = Object.keys(en).filter((k) => !(k in d));
  const extra = Object.keys(d).filter((k) => !(k in base));
  const identicalToZh = Object.keys(d).filter(
    (k) => k in base && typeof d[k] === 'string' && d[k] === base[k],
  );
  const asciiInNonEn = Object.keys(d).filter(
    (k) => typeof d[k] === 'string' && d[k].length > 0 && asciiRe.test(d[k]) && /[A-Za-z]{3,}/.test(d[k]),
  );
  summary[loc] = { missing, missingEn, extra, identicalToZh, asciiInNonEn };
  console.log(`--- ${loc} ---`);
  console.log('总 key:', Object.keys(d).length);
  console.log('缺 vs zh-CN:', missing.length, missing.length ? missing.slice(0, 100) : '');
  console.log('缺 vs en:', missingEn.length, missingEn.length ? missingEn.slice(0, 40) : '');
  console.log('多出 vs zh:', extra.length, extra.length ? extra.slice(0, 40) : '');
  console.log('值与 zh 完全相同:', identicalToZh.length, identicalToZh.length ? identicalToZh.slice(0, 60) : '');
  console.log('疑似英文回退(纯 ASCII 长串):', asciiInNonEn.length, asciiInNonEn.length ? asciiInNonEn.slice(0, 60) : '');
  console.log();
}
console.log('zh-CN keys:', Object.keys(base).length, '| en keys:', Object.keys(en).length);
