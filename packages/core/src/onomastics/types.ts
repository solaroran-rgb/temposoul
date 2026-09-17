export type Confidence = 'verified' | 'probable' | 'disputed' | 'legendary';
export type DossierConfidence = Confidence | 'unavailable';
export type DataStatus = 'complete' | 'partial' | 'unavailable';

export type ScriptSystem = 'han' | 'latin';
export type NameType = 'person' | 'company' | 'pet';
export type StageName =
  | 'strokes'
  | 'phonetics'
  | 'semantics'
  | 'wuge'
  | 'sancai'
  | 'zodiac'
  | 'usability'
  | 'script-adapt';

export interface NameInput {
  surname: string;
  given: string;
  type: NameType;
  script: ScriptSystem;
  gender?: 'male' | 'female' | 'neutral';
  dialect?: 'mandarin' | 'cantonese' | 'wu' | 'minnan';
  birthDate?: string;
  birthYear?: number;
}

export interface CharDossierLike {
  char: string;
  unicode?: string;
  traditional?: string;
  simplified?: string;
  kangxiStrokes?: number | null;
  radical?: string;
  radicalVariantRule?: string | null; // 数据文件可为 null（放宽兼容）
  pinyin?: string | null; // 数据文件可为 null
  tone?: number | null; // 数据文件可为 null
  meanings?: { meaning: string; source: string; confidence: DossierConfidence }[];
  wuxing?: string;
  rareCharLevel?: 'common' | 'rare' | 'very-rare' | 'unknown' | null; // 数据文件可为 null
  inputRisk?: { system: string; supported: boolean; note: string }[];
  homophones?: { dialect: string; word: string; note: string; confidence: DossierConfidence }[];
  source?: string;
  note?: string;
  confidence?: DossierConfidence;
  reviewer?: string;
  updatedAt?: string;
}

export interface ZodiacRootTable {
  [zodiac: string]: { liked: string[]; avoided: string[] };
}

export interface EvaluateDeps {
  dossierProvider?: (c: string) => CharDossierLike | null | undefined;
  provider?: (c: string) => CharDossierLike | null | undefined;
  zodiacRootTable?: ZodiacRootTable | null;
  homophoneTable?: { char: string; dialect: string; word: string; note: string }[] | null;
}

export interface EvidenceItem {
  fieldPath: string;
  label: string;
  source: string;
  confidence: Confidence;
  note?: string;
}
export interface StageResult<T> {
  data: T;
  status: DataStatus;
  evidence: EvidenceItem[];
  note?: string;
}

export interface HomophoneRisk {
  dialect: string;
  word: string;
  note: string;
  confidence: Confidence;
}
export interface MeaningItem {
  char: string;
  meaning: string;
  source: string;
  confidence: Confidence;
}

export interface StrokesData {
  perChar: { char: string; strokes: number | null }[];
  total: number | null;
  missing: string[];
}
export interface GlyphData {
  strokeCountTotal: number | null;
  rareCharLevel: 'common' | 'rare' | 'very-rare' | 'unknown';
  inputRisk: { system: string; supported: boolean; note: string }[];
  perChar?: { char: string; strokes: number | null }[];
  missing?: string[];
}
export interface PhoneticsData {
  pinyin: string[];
  tones: number[];
  syllables: string[];
  tongueTwister: boolean;
  homophoneRisks: HomophoneRisk[];
  duplicateRate: null;
}
export interface SemanticsData {
  meanings: MeaningItem[];
}
export interface WugeData {
  heavenly: number | null;
  human: number | null;
  earthly: number | null;
  outer: number | null;
  total: number | null;
  eightyOne: number | null;
}
export interface SancaiData {
  heavenlyElement: string | null;
  humanElement: string | null;
  earthlyElement: string | null;
  text: string | null;
}
export interface ZodiacData {
  zodiac: string;
  likedRoots: string[];
  avoidedRoots: string[];
  basis: 'lichun' | 'lunar-new-year' | 'unknown';
}
export interface UsabilityData {
  conformsToStandard: boolean;
  rareCharLevel: 'common' | 'rare' | 'very-rare' | 'unknown';
  inputRisk: { system: string; supported: boolean; note: string }[];
}
export interface ScriptAdaptData {
  syllables: string[];
  length: number;
  initials: string;
  meaning?: string;
  culturalNotes?: string;
}

export interface FactLayer {
  glyph: StageResult<GlyphData>;
  phonetics: StageResult<PhoneticsData>;
  semantics: StageResult<SemanticsData>;
  usability: StageResult<UsabilityData>;
  strokes?: StageResult<StrokesData>;
}
export interface FolkLayer {
  wuge: StageResult<WugeData>;
  sancai: StageResult<SancaiData>;
  zodiac: StageResult<ZodiacData>;
  disclaimer: string;
}
export interface CultureLayer {
  genderTendency: string | null;
  eraStyle: string;
  crossDialectNotes: string[];
  usageScenario: string[];
  taboo: StageResult<{ hits: string[] }>;
  generationName: StageResult<{ matched: string | null }>;
  allusions: string[];
}
export interface ConflictItem {
  dimension: string;
  a: string;
  b: string;
  note: string;
}

export interface NameProfile {
  schemaVersion: string;
  input: NameInput;
  fact: FactLayer;
  folk: FolkLayer;
  culture: CultureLayer;
  conflicts: ConflictItem[];
  evidence: EvidenceItem[];
  dataStatus: Record<string, DataStatus>;
  duplicateRate: null;
  disclaimer: string;
  confidence?: Confidence;
  generatedAt: string;
}

export const FOLK_DISCLAIMER = '文化习俗，非可验证结论';
export const LATIN_FOLK_DISCLAIMER = '拉丁书写体系不计算五格/三才';
export const NAME_DISCLAIMER = '本档案为事实与民俗文化参考，不含吉凶预测、成功率或必然事件断言';

export function asConfidence(c: DossierConfidence | undefined): Confidence {
  return c && c !== 'unavailable' ? c : 'probable';
}
