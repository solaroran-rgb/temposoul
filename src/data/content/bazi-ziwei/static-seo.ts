/**
 * A 域静态 SEO 14 条（v8.0 修正 breadcrumb_paths 显式传入）
 * 来源：专家 A v8.0（论证44.md §3.1）
 * 执行裁决（2026-09-18 收口执行）：原 11/12 条（/wiki/transits/detail、/wiki/solar-return/detail）
 * 与 TRANSITS 数据记录 slug 重复 → 替换为 2 条不冲突总览页，使唯一路由 = 280（静态14 + 动态266）
 */
export interface StaticSeo {
  slug: string;
  title: string;
  description: string;
  breadcrumb: string[];
  breadcrumb_paths: string[];
}

function mk(i: StaticSeo): StaticSeo {
  if (i.breadcrumb.length !== i.breadcrumb_paths.length) {
    throw new Error(`[static-seo] ${i.slug} breadcrumb length mismatch`);
  }
  return i;
}

export const STATIC_SEO: Record<string, StaticSeo> = {
  '/wiki/ten-gods': mk({
    slug: '/wiki/ten-gods',
    title: '十神详解：八字十神含义与白话解读',
    description: '系统讲解八字十神（比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印）的定义、性格、喜忌与组合。',
    breadcrumb: ['首页', '命理百科', '十神'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/ten-gods'],
  }),
  '/wiki/shen-sha': mk({
    slug: '/wiki/shen-sha',
    title: '八字神煞专题：12 大核心神煞详解',
    description: '天乙贵人、桃花、驿马、华盖、空亡、红鸾等 12 大神煞的查法、含义与现代白话解读。',
    breadcrumb: ['首页', '命理百科', '神煞'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/shen-sha'],
  }),
  '/wiki/four-transform': mk({
    slug: '/wiki/four-transform',
    title: '紫微四化详解：化禄化权化科化忌×十四主星',
    description: '紫微斗数四化与十四主星组合的含义、入宫影响与白话解读，标注为参考维度。',
    breadcrumb: ['首页', '命理百科', '四化'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/four-transform'],
  }),
  '/wiki/ziwei-patterns': mk({
    slug: '/wiki/ziwei-patterns',
    title: '紫微斗数格局大全：15 大主格局白话解读',
    description: '紫微斗数主要格局（≥15 个）的组成条件、特质与白话解读。',
    breadcrumb: ['首页', '命理百科', '紫微格局'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/ziwei-patterns'],
  }),
  '/wiki/palace-star': mk({
    slug: '/wiki/palace-star',
    title: '紫微十二宫×主星解读模板与示例',
    description: '紫微斗数 12 宫与 14 主星组合解读的内容模板与示例，含 168 入口 SEO 结构。',
    breadcrumb: ['首页', '命理百科', '宫星组合'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/palace-star'],
  }),
  '/wiki/limit-year-guide': mk({
    slug: '/wiki/limit-year-guide',
    title: '紫微限年工具：大限小限流年怎么看',
    description: '紫微斗数大限、小限、流年的概念、起法与四化联动，附使用引导。',
    breadcrumb: ['首页', '命理百科', '限年'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/limit-year-guide'],
  }),
  '/wiki/transits': mk({
    slug: '/wiki/transits',
    title: '西占行运：概念与解读框架',
    description: '西洋占星行运（Transits）的概念、分层解读框架与白话说明。',
    breadcrumb: ['首页', '命理百科', '行运'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/transits'],
  }),
  '/wiki/solar-return': mk({
    slug: '/wiki/solar-return',
    title: '太阳返照：概念与解读框架',
    description: '太阳返照（Solar Return）的概念、返照上升与宫位解读框架。',
    breadcrumb: ['首页', '命理百科', '太阳返照'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/solar-return'],
  }),
  '/tools/limit-year': mk({
    slug: '/tools/limit-year',
    title: '紫微限年工具：大限小限流年查询',
    description: '大限、小限、流年三层节律的查询入口与字段说明。',
    breadcrumb: ['首页', '工具', '限年工具'],
    breadcrumb_paths: ['/', '/tools', '/tools/limit-year'],
  }),
  '/tools/solar-return': mk({
    slug: '/tools/solar-return',
    title: '太阳返照查询工具',
    description: '太阳返照盘查询入口，含输入字段与输出结构说明。',
    breadcrumb: ['首页', '工具', '太阳返照'],
    breadcrumb_paths: ['/', '/tools', '/tools/solar-return'],
  }),
  '/wiki/limit-year-guide/faq': mk({
    slug: '/wiki/limit-year-guide/faq',
    title: '限年工具常见问题',
    description: '限年工具的使用常见问题与口径说明。',
    breadcrumb: ['首页', '命理百科', '限年', 'FAQ'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/limit-year-guide', '/wiki/limit-year-guide/faq'],
  }),
  '/wiki/four-transform/pairs': mk({
    slug: '/wiki/four-transform/pairs',
    title: '十干四化配对表',
    description: '十干（甲乙丙丁戊己庚辛壬癸）生年四化配对表，标注为参考维度。',
    breadcrumb: ['首页', '命理百科', '四化', '配对表'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/four-transform', '/wiki/four-transform/pairs'],
  }),
  '/wiki/palace-star/overview': mk({
    slug: '/wiki/palace-star/overview',
    title: '紫微十二宫与主星总览',
    description: '紫微斗数 12 宫位（命宫至父母宫）与 14 主星的对应总览，作为宫星解读入口。',
    breadcrumb: ['首页', '命理百科', '宫星组合', '总览'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/palace-star', '/wiki/palace-star/overview'],
  }),
  '/wiki/four-transform/overview': mk({
    slug: '/wiki/four-transform/overview',
    title: '四化体系总览',
    description: '化禄化权化科化忌的含义、四化与十四主星的对应关系总览，标注为参考维度。',
    breadcrumb: ['首页', '命理百科', '四化', '总览'],
    breadcrumb_paths: ['/', '/wiki', '/wiki/four-transform', '/wiki/four-transform/overview'],
  }),
};

if (Object.keys(STATIC_SEO).length !== 14) {
  throw new Error(`[static-seo] expected 14, got ${Object.keys(STATIC_SEO).length}`);
}
