/**
 * D 域 Merkle 根与文件清单（R5 D-A2）
 * 由 scripts/merkle/d-domain-merkle.mjs 逻辑计算，此处固化为常量供 verify-merkle.mjs 对接
 * 重新计算命令：node scripts/merkle/d-domain-merkle.mjs（在仓库根执行）
 */
export const D_MERKLE_ROOT = '50df0a629c54852e05548f3a564841e5c272a0254bdb7378d85806e2b89f39f3';

export const D_FILE_MANIFEST = [
  'english-name.data.ts',
  'brand-naming.data.ts',
  'artisanal-naming.data.ts',
  'name-consultant.data.ts',
  'name-popularity.data.ts',
  'rhythm-calendar.data.ts',
  'creator-syndicate.data.ts',
] as const;

export const D_FILE_COUNT = D_FILE_MANIFEST.length;
