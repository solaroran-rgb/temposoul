/**
 * LN 雷诺曼组 · 36 张（Petit Lenormand 通行牌序）
 *
 * 字段绑定（R3 核验）：lenormandDraw.{cardId, position, spread}
 * - cardId   牌号 1-36，对应 packages/core/src/divination/algorithms/lenormand.ts 的 LENORMAND_CARDS[].id
 * - position 牌位名，取值来自 LENORMAND_SPREADS[*].positions
 * - spread   牌阵类型，取值 single / three / five / relationship / decision / nine / element / grandTableau
 *
 * 范式（R3-7 任务卡）：
 * - 3 因子：牌义核心（0.40）/ 领域倾向（0.30）/ 组合倾向（0.30）
 * - 2 组合：顺势吉（COMBO-LN{nn}-G）/ 受阻凶（COMBO-LN{nn}-X）
 * - 2 模板：每组合各一条三层白话（pro / mix / lay）
 * - schools 每流派列加总 = 1.00（A/B/C 三档轮换，见下）
 *
 * 吉凶分支划分依据（可核验，非脑补）：
 * - 顺势吉 = 牌落「结论位」（核心线索 / 走向 / 最终走向 / 后续走向 / 关键建议 / 外在助力）→ 牌义直接落实
 * - 受阻凶 = 牌落「背景位」（起因 / 过去背景 / 隐藏因素）→ 牌义尚在酝酿或被遮蔽
 * - 受阻分支极性按牌本义降一档（++ → + / + → 0 / 0 → - / - → --），表示落实度下降，不代表灾祸
 * - 其余牌位（核心 / 现状 / 当前处境 / 选择分支 / 九宫各方）按最接近的语义类归属
 *
 * schools 三档（每列加总 = 1.00）：
 * A 消息文书类 = ziping 0.38/0.30/0.32, mangpai 0.34/0.36/0.30, xinpai 0.40/0.28/0.32
 * B 人物关系类 = ziping 0.36/0.34/0.30, mangpai 0.34/0.34/0.32, xinpai 0.36/0.32/0.32
 * C 物质资源类 = ziping 0.40/0.28/0.32, mangpai 0.34/0.34/0.32, xinpai 0.38/0.30/0.32
 *
 * 纪律：只填数据，不写引擎逻辑；字段绑定只用上述三个键；触发条件不含性别 / 年龄 / 婚姻状态（D-3）；
 * 模板不含医疗建议、投资建议与绝对断言（TB-003 / TB-005）。
 *
 * 注意（待裁决）：牌名与本仓 divination/algorithms/lenormand.ts 有 5 处不一致 ——
 * 房屋(房子) / 岔路(路) / 男人(男士) / 女人(女士) / 十字(十字架)。
 * 本文件以 R3-7 任务卡牌名为准；算法层 LENORMAND_FIXED_COMBINATIONS 仍用旧名，接线前需统一。
 */
import type { TermSchema } from '../types';

