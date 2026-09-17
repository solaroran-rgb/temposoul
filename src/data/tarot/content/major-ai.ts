import type { ContentBlock } from '@/data/knowledge/schema';
import type { ContentPatch } from '@/data/content/types';

/**
 * 大阿卡纳 AI 批量补全 16 张（2026-09-18）
 * 已有实质解读保留在 major.ts（愚者/魔术师/女祭司/女皇/教皇/恋人）。
 * 本文件为 AI 生成，待专家审计；confidence=probable，sourceRef 含「AI生成待专家审计」。
 */
export const MAJOR_AI_PATCHES: ContentPatch[] = [
  {
    id: 'the-emperor',
    summary: '皇帝：秩序与掌控，代表结构、权威与稳固的自我立场。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['秩序', '掌控', '权威', '结构', '纪律'],
      element: '火',
      astrology: '白羊座',
      uprightText: '正位时，需要建立清晰规则与边界，用纪律把想法变成可执行的框架。',
      reversedText: '逆位时，提示控制欲过强或规则僵化，需要从独断退回协商。',
      symbolism: '石制王座与盔甲象征稳固与防御，也暗示权威需要以责任为底。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '皇帝代表「把混乱变成制度」的能力：当局面需要稳定时，明确的规则比善意更有用。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒：掌控是为了让事情落地，而不是证明自己正确；学会授权才是长期的强大。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-chariot',
    summary: '战车：意志与前进，代表驾驭对立力量、朝目标冲锋。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['前进', '意志', '胜利', '驾驭', '决断'],
      element: '水',
      astrology: '巨蟹座',
      uprightText: '正位时，两股相反的力量需要被你统一方向，坚持前进即可取胜。',
      reversedText: '逆位时，提示方向打架或用力过猛，先对齐目标再加速。',
      symbolism: '相向而背的两只狮身兽象征内在冲突，驭者的关键是统一缰绳。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '战车的胜利不靠蛮力，而靠把相互拉扯的两股能量拧成同一方向。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它常出现在需要强执行的阶段：先确定要去哪里，再谈怎么跑。',
      } as ContentBlock,
    ],
  },
  {
    id: 'strength',
    summary: '力量：温柔的克制，代表以耐心与柔韧驯服内心的野性。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['柔韧', '耐心', '内在力量', '克制', '温柔'],
      element: '火',
      astrology: '狮子座',
      uprightText: '正位时，真正的力量是不被情绪牵着走，用平静与耐心化解对抗。',
      reversedText: '逆位时，提示自我怀疑或情绪失控，先稳住自己再处理外部。',
      symbolism: '女子徒手安抚狮子，象征以温柔而非暴力降服本能冲动。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '力量牌把「强」重新定义为自控：能驯服自己脾气的人，才驾驭得住局面。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒在压力下保持风度，胜负之外更重要的是不失控。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-hermit',
    summary: '隐者：内省与独行，代表退回自己、寻找内在答案。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['内省', '独行', '智慧', '沉默', '寻找'],
      element: '土',
      astrology: '处女座',
      uprightText: '正位时，适合暂时抽离人群，独自想清楚自己真正要的方向。',
      reversedText: '逆位时，提示过度孤立或逃避，需要在独处与求助之间找平衡。',
      symbolism: '手持灯笼独自站在山巅，象征独自持灯照亮自己的路。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '隐者不是孤僻，而是主动选择一段不被外界声音干扰的思考期。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它鼓励记录与沉淀：答案往往在停止向外寻找之后才浮现。',
      } as ContentBlock,
    ],
  },
  {
    id: 'wheel-of-fortune',
    summary: '命运之轮：流转与转折，代表周期变化与顺势而为。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['转机', '周期', '命运', '流转', '顺势'],
      element: '火',
      astrology: '木星',
      uprightText: '正位时，局势正朝有利方向转动，适合抓住变化的节点顺势而为。',
      reversedText: '逆位时，提示低谷或逆行，不必硬扛，等待轮子转回来。',
      symbolism: '转动的巨轮象征世事起伏，没有人永远在最高点或最低点。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '命运之轮提醒：起跌是周期而非判决，顺境别傲慢，逆境别绝望。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它出现在转折期，重点是识别轮子正往哪转，再决定动作大小。',
      } as ContentBlock,
    ],
  },
  {
    id: 'justice',
    summary: '正义：因果与平衡，代表客观判断与承担后果。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['公正', '因果', '平衡', '判断', '责任'],
      element: '风',
      astrology: '天秤座',
      uprightText: '正位时，需要以事实而非情绪下判断，结果会对应你过去的选择。',
      reversedText: '逆位时，提示不公、推卸或自欺，需直面自己该承担的部分。',
      symbolism: '天平与双刃剑象征权衡与后果，既称量也执行。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '正义牌的核心是对等：你种什么因，就收什么果，没有侥幸。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒决策前把各方摆上天平，判断后愿意为结果负责。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-hanged-man',
    summary: '倒吊人：悬置与换视角，代表主动暂停、换个角度看问题。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['暂停', '换视角', '放下', '等待', '牺牲'],
      element: '水',
      astrology: '海王星',
      uprightText: '正位时，主动停下不是浪费，换个角度会看见之前忽略的答案。',
      reversedText: '逆位时，提示无谓牺牲或僵持，需要决定是继续等还是抽身。',
      symbolism: '倒挂的人面容平静，象征用颠倒的姿态获得全新视角。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '倒吊人代表「主动卡住」：有时越用力越走不出去，退一步反而通。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒把自我悬置片刻，换个立场，局面可能完全不同。',
      } as ContentBlock,
    ],
  },
  {
    id: 'death',
    summary: '死神：结束与转化，代表旧阶段终结、为新生让路。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['结束', '转化', '告别', '新生', '蜕变'],
      element: '水',
      astrology: '天蝎座',
      uprightText: '正位时，一个旧阶段必须结束，彻底告别才能腾出空间给新事物。',
      reversedText: '逆位时，提示抗拒结束、卡在过渡里，拖延只会更耗。',
      symbolism: '骷髅骑士与落马的王象征旧秩序的退场，不是毁灭而是更新。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '死神牌少指肉体死亡，多指心理与生活的蜕皮：旧的不去新的不来。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它出现时鼓励体面告别，死死抓住过去只会阻碍转化。',
      } as ContentBlock,
    ],
  },
  {
    id: 'temperance',
    summary: '节制：调和与中庸，代表把不同元素耐心调配成平衡。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['调和', '中庸', '耐心', '平衡', '节制'],
      element: '火',
      astrology: '射手座',
      uprightText: '正位时，需要在对立之间找平衡，用耐心与分寸把事情慢慢调顺。',
      reversedText: '逆位时，提示失衡或极端，检查哪里用力过猛或过犹不及。',
      symbolism: '天使在两杯之间往返倒水，象征持续调和与恰到好处。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '节制牌反对走极端：好结果来自一点点调整、反复试错的耐心。',
      } as ContentBlock,
      { kind: 'paragraph', text: '它提醒放慢，把对立的需求融合，而不是二选一。' } as ContentBlock,
    ],
  },
  {
    id: 'the-devil',
    summary: '恶魔：束缚与执念，代表被欲望、依赖或旧模式锁住。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['执念', '束缚', '欲望', '依赖', '贪着'],
      element: '土',
      astrology: '摩羯座',
      uprightText: '正位时，看清自己正被某种欲望或坏习惯牵制，锁链其实可松可解。',
      reversedText: '逆位时，提示开始挣脱枷锁，决心切断不健康的依附。',
      symbolism: '两人被松垮的锁链系住，象征束缚多是自我加诸的。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '恶魔牌照见的是我们自愿戴上的镣铐：欲望、攀比、明知有害却戒不掉。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒锁链是松的，第一步是承认它的存在，然后松手。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-tower',
    summary: '高塔：突变与崩塌，代表虚假结构被骤变摧毁、露出真相。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['突变', '崩塌', '真相', '启示', '重建'],
      element: '火',
      astrology: '火星',
      uprightText: '正位时，建立在错误基础上的东西会骤然崩塌，摧毁即解脱。',
      reversedText: '逆位时，提示拖延着不愿面对的崩塌，勉强维持只会更痛。',
      symbolism: '被闪电击中的高塔与坠落的人，象征虚假的安稳被真理击穿。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '高塔很吓人，但它崩掉的往往是早就该塌的虚假结构。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它出现时别只盯着损失：废墟之上才有机会按真相重建。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-star',
    summary: '星星：希望与疗愈，代表风暴过后的平静、信念与指引。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['希望', '疗愈', '信念', '平静', '灵感'],
      element: '风',
      astrology: '水瓶座',
      uprightText: '正位时，经历动荡后重获内心平静，相信长期方向并温柔疗愈自己。',
      reversedText: '逆位时，提示失落信心或脱离现实，需要把期待拉回可实现处。',
      symbolism: '星空下跪地倒水的女子，象征在希望中滋养身心。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '星星牌是高塔之后的疗愈：天没塌，反而看清了真正想去的方向。',
      } as ContentBlock,
      { kind: 'paragraph', text: '它鼓励带着信念慢慢来，平静本身就是力量。' } as ContentBlock,
    ],
  },
  {
    id: 'the-moon',
    summary: '月亮：迷雾与不安，代表不确定性、潜意识与幻象。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['迷雾', '不安', '潜意识', '幻象', '直觉'],
      element: '水',
      astrology: '双鱼座',
      uprightText: '正位时，信息不完整、前路有迷雾，宜相信直觉但不急于下结论。',
      reversedText: '逆位时，迷雾散去、误解澄清，藏着的真相逐渐浮出。',
      symbolism: '月下的小径、狼与狗、螯虾，象征在半明半暗中的不安本能。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '月亮牌提醒看不清时别硬做决定：恐惧和希望都可能是幻觉。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它鼓励记录梦境与情绪，潜意识想借这种模糊向你传递信息。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-sun',
    summary: '太阳：明朗与成功，代表喜悦、清晰与充满生命力的达成。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['成功', '喜悦', '明朗', '活力', '清晰'],
      element: '火',
      astrology: '太阳',
      uprightText: '正位时，局面明朗乐观，努力被看见，适合大方地享受成果。',
      reversedText: '逆位时，提示短暂乌云或过度乐观，别得意忘形即可转好。',
      symbolism: '阳光下骑在白马上的孩子，象征纯粹的喜悦与生命力。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '太阳牌是少有的几乎全吉的牌：它允许你高兴，不用谦虚地压着。',
      } as ContentBlock,
      { kind: 'paragraph', text: '它提醒接受被认可，也把这份明朗传递给身边的人。' } as ContentBlock,
    ],
  },
  {
    id: 'judgement',
    summary: '审判：觉醒与召唤，代表回顾过往、重新评估后迎接新召命。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['觉醒', '回顾', '召唤', '重生', '释然'],
      element: '火',
      astrology: '冥王星',
      uprightText: '正位时，适合复盘人生旧账，与过去和解后回应更高一层的召唤。',
      reversedText: '逆位时，提示苛责自己或迟迟不肯放下旧伤，需宽恕方能前行。',
      symbolism: '天使吹号、众人苏醒，象征对过往的总结与重新召唤。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '审判牌是一次内在的终审：不是惩罚，而是把旧章节读完、合上。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它鼓励用更成熟的眼光复盘，然后站起来回应新的人生阶段。',
      } as ContentBlock,
    ],
  },
  {
    id: 'the-world',
    summary: '世界：圆满与完成，代表一个周期圆满收尾、整合后通向新旅程。',
    confidence: 'probable',
    sourceRef: ['AI生成待专家审计', '塔罗通行牌义（韦特体系民间流通释义）'],
    domainFields: {
      source: 'AI生成待专家审计',
      keywords: ['圆满', '完成', '整合', '成就', '循环'],
      element: '土',
      astrology: '土星',
      uprightText: '正位时，一个阶段圆满完成，你已整合所学，准备好开启下一圈。',
      reversedText: '逆位时，提示差最后一步没收尾，或迟迟不愿结束而拖延。',
      symbolism: '花环中起舞的人形，四象环绕，象征完整与圆满。',
    },
    blocks: [
      {
        kind: 'paragraph',
        text: '世界牌是愚者之旅的终点：你把一路学到的东西整合成了完整的自己。',
      } as ContentBlock,
      {
        kind: 'paragraph',
        text: '它提醒好好庆祝收尾，圆满不是终点，而是下一段旅程的起点。',
      } as ContentBlock,
    ],
  },
];
