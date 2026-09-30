import fs from 'node:fs';
const F = 'docs/i18n/T07/translated';
const CASES = [
  ['es-ES.json', '立夏', 'Li Xia'],
  ['es-ES.json', '芒种', 'Mang Zhong'],
  ['es-ES-p1.json', '立夏', 'Li Xia'],
  ['es-ES-p1.json', '芒种', 'Mang Zhong'],
  ['vi-VN-extra.json', '中秋月相与传统文化中的月亮意象', 'Giai đoạn trăng Trung Thu và hình ảnh mặt trăng trong văn hóa truyền thống'],
  ['vi-VN.json', '中秋月相与传统文化中的月亮意象', 'Giai đoạn trăng Trung Thu và hình ảnh mặt trăng trong văn hóa truyền thống']
];
for (const [f, zh, tr] of CASES) {
  const p = `${F}/${f}`;
  const arr = JSON.parse(fs.readFileSync(p, 'utf8'));
  const obj = Array.isArray(arr) ? Object.fromEntries(arr) : arr;
  const old = obj[zh];
  if (typeof old !== 'string') {
    console.log('MISS', f, zh, '| keys:', Object.keys(obj).slice(0, 3));
    continue;
  }
  console.log('OLD', f, zh, '=>', old);
  obj[zh] = tr;
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
  console.log('NEW', f, zh, '=>', obj[zh]);
}
