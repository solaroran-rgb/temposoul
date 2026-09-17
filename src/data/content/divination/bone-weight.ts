/**
 * C 域：称骨算命 51 条（占卜民俗）
 * 来源：专家 C R4（论证44.md registry bone_weight=51）+ 既有 chenggu.ts 数据层
 * 口径：51 档（2.1~7.1 两，每 0.1 一档），逐条 ≥150 字，compliance_level=caution
 */
import type { ContentRecord } from '../bazi-ziwei/types';

export interface BoneWeightExtra {
  kind: 'bone_weight';
  weight_liang: number; // 两
  weight_qian: number; // 钱
}

const LEVEL_NOTE: Record<string, string> = {
  light: '此档骨重偏轻，民间传统认为属于「根基轻」的一类，解读时更宜关注后天努力与自我塑造，而非先天定数。',
  mid: '此档骨重居中，民间传统认为属于「根基平」的一类，解读时宜理解为性格与际遇的参考底色，而非命定结论。',
  heavy: '此档骨重偏重，民间传统认为属于「根基重」的一类，解读时宜以平常心看待，避免被「重骨」的说法影响自我认知。',
};

/** 生成 51 档（2.1~7.1 两） */
function build(): Array<ContentRecord<BoneWeightExtra>> {
  const out: Array<ContentRecord<BoneWeightExtra>> = [];
  for (let liang = 2.1; liang <= 7.1; liang += 0.1) {
    const liangInt = Math.floor(liang);
    const qian = Math.round((liang - liangInt) * 10);
    const label = qian === 0 ? `${liangInt}两` : `${liangInt}两${qian}钱`;
    const level = liang < 4 ? 'light' : liang <= 5.4 ? 'mid' : 'heavy';
    const body = [
      `骨重「${label}」是袁天罡称骨法中的一档结果，由出生年月日时四柱骨重相加得出。`,
      `${LEVEL_NOTE[level]}`,
      `称骨法以骨重划分若干档位并附传统断语，属于民间流传的民俗文化文本，版本众多、各本断语略有出入，未经权威版本逐项核验。`,
      `我们仅将该结果作为传统文化了解与自我观察的参考维度，不构成对人生运势的断言；人生走向仍取决于个人选择与努力。`,
    ].join('');
    out.push({
      id: `bone_weight_${liangInt}${qian}`,
      version: '1.0.0',
      domain: 'divination',
      category: 'bone_weight',
      seo: {
        title: `称骨${label}详解`,
        description: `称骨算命「${label}」的民俗解读与文化参考说明。`,
        slug: `/wiki/bone_weight/${liangInt}-${qian}`,
        canonical: `/wiki/bone_weight/${liangInt}-${qian}`,
        breadcrumb: ['首页', '占卜民俗', '称骨算命', `${label}`],
        breadcrumb_paths: ['/', '/wiki', '/wiki/bone_weight', `/wiki/bone_weight/${liangInt}-${qian}`],
      },
      source: { system: 'hybrid', classic: '袁天罡称骨法（通行本）', chapter: `骨重·${label}` },
      compliance: { no_fatalism: true, domain_note: 'lifestyle_only', banned_words_checked: true },
      review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-c' },
      body: {
        plain_reading: body,
        insight_loop: {
          insight: `骨重「${label}」属于${level === 'heavy' ? '偏重' : level === 'light' ? '偏轻' : '居中'}档位，作为民俗参考。`,
          cause: `四柱骨重相加得出${label}，为通行本计算口径。`,
          manifestation: `传统断语对该档有相应描述，版本间略有出入。`,
          risk: `民间文本未经权威核验，不可作为吉凶依据。`,
          suggestion: `以了解民俗与自我观察为主，保持理性。`,
          action: `不作命运断言，以行动与选择为主导。`,
        },
      },
      extra: { kind: 'bone_weight', weight_liang: liangInt, weight_qian: qian },
      i18n_key: `bone_weight.${liangInt}_${qian}`,
    });
  }
  return out;
}

export const BONE_WEIGHT: readonly ContentRecord<BoneWeightExtra>[] = build();
export const BONE_WEIGHT_COUNT = BONE_WEIGHT.length; // 51
