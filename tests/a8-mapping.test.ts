import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { lexicon, type LexiconEntry } from '../src/data/lexicon';
import {
  A8_WAVE1_MAPPINGS,
  A8_ORPHAN_REFS,
  getMappingVernacular,
  type A8MappingEntry,
} from '../src/data/mappings/a8-wave1';
import {
  A8_POLYSEMY_BASE_TERMS,
  A8_POLYSEMY_ROWS,
  A8_POLYSEMY_KEY_RE,
} from '../src/data/mappings/a8-polysemy';
import { APPENDIX_A } from '../src/data/mappings/a8-appendix-a';
import { VEDIC_WAVE1_MAPPINGS } from '../packages/core/src/vedic/keys';

// T-17 子项 B（E-06 A8 白话映射库实体化）守护测试。
// 数据源（唯一权威）：A8_输出/mapping库_v1/{bazi,ziwei,almanac}.json

const A8_JSON_DIR =
  'E:/KnowledgeOS/AI地图/11_命律网站建设/21板块深度审计/下一批派工_20261007/任务卡/A8_输出/mapping库_v1';

test('57 条载体逐条可解析（mappingKey 唯一/字段合法/三语非空/原文非空）', () => {
  assert.equal(A8_WAVE1_MAPPINGS.length, 57, 'wave1 须 57 条');
  const keys = new Set<string>();
  const byDomain = { bazi: 0, ziwei: 0, almanac: 0 };
  for (const m of A8_WAVE1_MAPPINGS as A8MappingEntry[]) {
    assert.ok(m.mappingKey && m.mappingKey.length > 0, 'mappingKey 为空');
    assert.ok(!keys.has(m.mappingKey), `mappingKey 重复: ${m.mappingKey}`);
    keys.add(m.mappingKey);
    assert.ok(['bazi', 'ziwei', 'almanac'].includes(m.domain), `domain 非法: ${m.mappingKey}`);
    assert.ok(['C1', 'C2', 'C3'].includes(m.level), `level 非法: ${m.mappingKey}`);
    assert.ok(m.classicalText.length > 0, `classicalText 为空: ${m.mappingKey}`);
    assert.ok(m.source.name && m.source.location, `source 缺字段: ${m.mappingKey}`);
    assert.ok(m.vernacular.zhCN.length > 0, `zhCN 为空: ${m.mappingKey}`);
    assert.ok(m.vernacular.zhTW.length > 0, `zhTW 为空: ${m.mappingKey}`);
    assert.ok(m.vernacular.en.length > 0, `en 为空: ${m.mappingKey}`);
    assert.equal(m.termRefs.length, m.termRefBindings.length, `termRefs 与 bindings 不齐: ${m.mappingKey}`);
    byDomain[m.domain] += 1;
  }
  assert.equal(byDomain.bazi, 21, 'bazi 须 21 条');
  assert.equal(byDomain.ziwei, 18, 'ziwei 须 18 条');
  assert.equal(byDomain.almanac, 18, 'almanac 须 18 条');
});

test('每条 termRef 已绑定 lexicon key 或显式登记为孤儿（Critical）', () => {
  const orphanSet = new Set(A8_ORPHAN_REFS);
  for (const m of A8_WAVE1_MAPPINGS as A8MappingEntry[]) {
    m.termRefs.forEach((tr, i) => {
      const bound = m.termRefBindings[i];
      if (bound === null) {
        assert.ok(orphanSet.has(tr), `未登记孤儿却无绑定: ${m.mappingKey} -> ${tr}`);
      } else {
        assert.ok(bound.includes(':'), `绑定 key 格式异常: ${bound}`);
      }
    });
  }
  // 汇总：52 个唯一 termRef = 已绑定 ∪ 孤儿
  const allRefs = new Set<string>();
  for (const m of A8_WAVE1_MAPPINGS as A8MappingEntry[]) for (const tr of m.termRefs) allRefs.add(tr);
  assert.equal(allRefs.size, 52, '唯一 termRef 须 52');
});

