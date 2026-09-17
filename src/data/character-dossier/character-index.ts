import sample from './sample.json';

export interface CharAssetLite {
  char: string;
  radical?: string;
  kangxiStrokes?: number | null;
  status?: 'complete' | 'partial' | 'unavailable';
  meanings?: { meaning: string; source: string }[];
}

export const CHAR_INDEX: Record<string, CharAssetLite> = {};
export const RADICAL_INDEX: Record<string, string[]> = {};
export const MEANING_INDEX: Record<string, string[]> = {};

function ingestOne(ch: CharAssetLite): void {
  if (!ch?.char) return;
  CHAR_INDEX[ch.char] = ch;
  if (ch.radical) (RADICAL_INDEX[ch.radical] ??= []).push(ch.char);
  for (const m of ch.meanings ?? []) {
    const key = String(m.meaning || '').slice(0, 2);
    if (key) (MEANING_INDEX[key] ??= []).push(ch.char);
  }
}
function ingestList(list: unknown): void {
  const arr = Array.isArray(list) ? list : ((list as { entries?: unknown[] })?.entries ?? []);
  for (const raw of arr) ingestOne(raw as CharAssetLite);
}
ingestList(sample);

export function mergeCharAsset(ch: CharAssetLite): void {
  ingestOne(ch);
}
export function mergeCharAssets(list: CharAssetLite[]): void {
  for (const c of list) ingestOne(c);
}

const meta = import.meta as unknown as {
  glob?: (p: string, o: { eager: false }) => Record<string, () => Promise<{ default: unknown }>>;
};
const chunkLoaders =
  typeof meta.glob === 'function' ? meta.glob('./chunks/chunk-*.json', { eager: false }) : {};

let chunksLoaded = false;
export async function ensureAllChunks(): Promise<void> {
  if (chunksLoaded) return;
  for (const load of Object.values(chunkLoaders ?? {})) {
    try {
      const mod = await load();
      ingestList(mod?.default ?? mod);
    } catch {
      /* 分片缺失不阻塞 */
    }
  }
  chunksLoaded = true;
}

export function charsByMeaning(keys: string[]): string[] {
  const out = new Set<string>();
  for (const k of keys) for (const ch of MEANING_INDEX[String(k).slice(0, 2)] ?? []) out.add(ch);
  return [...out];
}
