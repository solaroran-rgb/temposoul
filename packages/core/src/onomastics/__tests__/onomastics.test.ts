import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateNameProfile,
  resolveStrokes,
  calculateWuge,
  detectScript,
  zodiacOfYear,
  numeralWuxing,
} from '../index';
import { splitSyllables, isTongueTwister } from '../phonetics';
import type { CharDossierLike as DossierLike, EvaluateDeps } from '../types';

const DOSSIER: Record<string, DossierLike> = {
  李: {
    char: '李',
    pinyin: 'lǐ',
    tone: 3,
    kangxiStrokes: 7,
    meanings: [{ meaning: '落叶乔木；李子', source: 'dossier', confidence: 'probable' }],
    rareCharLevel: 'common',
    confidence: 'probable',
    source: 'character-dossier',
  },
  明: {
    char: '明',
    pinyin: 'míng',
    tone: 2,
    kangxiStrokes: 8,
    meanings: [{ meaning: '明亮；明白', source: 'dossier', confidence: 'probable' }],
    rareCharLevel: 'common',
    confidence: 'probable',
    source: 'character-dossier',
  },
  清: {
    char: '清',
    pinyin: 'qīng',
    tone: 1,
    kangxiStrokes: 12,
    radicalVariantRule: 'shui',
    meanings: [{ meaning: '水澄澈；清正', source: 'dossier', confidence: 'probable' }],
    rareCharLevel: 'common',
    confidence: 'probable',
    source: 'character-dossier',
  },
  照: {
    char: '照',
    pinyin: 'zhào',
    tone: 4,
    kangxiStrokes: 13,
    meanings: [{ meaning: '照耀', source: 'dossier', confidence: 'probable' }],
    rareCharLevel: 'common',
    confidence: 'probable',
    source: 'character-dossier',
  },
};

const deps: EvaluateDeps = {
  dossierProvider: (c) => DOSSIER[c] || null,
  zodiacRootTable: { 马: { liked: ['清'], avoided: ['照'] } },
  homophoneTable: [
    { dialect: 'cantonese', char: '清', word: '青', note: '粤语同音，需人工确认语境' },
  ],
};

test('笔画解析：缺数据返回 unavailable，不做估算', () => {
  const r = resolveStrokes(null);
  assert.equal(r.confidence, 'unavailable');
  assert.equal(r.strokes, null);
});

test('五格：李明 → 天格 8 / 人格 15 / 地格 9 / 总格 15', () => {
  const w = calculateWuge('李', '明', deps.dossierProvider);
  assert.equal(w.data.heavenly, 8);
  assert.equal(w.data.human, 15);
  assert.equal(w.data.earthly, 9);
  assert.equal(w.data.total, 15);
  assert.equal(w.data.eightyOne, null);
});

test('八字轨：三层解构 + 冲突提示 + 免责', () => {
  const p = evaluateNameProfile(
    { surname: '李', given: '清照', type: 'person', script: 'han', birthDate: '1990-05-15' },
    deps,
  );
  assert.equal(p.fact.phonetics.data.pinyin.length, 3);
  assert.equal(p.folk.zodiac.data.zodiac, '马');
  assert.equal(p.folk.wuge.data.total, 32);
  assert.equal(p.fact.phonetics.data.duplicateRate, null);
  assert.ok(p.folk.disclaimer.includes('非可验证'));
  assert.ok(Array.isArray(p.conflicts));
  assert.ok(p.disclaimer.includes('不含吉凶预测'));
});

test('拉丁轨：不计算康熙笔画与五格', () => {
  const p = evaluateNameProfile(
    { surname: 'Alexander', given: 'Lee', type: 'person', script: 'latin' },
    deps,
  );
  assert.equal(p.input.script, 'latin');
  assert.equal(p.folk.wuge.status, 'unavailable');
  assert.equal(p.fact.glyph.data.strokeCountTotal, null);
});

test('缺数据降级：生僻字缺失时维度为 partial/unavailable', () => {
  const p = evaluateNameProfile(
    { surname: '李', given: '𰻝', type: 'person', script: 'han' },
    deps,
  );
  assert.equal(p.dataStatus['folk.wuge'], 'partial');
  assert.ok(p.fact.glyph.note?.includes('缺笔画数据'));
});

test('书写体系识别', () => {
  assert.equal(detectScript('李清照'), 'han');
  assert.equal(detectScript('Alexander'), 'latin');
  assert.equal(detectScript('สมชาย'), 'unknown');
});

test('生肖与数理五行', () => {
  assert.equal(zodiacOfYear(1990), '马');
  assert.equal(numeralWuxing(15), '土');
  assert.equal(numeralWuxing(null), null);
});

test('音节切分：带声调拼音逐字成音节（v1 缺陷回归）', () => {
  assert.deepEqual(splitSyllables(['lǐ', 'qīng', 'zhào']), ['lǐ', 'qīng', 'zhào']);
  assert.equal(splitSyllables([]).length, 0);
});

test('拗口检测：相邻同音字判定', () => {
  assert.equal(isTongueTwister(['lǐ', 'lǐ']), true);
  assert.equal(isTongueTwister(['wáng', 'míng']), false);
});

test('外格：单姓单名取约定值 2，不出现 0 或负数（v1 缺陷回归）', () => {
  const w = calculateWuge('李', '明', deps.dossierProvider);
  assert.equal(w.data.heavenly, 8);
  assert.equal(w.data.outer, 2);
  const w2 = calculateWuge('李', '清照', deps.dossierProvider);
  assert.ok((w2.data.outer ?? 0) >= 1);
});

test('生僻等级与维度状态一致性（v1 缺陷回归）', () => {
  const p = evaluateNameProfile(
    { surname: '李', given: '明', type: 'person', script: 'han' },
    deps,
  );
  assert.equal(p.fact.glyph.data.rareCharLevel, 'common');
  // 数据未接入的维度不得标 complete
  assert.equal(p.culture.taboo.status, 'unavailable');
  assert.equal(p.culture.generationName.status, 'unavailable');
});

test('缺数据：全部字符未收录时五格 unavailable 且无估算值', () => {
  const p = evaluateNameProfile(
    { surname: '𰻝', given: '𰻝', type: 'person', script: 'han' },
    deps,
  );
  assert.equal(p.dataStatus['folk.wuge'], 'unavailable');
  assert.equal(p.fact.glyph.data.strokeCountTotal, null);
  assert.equal(p.fact.phonetics.data.syllables.length, 0);
});