test('17 多义 sense_id 唯一 + key 格式全匹配 + 与 lexicon/vedic 全 key 零碰撞', () => {
  assert.equal(A8_POLYSEMY_BASE_TERMS.length, 17, '跨文件同名须实算 = 17');
  const keys = A8_POLYSEMY_ROWS.map((r) => r.key);
  assert.equal(new Set(keys).size, keys.length, '多义 key 重复');
  for (const r of A8_POLYSEMY_ROWS) {
    assert.ok(A8_POLYSEMY_KEY_RE.test(r.key), `多义 key 格式异常: ${r.key}`);
    assert.equal(r.key, `${r.namespace}:${r.term}_${r.senseId}`, `key 拼装不符: ${r.key}`);
  }
  // 与 lexicon 全 key 零碰撞（lexicon key 尾段=term，无 _<sense> 后缀，理论不撞；实算再校验）
  const lexKeys = new Set((lexicon as LexiconEntry[]).map((e) => e.key));
  for (const k of keys) assert.ok(!lexKeys.has(k), `与 lexicon key 碰撞: ${k}`);
  // 与 vedic keys.ts 全 key 零碰撞
  const vedicKeys = new Set(VEDIC_WAVE1_MAPPINGS.map((m) => m.key));
  for (const k of keys) assert.ok(!vedicKeys.has(k), `与 vedic key 碰撞: ${k}`);
});

test('抽查 ≥3 条 classicalText/vernacular 与 A8 JSON 原文逐字一致', () => {
  const load = (f: string) => JSON.parse(fs.readFileSync(path.join(A8_JSON_DIR, f), 'utf8'));
  const byKey = new Map((A8_WAVE1_MAPPINGS as A8MappingEntry[]).map((m) => [m.mappingKey, m]));
  let checked = 0;
  for (const f of ['bazi.json', 'ziwei.json', 'almanac.json']) {
    const pack = load(f);
    for (const e of pack.entries) {
      const m = byKey.get(e.mapping_key);
      assert.ok(m, `缺载体: ${e.mapping_key}`);
      const t = e.vernacular_candidates[0].text;
      // 每 pack 抽查首/中/尾共 ≥1 条逐字比对
      if (e.mapping_key.endsWith('_strong') || e.mapping_key.endsWith('zi_wei') || e.mapping_key.endsWith('jia_qu')) {
        assert.equal(m.classicalText, e.classical_text, `classicalText 不符: ${e.mapping_key}`);
        assert.equal(m.vernacular.zhCN, t['zh-CN'], `zhCN 不符: ${e.mapping_key}`);
        assert.equal(m.vernacular.zhTW, t['zh-TW'], `zhTW 不符: ${e.mapping_key}`);
        assert.equal(m.vernacular.en, t['en-US'], `en 不符: ${e.mapping_key}`);
        checked += 1;
      }
    }
  }
  assert.ok(checked >= 3, `抽查条数不足: ${checked}`);
});

test('术语绑定抽查：≥10 个 termRefs 的 boundLexiconKey 命中 lexicon', () => {
  const lexKeys = new Set((lexicon as LexiconEntry[]).map((e) => e.key));
  let hit = 0;
  for (const m of A8_WAVE1_MAPPINGS as A8MappingEntry[]) {
    for (const k of m.boundLexiconKey) {
      assert.ok(lexKeys.has(k), `boundLexiconKey 未命中 lexicon: ${k} (${m.mappingKey})`);
      hit += 1;
    }
  }
  assert.ok(hit >= 10, `绑定命中数不足: ${hit}`);
});

test('附录 A 双轨表 57 条三语基准与查表函数可用', () => {
  assert.equal(APPENDIX_A.length, 57, '附录 A 须 57 条');
  for (const r of APPENDIX_A) {
    assert.ok(r.zhCN && r.zhTW && r.en && r.classicalText, `附录 A 字段缺: ${r.key}`);
  }
  // 查表函数：命中 / 缺词条信号
  assert.equal(getMappingVernacular('bazi.C1.day_master_strong', 'zhCN').slice(0, 6), '传统命理认为');
  assert.equal(getMappingVernacular('not.exist.key', 'zhCN'), null, '缺词条应返回 null');
});
