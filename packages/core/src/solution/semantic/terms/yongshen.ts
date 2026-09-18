/**
 * YS 用神组 · 4 条
 * 用神 / 喜神 / 忌神 / 仇神
 *
 * 字段绑定（R3 核验）：
 * - analysis.usefulGod.{favorable, unfavorable, useful, avoid}
 */
import type { TermSchema } from '../types';

export const YONGSHEN_REGISTRY: Record<string, TermSchema> = {
  YS: {
    id: 'YS',
    name: '用神',
    group: 'YS',
    factors: [
      { id: 'YS-1', name: '格局所需', trigger: [{ op: 'has', args: ['analysis.usefulGod.useful', '干'] }], fieldBinding: ['analysis.usefulGod.useful'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'YS-2', name: '平衡取用', trigger: [{ op: 'has', args: ['analysis.usefulGod.useful', '干'] }], fieldBinding: ['analysis.usefulGod.useful', 'wuxingStrength.dominantByRule'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'YS-3', name: '通关之用', trigger: [{ op: 'has', args: ['analysis.usefulGod.useful', '干'] }], fieldBinding: ['analysis.usefulGod.useful', 'pillarRelations.fuxin'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-YS-DE', name: '用神得力', trigger: [{ op: 'has', args: ['analysis.usefulGod.useful', '干'] }, { op: 'contains', args: ['wuxingStrength.present', '干'] }], priority: 10, mutex: [] },
      { id: 'COMBO-YS-QUE', name: '用神落空', trigger: [{ op: 'has', args: ['analysis.usefulGod.useful', '干'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-YS-DE', pro: '用神得力，格局所取之用在局中得实，行运有依', mix: '你命局中最关键的助力在局中有实，行运时较有依靠', lay: '你命中最重要的那把"钥匙"是实在的，关键时刻能用上', polarity: '++', modality: 'assert', atomicId: 'ATOM-YS-DE-001' },
      { comboId: 'COMBO-YS-QUE', pro: '用神落空，格局所取之用在局中虚浮，行运难依', mix: '你命中关键的助力偏虚，行运时较难真正依靠', lay: '你命中那把"钥匙"偏虚，真到关键时刻容易掉链子', polarity: '-', modality: 'tend', atomicId: 'ATOM-YS-QUE-001' },
    ],
    dimTags: ['DIM_06'],
  },
  XS: {
    id: 'XS',
    name: '喜神',
    group: 'YS',
    factors: [
      { id: 'XS-1', name: '助用之喜', trigger: [{ op: 'has', args: ['analysis.usefulGod.favorable', '干'] }], fieldBinding: ['analysis.usefulGod.favorable'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'XS-2', name: '生扶之用', trigger: [{ op: 'has', args: ['analysis.usefulGod.favorable', '干'] }], fieldBinding: ['analysis.usefulGod.favorable', 'analysis.usefulGod.useful'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'XS-3', name: '流年喜见', trigger: [{ op: 'in_luck', args: ['liunian', '喜'] }], fieldBinding: ['liunian', 'analysis.usefulGod.favorable'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-XS-JIAN', name: '喜神相见', trigger: [{ op: 'has', args: ['analysis.usefulGod.favorable', '干'] }, { op: 'in_luck', args: ['liunian', '喜'] }], priority: 10, mutex: [] },
      { id: 'COMBO-XS-SHOU', name: '喜神受克', trigger: [{ op: 'has', args: ['analysis.usefulGod.favorable', '干'] }, { op: 'has', args: ['analysis.usefulGod.unfavorable', '干'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-XS-JIAN', pro: '喜神相见，助用之喜在流年得见，运势添助力', mix: '你喜神所在之运较易得见，运势添了助力，较为顺遂', lay: '你走运的时候比较顺，能赶上机会', polarity: '+', modality: 'likely', atomicId: 'ATOM-XS-JIAN-001' },
      { comboId: 'COMBO-XS-SHOU', pro: '喜神受克，助用之喜被忌神所克，助力打折', mix: '你的助力易受克制，运势上较难真正兑现', lay: '你本该得到的助力容易被消耗掉，得劲时不太实在', polarity: '-', modality: 'tend', atomicId: 'ATOM-XS-SHOU-001' },
    ],
    dimTags: ['DIM_06'],
  },
  JS: {
    id: 'JS',
    name: '忌神',
    group: 'YS',
    factors: [
      { id: 'JS-1', name: '破格之忌', trigger: [{ op: 'has', args: ['analysis.usefulGod.unfavorable', '干'] }], fieldBinding: ['analysis.usefulGod.unfavorable'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'JS-2', name: '克用之忌', trigger: [{ op: 'has', args: ['analysis.usefulGod.unfavorable', '干'] }], fieldBinding: ['analysis.usefulGod.unfavorable', 'analysis.usefulGod.useful'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'JS-3', name: '流年忌见', trigger: [{ op: 'in_luck', args: ['liunian', '忌'] }], fieldBinding: ['liunian', 'analysis.usefulGod.unfavorable'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-JS-JIAN', name: '忌神相见', trigger: [{ op: 'has', args: ['analysis.usefulGod.unfavorable', '干'] }, { op: 'in_luck', args: ['liunian', '忌'] }], priority: 10, mutex: [] },
      { id: 'COMBO-JS-ZHI', name: '忌神受制', trigger: [{ op: 'has', args: ['analysis.usefulGod.unfavorable', '干'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-JS-JIAN', pro: '忌神相见，破格之忌在流年得见，运势多阻', mix: '你忌神所在之运较易得见，运势上阻碍偏多', lay: '你走霉运的时候容易撞上麻烦，阻力偏大', polarity: '-', modality: 'likely', atomicId: 'ATOM-JS-JIAN-001' },
      { comboId: 'COMBO-JS-ZHI', pro: '忌神受制，破格之忌被制化，阻力有缓冲', mix: '你的忌神易被制化，阻力有缓冲，不至于失控', lay: '你虽容易撞霉运，但有人帮你挡着，不至于太糟', polarity: '0', modality: 'tend', atomicId: 'ATOM-JS-ZHI-001' },
    ],
    dimTags: ['DIM_06'],
  },
  CS: {
    id: 'CS',
    name: '仇神',
    group: 'YS',
    factors: [
      { id: 'CS-1', name: '仇用之仇', trigger: [{ op: 'has', args: ['analysis.usefulGod.avoid', '干'] }], fieldBinding: ['analysis.usefulGod.avoid'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'CS-2', name: '敌忌之仇', trigger: [{ op: 'has', args: ['analysis.usefulGod.avoid', '干'] }], fieldBinding: ['analysis.usefulGod.avoid', 'analysis.usefulGod.unfavorable'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'CS-3', name: '流年仇见', trigger: [{ op: 'in_luck', args: ['liunian', '仇'] }], fieldBinding: ['liunian', 'analysis.usefulGod.avoid'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-CS-JIAN', name: '仇神相见', trigger: [{ op: 'has', args: ['analysis.usefulGod.avoid', '干'] }, { op: 'in_luck', args: ['liunian', '仇'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CS-XIE', name: '仇神挟忌', trigger: [{ op: 'has', args: ['analysis.usefulGod.avoid', '干'] }, { op: 'has', args: ['analysis.usefulGod.unfavorable', '干'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CS-JIAN', pro: '仇神相见，仇用之神在流年得见，助力反被耗', mix: '你仇神所在之运较易得见，本该的助力反被消耗', lay: '你有时遇到的"帮凶"反而把你拉下水，助力落空', polarity: '-', modality: 'tend', atomicId: 'ATOM-CS-JIAN-001' },
      { comboId: 'COMBO-CS-XIE', pro: '仇神挟忌，仇神挟制忌神，助力与阻力同伤', mix: '你的仇神与忌神相互牵连，助力与阻力一同受损', lay: '你的麻烦容易连环，一个坑连着另一个坑', polarity: '--', modality: 'tend', atomicId: 'ATOM-CS-XIE-001' },
    ],
    dimTags: ['DIM_06'],
  },
};
