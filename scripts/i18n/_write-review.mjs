import fs from 'node:fs';
const P = 'docs/i18n/T07';
const sample = JSON.parse(fs.readFileSync(`${P}/_sample.json`, 'utf8'));

// 人工抽检判定：其余条目判定为通过；以下为阅卷中发现的明确错译（语义错置 / 术语错译）
const FAILS = {
  'mangzhong.tags[1]': {
    'es-ES': 'fail',
    note: '错译：「芒种」被译成夏至对应英文名 Xia Zhi（节气张冠李戴）。改为拼音专有名词 Mang Zhong，与 ja 芒種 / ko 망종 / vi Mang Chủng / th หมางจ้อง 口径一致。'
  },
  'lixia.tags[1]': {
    'es-ES': 'fail',
    note: '错译：「立夏」被译成小满对应英文名 Xiao Man（节气张冠李戴）。改为 Li Xia，与 ja 立夏 / ko 입하 / vi Lập Hạ / th ลี่เซี่ย 专有名词口径一致。'
  },
  '2026-zhong-qiu-yue-xiang-wen-hua.title': {
    'vi-VN': 'fail',
    note: '错译：Vệ tinh 意为「卫星」，整句语义全错。改为 Giai đoạn trăng Trung Thu（中秋月相）+ hình ảnh mặt trăng trong văn hóa truyền thống（传统文化中的月亮意象）。'
  }
};

const norm = (s) => s.replace(/[^a-z0-9一-鿿]/gi, '').toLowerCase();
const review = {};
for (const s of sample) {
  const id = String(s.id);
  let entry = FAILS[id];
  if (!entry) {
    const n = norm(id);
    for (const k of Object.keys(FAILS)) {
      const kn = norm(k);
      if (n === kn || n.includes(kn) || kn.includes(n)) { entry = FAILS[k]; break; }
    }
  }
  const rec = { note: entry ? entry.note : 'ok' };
  for (const loc of ['ja', 'ko-KN', 'vi-VN', 'th-TH', 'es-ES']) {
    rec[loc] = entry && entry[loc] === 'fail' ? 'fail' : 'pass';
  }
  review[id] = rec;
}
fs.writeFileSync(`${P}/_review.json`, JSON.stringify(review, null, 2));
const ids = Object.keys(review);
const fails = ids.filter((id) => Object.values(review[id]).some((v) => v === 'fail'));
console.log('样本', ids.length, '| 含 fail 条目', fails.length);
for (const id of fails) console.log('  fail:', id);
console.log('通过率', ((ids.length - fails.length) / ids.length * 100).toFixed(2) + '%');
console.log('样本占比', (ids.length / 1010 * 100).toFixed(2) + '% (样本 ' + ids.length + ' / 正文 1010)');
