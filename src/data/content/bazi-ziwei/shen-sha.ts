/**
 * 神煞 12 条（bazi-ziwei 域）
 * 来源：专家 A R3 v3.0（lunz 2.md 文件树 shen-sha.ts）+ R2 约束②全量生成（≥150 字/条）
 * 口径：天乙贵人/文昌贵人/桃花/驿马/华盖/空亡/红鸾/天喜/羊刃/禄神/将星/金舆 = 12 条
 */
import type { ShenShaExtra, ContentRecord } from './types';

const S: Array<{
  id: string;
  name: string;
  pinyin: string;
  base: ShenShaExtra['lookup_base'];
  rule: string;
  meaning: string;
}> = [
  { id: 'tianyi', name: '天乙贵人', pinyin: 'tianyi', base: 'day_stem', rule: '甲戊庚见丑未，乙己见子申等', meaning: '遇困易得帮助，人缘与化解力强，为最吉之神煞之一。' },
  { id: 'wenchang', name: '文昌贵人', pinyin: 'wenchang', base: 'day_stem', rule: '甲见巳、乙见午等顺布', meaning: '主聪明好学、利文书考试，学习与表达能力强。' },
  { id: 'taohua', name: '桃花', pinyin: 'taohua', base: 'day_branch', rule: '申子辰见酉、寅午戌见卯等', meaning: '主异性缘与人气，艺术审美佳，需防感情纠葛。' },
  { id: 'yima', name: '驿马', pinyin: 'yima', base: 'day_branch', rule: '申子辰见寅、寅午戌见申等', meaning: '主动态、迁移与变动，利外出发展，奔波劳碌并存。' },
  { id: 'huagai', name: '华盖', pinyin: 'huagai', base: 'day_branch', rule: '申子辰见辰、寅午戌见戌等', meaning: '主孤高才艺，喜玄学艺术，有独处与钻研倾向。' },
  { id: 'kongwang', name: '空亡', pinyin: 'kongwang', base: 'day_pillar', rule: '以日柱查旬中空亡', meaning: '主所临宫位力量虚空，需辩证看待，也代表放下执念的课题。' },
  { id: 'hongluan', name: '红鸾', pinyin: 'hongluan', base: 'year_branch', rule: '子见卯、丑见寅顺数', meaning: '主喜庆姻缘，婚恋机会增多，利人际关系融洽。' },
  { id: 'tianxi', name: '天喜', pinyin: 'tianxi', base: 'year_branch', rule: '与红鸾对冲', meaning: '主喜事临门，家庭和睦，婚育与庆典类吉事相关。' },
  { id: 'yangren', name: '羊刃', pinyin: 'yangren', base: 'day_stem', rule: '甲见卯、丙戊见午等', meaning: '主刚烈果决、魄力足，需防急躁与冲突，宜正用其锋。' },
  { id: 'lushen', name: '禄神', pinyin: 'lushen', base: 'day_stem', rule: '甲禄在寅、乙禄在卯等', meaning: '主衣食之禄，财源稳定，利工作收入与生活保障。' },
  { id: 'jiangxing', name: '将星', pinyin: 'jiangxing', base: 'year_branch', rule: '申子辰见子、寅午戌见午等', meaning: '主领导才能与掌控力，宜管理岗位，威仪足。' },
  { id: 'jinyu', name: '金舆', pinyin: 'jinyu', base: 'day_stem', rule: '甲龙乙蛇丙戊羊等', meaning: '主车马之福，出行平安，生活品质佳。' },
];

export const SHEN_SHA: readonly ContentRecord<ShenShaExtra>[] = S.map((s) => {
  const body = [
    `${s.name}（${s.pinyin}）是八字神煞体系中较常参考的一颗神煞，其查法以${s.base === 'day_stem' ? '日干' : s.base === 'year_stem' ? '年干' : s.base === 'day_branch' ? '日支' : s.base === 'year_branch' ? '年支' : '日柱'}为基准：${s.rule}。`,
    `当命局中出现${s.name}时，传统命理认为主${s.meaning}`,
    `需要说明的是，神煞的解读属于命理文化参考维度，需结合五行生克与全局结构辩证看待，不宜单独作为吉凶结论；同一神煞在不同宫位与组合下的应事轻重也有差异。`,
  ].join('');
  return {
    id: `shen_sha_${s.id}`,
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'shen_sha',
    seo: {
      title: `${s.name}详解`,
      description: `${s.name}的查法、含义与命理参考解读，作为神煞专题内容。`,
      slug: `/wiki/shen-sha/${s.id}`,
      canonical: `/wiki/shen-sha/${s.id}`,
      breadcrumb: ['首页', '命理百科', '神煞', s.name],
      breadcrumb_paths: ['/', '/wiki', '/wiki/shen-sha', `/wiki/shen-sha/${s.id}`],
    },
    source: { system: 'bazi', classic: '三命通会', chapter: `神煞篇·${s.name}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${s.name}提示命局中「${s.meaning}」的倾向。`,
        cause: `${s.name}依${s.rule}查得，形成该领域的事件与性格提示。`,
        manifestation: `在相应宫位与年份呈现${s.name}主事的特征。`,
        risk: `单独以神煞论断易失之片面。`,
        suggestion: `结合五行旺衰与整体格局辩证参考。`,
        action: `以${s.name}提示的方向规划，不作绝对吉凶判断。`,
      },
    },
    extra: {
      kind: 'shen_sha',
      name_zh: s.name,
      pinyin: s.pinyin,
      lookup_rule: s.rule,
      lookup_base: s.base,
      meaning: s.meaning,
    },
    i18n_key: `shen_sha.${s.id}`,
  };
});

export const SHEN_SHA_COUNT = SHEN_SHA.length; // 12
