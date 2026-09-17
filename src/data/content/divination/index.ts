/**
 * C 域（占卜民俗）聚合出口 + 单一事实源校验：384 = 称骨51 + 塔罗78 + 解梦100 + 易经64 + 81数理81 + 爱情10
 */
export { BONE_WEIGHT, BONE_WEIGHT_COUNT } from './bone-weight';
export { TAROT, TAROT_COUNT } from './tarot';
export { DREAM_DICT, DREAM_DICT_COUNT } from './dream-dict';
export { ICHING, ICHING_COUNT } from './iching';
export { NUMBER_DIVINATION, NUMBER_DIVINATION_COUNT } from './number-divination';
export { LOVE_DIVINATION, LOVE_DIVINATION_COUNT } from './love-divination';

export const C_DOMAIN_COUNT = 51 + 78 + 100 + 64 + 81 + 10; // 384

export const C_COMPLIANCE_LEVELS = {
  bone_weight: 'caution',
  tarot: 'info',
  dream_dict: 'caution',
  iching: 'info',
  number_divination: 'caution',
  love_divination: 'warning',
} as const;
