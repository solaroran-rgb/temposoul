import test from 'node:test';
import assert from 'node:assert/strict';
import { lexicon } from '../src/data/lexicon';
import type { LexiconEntry } from '../src/data/lexicon';

// T-14（X1-D-41 收口）：术语库 key 守护测试（K4）。
// 口径见 E:\KnowledgeOS\AI地图\11_命律网站建设\21板块深度审计\X1_收口\口径复核结论_板块与术语.md §2.4。
// 本测试轨为 lexicon 词条键（<namespace>:<term>），与引擎侧 archetype_key（<体系>:<实体类型>:<实体名>，见 terms-7lang.test.ts）是两轨，不得混用。

// key = <namespace>:<term>；namespace 可为 common/bazi/ziwei/qimen/liuren/zeiri/qizheng/fengshui/shasha/nayin/ziwei-geju/vedic@1 等
const KEY_RE = /^[a-z0-9@_-]+:[^:\s]+$/;

test('K4-1 全条目 key 落地率 100%（每条均有非空 key 且格式为 <namespace>:<term>）', () => {
  assert.ok(lexicon.length > 0, '词库为空');
  for (const e of lexicon as LexiconEntry[]) {
    assert.ok(typeof e.key === 'string' && e.key.length > 0, `缺 key: ${e.term}`);
    assert.match(e.key, KEY_RE, `key 格式异常: ${e.key}`);
    // key 的尾段必须等于 term，防止拼错
    assert.ok(e.key.endsWith(`:${e.term}`), `key 尾段与 term 不一致: ${e.key} vs ${e.term}`);
  }
});

test('K4-2 key 全局唯一（重复即破坏「键即契约」）', () => {
  const keys = (lexicon as LexiconEntry[]).map((e) => e.key);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  assert.equal(dup.length, 0, `存在重复 key: ${[...new Set(dup)].join(', ')}`);
});

test('K4-3 (term, category) 组合唯一（同词同类不得重复录入）', () => {
  const seen = new Set<string>();
  const dup: string[] = [];
  for (const e of lexicon as LexiconEntry[]) {
    const k = `${e.term}@@${e.category}`;
    if (seen.has(k)) dup.push(k);
    seen.add(k);
  }
  assert.equal(dup.length, 0, `存在重复 (term,category): ${[...new Set(dup)].join(', ')}`);
});

test('K4-4 多义词并列落地：同一 term 允许多条，但每条须有 disambiguation 写清适用体系', () => {
  const byTerm = new Map<string, LexiconEntry[]>();
  for (const e of lexicon as LexiconEntry[]) {
    const arr = byTerm.get(e.term) ?? [];
    arr.push(e);
    byTerm.set(e.term, arr);
  }
  for (const [term, entries] of byTerm) {
    if (entries.length > 1) {
      for (const e of entries) {
        assert.ok(
          typeof e.disambiguation === 'string' && e.disambiguation.length > 0,
          `多义词缺 disambiguation: ${e.key}`
        );
      }
    }
  }
});

test('K4-5 vedic@1 语义版本命名空间已落地（示例核心条目存在）', () => {
  const vedic = (lexicon as LexiconEntry[]).filter((e) => e.key.startsWith('vedic@1:'));
  assert.ok(vedic.length >= 4, `vedic@1 条目过少: ${vedic.length}`);
  const keys = new Set(vedic.map((e) => e.key));
  for (const k of ['vedic@1:nakshatra', 'vedic@1:navamsa', 'vedic@1:rasi', 'vedic@1:graha']) {
    assert.ok(keys.has(k), `缺 vedic@1 示例: ${k}`);
  }
});
