// src/data/onomastics/number-meanings.ts
export interface NumberMeaning {
  number: number;
  title: string;
  positive: string[];
  challenge: string[];
  career: string;
  relationship: string;
  disclaimer: string;
}

export const NUMBER_MEANINGS: NumberMeaning[] = [
  {
    number: 1,
    title: '领导者',
    positive: ['独立', '开创', '自信'],
    challenge: ['固执', '自我中心'],
    career: '开创性、领导型工作',
    relationship: '重视个人空间与主导权',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 2,
    title: '协调者',
    positive: ['合作', '敏感', '平衡'],
    challenge: ['犹豫', '依赖'],
    career: '协作、辅助型工作',
    relationship: '重视和谐与陪伴',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 3,
    title: '表达者',
    positive: ['创意', '乐观', '沟通'],
    challenge: ['分散', '肤浅'],
    career: '创意、表达类工作',
    relationship: '重视交流与乐趣',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 4,
    title: '实干者',
    positive: ['踏实', '有序', '可靠'],
    challenge: ['僵化', '固执'],
    career: '需要耐心与条理的工作',
    relationship: '重视稳定与承诺',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 5,
    title: '自由者',
    positive: ['冒险', '适应', '好奇'],
    challenge: ['不安定', '冲动'],
    career: '变化多、自由度高的工作',
    relationship: '重视自由与新鲜感',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 6,
    title: '关怀者',
    positive: ['责任', '温暖', '和谐'],
    challenge: ['过度付出', '控制'],
    career: '服务、教育类工作',
    relationship: '重视家庭与责任',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 7,
    title: '思考者',
    positive: ['分析', '智慧', '内省'],
    challenge: ['疏离', '怀疑'],
    career: '研究、分析类工作',
    relationship: '重视精神共鸣',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 8,
    title: '成就者',
    positive: ['效率', '组织'],
    challenge: ['功利', '工作狂'],
    career: '管理、商业类工作',
    relationship: '重视成就与地位',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 9,
    title: '博爱者',
    positive: ['包容', '理想', '奉献'],
    challenge: ['情绪化', '脱离现实'],
    career: '公益、艺术、国际化工作',
    relationship: '重视精神层面的连接',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 11,
    title: '灵感者',
    positive: ['直觉', '启示', '理想'],
    challenge: ['紧张', '过度敏感'],
    career: '创意、咨询工作',
    relationship: '重视精神深度连接',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 22,
    title: '大师建筑师',
    positive: ['宏图', '务实', '领导力'],
    challenge: ['压力', '完美主义'],
    career: '大型项目组织与落地',
    relationship: '重视共同愿景',
    disclaimer: '数字学为民俗参考',
  },
  {
    number: 33,
    title: '无私服务者',
    positive: ['慈悲', '教导', '榜样'],
    challenge: ['牺牲过度', '负担重'],
    career: '教育、疗愈、公益类工作',
    relationship: '重视无条件关爱',
    disclaimer: '数字学为民俗参考',
  },
];
