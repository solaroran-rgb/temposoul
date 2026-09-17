/**
 * 字档案加载器（契约 v3.2 决策 23：数据落 src/data/character-dossier，Vite JSON import）
 * 全量 3500 字与代码解耦：缺失维度返回 null，由引擎降级为 unavailable，禁止估算填充。
 */
import raw from './sample.json';
import zodiacRaw from './zodiac-roots.json';
import {
  parseDossierFile,
  type CharacterDossier,
  type ZodiacRootTable,
  type HomophoneEntry,
} from './schemas';
import { DATASET_VERSION, provenanceText } from './provenance';

export interface DossierLoadReport {
  datasetVersion: string;
  loaded: number;
  errors: string[];
  provenance: string;
}

const byChar = new Map<string, CharacterDossier>();
let report: DossierLoadReport | null = null;

function ensureLoaded(): DossierLoadReport {
  if (report) return report;
  const { entries, errors } = parseDossierFile(raw);
  for (const e of entries) byChar.set(e.char, e);
  report = {
    datasetVersion: DATASET_VERSION,
    loaded: entries.length,
    errors,
    provenance: provenanceText(),
  };
  return report;
}

export function getDossierReport(): DossierLoadReport {
  return ensureLoaded();
}

export function getDossier(char: string): CharacterDossier | null {
  ensureLoaded();
  return byChar.get(char) || null;
}

export function dossierProvider(char: string): CharacterDossier | null {
  return getDossier(char);
}

export function isCharCovered(char: string): boolean {
  ensureLoaded();
  return byChar.has(char);
}

/** 按笔画检索（康熙笔画优先，回退字典笔画） */
export function findByStroke(strokes: number): CharacterDossier[] {
  ensureLoaded();
  return [...byChar.values()].filter(
    (d) => d.kangxiStrokes === strokes || d.dictionaryStrokes === strokes,
  );
}

/** 按拼音检索（忽略声调符号） */
export function findByPinyin(pinyin: string): CharacterDossier[] {
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const target = norm(pinyin);
  ensureLoaded();
  return [...byChar.values()].filter((d) => d.pinyin && norm(d.pinyin) === target);
}

export function searchChar(keyword: string, limit = 20): CharacterDossier[] {
  ensureLoaded();
  const k = keyword.trim();
  if (!k) return [];
  const out: CharacterDossier[] = [];
  for (const d of byChar.values()) {
    if (
      d.char === k ||
      (d.pinyin && d.pinyin.toLowerCase().startsWith(k.toLowerCase())) ||
      (d.meaning && d.meaning.includes(k))
    ) {
      out.push(d);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export function getZodiacRootTable(): ZodiacRootTable {
  return (zodiacRaw as { table: ZodiacRootTable }).table;
}

/** 方言谐音表：样例阶段为空数组，D3 人工表灌入后自动生效 */
export const HOMOPHONE_TABLE: HomophoneEntry[] = [];

export function getHomophoneTable(): HomophoneEntry[] {
  return HOMOPHONE_TABLE;
}

export function datasetSize(): number {
  return ensureLoaded().loaded;
}
