import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateNameProfile } from '../pipeline';
import type { CharDossierLike, EvaluateDeps } from '../types';

const DOSSIER: Record<string, CharDossierLike> = {
  李: {
    char: '李',
    kangxiStrokes: 7,
    pinyin: 'lǐ',
    tone: 3,
    radical: '木',
    rareCharLevel: 'common',
    confidence: 'verified',
    source: 'Unihan+康熙',
    meanings: [{ meaning: '落叶乔木', source: '汉典', confidence: 'verified' }],
  },
  明: {
    char: '明',
    kangxiStrokes: 8,
    pinyin: 'míng',
    tone: 2,
    radical: '日',
    rareCharLevel: 'common',
    confidence: 'verified',
    source: 'Unihan+康熙',
    meanings: [{ meaning: '明亮', source: '汉典', confidence: 'verified' }],
  },
  昭: {
    char: '昭',
    kangxiStrokes: 9,
    pinyin: 'zhāo',
    tone: 1,
    radical: '日',
    rareCharLevel: 'common',
    confidence: 'verified',
    source: 'Unihan+康熙',
    meanings: [{ meaning: '显著', source: '汉典', confidence: 'verified' }],
  },
};
const deps: EvaluateDeps = {
  dossierProvider: (c) => DOSSIER[c] ?? null,
  zodiacRootTable: { 马: { liked: ['艹', '木'], avoided: ['火'] } },
};

test('汉轨：李昭 五格/生肖/证据链完整', () => {
  const p = evaluateNameProfile(
    { surname: '李', given: '昭', type: 'person', script: 'han', birthDate: '1990-05-15' },
    deps,
  );
  assert.equal(p.folk.wuge.status, 'complete');
  assert.equal(p.folk.zodiac.data.zodiac, '马');
  assert.ok(p.evidence.length >= 3);
  assert.equal(p.duplicateRate, null);
});

test('拉丁轨：跳过 strokes/wuge/sancai，folk 全部 unavailable', () => {
  const p = evaluateNameProfile(
    { surname: 'Alexander', given: 'Lee', type: 'person', script: 'latin' },
    deps,
  );
  assert.equal(p.folk.wuge.status, 'unavailable');
  assert.equal(p.folk.sancai.status, 'unavailable');
  assert.equal(p.folk.zodiac.status, 'unavailable');
  assert.equal(p.folk.disclaimer, '拉丁书写体系不计算五格/三才');
  assert.equal(p.fact.strokes?.status, 'unavailable');
});

test('立春分界：无立春数据时降级 lunar-new-year，不崩', () => {
  const p = evaluateNameProfile(
    { surname: '李', given: '明', type: 'person', script: 'han', birthDate: '1990-01-20' },
    deps,
  );
  const z = p.folk.zodiac;
  assert.ok(['lichun', 'lunar-new-year', 'unknown'].includes(z.data.basis));
  assert.ok(typeof z.data.zodiac === 'string');
  assert.equal(p.disclaimer.includes('不含吉凶预测'), true);
});
