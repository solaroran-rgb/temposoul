/**
 * 字档案数据结构定义 + zod 校验（契约 v3.2 §5 / §1 zod 4）
 * 字段带 source / note / confidence / reviewer / updatedAt，禁止无出处数据。
 */
import { z } from 'zod';

export const ConfidenceSchema = z.enum([
  'verified',
  'probable',
  'disputed',
  'legendary',
  'unavailable',
]);
export const RareCharLevelSchema = z.enum(['common', 'rare', 'very-rare']);

export const CharacterDossierSchema = z.object({
  char: z.string().min(1),
  unicode: z.string().optional(),
  simplified: z.string().optional(),
  traditional: z.string().optional(),
  pinyin: z.string().nullable().optional(),
  tone: z.number().int().min(0).max(5).nullable().optional(),
  dictionaryStrokes: z.number().int().positive().nullable().optional(),
  kangxiStrokes: z.number().int().positive().nullable().optional(),
  radicalVariantRule: z.string().nullable().optional(),
  meaning: z.string().nullable().optional(),
  allusion: z.string().nullable().optional(),
  rareCharLevel: RareCharLevelSchema.nullable().optional(),
  source: z.string().optional(),
  note: z.string().optional(),
  confidence: ConfidenceSchema.optional(),
  reviewer: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CharacterDossier = z.infer<typeof CharacterDossierSchema>;

export const CharacterDossierFileSchema = z.object({
  schemaVersion: z.string(),
  generatedAt: z.string(),
  count: z.number().int(),
  provenanceRef: z.string().optional(),
  note: z.string().optional(),
  entries: z.array(CharacterDossierSchema),
});

export type CharacterDossierFile = z.infer<typeof CharacterDossierFileSchema>;

/** 生肖喜忌字根表（民俗，legendary） */
export const ZodiacRootTableSchema = z.record(
  z.string(),
  z.object({ liked: z.array(z.string()), avoided: z.array(z.string()) }),
);
export type ZodiacRootTable = z.infer<typeof ZodiacRootTableSchema>;

/** 方言谐音表（人工，probable） */
export const HomophoneEntrySchema = z.object({
  dialect: z.enum(['mandarin', 'cantonese', 'wu', 'minnan']),
  char: z.string(),
  word: z.string(),
  note: z.string(),
});
export type HomophoneEntry = z.infer<typeof HomophoneEntrySchema>;

/** 单条校验失败不中断整体加载 */
export function parseDossierFile(raw: unknown): { entries: CharacterDossier[]; errors: string[] } {
  const errors: string[] = [];
  const entries: CharacterDossier[] = [];
  const obj = raw as { entries?: unknown[] };
  for (const item of obj?.entries ?? []) {
    const r = CharacterDossierSchema.safeParse(item);
    if (r.success) entries.push(r.data);
    else
      errors.push(
        `${(item as { char?: string })?.char ?? '?'}: ${r.error.issues[0]?.message ?? 'invalid'}`,
      );
  }
  return { entries, errors };
}
