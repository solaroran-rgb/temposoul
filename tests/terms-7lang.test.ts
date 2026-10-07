import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TERMS_7LANG,
  termKeyByZh,
  termKeysByZh,
  translateTerm,
} from '../src/data/terms-7lang';

// T3 多语言（M4·G1-lite）：术语查找表守护测试。
// 完整口径见 docs/audit/2026-09-13-上线前加固/thread-03-*/output/02_准确性口径定义.md。
// 键变更属破坏性变更（T4「键即契约」），须四线程会签并同步更新本测试与快照。

const KEY_RE = /^[a-z]+:[a-z0-9_]+:[a-z0-9_]+$/;
const NON_ZH_LOCALES = ['en', 'es-ES', 'ja', 'ko-KR', 'th-TH', 'vi-VN'] as const;

test('术语表规模与键格式（T4 v1 三段式）', () => {
  assert.equal(TERMS_7LANG.length, 355, 'tier1 行数变化须有意为之并同步快照');
  const keys = TERMS_7LANG.map((entry) => entry.key);
  assert.equal(new Set(keys).size, keys.length, 'archetype_key 不得重复');
  for (const entry of TERMS_7LANG) {
    assert.match(entry.key, KEY_RE, `键格式异常: ${entry.key}`);
    assert.ok(entry.i18n['zh-CN'], `zh 源术语为空: ${entry.key}`);
  }
});

test('tier1_filled/supplement 行 6 语言齐全；partial 行至少 en 可用', () => {
  for (const entry of TERMS_7LANG) {
    if (entry.status === 'tier1_filled' || entry.status === 'tier1_supplement') {
      for (const locale of NON_ZH_LOCALES) {
        const value = entry.i18n[locale];
        assert.ok(value && value !== '—', `${entry.key} 缺 ${locale} 译文`);
      }
    } else {
      assert.equal(entry.status, 'tier1_partial', `未知状态: ${entry.key}`);
      assert.ok(entry.i18n.en && entry.i18n.en !== '—', `partial 行 en 也为空: ${entry.key}`);
    }
  }
});

test('translateTerm 确定性抽查（干支/组合/宫位/卦名）', () => {
  assert.equal(translateTerm('甲', 'en'), 'Jia');
  assert.equal(translateTerm('甲', 'zh-CN'), '甲');
  assert.equal(translateTerm('甲子', 'en'), 'Jia Zi');
  assert.equal(translateTerm('甲子', 'vi-VN'), 'Giáp Tý');
  // 命宫 按 zh 是多键（基础/推命体系/十二宫），须按 archetype_key 查
  assert.equal(translateTerm('ziwei:palace:minggong', 'ko-KR'), '명궁');
  assert.equal(translateTerm('乾为天', 'vi-VN'), 'Càn');
  assert.equal(translateTerm('比肩', 'en'), 'Friend');
  assert.equal(translateTerm('立春', 'ja'), '立春');
});

test('查不到与多键撞车的诚实降级（返回 null，不静默兜底）', () => {
  assert.equal(translateTerm('不存在的术语XYZ', 'en'), null);
  assert.equal(translateTerm('乾为天', 'th-TH'), null, 'partial 行 th 待定应返回 null');
  // zh→键 多义（命宫跨 3 域）：termKeyByZh 拒绝歧义，须带上下文用键查
  assert.ok(termKeysByZh('命宫')?.length >= 2, '跨域 zh 应有多个键');
  assert.equal(termKeyByZh('命宫'), null, '多键 zh 应返回 null（需上下文键）');
  assert.equal(typeof termKeyByZh('甲'), 'string', '唯一键应直接命中');
});
