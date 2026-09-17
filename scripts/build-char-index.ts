import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src/data/character-dossier/sample.json');
const OUT = join(ROOT, 'src/data/character-dossier/character-index.generated.json');

interface Out { char: Record<string, unknown>; radical: Record<string, string[]>; meaning: Record<string, string[]> }

function main(): void {
  if (!existsSync(SRC)) { console.log('[char-index] sample.json 缺失，跳过'); return; }
  const raw = JSON.parse(readFileSync(SRC, 'utf-8')) as { entries?: unknown[] } | unknown[];
  const entries = Array.isArray(raw) ? raw : (raw.entries ?? []);
  const out: Out = { char: {}, radical: {}, meaning: {} };
  for (const e of entries as { char?: string; radical?: string; meanings?: { meaning?: string }[] }[]) {
    if (!e?.char) continue;
    out.char[e.char] = e;
    if (e.radical) (out.radical[e.radical] ??= []).push(e.char);
    for (const m of e.meanings ?? []) {
      const k = String(m.meaning || '').slice(0, 2);
      if (k) (out.meaning[k] ??= []).push(e.char);
    }
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out), 'utf-8');
  console.log(`[char-index] 生成完成：${Object.keys(out.char).length} 字`);
}
main();
