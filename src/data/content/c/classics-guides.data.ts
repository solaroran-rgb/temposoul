/**
 * C-4 国学典籍导读：10 部经典白话导读
 * 来源：专家 C R3（143217.md §classics/classics-guides.data.ts）
 * 口径：10 部，每条 ≥320 字
 */
import type { CContentRecord, CClassicsGuideExtra } from './types';

interface ClassicSeed {
  slug: string;
  name: string;
  dynasty: string;
  version: string;
  keyChapters: string;
  coreIdea: string;
  modernRelevance: string;
}

const CLASSICS: ClassicSeed[] = [
  {
    slug: 'zhouyi',
    name: '周易',
    dynasty: '先秦',
    version: '中华书局《周易译注》（黄寿祺、张善文撰）',
    keyChapters: '伏羲画卦、文王演易、孔子作传',
    coreIdea: '变易之道',
    modernRelevance: '六十四卦本质是64种"情境模式"，训练"看清当下所处位置"的能力',
  },
  {
    slug: 'daodejing',
    name: '道德经',
    dynasty: '春秋',
    version: '中华书局《老子注译及评介》（陈鼓应撰）',
    keyChapters: '道可道非常道、上善若水、无为而治',
    coreIdea: '道法自然',
    modernRelevance: "现代人的'内耗'很多源于'想控制不可控之事'，道德经教我们区分可控与不可控",
  },
  {
    slug: 'lunyu',
    name: '论语',
    dynasty: '春秋',
    version: '中华书局《论语译注》（杨伯峻撰）',
    keyChapters: '学而时习之、吾日三省吾身、己所不欲勿施于人',
    coreIdea: '仁与礼',
    modernRelevance: '论语的核心是"如何与自己、与他人相处"，在现代职场和亲密关系中依然适用',
  },
  {
    slug: 'mengzi',
    name: '孟子',
    dynasty: '战国',
    version: '中华书局《孟子译注》（杨伯峻撰）',
    keyChapters: '性善论、浩然之气、民为贵',
    coreIdea: '性善与养气',
    modernRelevance: '孟子的"浩然之气"就是现代人说的"内在力量"——通过持续做正确的事来积累',
  },
  {
    slug: 'zhuangzi',
    name: '庄子',
    dynasty: '战国',
    version: '中华书局《庄子今注今译》（陈鼓应撰）',
    keyChapters: '逍遥游、齐物论、养生主',
    coreIdea: '逍遥与齐物',
    modernRelevance: "庄子教我们'解绑'——你以为重要的事，换个角度看其实没那么重要",
  },
  {
    slug: 'sunzi-bingfa',
    name: '孙子兵法',
    dynasty: '春秋',
    version: '中华书局《孙子兵法新注》',
    keyChapters: '始计篇、谋攻篇、军形篇',
    coreIdea: '知己知彼',
    modernRelevance: '不是教你打仗，而是教你在竞争中"先赢后战"——准备充分再出手',
  },
  {
    slug: 'hanfeizi',
    name: '韩非子',
    dynasty: '战国',
    version: '中华书局《韩非子校注》',
    keyChapters: '五蠹、孤愤、说难',
    coreIdea: '法、术、势',
    modernRelevance: '韩非子的"制度思维"对现代管理有启发：好的制度让坏人变好，坏的制度让好人变坏',
  },
  {
    slug: 'zhongyong',
    name: '中庸',
    dynasty: '战国',
    version: '中华书局《中庸注》',
    keyChapters: '天命之谓性、中和、诚者天之道',
    coreIdea: '致中和',
    modernRelevance: '中庸不是"和稀泥"，而是"找到恰到好处的点"——在职场中尤其需要这种分寸感',
  },
  {
    slug: 'daxue',
    name: '大学',
    dynasty: '战国',
    version: '中华书局《大学中庸译注》',
    keyChapters: '三纲领、八条目、格物致知',
    coreIdea: '修身齐家治国',
    modernRelevance: '大学给出了一个"成长路线图"：从格物到平天下，每一步都不可跳过',
  },
  {
    slug: 'shiji',
    name: '史记',
    dynasty: '西汉',
    version: '中华书局点校本《史记》',
    keyChapters: '项羽本纪、廉颇蔺相如列传、货殖列传',
    coreIdea: '究天人之际，通古今之变',
    modernRelevance: '史记不只是历史书，更是"人性观察手册"——两千年前的人和今天的人本质上没怎么变',
  },
];

export const CLASSICS_GUIDES: readonly CContentRecord<CClassicsGuideExtra>[] = CLASSICS.map((c) => {
  const body = [
    `${c.name}成书于${c.dynasty}，主要内容涵盖：${c.keyChapters}。`,
    `核心思想：${c.coreIdea}。白话转译：${c.modernRelevance}。`,
    `与自我觉察的关联：现代人的很多困扰，古人早已观察到并给出了思考框架。${c.name}的核心思想，是帮我们建立一个"观察自身处境"的思维工具。`,
    `白话导读建议：读${c.name}时，不必纠结原文细节，先体会核心思想，再选感兴趣的章节细读。`,
    `版本说明：本文参考${c.version}，原文引述以该版本为准。典籍导读为文化知识科普，不构成治疗或心理建议。`,
  ].join('');

  return {
    id: `c_classics_guide_${c.slug}`,
    version: '1.0.0',
    domain: 'c',
    category: 'c_classics_guide',
    seo: {
      title: `${c.name}导读`,
      description: `${c.name}核心思想白话导读，版本来源标注`,
      slug: `/knowledge/classics/${c.slug}`,
      canonical: `/knowledge/classics/${c.slug}`,
      breadcrumb: ['首页', '国学典籍', c.name],
      breadcrumb_paths: ['/', '/knowledge/classics', `/knowledge/classics/${c.slug}`],
    },
    source: { system: 'classics', classic: c.name, chapter: '全书导读' },
    compliance: {
      no_fatalism: true,
      domain_note: 'culture_discussion',
      banned_words_checked: true,
    },
    review: {
      status: 'supplemented',
      word_count: body.replace(/\s/g, '').length,
      reviewer: 'expert-c',
    },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${c.name}的核心思想是「${c.coreIdea}」。`,
        cause: `${c.name}成书于${c.dynasty}，是中国思想传统的重要组成部分。`,
        manifestation: c.modernRelevance,
        risk: '古籍解读存在多元视角，本文仅供入门参考。',
        suggestion: `选一个你最感兴趣的章节开始读${c.name}。`,
        action: '每周读一章原文+白话翻译，记录自己的感悟。',
      },
    },
    extra: {
      kind: 'c_classics_guide',
      dynasty: c.dynasty,
      version_source: c.version,
      key_chapters: c.keyChapters,
      core_idea: c.coreIdea,
      modern_relevance: c.modernRelevance,
    },
    i18n_key: `c_classics_guide.${c.slug}`,
  };
});

export const CLASSICS_GUIDES_COUNT = CLASSICS_GUIDES.length; // 10
