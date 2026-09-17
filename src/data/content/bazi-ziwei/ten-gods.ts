/**
 * 十神 10 条（bazi-ziwei 域）
 * 来源：专家 A R3 v3.0（lunz 2.md 文件树 ten-gods.ts）+ R2 约束②全量生成（≥200 字/条）
 * 口径：比肩/劫财/食神/伤官/偏财/正财/七杀/正官/偏印/正印 = 10 条
 */
import type { TenGodExtra, ContentRecord } from './types';

const P: Array<{
  id: string;
  name: string;
  pinyin: string;
  relation: string;
  strong: string;
  weak: string;
  combos: Array<{ with: string; reading: string }>;
}> = [
  {
    id: 'bijian', name: '比肩', pinyin: 'bijian', relation: '与日干同性同类',
    strong: '自信独立，善竞争，可独当一面', weak: '助力不足，需主动依靠团队',
    combos: [{ with: '劫财', reading: '兄弟朋友缘深，合伙机会多，但需防利益分配' }, { with: '食神', reading: '自立求财，技能型发展有利' }],
  },
  {
    id: 'jiecai', name: '劫财', pinyin: 'jiecai', relation: '与日干同五行异阴阳',
    strong: '行动力强，敢于争取资源', weak: '易因争夺损耗，宜守不宜攻',
    combos: [{ with: '七杀', reading: '竞争型赛道易突围，宜高压环境' }, { with: '伤官', reading: '才华外放但需克制锋芒' }],
  },
  {
    id: 'shishen', name: '食神', pinyin: 'shishen', relation: '日干所生、同性',
    strong: '福气深厚，表达温和，口福佳', weak: '福力不足，需主动创造快乐',
    combos: [{ with: '正财', reading: '才艺生财，稳定输出有利' }, { with: '偏印', reading: '思维独特，适合创意表达' }],
  },
  {
    id: 'shangguan', name: '伤官', pinyin: 'shangguan', relation: '日干所生、异性',
    strong: '才华横溢，创新力强，敢表达', weak: '易锋芒过露，需修炼情绪',
    combos: [{ with: '正印', reading: '才华得约束而更显格局' }, { with: '偏财', reading: '创意变现，适合营销创作' }],
  },
  {
    id: 'piancai', name: '偏财', pinyin: 'piancai', relation: '日干所克、同性',
    strong: '财源广进，人缘活络，善抓机会', weak: '财运波动，需稳健规划',
    combos: [{ with: '七杀', reading: '风险偏好高，宜创业型发展' }, { with: '食神', reading: '以技艺生财，稳健增长' }],
  },
  {
    id: 'zhengcai', name: '正财', pinyin: 'zhengcai', relation: '日干所克、异性',
    strong: '求财务实，储蓄能力强，责任感重', weak: '财路单一，需拓宽收入结构',
    combos: [{ with: '正官', reading: '职场稳定升迁，宜体制内发展' }, { with: '正印', reading: '凭学识与信用得财' }],
  },
  {
    id: 'qisha', name: '七杀', pinyin: 'qisha', relation: '克日干、同性',
    strong: '魄力果决，抗压强，能担重任', weak: '压力过大易急躁，需管理情绪',
    combos: [{ with: '食神', reading: '化杀为权，以智谋驾驭压力' }, { with: '羊刃', reading: '竞争激烈，需合法合规争取' }],
  },
  {
    id: 'zhengguan', name: '正官', pinyin: 'zhengguan', relation: '克日干、异性',
    strong: '自律守规，名誉心强，宜公职管理', weak: '条框束缚多，需增强自主',
    combos: [{ with: '正印', reading: '官印相生，仕途顺遂' }, { with: '正财', reading: '财官双美，事业财源两旺' }],
  },
  {
    id: 'pianyin', name: '偏印', pinyin: 'pianyin', relation: '生日干、同性',
    strong: '思维敏锐，直觉强，善研究冷门', weak: '易多思多虑，需落实践行',
    combos: [{ with: '食神', reading: '枭神夺食，创作易卡顿需调适' }, { with: '七杀', reading: '杀印相生，以专业能力化解压力' }],
  },
  {
    id: 'zhengyin', name: '正印', pinyin: 'zhengyin', relation: '生日干、异性',
    strong: '贵人缘深，学识扎实，名誉好', weak: '依赖心强，需培养独立',
    combos: [{ with: '正官', reading: '官印相生，事业清贵' }, { with: '食神', reading: '印食相随，才学两得' }],
  },
];

export const TEN_GODS: readonly ContentRecord<TenGodExtra>[] = P.map((g) => {
  const body = [
    `${g.name}（${g.pinyin}）是八字十神中${g.relation}的十神，代表日干与其他天干地支之间的一类生克关系，也是解读命局性格与运势走向的基础视角之一。`,
    `当${g.name}在命局中力量偏强时，主${g.strong}；力量偏弱或受制时，则${g.weak}。`,
    `在组合层面，${g.name}与不同十神搭配会呈现不同的现实议题：${g.combos.map((c) => `${c.with}相配时，${c.reading}`).join('；')}。`,
    `需要说明的是，十神解读属于命理文化参考维度，不构成对个人命运的确定性断言；实际分析需结合日主强弱、五行旺衰与大运流年综合判断。`,
  ].join('');
  return {
    id: `ten_god_${g.id}`,
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'ten_gods',
    seo: {
      title: `${g.name}详解`,
      description: `${g.name}十神的含义、性格倾向、喜忌与组合解读，作为命理参考维度。`,
      slug: `/wiki/ten-gods/${g.id}`,
      canonical: `/wiki/ten-gods/${g.id}`,
      breadcrumb: ['首页', '命理百科', '十神', g.name],
      breadcrumb_paths: ['/', '/wiki', '/wiki/ten-gods', `/wiki/ten-gods/${g.id}`],
    },
    source: { system: 'bazi', classic: '渊海子平', chapter: `十神篇·${g.name}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${g.name}揭示日主在「${g.relation}」关系下的性格与机遇倾向。`,
        cause: `${g.name}的力量强弱与组合决定其在命局中的作用方式。`,
        manifestation: `在性格、事业与人际上呈现${g.strong}或${g.weak}的倾向。`,
        risk: `单看十神易忽略日主强弱与五行平衡。`,
        suggestion: `结合日主旺衰、五行喜忌与流年动态综合解读。`,
        action: `以${g.name}的正面特质为发力点，规避其负面倾向。`,
      },
    },
    extra: {
      kind: 'ten_gods',
      name_zh: g.name,
      pinyin: g.pinyin,
      five_element_relation: g.relation,
      preference: { strong_body: g.strong, weak_body: g.weak },
      combinations: g.combos.map((c) => ({ with: c.with, reading: c.reading })),
    },
    i18n_key: `ten_gods.${g.id}`,
  };
});

export const TEN_GODS_COUNT = TEN_GODS.length; // 10
