/**
 * B 域：24 节气（历法星象）——全部内容化 ≥200 字/条
 * 来源：专家 B R4（论证222.md §二 B 域 50 条 = 星曜14+宫位12+节气24）+ 既有知识库
 * 口径：solar-terms 24 条
 */
import type { ContentRecord, ContentSeo } from '../bazi-ziwei/types';

export interface SolarTermExtra {
  kind: 'solar_term';
  term_index: number; // 1-24
  solar_approx: string; // 公历约
  five_element: string;
  wellness_tip: string;
}

const TERMS: Array<{ zh: string; pinyin: string; month: string; approx: string; wx: string; tip: string }> = [
  { zh: '立春', pinyin: 'lichun', month: '正月', approx: '2月3-5日', wx: '木', tip: '宜早睡早起，舒展筋骨，顺应生发之气。' },
  { zh: '雨水', pinyin: 'yushui', month: '正月', approx: '2月18-20日', wx: '木', tip: '注意保暖防潮，饮食清淡，养护脾胃。' },
  { zh: '惊蛰', pinyin: 'jingzhe', month: '二月', approx: '3月5-7日', wx: '木', tip: '万物复苏，宜户外活动，疏肝理气。' },
  { zh: '春分', pinyin: 'chunfen', month: '二月', approx: '3月20-22日', wx: '木', tip: '昼夜平分，宜平衡作息，调和阴阳。' },
  { zh: '清明', pinyin: 'qingming', month: '三月', approx: '4月4-6日', wx: '木', tip: '踏青祭祖，宜清淡饮食，注意情绪疏导。' },
  { zh: '谷雨', pinyin: 'guyu', month: '三月', approx: '4月19-21日', wx: '木', tip: '雨生百谷，宜健脾祛湿，适当运动。' },
  { zh: '立夏', pinyin: 'lixia', month: '四月', approx: '5月5-7日', wx: '火', tip: '夏气初生，宜养心安神，午间小憩。' },
  { zh: '小满', pinyin: 'xiaoman', month: '四月', approx: '5月20-22日', wx: '火', tip: '物致于此小得盈满，宜饮食有节，防暑湿。' },
  { zh: '芒种', pinyin: 'mangzhong', month: '五月', approx: '6月5-7日', wx: '火', tip: '有芒之种谷可稼种，宜清补，多饮水。' },
  { zh: '夏至', pinyin: 'xiazhi', month: '五月', approx: '6月21-22日', wx: '火', tip: '阳极之至，宜静养，作息顺应昼长夜短。' },
  { zh: '小暑', pinyin: 'xiaoshu', month: '六月', approx: '7月6-8日', wx: '火', tip: '暑气渐盛，宜防中暑，饮食宜清淡。' },
  { zh: '大暑', pinyin: 'dashu', month: '六月', approx: '7月22-24日', wx: '火', tip: '一年最热，宜避暑养心，多食苦味。' },
  { zh: '立秋', pinyin: 'liqiu', month: '七月', approx: '8月7-9日', wx: '金', tip: '秋气始生，宜润肺防燥，早卧早起。' },
  { zh: '处暑', pinyin: 'chushu', month: '七月', approx: '8月22-24日', wx: '金', tip: '暑气渐退，宜滋阴润燥，适度进补。' },
  { zh: '白露', pinyin: 'bailu', month: '八月', approx: '9月7-9日', wx: '金', tip: '露凝而白，宜添衣防寒，养护肺气。' },
  { zh: '秋分', pinyin: 'qiufen', month: '八月', approx: '9月22-24日', wx: '金', tip: '昼夜平分，宜平衡阴阳，收敛神气。' },
  { zh: '寒露', pinyin: 'hanlu', month: '九月', approx: '10月7-9日', wx: '金', tip: '露寒而凝，宜温养脾胃，注意足部保暖。' },
  { zh: '霜降', pinyin: 'shuangjiang', month: '九月', approx: '10月23-24日', wx: '金', tip: '气肃而凝，宜进补御寒，适度运动。' },
  { zh: '立冬', pinyin: 'lidong', month: '十月', approx: '11月7-8日', wx: '水', tip: '冬气始藏，宜养精蓄锐，早睡晚起。' },
  { zh: '小雪', pinyin: 'xiaoxue', month: '十月', approx: '11月22-23日', wx: '水', tip: '气温渐降，宜温补阳气，防寒保暖。' },
  { zh: '大雪', pinyin: 'daxue', month: '十一月', approx: '12月6-8日', wx: '水', tip: '至此而雪盛，宜进补养肾，注意室内通风。' },
  { zh: '冬至', pinyin: 'dongzhi', month: '十一月', approx: '12月21-23日', wx: '水', tip: '阴极之至阳气始生，宜温补养藏，静心休养。' },
  { zh: '小寒', pinyin: 'xiaohan', month: '十二月', approx: '1月5-7日', wx: '水', tip: '寒气尚盛，宜护阳御寒，温补脾胃。' },
  { zh: '大寒', pinyin: 'dahan', month: '十二月', approx: '1月20-21日', wx: '水', tip: '寒气之极，宜养精蓄锐，迎接立春。' },
];

export const SOLAR_TERMS: readonly ContentRecord<SolarTermExtra>[] = TERMS.map((t, i) => {
  const seo: ContentSeo = {
    title: `${t.zh}节气详解`,
    description: `${t.zh}（${t.approx}）的节气含义、五行属性与养生参考。`,
    slug: `/wiki/solar-terms/${t.pinyin}`,
    canonical: `/wiki/solar-terms/${t.pinyin}`,
    breadcrumb: ['首页', '黄历·节气', t.zh],
    breadcrumb_paths: ['/', '/wiki', '/wiki/solar-terms', `/wiki/solar-terms/${t.pinyin}`],
  };
  const body = [
    `${t.zh}是二十四节气中的第${i + 1}个节气，约在每年公历${t.approx}交节，对应农历${t.month}。`,
    `从历法上讲，${t.zh}标志着太阳到达黄经${((i + 1) * 15).toString()}°的位置，是古人观察太阳周年运动与物候变化总结出的时间节点。${t.zh}时节，${t.wx}行之气当令，自然界的物候呈现相应特征，传统养生讲究顺应此时节之气调养身心：${t.tip}`,
    `节气不仅是农事安排与民俗生活的时间刻度，也是理解中国时间文化的一把钥匙。将节气作为生活节奏的参考，可以帮助我们在快节奏中找回与自然同步的节律感。`,
  ].join('');
  return {
    id: `solar_term_${t.pinyin}`,
    version: '1.0.0',
    domain: 'calendar-astro',
    category: 'solar_term',
    seo,
    source: { system: 'hybrid', classic: '通胜·七十二候', chapter: `二十四节气·${t.zh}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-b' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${t.zh}提示进入「${t.wx}」气主导的节律阶段。`,
        cause: `太阳到达黄经${((i + 1) * 15).toString()}°，节气之气交接。`,
        manifestation: `物候与生活节奏随之变化，养生重点相应调整。`,
        risk: `忽略节令变化易与环境节律脱节。`,
        suggestion: `顺应节气调整作息与饮食，保持身心平衡。`,
        action: `以${t.zh}为节点安排生活节奏，观察自身状态。`,
      },
    },
    extra: {
      kind: 'solar_term',
      term_index: i + 1,
      solar_approx: t.approx,
      five_element: t.wx,
      wellness_tip: t.tip,
    },
    i18n_key: `solar_term.${t.pinyin}`,
  };
});

export const SOLAR_TERMS_COUNT = SOLAR_TERMS.length; // 24
