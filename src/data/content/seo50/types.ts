/**
 * 线程 C · SEO 内容路由数据层
 * 50 篇长尾关键词科普文（八字 / 紫微 / 塔罗 / 星座 / 姓名 / 黄历 / 生肖 / 风水）
 *
 * 设计对齐 src/data/content/entry-types.ts 的 LocalContentBlock 六变体白名单；
 * 每篇记录自带 sourceRef（满足 scripts/lint-content.mjs 溯源门禁），
 * 正文不出现宿命断言 / 医疗 / 法律 / 投资类词（满足 L4 禁词门禁）。
 *
 * 合规基线（每篇渲染时由详情页统一追加，正文不重复占位）：
 *   - 仅供娱乐与自我觉察，不构成专业建议
 *   - AI 生成待专家审计
 */

export type SeoTopic =
  'bazi' | 'ziwei' | 'tarot' | 'astrology' | 'naming' | 'almanac' | 'zodiac' | 'fengshui';

/** block 变体白名单子集（与 lint-content.mjs ALLOWED_BLOCK_KINDS 对齐） */
export type SeoBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'callout'; tone: 'info' | 'warn'; text: string };

export interface SeoArticle {
  id: string;
  slug: string;
  /** H1：即目标长尾关键词 */
  title: string;
  /** 主关键词（用于内链 / meta keywords） */
  keyword: string;
  topic: SeoTopic;
  /** 列表页摘要，≤60 字 */
  summary: string;
  blocks: SeoBlock[];
  /** 溯源（lint 门禁要求 blocks 旁必须有 sourceRef） */
  sourceRef: string;
  updatedAt: string;
}

export const SEO_TOPIC_META: Record<SeoTopic, { label: string; desc: string; path: string }> = {
  bazi: { label: '八字', desc: '四柱八字入门与现代解读视角', path: '/seo/bazi' },
  ziwei: { label: '紫微斗数', desc: '十二宫位与主星的文化图解', path: '/seo/ziwei' },
  tarot: { label: '塔罗', desc: '78 张塔罗牌意的心理视角', path: '/seo/tarot' },
  astrology: { label: '星座占星', desc: '太阳 / 月亮 / 上升与行星相位', path: '/seo/astrology' },
  naming: { label: '姓名学', desc: '起名用字与姓名文化常识', path: '/seo/naming' },
  almanac: { label: '老黄历', desc: '宜忌 / 节气 / 民俗日历文化', path: '/seo/almanac' },
  zodiac: { label: '生肖', desc: '十二生肖与民俗合冲说法', path: '/seo/zodiac' },
  fengshui: { label: '风水', desc: '居家环境布局的民俗与心理学', path: '/seo/fengshui' },
};
