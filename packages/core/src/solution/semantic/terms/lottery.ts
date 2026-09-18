/**
 * LQ 灵签组 · 3 条
 * 上签 / 中签 / 下签
 *
 * 字段绑定（R3 核验）：
 * - lotteryDraw.{lotId, tier, title, poem, interpretation[]}
 *
 * 说明：灵签按 tier（等级）分上/中/下三等，poem 为签诗，interpretation[] 为逐句白话解读。
 */
import type { TermSchema } from '../types';

export const LOTTERY_REGISTRY: Record<string, TermSchema> = {
  SQ: {
    id: 'SQ',
    name: '上签',
    group: 'LQ',
    factors: [
      { id: 'SQ-1', name: '签等判定', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '上'] }], fieldBinding: ['lotteryDraw.tier', 'lotteryDraw.lotId'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SQ-2', name: '签诗吉象', trigger: [{ op: 'has', args: ['lotteryDraw.poem', '吉'] }], fieldBinding: ['lotteryDraw.poem', 'lotteryDraw.title'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SQ-3', name: '逐句吉释', trigger: [{ op: 'has', args: ['lotteryDraw.interpretation', '吉'] }], fieldBinding: ['lotteryDraw.interpretation', 'lotteryDraw.tier'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SQ-CHEN', name: '上签呈祥', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '上'] }, { op: 'has', args: ['lotteryDraw.poem', '吉'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SQ-JI', name: '上签见吉', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '上'] }, { op: 'has', args: ['lotteryDraw.interpretation', '吉'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SQ-CHEN', pro: '上签呈祥，签等居上且签诗呈吉象，主事吉、求事宜成', mix: '你抽到的是上签，签诗也呈吉象，所求之事偏吉，宜积极促成', lay: '你抽到一支"好签"，签文也吉利，想做的事大概率能成，可以放心去努力', polarity: '++', modality: 'assert', atomicId: 'ATOM-LQ-SQ-001' },
      { comboId: 'COMBO-SQ-JI', pro: '上签见吉，签等居上且逐句呈吉释，主吉象贯穿', mix: '你抽到的是上签，逐句白话也都偏吉，吉利贯穿始终', lay: '你抽到的"好签"从头到尾都是好话，整体运势偏顺', polarity: '+', modality: 'likely', atomicId: 'ATOM-LQ-SQ-002' },
    ],
    dimTags: ['DIM_13'],
  },
  ZQ: {
    id: 'ZQ',
    name: '中签',
    group: 'LQ',
    factors: [
      { id: 'ZQ-1', name: '签等判定', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '中'] }], fieldBinding: ['lotteryDraw.tier', 'lotteryDraw.lotId'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'ZQ-2', name: '签诗平象', trigger: [{ op: 'has', args: ['lotteryDraw.poem', '平'] }], fieldBinding: ['lotteryDraw.poem', 'lotteryDraw.title'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'ZQ-3', name: '逐句平释', trigger: [{ op: 'has', args: ['lotteryDraw.interpretation', '平'] }], fieldBinding: ['lotteryDraw.interpretation', 'lotteryDraw.tier'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-ZQ-CHEN', name: '中签呈平', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '中'] }, { op: 'has', args: ['lotteryDraw.poem', '平'] }], priority: 10, mutex: [] },
      { id: 'COMBO-ZQ-JI', name: '中签见平', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '中'] }, { op: 'has', args: ['lotteryDraw.interpretation', '平'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-ZQ-CHEN', pro: '中签呈平，签等居中且签诗呈平象，主事平、宜守常', mix: '你抽到的是中签，签诗也呈平象，所求之事偏平，宜守常不宜冒进', lay: '你抽到一支"平平的签"，事情不算差但也不出彩，按部就班稳着走就行', polarity: '0', modality: 'assert', atomicId: 'ATOM-LQ-ZQ-001' },
      { comboId: 'COMBO-ZQ-JI', pro: '中签见平，签等居中且逐句呈平释，主平象贯穿', mix: '你抽到的是中签，逐句白话也都偏平，平稳贯穿始终', lay: '你抽到的"平平的签"从头到尾都中性，整体不偏不倚', polarity: '0', modality: 'likely', atomicId: 'ATOM-LQ-ZQ-002' },
    ],
    dimTags: ['DIM_13'],
  },
  XQ: {
    id: 'XQ',
    name: '下签',
    group: 'LQ',
    factors: [
      { id: 'XQ-1', name: '签等判定', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '下'] }], fieldBinding: ['lotteryDraw.tier', 'lotteryDraw.lotId'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'XQ-2', name: '签诗凶象', trigger: [{ op: 'has', args: ['lotteryDraw.poem', '凶'] }], fieldBinding: ['lotteryDraw.poem', 'lotteryDraw.title'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'XQ-3', name: '逐句凶释', trigger: [{ op: 'has', args: ['lotteryDraw.interpretation', '凶'] }], fieldBinding: ['lotteryDraw.interpretation', 'lotteryDraw.tier'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-XQ-CHEN', name: '下签呈凶', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '下'] }, { op: 'has', args: ['lotteryDraw.poem', '凶'] }], priority: 10, mutex: [] },
      { id: 'COMBO-XQ-JI', name: '下签见凶', trigger: [{ op: 'has', args: ['lotteryDraw.tier', '下'] }, { op: 'has', args: ['lotteryDraw.interpretation', '凶'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-XQ-CHEN', pro: '下签呈凶，签等居下且签诗呈凶象，主事阻、宜缓守', mix: '你抽到的是下签，签诗也呈凶象，所求之事多阻，宜缓不宜冒进', lay: '你抽到一支"差签"，事情容易不顺，建议缓一缓、守一守，别硬冲', polarity: '-', modality: 'assert', atomicId: 'ATOM-LQ-XQ-001' },
      { comboId: 'COMBO-XQ-JI', pro: '下签见凶，签等居下且逐句呈凶释，主凶象贯穿', mix: '你抽到的是下签，逐句白话也都偏凶，凶象贯穿始终', lay: '你抽到的"差签"从头到尾都不太好，整体阻力偏大，宜静守', polarity: '--', modality: 'likely', atomicId: 'ATOM-LQ-XQ-002' },
    ],
    dimTags: ['DIM_13'],
  },
};