export const LENORMAND_REGISTRY: Record<string, TermSchema> = {
  LN01: {
    id: 'LN01',
    name: '骑士',
    group: 'LN',
    factors: [
      { id: 'LN01-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '1'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN01-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'three'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN01-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN01-G', name: '骑士顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '1'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN01-X'] },
      { id: 'COMBO-LN01-X', name: '骑士受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '1'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN01-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN01-G', pro: '骑士落结论位，主消息抵达、事情开始移动，宜趁势推进', mix: '消息或进展正在赶来，节奏开始提速，接住就好', lay: '你等的那条消息多半快到了，这时候别压着不动', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-01-G-001' },
      { comboId: 'COMBO-LN01-X', pro: '骑士落背景位，消息尚在途中，事由未明', mix: '动静已经有了，确切消息还没落地', lay: '有些风声了，不过还没到能拍板的时候，先别急着下结论', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-01-X-001' },
    ],
  },
  LN02: {
    id: 'LN02',
    name: '三叶草',
    group: 'LN',
    factors: [
      { id: 'LN02-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '2'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN02-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'three'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN02-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN02-G', name: '三叶草顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '2'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN02-X'] },
      { id: 'COMBO-LN02-X', name: '三叶草受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '2'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN02-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN02-G', pro: '三叶草落结论位，小吉成事，宜快取不宜拖', mix: '短期机会落在结果上，动作快就接得住', lay: '有个小好运摆在面前，趁热拿下，拖一拖就没了', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-02-G-001' },
      { comboId: 'COMBO-LN02-X', pro: '三叶草落背景位，机会窗口偏窄，宜留力待时', mix: '运气是有，但火候未到，别把筹码一次用光', lay: '这点小运气还不太稳，先观望着，别把家底押上', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-02-X-001' },
    ],
  },
  LN03: {
    id: 'LN03',
    name: '船',
    group: 'LN',
    factors: [
      { id: 'LN03-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '3'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN03-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'five'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN03-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN03-G', name: '船顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '3'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN03-X'] },
      { id: 'COMBO-LN03-X', name: '船受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '3'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN03-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN03-G', pro: '船落结论位，主距离、迁移或方向转换，动中得局', mix: '方向在换，走出去比原地耗着更有戏', lay: '换个地方或换个方向，路子会比现在宽', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-03-G-001' },
      { comboId: 'COMBO-LN03-X', pro: '船落背景位，远行之意未发，多属心念先动', mix: '想走出去的念头起来了，条件还没齐', lay: '你心里惦记着换个环境，不过现在还没到真正动身的时候', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-03-X-001' },
    ],
  },
  LN04: {
    id: 'LN04',
    name: '房屋',
    group: 'LN',
    factors: [
      { id: 'LN04-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '4'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN04-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'nine'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN04-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN04-G', name: '房屋顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '4'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN04-X'] },
      { id: 'COMBO-LN04-X', name: '房屋受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '4'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN04-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN04-G', pro: '房屋落结论位，主根基安稳、居所与安全感成立', mix: '家庭与住所这块比较稳，适合把底盘坐实', lay: '家里和住的地方很踏实，趁这个稳劲儿把基础打牢', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-04-G-001' },
      { comboId: 'COMBO-LN04-X', pro: '房屋落背景位，根基仍在修整，家事宜从长计', mix: '守住老本行是主线，变动宜缓', lay: '家里的老底子还在，但正处在整理期，先别折腾', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-04-X-001' },
    ],
  },
  LN05: {
    id: 'LN05',
    name: '树',
    group: 'LN',
    factors: [
      { id: 'LN05-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '5'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN05-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'nine'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN05-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN05-G', name: '树顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '5'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN05-X'] },
      { id: 'COMBO-LN05-X', name: '树受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '5'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN05-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN05-G', pro: '树落结论位，主长期生长、根基渐厚', mix: '慢功夫开始见效，越往后越有分量', lay: '这事见效慢，但底子越扎越深，别嫌起步慢', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-05-G-001' },
      { comboId: 'COMBO-LN05-X', pro: '树落背景位，生长节奏缓慢，宜养护而非催熟', mix: '根还在扎，急着看果容易失望', lay: '现在还在地下长根呢，急不来，把日常照护做扎实就好', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-05-X-001' },
    ],
  },
  LN06: {
    id: 'LN06',
    name: '云',
    group: 'LN',
    factors: [
      { id: 'LN06-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '6'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN06-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'nine'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN06-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN06-G', name: '云顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '6'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN06-X'] },
      { id: 'COMBO-LN06-X', name: '云受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '6'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN06-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN06-G', pro: '云落结论位，主信息不明，需先辨真假', mix: '看不清的部分会摆到明面上，先别急着定论', lay: '这事会有点糊，先弄清真假再动，别听风就是雨', polarity: '-', modality: 'likely', atomicId: 'ATOM-LN-06-G-001' },
      { comboId: 'COMBO-LN06-X', pro: '云落背景位，遮蔽来自旧信息或未明动机', mix: '雾的源头在暗处，多来自没说透的事', lay: '让你迷糊的原因，多半是有人没把话说透', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-06-X-001' },
    ],
  },
  LN07: {
    id: 'LN07',
    name: '蛇',
    group: 'LN',
    factors: [
      { id: 'LN07-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '7'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN07-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN07-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN07-G', name: '蛇顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '7'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN07-X'] },
      { id: 'COMBO-LN07-X', name: '蛇受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '7'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN07-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN07-G', pro: '蛇落结论位，主迂回与隐藏动机浮现，宜先设界', mix: '绕行和人情算计会显出来，把边界划清', lay: '事情会绕个弯，有人情上的小算盘，自己先立好规矩', polarity: '-', modality: 'assert', atomicId: 'ATOM-LN-07-G-001' },
      { comboId: 'COMBO-LN07-X', pro: '蛇落背景位，暗线未明，宜防被绕与被套', mix: '有绕行的动机在酝酿，别急着交底', lay: '底下有人在打自己的小算盘，你先把底牌收住', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-07-X-001' },
    ],
  },
  LN08: {
    id: 'LN08',
    name: '棺材',
    group: 'LN',
    factors: [
      { id: 'LN08-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '8'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN08-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'five'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN08-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN08-G', name: '棺材顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '8'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN08-X'] },
      { id: 'COMBO-LN08-X', name: '棺材受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '8'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN08-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN08-G', pro: '棺材落结论位，主旧阶段收尾，宜止损转向', mix: '该结束的会结束，收干净才好腾出手', lay: '有些事该画句号了，收利索点，后面才有空间', polarity: '-', modality: 'assert', atomicId: 'ATOM-LN-08-G-001' },
      { comboId: 'COMBO-LN08-X', pro: '棺材落背景位，旧账未清，拖延则耗', mix: '早就该合上的事，还挂在那里消耗你', lay: '早该结束的事一直没结束，最费的就是这份精神', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-08-X-001' },
    ],
  },
  LN09: {
    id: 'LN09',
    name: '花束',
    group: 'LN',
    factors: [
      { id: 'LN09-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '9'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN09-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN09-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN09-G', name: '花束顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '9'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN09-X'] },
      { id: 'COMBO-LN09-X', name: '花束受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '9'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN09-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN09-G', pro: '花束落结论位，主善意、邀约与被认可落实', mix: '好感与礼物会落到实处，接得住就加分', lay: '有人递好意过来，大大方方接住就好', polarity: '++', modality: 'assert', atomicId: 'ATOM-LN-09-G-001' },
      { comboId: 'COMBO-LN09-X', pro: '花束落背景位，善意未至，多属口头铺垫', mix: '善意还在预热，别把它当成承诺', lay: '人家现在只是客气一下，先别当成真的许诺', polarity: '+', modality: 'likely', atomicId: 'ATOM-LN-09-X-001' },
    ],
  },
  LN10: {
    id: 'LN10',
    name: '镰刀',
    group: 'LN',
    factors: [
      { id: 'LN10-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '10'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN10-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'decision'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN10-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN10-G', name: '镰刀顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '10'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN10-X'] },
      { id: 'COMBO-LN10-X', name: '镰刀受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '10'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN10-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN10-G', pro: '镰刀落结论位，主决断切割，宜快刀理顺', mix: '该切就切，干净利落比拖泥带水强', lay: '该断的事断干净，快比拖强', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-10-G-001' },
      { comboId: 'COMBO-LN10-X', pro: '镰刀落背景位，切割之因在前情，宜慎重下刀', mix: '要断的根还没看清，别误伤', lay: '想切的东西，先看清是不是真该切，别一刀下去伤到自家人', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-10-X-001' },
    ],
  },
  LN11: {
    id: 'LN11',
    name: '鞭子',
    group: 'LN',
    factors: [
      { id: 'LN11-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '11'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN11-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN11-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN11-G', name: '鞭子顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '11'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN11-X'] },
      { id: 'COMBO-LN11-X', name: '鞭子受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '11'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN11-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN11-G', pro: '鞭子落结论位，主反复拉扯与摩擦显化', mix: '同一件事反复争，得从根上解决', lay: '老问题又来一遍，光争没用，得换做法', polarity: '-', modality: 'assert', atomicId: 'ATOM-LN-11-G-001' },
      { comboId: 'COMBO-LN11-X', pro: '鞭子落背景位，摩擦起于旧账，宜先停手', mix: '争执的根在以前的事，先停下再谈', lay: '吵起来多是因为翻旧账，先停一停，等气消了再说', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-11-X-001' },
    ],
  },
  LN12: {
    id: 'LN12',
    name: '鸟',
    group: 'LN',
    factors: [
      { id: 'LN12-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '12'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN12-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'three'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN12-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN12-G', name: '鸟顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '12'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN12-X'] },
      { id: 'COMBO-LN12-X', name: '鸟受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '12'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN12-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN12-G', pro: '鸟落结论位，主消息频繁、沟通加速', mix: '消息一多，情绪也容易跟着放大', lay: '这段消息会很多，别被带着情绪跑', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-12-G-001' },
      { comboId: 'COMBO-LN12-X', pro: '鸟落背景位，言语有余而落实不足，宜收口', mix: '说得比做得多，听的人容易乱', lay: '话说得多、事没定下来，先少说两句、多看两眼', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-12-X-001' },
    ],
  },
  LN13: {
    id: 'LN13',
    name: '孩子',
    group: 'LN',
    factors: [
      { id: 'LN13-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '13'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN13-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN13-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN13-G', name: '孩子顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '13'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN13-X'] },
      { id: 'COMBO-LN13-X', name: '孩子受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '13'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN13-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN13-G', pro: '孩子落结论位，主新起点成立，宜小步试水', mix: '新事刚开头，小步走比大步冲稳', lay: '新开的头，别指望一步到位，试着小步走', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-13-G-001' },
      { comboId: 'COMBO-LN13-X', pro: '孩子落背景位，事在萌芽，条件尚未成熟', mix: '想法刚起，火候不足', lay: '这事刚有个念头，还没到能办的时候', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-13-X-001' },
    ],
  },
  LN14: {
    id: 'LN14',
    name: '狐狸',
    group: 'LN',
    factors: [
      { id: 'LN14-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '14'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN14-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'decision'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN14-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN14-G', name: '狐狸顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '14'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN14-X'] },
      { id: 'COMBO-LN14-X', name: '狐狸受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '14'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN14-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN14-G', pro: '狐狸落结论位，主利益结构显形，宜算清再动', mix: '账要算明白，看清楚谁在哪一环得利', lay: '先把利害算清楚，别被人精明走了', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-14-G-001' },
      { comboId: 'COMBO-LN14-X', pro: '狐狸落背景位，人心难测，宜多留凭据', mix: '暗处有算计，留痕最要紧', lay: '有人心里有本小账，凡事留个凭据，别只信口头', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-14-X-001' },
    ],
  },
  LN15: {
    id: 'LN15',
    name: '熊',
    group: 'LN',
    factors: [
      { id: 'LN15-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '15'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN15-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'five'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN15-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN15-G', name: '熊顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '15'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN15-X'] },
      { id: 'COMBO-LN15-X', name: '熊受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '15'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN15-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN15-G', pro: '熊落结论位，主资源与话语权就位，宜借势', mix: '资源方与话语权都在场，可以坐下来谈', lay: '有资源、有分量的人会站出来，顺着势头谈更好', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-15-G-001' },
      { comboId: 'COMBO-LN15-X', pro: '熊落背景位，强势方未表态，宜先避锋', mix: '掌资源的人还没点头，别硬碰', lay: '说话有分量那位还没表态，别硬顶着来', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-15-X-001' },
    ],
  },
  LN16: {
    id: 'LN16',
    name: '星星',
    group: 'LN',
    factors: [
      { id: 'LN16-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '16'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN16-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'nine'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN16-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN16-G', name: '星星顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '16'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN16-X'] },
      { id: 'COMBO-LN16-X', name: '星星受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '16'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN16-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN16-G', pro: '星星落结论位，主愿景明晰、远程有应', mix: '方向感清楚了，远处也有人接应', lay: '你想做的这件事方向清楚了，外面还有人愿意搭手', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-16-G-001' },
      { comboId: 'COMBO-LN16-X', pro: '星星落背景位，愿景散而未聚，宜先定靶', mix: '想得多但没聚焦，先挑一个再说', lay: '脑子里想法不少，就是没定下来做哪个，先挑一个动手', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-16-X-001' },
    ],
  },
  LN17: {
    id: 'LN17',
    name: '鹳',
    group: 'LN',
    factors: [
      { id: 'LN17-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '17'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN17-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'five'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN17-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN17-G', name: '鹳顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '17'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN17-X'] },
      { id: 'COMBO-LN17-X', name: '鹳受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '17'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN17-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN17-G', pro: '鹳落结论位，主环境调整、局势改善', mix: '换环境的时机到了，改过之后更顺', lay: '换个环境对你有好处，改动之后会顺一些', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-17-G-001' },
      { comboId: 'COMBO-LN17-X', pro: '鹳落背景位，变动之意未成，宜备而后动', mix: '想改但时机没到，先把准备做齐', lay: '想动一动的心情能理解，但先把手上收拾干净再走', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-17-X-001' },
    ],
  },
  LN18: {
    id: 'LN18',
    name: '狗',
    group: 'LN',
    factors: [
      { id: 'LN18-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '18'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN18-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN18-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN18-G', name: '狗顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '18'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN18-X'] },
      { id: 'COMBO-LN18-X', name: '狗受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '18'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN18-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN18-G', pro: '狗落结论位，主可托付之人相助', mix: '靠得住的人会出现，可以开口求助', lay: '会有靠得住的朋友搭把手，别客气', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-18-G-001' },
      { comboId: 'COMBO-LN18-X', pro: '狗落背景位，相助未至，宜先自持', mix: '熟人关系需要维护，别只等别人主动', lay: '老朋友那边一时顾不上，先自己扛一下，回头再联系', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-18-X-001' },
    ],
  },
  LN19: {
    id: 'LN19',
    name: '塔',
    group: 'LN',
    factors: [
      { id: 'LN19-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '19'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN19-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'nine'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN19-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN19-G', name: '塔顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '19'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN19-X'] },
      { id: 'COMBO-LN19-X', name: '塔受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '19'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN19-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN19-G', pro: '塔落结论位，主规则与机构框架成为主轴', mix: '走流程、按规矩办反而是最快的路', lay: '这事得按流程走，找对门路比找关系管用', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-19-G-001' },
      { comboId: 'COMBO-LN19-X', pro: '塔落背景位，边界与距离感犹存', mix: '隔阂来自规则或位差，别急着拉近', lay: '和对方之间隔着规矩和距离，先别急着套近乎', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-19-X-001' },
    ],
  },
  LN20: {
    id: 'LN20',
    name: '花园',
    group: 'LN',
    factors: [
      { id: 'LN20-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '20'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN20-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'nine'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN20-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN20-G', name: '花园顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '20'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN20-X'] },
      { id: 'COMBO-LN20-X', name: '花园受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '20'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN20-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN20-G', pro: '花园落结论位，主公开场域与圈层曝光成立', mix: '事情会走到台面上，人脉能派上用场', lay: '这事会被更多人知道，朋友圈子能帮上忙', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-20-G-001' },
      { comboId: 'COMBO-LN20-X', pro: '花园落背景位，圈层声量未成，宜先蓄人', mix: '热闹还没起来，先把人聚齐', lay: '现在还没到热闹的时候，先把人找齐、把事备好', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-20-X-001' },
    ],
  },
  LN21: {
    id: 'LN21',
    name: '山',
    group: 'LN',
    factors: [
      { id: 'LN21-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '21'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN21-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'five'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN21-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN21-G', name: '山顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '21'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN21-X'] },
      { id: 'COMBO-LN21-X', name: '山受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '21'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN21-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN21-G', pro: '山落结论位，主阻碍显化，宜绕行或等待', mix: '挡在前面的东西看清了，绕比撞省力', lay: '挡路的东西看清楚了，绕开走比硬碰划算', polarity: '-', modality: 'assert', atomicId: 'ATOM-LN-21-G-001' },
      { comboId: 'COMBO-LN21-X', pro: '山落背景位，阻力已积，宜化整为零', mix: '阻力是老问题积出来的，拆开处理', lay: '这堵墙是慢慢积起来的，一块一块拆比一次推倒现实', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-21-X-001' },
    ],
  },
  LN22: {
    id: 'LN22',
    name: '岔路',
    group: 'LN',
    factors: [
      { id: 'LN22-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '22'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN22-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'decision'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN22-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN22-G', name: '岔路顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '22'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN22-X'] },
      { id: 'COMBO-LN22-X', name: '岔路受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '22'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN22-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN22-G', pro: '岔路落结论位，主抉择当前，宜取舍分明', mix: '两条路只能挑一条，先定标准再选', lay: '到分岔口了，两头都想要，最后两头都耽误', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-22-G-001' },
      { comboId: 'COMBO-LN22-X', pro: '岔路落背景位，犹疑源于取舍未决', mix: '纠结不是因为信息不够，是不想舍', lay: '拿不定主意，多半不是没想清，而是哪一边都舍不得放', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-22-X-001' },
    ],
  },
  LN23: {
    id: 'LN23',
    name: '老鼠',
    group: 'LN',
    factors: [
      { id: 'LN23-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '23'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN23-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'three'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN23-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN23-G', name: '老鼠顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '23'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN23-X'] },
      { id: 'COMBO-LN23-X', name: '老鼠受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '23'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN23-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN23-G', pro: '老鼠落结论位，主持续损耗显形，宜先止损', mix: '小口子一直在漏，先把漏点堵上', lay: '钱或精力在一点点漏，赶紧先堵住再说', polarity: '-', modality: 'assert', atomicId: 'ATOM-LN-23-G-001' },
      { comboId: 'COMBO-LN23-X', pro: '老鼠落背景位，损耗隐蔽，宜先行盘点', mix: '耗损来自看不见的地方，得查账', lay: '有些消耗你还没察觉，抽空把账目和精力盘一盘', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-23-X-001' },
    ],
  },
  LN24: {
    id: 'LN24',
    name: '心',
    group: 'LN',
    factors: [
      { id: 'LN24-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '24'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN24-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN24-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN24-G', name: '心顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '24'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN24-X'] },
      { id: 'COMBO-LN24-X', name: '心受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '24'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN24-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN24-G', pro: '心落结论位，主情感动机成立，心意可察', mix: '真实的心意摆在明面上，接得住就好', lay: '感情这块是真心的，看得见也摸得着', polarity: '++', modality: 'assert', atomicId: 'ATOM-LN-24-G-001' },
      { comboId: 'COMBO-LN24-X', pro: '心落背景位，情感未明，宜先观其行', mix: '心意还没落地，别急着往里投', lay: '对方心思还没定，先看行动再说', polarity: '+', modality: 'likely', atomicId: 'ATOM-LN-24-X-001' },
    ],
  },
  LN25: {
    id: 'LN25',
    name: '戒指',
    group: 'LN',
    factors: [
      { id: 'LN25-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '25'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN25-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN25-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN25-G', name: '戒指顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '25'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN25-X'] },
      { id: 'COMBO-LN25-X', name: '戒指受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '25'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN25-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN25-G', pro: '戒指落结论位，主承诺与契约成立', mix: '事情有望定下来，白纸黑字更稳', lay: '这事有望说定，能写下来就别只靠一句话', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-25-G-001' },
      { comboId: 'COMBO-LN25-X', pro: '戒指落背景位，承诺未闭环，条款宜细审', mix: '约定还差临门一脚，先看细条款', lay: '说定的事还差最后一步，先别高兴太早，条款看仔细', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-25-X-001' },
    ],
  },
  LN26: {
    id: 'LN26',
    name: '书',
    group: 'LN',
    factors: [
      { id: 'LN26-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '26'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN26-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'decision'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN26-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN26-G', name: '书顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '26'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN26-X'] },
      { id: 'COMBO-LN26-X', name: '书受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '26'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN26-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN26-G', pro: '书落结论位，主隐秘信息待解，宜先求知', mix: '关键信息就在手边，多问一句就清楚', lay: '答案就在你没细看的地方，多问、多看资料', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-26-G-001' },
      { comboId: 'COMBO-LN26-X', pro: '书落背景位，实情仍藏，宜留观察期', mix: '有没公开的信息，别急着表态', lay: '还有些事没摊开说，先别急着站边', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-26-X-001' },
    ],
  },
  LN27: {
    id: 'LN27',
    name: '信',
    group: 'LN',
    factors: [
      { id: 'LN27-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '27'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN27-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'three'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN27-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN27-G', name: '信顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '27'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN27-X'] },
      { id: 'COMBO-LN27-X', name: '信受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '27'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN27-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN27-G', pro: '信落结论位，主书面凭据落地', mix: '书面通知或凭据会到，记得查收', lay: '会有正式的通知或文件过来，看清楚再签', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-27-G-001' },
      { comboId: 'COMBO-LN27-X', pro: '信落背景位，文书未定，宜催不宜等', mix: '文件卡在流程里，主动问一句更快', lay: '文件流程卡住了，主动催一催比干等快', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-27-X-001' },
    ],
  },
  LN28: {
    id: 'LN28',
    name: '男人',
    group: 'LN',
    factors: [
      { id: 'LN28-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '28'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN28-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN28-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN28-G', name: '男人顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '28'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN28-X'] },
      { id: 'COMBO-LN28-X', name: '男人受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '28'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN28-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN28-G', pro: '男人落结论位，主主动方角色成为焦点', mix: '主动的那一方会明确表态', lay: '这事里主动的一方会亮明态度', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-28-G-001' },
      { comboId: 'COMBO-LN28-X', pro: '男人落背景位，主动方态度未明', mix: '该主动的一方还在观望', lay: '该表态的那位还没开口，别光等着', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-28-X-001' },
    ],
  },
  LN29: {
    id: 'LN29',
    name: '女人',
    group: 'LN',
    factors: [
      { id: 'LN29-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '29'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN29-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN29-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN29-G', name: '女人顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '29'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN29-X'] },
      { id: 'COMBO-LN29-X', name: '女人受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '29'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN29-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN29-G', pro: '女人落结论位，主接收方角色成为焦点', mix: '另一方会接住这事并给出回应', lay: '另一位会接住这事，也会给回应', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-29-G-001' },
      { comboId: 'COMBO-LN29-X', pro: '女人落背景位，回应未至', mix: '对方还没接话，宜再等等', lay: '对方暂时没回应，别急着追着问', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-29-X-001' },
    ],
  },
  LN30: {
    id: 'LN30',
    name: '百合',
    group: 'LN',
    factors: [
      { id: 'LN30-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '30'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'LN30-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'relationship'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.34, xinpai: 0.32 } },
      { id: 'LN30-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN30-G', name: '百合顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '30'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN30-X'] },
      { id: 'COMBO-LN30-X', name: '百合受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '30'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN30-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN30-G', pro: '百合落结论位，主成熟处理、体面收束', mix: '沉稳一点处理，结果更体面', lay: '这事稳着办，最体面也最省事', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-30-G-001' },
      { comboId: 'COMBO-LN30-X', pro: '百合落背景位，需以时间换平稳', mix: '急不得，越慢越稳', lay: '这事儿急没用，缓一缓反而平顺', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-30-X-001' },
    ],
  },
  LN31: {
    id: 'LN31',
    name: '太阳',
    group: 'LN',
    factors: [
      { id: 'LN31-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '31'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN31-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'element'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN31-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN31-G', name: '太阳顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '31'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN31-X'] },
      { id: 'COMBO-LN31-X', name: '太阳受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '31'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN31-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN31-G', pro: '太阳落结论位，主局势转明、推进条件增强', mix: '事情亮起来了，往前推正当时', lay: '这段顺，想推的事趁现在推', polarity: '++', modality: 'assert', atomicId: 'ATOM-LN-31-G-001' },
      { comboId: 'COMBO-LN31-X', pro: '太阳落背景位，光辉未显，宜先蓄力', mix: '光还没照到这一步，先攒劲', lay: '还没到发光的时候，先把力气攒足', polarity: '+', modality: 'likely', atomicId: 'ATOM-LN-31-X-001' },
    ],
  },
  LN32: {
    id: 'LN32',
    name: '月亮',
    group: 'LN',
    factors: [
      { id: 'LN32-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '32'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN32-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'element'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN32-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN32-G', name: '月亮顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '32'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN32-X'] },
      { id: 'COMBO-LN32-X', name: '月亮受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '32'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN32-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN32-G', pro: '月亮落结论位，主情绪与外界评价成为主线', mix: '心里的感觉和口碑会左右判断', lay: '这时候你的感觉和别人的评价，会很大程度影响判断', polarity: '0', modality: 'likely', atomicId: 'ATOM-LN-32-G-001' },
      { comboId: 'COMBO-LN32-X', pro: '月亮落背景位，情绪起伏在前，宜先安己', mix: '干扰来自心情，先稳情绪再决策', lay: '搅乱你的多是心情，先把心放平再拿主意', polarity: '-', modality: 'tend', atomicId: 'ATOM-LN-32-X-001' },
    ],
  },
  LN33: {
    id: 'LN33',
    name: '钥匙',
    group: 'LN',
    factors: [
      { id: 'LN33-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '33'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN33-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'decision'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN33-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN33-G', name: '钥匙顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '33'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN33-X'] },
      { id: 'COMBO-LN33-X', name: '钥匙受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '33'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN33-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN33-G', pro: '钥匙落结论位，主关键条件到位，问题有解', mix: '那把钥匙到手了，门能开', lay: '卡住的地方有解了，关键那一步能走通', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-33-G-001' },
      { comboId: 'COMBO-LN33-X', pro: '钥匙落背景位，解题条件未齐，宜先找缺件', mix: '差的是关键一环，先把缺口找出来', lay: '还差最关键的一样东西，先弄清缺什么', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-33-X-001' },
    ],
  },
  LN34: {
    id: 'LN34',
    name: '鱼',
    group: 'LN',
    factors: [
      { id: 'LN34-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '34'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN34-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'three'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN34-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN34-G', name: '鱼顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '34'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN34-X'] },
      { id: 'COMBO-LN34-X', name: '鱼受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '34'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN34-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN34-G', pro: '鱼落结论位，主资源与流动性充裕', mix: '钱和资源的流动会顺一些', lay: '手头的钱和资源会松动一些，流动比之前好', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-34-G-001' },
      { comboId: 'COMBO-LN34-X', pro: '鱼落背景位，流动趋紧，宜先控支出', mix: '进出的账要先算清，别铺太大', lay: '进出的账先算清楚，别把摊子铺得太大', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-34-X-001' },
    ],
  },
  LN35: {
    id: 'LN35',
    name: '锚',
    group: 'LN',
    factors: [
      { id: 'LN35-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '35'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.40, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'LN35-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'grandTableau'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'LN35-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.32, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN35-G', name: '锚顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '35'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN35-X'] },
      { id: 'COMBO-LN35-X', name: '锚受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '35'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN35-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN35-G', pro: '锚落结论位，主长期稳定成立，宜守正深耕', mix: '稳定下来了，能在一条路上深耕', lay: '位置稳住了，可以安心把一件事做深', polarity: '+', modality: 'assert', atomicId: 'ATOM-LN-35-G-001' },
      { comboId: 'COMBO-LN35-X', pro: '锚落背景位，稳定未固，宜先稳再进', mix: '根基还在晃，先别急着扩张', lay: '脚下还没完全踩稳，先站稳了再说扩张的事', polarity: '0', modality: 'tend', atomicId: 'ATOM-LN-35-X-001' },
    ],
  },
  LN36: {
    id: 'LN36',
    name: '十字',
    group: 'LN',
    factors: [
      { id: 'LN36-1', name: '牌义核心', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '36'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.40 } },
      { id: 'LN36-2', name: '领域倾向', trigger: [{ op: 'has', args: ['lenormandDraw.spread', 'decision'] }], fieldBinding: ['lenormandDraw.spread', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.28 } },
      { id: 'LN36-3', name: '组合倾向', trigger: [{ op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], fieldBinding: ['lenormandDraw.cardId', 'lenormandDraw.position'], defaultWeight: 0.30, schools: { ziping: 0.32, mangpai: 0.30, xinpai: 0.32 } },
    ],
    combos: [
      { id: 'COMBO-LN36-G', name: '十字顺势吉', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '36'] }, { op: 'or', args: ['lenormandDraw.position', '核心线索', '走向', '最终走向', '后续走向', '关键建议', '外在助力'] }], priority: 10, mutex: ['COMBO-LN36-X'] },
      { id: 'COMBO-LN36-X', name: '十字受阻凶', trigger: [{ op: 'equals', args: ['lenormandDraw.cardId', '36'] }, { op: 'or', args: ['lenormandDraw.position', '起因', '过去背景', '隐藏因素'] }], priority: 20, mutex: ['COMBO-LN36-G'] },
    ],
    templates: [
      { comboId: 'COMBO-LN36-G', pro: '十字落结论位，主责任加重，宜正面承担', mix: '该扛的责任要扛起来，扛过这一段就好', lay: '这段担子会重些，正面接下来反而轻松', polarity: '-', modality: 'assert', atomicId: 'ATOM-LN-36-G-001' },
      { comboId: 'COMBO-LN36-X', pro: '十字落背景位，负担起于旧因，宜先行减负', mix: '压力多是老担子压出来的，得卸一部分', lay: '这股压力不是新来的，是老事情压的，该卸的卸掉一些', polarity: '--', modality: 'likely', atomicId: 'ATOM-LN-36-X-001' },
    ],
  },
};
