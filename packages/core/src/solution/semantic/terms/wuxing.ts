/**
 * WX 五行组 · 5 条
 * 金 / 木 / 水 / 火 / 土（各含 过旺 / 偏弱 / 缺失 三态）
 *
 * 字段绑定（R3 核验）：
 * - wuxingStrength.{missing, present, dominantByRule, ruleBasis}
 */
import type { TermSchema } from '../types';

export const WUXING_REGISTRY: Record<string, TermSchema> = {
  J: {
    id: 'J',
    name: '金',
    group: 'WX',
    factors: [
      { id: 'J-1', name: '金过旺', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '金'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'wuxingStrength.ruleBasis'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'J-2', name: '金偏弱', trigger: [{ op: 'contains', args: ['wuxingStrength.present', '金'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.30, xinpai: 0.30 } },
      { id: 'J-3', name: '金缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '金'] }], fieldBinding: ['wuxingStrength.missing'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
    ],
    combos: [
      { id: 'COMBO-J-WANG', name: '金旺肃杀', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '金'] }], priority: 10, mutex: ['COMBO-J-QUE'] },
      { id: 'COMBO-J-QUE', name: '金缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '金'] }], priority: 20, mutex: ['COMBO-J-WANG'] },
    ],
    templates: [
      { comboId: 'COMBO-J-WANG', pro: '金旺肃杀，决断力强而刚，易伤木', mix: '你决断力很强，但偏刚硬，容易与柔和之事相冲', lay: '你做事果断干脆，但有时太较真，容易跟人起冲突', polarity: '-', modality: 'assert', atomicId: 'ATOM-J-WANG-001' },
      { comboId: 'COMBO-J-QUE', pro: '金缺，肃杀不足，决断与执行力偏弱', mix: '你在果断决断与执行上偏弱，遇事易犹豫', lay: '你做决定时容易拿不定主意，执行力可以再强一点', polarity: '-', modality: 'tend', atomicId: 'ATOM-J-QUE-001' },
    ],
    dimTags: ['DIM_04'],
  },
  M: {
    id: 'M',
    name: '木',
    group: 'WX',
    factors: [
      { id: 'M-1', name: '木过旺', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '木'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'wuxingStrength.ruleBasis'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'M-2', name: '木偏弱', trigger: [{ op: 'contains', args: ['wuxingStrength.present', '木'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.30, xinpai: 0.30 } },
      { id: 'M-3', name: '木缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '木'] }], fieldBinding: ['wuxingStrength.missing'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
    ],
    combos: [
      { id: 'COMBO-M-WANG', name: '木旺争发', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '木'] }], priority: 10, mutex: ['COMBO-M-QUE'] },
      { id: 'COMBO-M-QUE', name: '木缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '木'] }], priority: 20, mutex: ['COMBO-M-WANG'] },
    ],
    templates: [
      { comboId: 'COMBO-M-WANG', pro: '木旺争发，向上欲强而偏争，克土明显', mix: '你上进心强，但竞争欲偏强，容易在资源与立场上跟人争', lay: '你很有上进心，但太要强，容易跟人争高下', polarity: '-', modality: 'assert', atomicId: 'ATOM-M-WANG-001' },
      { comboId: 'COMBO-M-QUE', pro: '木缺，生发不足，向上动力偏弱', mix: '你在向上生长、主动开拓上偏弱，起步易迟', lay: '你做事起步偏慢，主动争取的劲可以再大一点', polarity: '-', modality: 'tend', atomicId: 'ATOM-M-QUE-001' },
    ],
    dimTags: ['DIM_04'],
  },
  S: {
    id: 'S',
    name: '水',
    group: 'WX',
    factors: [
      { id: 'S-1', name: '水过旺', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '水'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'wuxingStrength.ruleBasis'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'S-2', name: '水偏弱', trigger: [{ op: 'contains', args: ['wuxingStrength.present', '水'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.30, xinpai: 0.30 } },
      { id: 'S-3', name: '水缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '水'] }], fieldBinding: ['wuxingStrength.missing'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
    ],
    combos: [
      { id: 'COMBO-S-WANG', name: '水旺泛滥', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '水'] }], priority: 10, mutex: ['COMBO-S-QUE'] },
      { id: 'COMBO-S-QUE', name: '水缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '水'] }], priority: 20, mutex: ['COMBO-S-WANG'] },
    ],
    templates: [
      { comboId: 'COMBO-S-WANG', pro: '水旺泛滥，流动过盛而散，克火明显', mix: '你思维很活，但容易发散，精力与方向偏散乱', lay: '你脑子转得快，但容易东想西想，收不住', polarity: '-', modality: 'assert', atomicId: 'ATOM-S-WANG-001' },
      { comboId: 'COMBO-S-QUE', pro: '水缺，流动不足，智识与变通偏弱', mix: '你在智识变通与流动性上偏弱，思路易僵', lay: '你思路偏保守，变通和灵活性可以再强一点', polarity: '-', modality: 'tend', atomicId: 'ATOM-S-QUE-001' },
    ],
    dimTags: ['DIM_04'],
  },
  H: {
    id: 'H',
    name: '火',
    group: 'WX',
    factors: [
      { id: 'H-1', name: '火过旺', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '火'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'wuxingStrength.ruleBasis'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'H-2', name: '火偏弱', trigger: [{ op: 'contains', args: ['wuxingStrength.present', '火'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.30, xinpai: 0.30 } },
      { id: 'H-3', name: '火缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '火'] }], fieldBinding: ['wuxingStrength.missing'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
    ],
    combos: [
      { id: 'COMBO-H-WANG', name: '火旺炎上', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '火'] }], priority: 10, mutex: ['COMBO-H-QUE'] },
      { id: 'COMBO-H-QUE', name: '火缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '火'] }], priority: 20, mutex: ['COMBO-H-WANG'] },
    ],
    templates: [
      { comboId: 'COMBO-H-WANG', pro: '火旺炎上，热情过盛而耗，克金明显', mix: '你热情很高，但容易过耗，精力与情绪起伏大', lay: '你性子很热情，但有时三分钟热度，容易透支', polarity: '-', modality: 'assert', atomicId: 'ATOM-H-WANG-001' },
      { comboId: 'COMBO-H-QUE', pro: '火缺，炎上不足，热情与表达偏弱', mix: '你在热情表达与感染力上偏弱，气场偏内敛', lay: '你性子偏安静，热情和表达可以再多释放一点', polarity: '-', modality: 'tend', atomicId: 'ATOM-H-QUE-001' },
    ],
    dimTags: ['DIM_04'],
  },
  T: {
    id: 'T',
    name: '土',
    group: 'WX',
    factors: [
      { id: 'T-1', name: '土过旺', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '土'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'wuxingStrength.ruleBasis'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.32, xinpai: 0.35 } },
      { id: 'T-2', name: '土偏弱', trigger: [{ op: 'contains', args: ['wuxingStrength.present', '土'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.30, xinpai: 0.30 } },
      { id: 'T-3', name: '土缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '土'] }], fieldBinding: ['wuxingStrength.missing'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
    ],
    combos: [
      { id: 'COMBO-T-WANG', name: '土旺敦厚', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', '土'] }], priority: 10, mutex: ['COMBO-T-QUE'] },
      { id: 'COMBO-T-QUE', name: '土缺失', trigger: [{ op: 'has', args: ['wuxingStrength.missing', '土'] }], priority: 20, mutex: ['COMBO-T-WANG'] },
    ],
    templates: [
      { comboId: 'COMBO-T-WANG', pro: '土旺敦厚，承载过厚而滞，克水明显', mix: '你稳重踏实，但偏厚重，容易在变通与流动上受困', lay: '你很稳很踏实，但有时太固执，不容易变通', polarity: '0', modality: 'assert', atomicId: 'ATOM-T-WANG-001' },
      { comboId: 'COMBO-T-QUE', pro: '土缺，承载不足，稳定与收纳偏弱', mix: '你在稳定收纳与抗压上偏弱，根基感偏虚', lay: '你底子偏薄，抗压和稳定这块可以再补一补', polarity: '-', modality: 'tend', atomicId: 'ATOM-T-QUE-001' },
    ],
    dimTags: ['DIM_04'],
  },
};
