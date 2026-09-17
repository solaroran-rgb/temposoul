import { FOLK_DISCLAIMER, LATIN_FOLK_DISCLAIMER, NAME_DISCLAIMER } from './types';
import type {
  ConflictItem,
  CultureLayer,
  DataStatus,
  EvaluateDeps,
  EvidenceItem,
  FactLayer,
  FolkLayer,
  GlyphData,
  NameInput,
  NameProfile,
  StageName,
} from './types';
import { runStrokes } from './strokes';
import { runPhonetics } from './phonetics';
import { runSemantics } from './semantics';
import { runWuge } from './wuge';
import { runSancai } from './sancai';
import { runZodiac } from './zodiac';
import { runUsability } from './usability';
import { runScriptAdapt } from './script-adapter';

export const STAGES_HAN: StageName[] = [
  'strokes',
  'phonetics',
  'semantics',
  'wuge',
  'sancai',
  'zodiac',
  'usability',
];
export const STAGES_LATIN: StageName[] = ['phonetics', 'semantics', 'usability', 'script-adapt'];

const EMPTY_FOLK = (disclaimer: string): FolkLayer => ({
  wuge: {
    data: { heavenly: null, human: null, earthly: null, outer: null, total: null, eightyOne: null },
    status: 'unavailable',
    evidence: [],
  },
  sancai: {
    data: { heavenlyElement: null, humanElement: null, earthlyElement: null, text: null },
    status: 'unavailable',
    evidence: [],
  },
  zodiac: {
    data: { zodiac: '', likedRoots: [], avoidedRoots: [], basis: 'unknown' },
    status: 'unavailable',
    evidence: [],
  },
  disclaimer,
});

function mergeStatus(a: DataStatus, b: DataStatus): DataStatus {
  if (a === 'unavailable' || b === 'unavailable') return 'unavailable';
  if (a === 'partial' || b === 'partial') return 'partial';
  return 'complete';
}

export function evaluateNameProfile(input: NameInput, deps: EvaluateDeps = {}): NameProfile {
  const isHan = input.script === 'han';
  const provider = deps.provider ?? deps.dossierProvider ?? (() => null);
  const resolved: EvaluateDeps = { ...deps, provider, dossierProvider: provider };
  const silent = !deps.provider && !deps.dossierProvider;

  const evidence: EvidenceItem[] = [];
  const dataStatus: Record<string, DataStatus> = {};

  const strokes = isHan
    ? runStrokes(input, resolved)
    : {
        data: { perChar: [], total: null, missing: [] },
        status: 'unavailable' as DataStatus,
        evidence: [],
      };
  const phonetics = runPhonetics(input, resolved);
  const semantics = runSemantics(input, resolved);
  const usability = runUsability(input, resolved);
  const scriptAdapt = isHan ? null : runScriptAdapt(input, resolved);

  const glyph: import('./types').StageResult<GlyphData> = {
    data: {
      strokeCountTotal: strokes.data.total,
      rareCharLevel: usability.data.rareCharLevel,
      inputRisk: usability.data.inputRisk,
      perChar: strokes.data.perChar,
      missing: strokes.data.missing,
    },
    status: mergeStatus(strokes.status, usability.status),
    evidence: [...strokes.evidence, ...usability.evidence],
    note: silent ? '未注入字档案 provider，字形维度为空' : (strokes.note ?? usability.note),
  };

  const fact: FactLayer = { glyph, phonetics, semantics, usability, strokes };

  let folk: FolkLayer;
  if (isHan) {
    const wuge = runWuge(input, resolved);
    folk = {
      wuge,
      sancai: runSancai(wuge, resolved),
      zodiac: runZodiac(input, resolved),
      disclaimer: FOLK_DISCLAIMER,
    };
  } else {
    folk = EMPTY_FOLK(LATIN_FOLK_DISCLAIMER);
  }

  evidence.push(
    ...glyph.evidence,
    ...phonetics.evidence,
    ...semantics.evidence,
    ...folk.wuge.evidence,
    ...folk.sancai.evidence,
    ...folk.zodiac.evidence,
  );
  dataStatus['fact.glyph'] = glyph.status;
  dataStatus['fact.phonetics'] = phonetics.status;
  dataStatus['fact.semantics'] = semantics.status;
  dataStatus['fact.usability'] = usability.status;
  dataStatus['fact.strokes'] = strokes.status;
  dataStatus['folk.wuge'] = folk.wuge.status;
  dataStatus['folk.sancai'] = folk.sancai.status;
  dataStatus['folk.zodiac'] = folk.zodiac.status;
  if (scriptAdapt) dataStatus['script.adapt'] = scriptAdapt.status;

  return {
    schemaVersion: '2.1',
    input,
    fact,
    folk,
    culture: buildCulture(input, fact, folk, isHan),
    conflicts: buildConflicts(fact, folk),
    evidence,
    dataStatus,
    duplicateRate: null,
    disclaimer: NAME_DISCLAIMER,
    confidence:
      !silent && glyph.status === 'complete' && phonetics.status === 'complete'
        ? 'verified'
        : 'probable',
    generatedAt: new Date().toISOString(),
  };
}

function buildConflicts(fact: FactLayer, folk: FolkLayer): ConflictItem[] {
  const out: ConflictItem[] = [];
  if (fact.phonetics.data.tongueTwister)
    out.push({
      dimension: 'phonetics',
      a: '相邻字声韵接近',
      b: '朗读流畅',
      note: '仅供参考，不构成取舍建议',
    });
  if (folk.wuge.status === 'partial')
    out.push({
      dimension: 'folk.wuge',
      a: '部分字缺笔画',
      b: '五格完整',
      note: '数据准备中，不估算',
    });
  if (fact.semantics.data.meanings.some((m) => m.confidence === 'disputed'))
    out.push({
      dimension: 'semantics',
      a: '字义存在流派分歧',
      b: '唯一释义',
      note: '已并列多口径',
    });
  return out;
}

function buildCulture(
  input: NameInput,
  fact: FactLayer,
  _folk: FolkLayer,
  isHan: boolean,
): CultureLayer {
  const joined = fact.semantics.data.meanings.map((m) => m.meaning).join('');
  const fem = /女|柔|婉|妍|嫣|婷/.test(joined);
  const male = /男|刚|毅|峰|霆|昊/.test(joined);
  return {
    genderTendency: fem && !male ? '偏女性' : male && !fem ? '偏男性' : '中性',
    eraStyle:
      input.type === 'company'
        ? '品牌名'
        : input.type === 'pet'
          ? '宠物名'
          : isHan
            ? '现代人名'
            : '拉丁人名',
    crossDialectNotes: fact.phonetics.data.homophoneRisks.map((r) => `${r.dialect}: ${r.word}`),
    usageScenario:
      input.type === 'company' ? ['品牌命名', '商标检索前参考'] : ['日常称呼', '文书登记'],
    taboo: {
      data: { hits: [] },
      status: 'unavailable',
      evidence: [],
      note: '避讳词表待 D4 内容生产',
    },
    generationName: {
      data: { matched: null },
      status: 'unavailable',
      evidence: [],
      note: '字辈谱待接入',
    },
    allusions: fact.semantics.data.meanings
      .filter((m) => m.confidence === 'verified')
      .map((m) => `${m.char}:${m.meaning}`),
  };
}
