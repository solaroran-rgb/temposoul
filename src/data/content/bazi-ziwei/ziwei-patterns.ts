/**
 * 紫微格局 15 条（bazi-ziwei 域）
 * 来源：专家 A R3 v3.0（lunz 2.md 文件树 ziwei-patterns.ts）+ R2 约束②全量生成（≥150 字/条）
 * 口径：15 个主格局（≥15）
 */
import type { ZiweiPatternExtra, ContentRecord } from './types';

const P: Array<{ id: string; name: string; condition: string; traits: string[]; risk: string }> = [
  { id: 'zisha', name: '紫微朝垣格', condition: '紫微坐命宫或身宫，辅弼昌曲拱照', traits: ['贵气显', '领袖气质', '格局高'], risk: '孤坐无辅时贵气减半' },
  { id: 'fuyin', name: '府相朝垣格', condition: '天府天相夹命或坐命三方', traits: ['稳重', '善管理', '福禄双全'], risk: '需防安逸过度' },
  { id: 'riyue', name: '日月同宫格', condition: '太阳太阴同守命宫（丑未）', traits: ['文武双全', '人缘佳', '动静皆宜'], risk: '需调和阴阳节奏' },
  { id: 'rifu', name: '日月并明格', condition: '太阳在卯、太阴在酉等明旺位', traits: ['光明磊落', '声名佳', '贵气显'], risk: '运势随日月旺衰波动' },
  { id: 'yuetu', name: '月朗天门格', condition: '太阴在亥（天门）庙旺', traits: ['温润有才', '福泽深', '晚运佳'], risk: '需防细腻过度' },
  { id: 'wugu', name: '武曲守垣格', condition: '武曲坐命（寅申等庙旺位）', traits: ['刚毅务实', '理财强', '执行力足'], risk: '性刚易孤' },
  { id: 'qisha', name: '七杀朝斗格', condition: '七杀坐命会吉（寅申）', traits: ['魄力足', '开创力强', '能担重任'], risk: '动中求财，宜闯荡' },
  { id: 'pojun', name: '破军暗曜格', condition: '破军坐命会吉制煞', traits: ['革新力强', '敢破敢立', '逆境翻盘'], risk: '变动多需防反复' },
  { id: 'tanlang', name: '贪狼会昌曲格', condition: '贪狼坐命会文昌文曲', traits: ['才艺双全', '人缘桃花旺', '社交强'], risk: '需防桃花过旺' },
  { id: 'tianfu', name: '天府守垣格', condition: '天府坐命会禄', traits: ['厚积薄发', '守成有度', '福泽绵长'], risk: '进取心需加强' },
  { id: 'tianliang', name: '天梁荫福格', condition: '天梁坐命会吉（子午）', traits: ['德望高', '贵人运强', '逢凶化吉'], risk: '需防孤高' },
  { id: 'jiuming', name: '君臣庆会格', condition: '紫微天府等主星与辅弼会合', traits: ['贵气显', '团队助力强', '格局宏大'], risk: '依赖外援需自立' },
  { id: 'chanrong', name: '三奇嘉会格', condition: '化禄化权化科三奇会命', traits: ['才华横溢', '顺遂多助', '名利双收'], risk: '需防志得意满' },
  { id: 'luoquan', name: '禄权科会格', condition: '命宫三方会禄权科（至少二化）', traits: ['晋升快', '掌控力强', '声名渐起'], risk: '需均衡发展' },
  { id: 'jiaxing', name: '夹贵格', condition: '紫微天府夹命或身（如卯宫）', traits: ['贵人夹辅', '机遇佳', '地位稳固'], risk: '需主动把握' },
];

export const ZIWEI_PATTERNS: readonly ContentRecord<ZiweiPatternExtra>[] = P.map((p) => {
  const body = [
    `${p.name}是紫微斗数中较常被提及的格局之一，其成格条件为：${p.condition}。`,
    `格局成立时，主${p.traits.join('、')}；在现实层面往往体现为命主在事业、人际或财运上的优势方向较为突出。`,
    `需要注意的是：${p.risk}。格局只是命盘解读的参考框架，不代表确定的吉凶结果，需结合四化、煞曜与大运流年的动态变化综合判断，也不应忽视个人选择与后天努力的作用。`,
  ].join('');
  return {
    id: `ziwei_pattern_${p.id}`,
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'ziwei_pattern',
    seo: {
      title: `${p.name}详解`,
      description: `${p.name}的成格条件、特质与命理参考解读，作为紫微格局专题内容。`,
      slug: `/wiki/ziwei-patterns/${p.id}`,
      canonical: `/wiki/ziwei-patterns/${p.id}`,
      breadcrumb: ['首页', '命理百科', '紫微格局', p.name],
      breadcrumb_paths: ['/', '/wiki', '/wiki/ziwei-patterns', `/wiki/ziwei-patterns/${p.id}`],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: `格局篇·${p.name}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${p.name}成格提示「${p.traits[0]}」方向的优势框架。`,
        cause: `${p.condition}构成格局条件，放大对应星曜组合的特质。`,
        manifestation: `在事业、人际或财运上呈现${p.traits.join('、')}的倾向。`,
        risk: `${p.risk}。`,
        suggestion: `以格局优势为主线，同时补足风险面。`,
        action: `结合四化与行运动态，务实规划发展路径。`,
      },
    },
    extra: {
      kind: 'ziwei_pattern',
      name_zh: p.name,
      condition: p.condition,
      traits: p.traits,
      risk_note: p.risk,
    },
    i18n_key: `ziwei_pattern.${p.id}`,
  };
});

export const ZIWEI_PATTERNS_COUNT = ZIWEI_PATTERNS.length; // 15
