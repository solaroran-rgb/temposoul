export interface TarotCardMeaning {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  upright: string;
  reversed: string;
  ready: boolean;
  confidence: 'verified' | 'probable' | 'legendary';
  disclaimer: string;
}

const MAJOR = [
  '愚者','魔术师','女祭司','女皇','皇帝','教皇','恋人','战车','力量','隐者','命运之轮','正义','倒吊人','死神','节制','恶魔','塔','星星','月亮','太阳','审判','世界'
];

const SUITS = ['权杖','圣杯','宝剑','星币'];
const RANKS = ['Ace','2','3','4','5','6','7','8','9','10','Page','Knight','Queen','King'];

/**
 * 78 张真实牌义（韦特体系通行民间释义）
 * 语气：提示/倾向/反思，不做医疗/投资/宿命断言
 * 键：major-N（N 0-21）/ minor-<花色>-<序号>（序号 0-13）
 */
const MEANINGS: Record<string, { upright: string; reversed: string }> = {
  // ===== 大阿卡纳 =====
  'major-0': {
    upright: '新阶段的开启，鼓励以开放、未被经验束缚的心态迈出第一步，接受计划之外的变化。',
    reversed: '准备不足：不是不能出发，而是需要先看清脚下的路，避免把鲁莽误当作勇气。',
  },
  'major-1': {
    upright: '你需要的条件大多已具备，关键在于聚焦与执行，把已有资源串成具体行动。',
    reversed: '精力分散或夸大其词，能量未落到具体事情上，需要收敛注意力。',
  },
  'major-2': {
    upright: '答案已在内心，只是尚未到说出口的时机，适合先向内看、留出安静时间。',
    reversed: '忽视内在声音，或被表面的信息牵着走，需要重新听自己的直觉。',
  },
  'major-3': {
    upright: '付出正在积累成果，适合以长期心态培育人与事，关注生活中的滋养来源。',
    reversed: '过度付出或照料失衡，需要先照顾好自己，再谈照顾他人。',
  },
  'major-4': {
    upright: '需要建立清晰规则与边界，用纪律把想法变成可执行的框架。',
    reversed: '控制欲过强或规则僵化，需要从独断退回协商，学会授权。',
  },
  'major-5': {
    upright: '适合寻求经验者的建议，或回到被验证过的方法上，体系化地学习。',
    reversed: '规则已不合时宜，需要审视是否只是惯性在维持，而非真正有用。',
  },
  'major-6': {
    upright: '需要按真实的价值取向做选择，而非只权衡得失；把选择说清楚。',
    reversed: '价值不一致或回避选择，导致关系与事情悬而未决。',
  },
  'major-7': {
    upright: '把相互拉扯的两股能量统一方向，坚持前进即可取胜。',
    reversed: '方向打架或用力过猛，先对齐目标再加速。',
  },
  'major-8': {
    upright: '真正的力量是不被情绪牵着走，用平静与耐心化解对抗。',
    reversed: '自我怀疑或情绪失控，先稳住自己再处理外部。',
  },
  'major-9': {
    upright: '适合暂时抽离人群，独自想清楚自己真正要的方向。',
    reversed: '过度孤立或逃避，需要在独处与求助之间找平衡。',
  },
  'major-10': {
    upright: '局势正朝有利方向转动，适合抓住变化的节点顺势而为。',
    reversed: '低谷或逆行，不必硬扛，等待轮子转回来。',
  },
  'major-11': {
    upright: '需要以事实而非情绪下判断，结果会对应你过去的选择。',
    reversed: '不公、推卸或自欺，需直面自己该承担的部分。',
  },
  'major-12': {
    upright: '主动停下不是浪费，换个角度会看见之前忽略的答案。',
    reversed: '无谓牺牲或僵持，需要决定是继续等还是抽身。',
  },
  'major-13': {
    upright: '一个旧阶段必须结束，彻底告别才能腾出空间给新事物。',
    reversed: '抗拒结束、卡在过渡里，拖延只会更耗。',
  },
  'major-14': {
    upright: '需要在对立之间找平衡，用耐心与分寸把事情慢慢调顺。',
    reversed: '失衡或极端，检查哪里用力过猛或过犹不及。',
  },
  'major-15': {
    upright: '看清自己正被某种欲望或旧习惯牵制，锁链其实可松可解。',
    reversed: '开始挣脱枷锁，决心切断不健康的依附。',
  },
  'major-16': {
    upright: '建立在错误基础上的东西会骤然变化，摧毁即解脱。',
    reversed: '拖延着不愿面对的崩塌，勉强维持只会更痛。',
  },
  'major-17': {
    upright: '经历动荡后重获内心平静，相信长期方向并温柔疗愈自己。',
    reversed: '失落信心或脱离现实，需要把期待拉回可实现处。',
  },
  'major-18': {
    upright: '信息不完整、前路有迷雾，宜相信直觉但不急于下结论。',
    reversed: '迷雾散去、误解澄清，藏着的真相逐渐浮出。',
  },
  'major-19': {
    upright: '局面明朗乐观，努力被看见，适合大方地享受成果。',
    reversed: '短暂乌云或过度乐观，别得意忘形即可转好。',
  },
  'major-20': {
    upright: '适合复盘过往，与过去和解后回应更高一层的召唤。',
    reversed: '苛责自己或迟迟不肯放下旧伤，需宽恕方能前行。',
  },
  'major-21': {
    upright: '一个阶段圆满完成，你已整合所学，准备好开启下一圈。',
    reversed: '差最后一步没收尾，或迟迟不愿结束而拖延。',
  },

  // ===== 小阿卡纳 · 权杖（火：行动/事业/热情） =====
  'minor-权杖-0': {
    upright: '一个新想法带着足够的热量出现，适合尽快做小规模尝试。',
    reversed: '热情未找到出口，或启动后缺乏持续供给。',
  },
  'minor-权杖-1': {
    upright: '你已站稳脚跟，适合站在高处权衡全局、选定下一个方向。',
    reversed: '计划脱离现实或害怕走出舒适区。',
  },
  'minor-权杖-2': {
    upright: '前期布局开始起效，适合等待回报并远眺下一程。',
    reversed: '计划受阻或方向过早，需调整节奏。',
  },
  'minor-权杖-3': {
    upright: '一段努力换来安稳与庆祝，适合与亲友共享成果。',
    reversed: '安稳中暗藏变动，或庆祝被琐事冲淡。',
  },
  'minor-权杖-4': {
    upright: '竞争与意见冲撞在所难免，在混战中找到自己的节奏。',
    reversed: '冲突缓和或你在刻意回避必要的争执。',
  },
  'minor-权杖-5': {
    upright: '努力被公开认可，适合带着荣誉继续往前走。',
    reversed: '虚名或胜利被打折，警惕骄傲。',
  },
  'minor-权杖-6': {
    upright: '你占住高位，需要扛住压力捍卫已有位置。',
    reversed: '防守吃力或战线过长，考虑战略性后撤。',
  },
  'minor-权杖-7': {
    upright: '事情突然加速，消息与机会很快到来，顺势快行。',
    reversed: '计划延误或信息混乱，减速核对。',
  },
  'minor-权杖-8': {
    upright: '你已付出很多，再坚持一下就能守住底线。',
    reversed: '精疲力竭或戒备过度，需要休整。',
  },
  'minor-权杖-9': {
    upright: '你承担过多，快到目的地了但快被压垮。',
    reversed: '该卸下重担或学会委托，别什么都自己扛。',
  },
  'minor-权杖-10': {
    upright: '一个新鲜灵感或小消息出现，保持好奇去试。',
    reversed: '三分钟热度或消息不靠谱。',
  },
  'minor-权杖-11': {
    upright: '行动力爆棚，适合一鼓作气推进重要事项。',
    reversed: '鲁莽冲动或三分钟热度，需踩刹车。',
  },
  'minor-权杖-12': {
    upright: '发挥自信与魅力，用热情把人和事凝聚起来。',
    reversed: '过度强势或情绪起伏，注意体恤他人。',
  },
  'minor-权杖-13': {
    upright: '适合确立方向、果断拍板，带动大家朝目标前进。',
    reversed: '专制或好大喜功，需倾听执行层。',
  },

  // ===== 小阿卡纳 · 圣杯（水：情感/关系/直觉） =====
  'minor-圣杯-0': {
    upright: '情感通道打开，适合表达真实感受与修复关系。',
    reversed: '情感被压抑或表达错位，需要先澄清自己的需要。',
  },
  'minor-圣杯-1': {
    upright: '一段关系或合作双向奔赴，彼此需要、互相成就。',
    reversed: '关系失衡或沟通错位，需要重新对齐。',
  },
  'minor-圣杯-2': {
    upright: '适合与同频的人聚会庆祝，互相支持。',
    reversed: '圈子复杂或小团体排挤，保持距离。',
  },
  'minor-圣杯-3': {
    upright: '你对现状倦怠，新机会就在手边却视而不见。',
    reversed: '开始醒悟，重新对身边的机会心动。',
  },
  'minor-圣杯-4': {
    upright: '沉浸于失去与遗憾，需要承认悲伤但别困在里面。',
    reversed: '开始走出失落，看见仍拥有的东西。',
  },
  'minor-圣杯-5': {
    upright: '旧日回忆或旧人带来温暖，适合怀旧也提醒别停留。',
    reversed: '过度沉溺过去，需要迈步向前。',
  },
  'minor-圣杯-6': {
    upright: '诱人的选择一堆，需要分辨哪个真实、哪个只是幻想。',
    reversed: '幻象散去，终于看清真正想要什么。',
  },
  'minor-圣杯-7': {
    upright: '现有快乐已不够，适合主动转身去追寻更深的意义。',
    reversed: '犹豫要不要离开，或逃避现实的出走。',
  },
  'minor-圣杯-8': {
    upright: '你渴望的东西基本到手，好好享受这份满足。',
    reversed: '表面满足内心仍空，或过度自我放纵。',
  },
  'minor-圣杯-9': {
    upright: '情感关系与家人关系和谐，达成理想状态。',
    reversed: '表面圆满下有裂痕，需修补沟通。',
  },
  'minor-圣杯-10': {
    upright: '一段新感受或直觉浮现，保持温柔与敏感去接住。',
    reversed: '情绪泛滥或过度敏感，需要落地。',
  },
  'minor-圣杯-11': {
    upright: '跟着心之所向前进，以真诚打动人心。',
    reversed: '沉溺幻想或情绪化，行动跟不上热情。',
  },
  'minor-圣杯-12': {
    upright: '发挥共情与直觉，温柔地照顾自己与他人。',
    reversed: '情绪过度依附或被他人情绪淹没。',
  },
  'minor-圣杯-13': {
    upright: '以成熟稳定的方式处理情感，既共情又有分寸。',
    reversed: '情绪压抑或操控他人感情，需释放。',
  },

  // ===== 小阿卡纳 · 宝剑（风：思维/冲突/真相） =====
  'minor-宝剑-0': {
    upright: '思路突然清明，适合做出需要理性的决定。',
    reversed: '判断被情绪或信息偏差干扰，需要更多证据。',
  },
  'minor-宝剑-1': {
    upright: '你卡在两难里，表面平静实则回避真正的选择。',
    reversed: '僵局打破、终于看清，决定浮出水面。',
  },
  'minor-宝剑-2': {
    upright: '某个真相或分离带来刺痛，允许自己难过再愈合。',
    reversed: '伤痛开始愈合，或反复纠结同一件事。',
  },
  'minor-宝剑-3': {
    upright: '是时候休息了，停止内耗、安静恢复精力。',
    reversed: '过度倦怠或该动却仍在拖延。',
  },
  'minor-宝剑-4': {
    upright: '争执中即使占理，也可能付出过高代价。',
    reversed: '冲突缓和，或开始反思是否值得争。',
  },
  'minor-宝剑-5': {
    upright: '你正在离开困境，缓慢但稳当地走向平静。',
    reversed: '未解决的情绪仍跟着你，走也走不安心。',
  },
  'minor-宝剑-6': {
    upright: '需要取巧或保密才能推进，但别越过底线。',
    reversed: '隐瞒被揭穿，或终于选择坦诚。',
  },
  'minor-宝剑-7': {
    upright: '你觉得被环境限制，其实很多束缚来自内心。',
    reversed: '开始松绑，发现没有想象中那么难动。',
  },
  'minor-宝剑-8': {
    upright: '焦虑被放大到失眠，先区分哪些是真问题。',
    reversed: '最坏的结果没有发生，恐惧开始退散。',
  },
  'minor-宝剑-9': {
    upright: '一段磨难触底，虽然此刻很惨但即将见底反弹。',
    reversed: '最痛的部分过去，开始慢慢复原。',
  },
  'minor-宝剑-10': {
    upright: '适合发问、收集信息，保持敏锐不轻易下结论。',
    reversed: '爱挑刺或消息八卦未核实。',
  },
  'minor-宝剑-11': {
    upright: '适合快速决断、直指核心，别绕弯子。',
    reversed: '说话太冲或草率决定，需三思。',
  },
  'minor-宝剑-12': {
    upright: '用清晰的判断做决定，理性中保留一点慈悲。',
    reversed: '过于尖刻或猜忌，理性变冷漠。',
  },
  'minor-宝剑-13': {
    upright: '需要依据事实与原则下判断，立场清晰。',
    reversed: '冷酷专断或用理性压制情感。',
  },

  // ===== 小阿卡纳 · 星币（土：金钱/实务/身体） =====
  'minor-星币-0': {
    upright: '出现可落地的机会，适合从财务状况与实际条件入手。',
    reversed: '计划停留在构想，缺乏可执行的下一步。',
  },
  'minor-星币-1': {
    upright: '同时处理多项事务，灵活周旋保持收支平衡。',
    reversed: '多线作战失衡，需要砍掉一些事。',
  },
  'minor-星币-2': {
    upright: '团队协作、各自专精，把方案逐步落地。',
    reversed: '配合不畅或敷衍，标准被降低。',
  },
  'minor-星币-3': {
    upright: '财务求稳、守护成果，但别因此过度保守。',
    reversed: '过度吝啬或财务松动，需重新平衡。',
  },
  'minor-星币-4': {
    upright: '正经历拮据或低潮，别硬撑，开口求助。',
    reversed: '困境缓解或开始重新站起来。',
  },
  'minor-星币-5': {
    upright: '适合慷慨助人或接受帮助，关系互惠。',
    reversed: '给予附带条件，或助长了依赖。',
  },
  'minor-星币-6': {
    upright: '前期投入已有雏形，耐心等它成熟并复盘。',
    reversed: '方向不对或付出未见回报，该调整。',
  },
  'minor-星币-7': {
    upright: '专注打磨技能，下笨功夫必有回报。',
    reversed: '心不在焉或练错方向，需校准。',
  },
  'minor-星币-8': {
    upright: '你已靠努力建立了安稳生活，好好享受。',
    reversed: '表面富足内在空虚，或过度依赖物质。',
  },
  'minor-星币-9': {
    upright: '事业或家庭根基稳固，可着眼长期传承。',
    reversed: '家庭/财务根基有裂痕，或墨守成规。',
  },
  'minor-星币-10': {
    upright: '适合从实际技能学起，一步一步把小计划落地。',
    reversed: '眼高手低或三分钟热度，需踏实。',
  },
  'minor-星币-11': {
    upright: '按既定计划稳步推进，可靠地把事做完。',
    reversed: '过于固执或拖延，缺乏变通。',
  },
  'minor-星币-12': {
    upright: '把生活与财务打理得舒适又有质感。',
    reversed: '过度务实或忽略精神，变得斤斤计较。',
  },
  'minor-星币-13': {
    upright: '具备商业头脑，长期经营换来稳固成果。',
    reversed: '贪婪或工作狂，把人当成工具。',
  },
};

const DISCLAIMER = '塔罗内容仅供文化娱乐与自我反思参考，不构成决策依据。';

export const TAROT_CARD_MEANINGS: TarotCardMeaning[] = [
  ...MAJOR.map((name, i) => {
    const m = MEANINGS[`major-${i}`]!;
    return {
      id: `major-${i}`,
      name,
      arcana: 'major' as const,
      upright: m.upright,
      reversed: m.reversed,
      ready: true,
      confidence: 'legendary' as const,
      disclaimer: DISCLAIMER,
    };
  }),
  ...SUITS.flatMap((suit) => RANKS.map((rank, i) => {
    const key = `minor-${suit}-${i}`;
    const m = MEANINGS[key]!;
    return {
      id: key,
      name: `${suit}${rank}`,
      arcana: 'minor' as const,
      upright: m.upright,
      reversed: m.reversed,
      ready: true,
      confidence: 'legendary' as const,
      disclaimer: DISCLAIMER,
    };
  })),
];
