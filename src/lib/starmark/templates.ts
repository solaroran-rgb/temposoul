/**
 * templates.ts —— StarMark 品牌模板体系 + UGC 称谓合规（B3 P12）
 *
 * >=3 套品牌模板（命名含 StarMark）：默认星空 / 浪漫 / 纪念。
 * 称谓合规：敏感词过滤 + 长度限制；图上强制娱乐参考口径标识。
 * 称谓不进 sky_id（见 skyId.ts）。
 *
 * 词库说明：P0 内置最小滥用词集（辱骂/色情/赌博/广告类明显高危项）；
 *           完整合规词表由合规线通过 setBlocklist() 注入，不硬编码在源码里。
 */

export interface StarMarkTemplate {
  id: string;
  /** 展示名（含 StarMark 品牌） */
  displayName: string;
  /** 背景渐变顶/底（hex） */
  bgTop: string;
  bgBottom: string;
  /** 星点主色（rgb 0..1） */
  starTint: [number, number, number];
  /** 星座线色 */
  lineColor: string;
  /** 强调色（标题/称谓） */
  accent: string;
  /** 页脚文案 */
  tagline: string;
}

export const STAR_MARK_TEMPLATES: StarMarkTemplate[] = [
  {
    id: 'starmark-night',
    displayName: 'StarMark · 初见星空',
    bgTop: '#050814',
    bgBottom: '#0d1b3a',
    starTint: [0.85, 0.9, 1.0],
    lineColor: 'rgba(120,180,255,0.35)',
    accent: '#cfe6ff',
    tagline: '这片星空，为你定格',
  },
  {
    id: 'starmark-romance',
    displayName: 'StarMark · 浪漫星夜',
    bgTop: '#16081f',
    bgBottom: '#3a0f2e',
    starTint: [1.0, 0.88, 0.92],
    lineColor: 'rgba(255,150,190,0.35)',
    accent: '#ffd6e4',
    tagline: '星光落在你眼里',
  },
  {
    id: 'starmark-memorial',
    displayName: 'StarMark · 纪念时刻',
    bgTop: '#0a0f1c',
    bgBottom: '#1c2a4a',
    starTint: [0.9, 0.95, 1.0],
    lineColor: 'rgba(150,200,255,0.30)',
    accent: '#d8e6ff',
    tagline: '那一刻，星空记得',
  },
];

export function getTemplate(id: string): StarMarkTemplate {
  return STAR_MARK_TEMPLATES.find((t) => t.id === id) ?? STAR_MARK_TEMPLATES[0];
}

/** 图上强制娱乐参考口径标识（合规红线，任何模板都必须画） */
export const DISCLAIMER_TEXT = '本图为星空位置娱乐参考，不构成任何建议';

/** 称谓长度上限（字符数，按 Unicode code point） */
export const NAME_MAX_LEN = 12;

/** P0 内置最小滥用词集（小写匹配）。合规线可通过 setBlocklist 追加完整词表。 */
let BLOCKLIST: string[] = [
  '傻逼', '操你', '去死', '他妈', '草泥马',
  '色情', '裸体', '卖淫', '嫖娼', '约炮',
  '赌博', '博彩', '赌场', '六合彩',
  '诈骗', '传销', '代开发票', '办证刻章',
  'fuck', 'shit', 'bitch', 'nigger',
];

/** 合规线注入完整词表（合并，不替换） */
export function setBlocklist(words: string[]): void {
  BLOCKLIST = Array.from(new Set([...BLOCKLIST, ...words.map((w) => w.toLowerCase())]));
}

export interface SanitizeNameResult {
  /** 清洗后的称谓（可上屏） */
  name: string;
  /** 是否命中敏感词（命中即拒绝生成，不可降级放行） */
  blocked: boolean;
  /** 是否因超长被截断 */
  truncated: boolean;
}

/**
 * 称谓过滤：先查敏感词（命中即 blocked=true），再按长度截断。
 * blocked=true 时调用方必须中止出图。
 */
export function sanitizeName(raw: string): SanitizeNameResult {
  const trimmed = String(raw ?? '').trim().slice(0, 64);
  const lower = trimmed.toLowerCase();
  for (const w of BLOCKLIST) {
    if (w && lower.includes(w)) {
      return { name: '', blocked: true, truncated: false };
    }
  }
  const chars = [...trimmed];
  const truncated = chars.length > NAME_MAX_LEN;
  const name = truncated ? chars.slice(0, NAME_MAX_LEN).join('') : trimmed;
  return { name, blocked: false, truncated };
}
