import type { LightFunEnvelope } from './lightfun.types';

export interface XiuEntry {
  readonly xiu: string;
  readonly direction: '东' | '北' | '西' | '南';
  readonly animal: string;
  readonly keywords: readonly [string, string];
  readonly one_line: string;
}

export interface XiuDegreeContent {
  readonly flow: readonly string[];
  readonly mansions: readonly XiuEntry[];
  readonly disclaimer_pack_keys: readonly string[];
}

const E: XiuEntry['direction'] = '东';
const N: XiuEntry['direction'] = '北';
const W: XiuEntry['direction'] = '西';
const S: XiuEntry['direction'] = '南';

export const XIU_28: readonly XiuEntry[] = [
  {
    xiu: '角',
    direction: E,
    animal: '苍龙角',
    keywords: ['开端', '稳固'],
    one_line: '一切从定位开始。',
  },
  {
    xiu: '亢',
    direction: E,
    animal: '苍龙颈',
    keywords: ['提升', '持重'],
    one_line: '站稳再向上。',
  },
  {
    xiu: '氐',
    direction: E,
    animal: '苍龙胸',
    keywords: ['根基', '承载'],
    one_line: '底盘决定高度。',
  },
  {
    xiu: '房',
    direction: E,
    animal: '苍龙腹',
    keywords: ['收纳', '节奏'],
    one_line: '把内部理顺。',
  },
  {
    xiu: '心',
    direction: E,
    animal: '苍龙心',
    keywords: ['内核', '觉察'],
    one_line: '回到动机本身。',
  },
  {
    xiu: '尾',
    direction: E,
    animal: '苍龙虎尾',
    keywords: ['延展', '余韵'],
    one_line: '收尾也要有章法。',
  },
  {
    xiu: '箕',
    direction: E,
    animal: '苍龙须',
    keywords: ['流动', '发散'],
    one_line: '让信息走出去。',
  },
  {
    xiu: '斗',
    direction: N,
    animal: '玄武斗',
    keywords: ['衡量', '取舍'],
    one_line: '先称重，再决定。',
  },
  { xiu: '牛', direction: N, animal: '牛', keywords: ['勤勉', '积累'], one_line: '慢功夫见效长。' },
  { xiu: '女', direction: N, animal: '女', keywords: ['细腻', '照料'], one_line: '细节里见用心。' },
  {
    xiu: '虚',
    direction: N,
    animal: '虚',
    keywords: ['内省', '留白'],
    one_line: '空出来才有空间。',
  },
  { xiu: '危', direction: N, animal: '危', keywords: ['警觉', '边界'], one_line: '知道风险在哪。' },
  {
    xiu: '室',
    direction: N,
    animal: '室',
    keywords: ['搭建', '归属'],
    one_line: '给自己一个结构。',
  },
  { xiu: '壁', direction: N, animal: '壁', keywords: ['守护', '分隔'], one_line: '边界也是保护。' },
  {
    xiu: '奎',
    direction: W,
    animal: '白虎奎',
    keywords: ['汇集', '文思'],
    one_line: '把材料攒齐。',
  },
  { xiu: '娄', direction: W, animal: '娄', keywords: ['聚合', '招募'], one_line: '找到同路人。' },
  {
    xiu: '胃',
    direction: W,
    animal: '胃',
    keywords: ['储备', '消化'],
    one_line: '消化输入再输出。',
  },
  {
    xiu: '昴',
    direction: W,
    animal: '昴',
    keywords: ['聚焦', '清亮'],
    one_line: '把目光聚成一束。',
  },
  { xiu: '毕', direction: W, animal: '毕', keywords: ['完成', '网罗'], one_line: '收口要干净。' },
  { xiu: '觜', direction: W, animal: '觜', keywords: ['观察', '分辨'], one_line: '看清再出手。' },
  { xiu: '参', direction: W, animal: '参', keywords: ['对照', '比较'], one_line: '参照系很重要。' },
  {
    xiu: '井',
    direction: S,
    animal: '朱雀井',
    keywords: ['连通', '滋养'],
    one_line: '让资源流动起来。',
  },
  {
    xiu: '鬼',
    direction: S,
    animal: '鬼',
    keywords: ['探索', '幽微'],
    one_line: '对未知保持好奇而非恐惧。',
  },
  { xiu: '柳', direction: S, animal: '柳', keywords: ['柔韧', '垂下'], one_line: '弯一下也不断。' },
  { xiu: '星', direction: S, animal: '星', keywords: ['明亮', '表达'], one_line: '让亮点被看见。' },
  { xiu: '张', direction: S, animal: '张', keywords: ['舒展', '张开'], one_line: '打开再谈深度。' },
  { xiu: '翼', direction: S, animal: '翼', keywords: ['辅助', '展翅'], one_line: '借风起飞。' },
  {
    xiu: '轸',
    direction: S,
    animal: '轸',
    keywords: ['转运', '更新'],
    one_line: '转弯处留意方向。',
  },
];

export const XIU_WHITELIST: ReadonlySet<string> = new Set(XIU_28.map((x) => x.xiu));

export const XIU_DEGREE_DATA: LightFunEnvelope<XiuDegreeContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-11',
  slug: 'xiu-degree',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '二十八宿文化', description: '东方星宿的文化象征参考' },
    en: { title: '28 Lunar Mansions', description: 'Cultural notes on lunar mansions' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '二十八宿文化｜星宿象征参考',
    description: '整理二十八宿的方位、动物与文化象征，作为传统文化科普与娱乐参考。',
    canonical: '/knowledge/xiu-degree',
    keywords: ['二十八宿', '星宿', '传统文化'],
    json_ld: [{ '@context': 'https://schema.org', '@type': 'Article', name: '二十八宿文化' }],
  },
  content: {
    flow: ['pick_xiu', 'show_symbol', 'close_loop'],
    mansions: XIU_28,
    disclaimer_pack_keys: ['general'],
  },
  ui: { theme: 'dark-ide', components: ['XiuGrid', 'XiuCard', 'ShareButton'] },
  share_card: {
    title: '二十八宿小知识',
    subtitle: '古人星空的分区',
    tags: ['#二十八宿', '#传统文化'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '二十八宿文化卡片',
    alt_text: '二十八宿的方位与文化象征',
    reading_order: ['xiu', 'direction', 'animal', 'keywords', 'one_line'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'low',
    disclaimers: [{ key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' }],
    disclaimer_slots: ['result_card', 'page_footer'],
    forbidden_terms: ['厄运', '改运', '必然', '一定'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/knowledge/xiu-degree',
    params: ['[xiu]'],
    whitelist: 'content.mansions',
    conflicts_with_884: false,
  },
};
