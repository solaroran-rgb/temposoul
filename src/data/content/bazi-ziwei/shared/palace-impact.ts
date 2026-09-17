/**
 * 12 宫影响共享常量（A 域 shared）
 * 来源：专家 A R3 v3.0（lunz 2.md §2.2）+ v4.0 修正
 */
export const PALACE_NAMES = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '交友', '官禄', '田宅', '福德', '父母',
] as const;

export const PALACE_PINYIN = [
  'ming', 'xiongdi', 'fuqi', 'zinv', 'caibo', 'jie',
  'qianyi', 'jiaoyou', 'guanlu', 'tianzhai', 'fude', 'fumu',
] as const;

export interface PalaceImpact {
  palace: (typeof PALACE_NAMES)[number];
  keyword: string;
  focus: string;
  secondary: string;
}

/** 12 宫影响说明（供 palace-star 详情与列表渲染共用） */
export const PALACE_IMPACT: readonly PalaceImpact[] = [
  { palace: '命宫', keyword: '自我', focus: '性格底色、人生基调、外在形象', secondary: '与主星共同决定格局层次' },
  { palace: '兄弟', keyword: '手足', focus: '兄弟姐妹缘分、平辈协作关系', secondary: '也映射早期同侪环境' },
  { palace: '夫妻', keyword: '姻缘', focus: '配偶特质、婚姻相处模式、感情观', secondary: '与配偶宫互参更准' },
  { palace: '子女', keyword: '子女', focus: '子女缘、生育状况、晚辈际遇', secondary: '亦含桃花、合伙与创作表达' },
  { palace: '财帛', keyword: '财源', focus: '理财方式、求财路径、现金流风格', secondary: '需结合命宫强弱判断财格' },
  { palace: '疾厄', keyword: '健康', focus: '体质强弱、易感疾病部位、压力出口', secondary: '反映抗压与恢复能力' },
  { palace: '迁移', keyword: '外出', focus: '外出际遇、环境适应、社会舞台', secondary: '大运流年吉凶常以迁移应验' },
  { palace: '交友', keyword: '人脉', focus: '朋友助力、下属部属、合作网络', secondary: '也看贵人与小人的分布' },
  { palace: '官禄', keyword: '事业', focus: '事业方向、职场成就、社会地位', secondary: '与命宫共同定位人生主轴' },
  { palace: '田宅', keyword: '家宅', focus: '不动产运、居家环境、家族根基', secondary: '亦映射内心安全感来源' },
  { palace: '福德', keyword: '福分', focus: '精神享受、福气深浅、晚年境遇', secondary: '反映内在情绪与业力底色' },
  { palace: '父母', keyword: '长辈', focus: '父母缘分、祖上荫庇、文书学业', secondary: '也看上司关系与官方助力' },
] as const;
