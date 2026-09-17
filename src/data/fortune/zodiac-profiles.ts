// src/data/fortune/zodiac-profiles.ts
// B16-补交终版：stableHash 改从 C 底座 @/data/content/deterministic 导入（本地真相，返回 number）
import { stableHash } from '@/data/content/deterministic';

export type ProfileTopic = 'personality' | 'love' | 'career';

export interface ZodiacProfileTemplate {
  signId: string;
  topic: ProfileTopic;
  template: string;
  variables: Record<string, string[]>;
  confidence: 'verified' | 'probable' | 'legendary';
  ready: boolean;
}

export const ZODIAC_PROFILES: ZodiacProfileTemplate[] = [
  {
    signId: 'aries', topic: 'personality',
    template: '{name}作为{element}星座的代表，天生具有{trait}的特质。在人际交往中，{name}往往表现出{social}的一面，这源于{ruler}的深层影响。',
    variables: { trait: ['勇敢果断', '热情奔放', '直言不讳'], social: ['主动积极', '乐于引领', '坦诚相待'] },
    confidence: 'verified', ready: true
  },
  {
    signId: 'aries', topic: 'love',
    template: '在感情世界中，{name}倾向于{style}的表达方式。{element}的属性使得{name}在亲密关系中更注重{focus}，这与{ruler}的能量密切相关。',
    variables: { style: ['热烈直接', '充满激情', '坦率真诚'], focus: ['真实的情感连接', '共同的冒险体验', '彼此的独立空间'] },
    confidence: 'probable', ready: true
  },
  {
    signId: 'aries', topic: 'career',
    template: '事业方面，{name}适合{env}的工作环境。{modality}的特质赋予{name}{strength}的能力，在{field}领域往往能发挥出色。',
    variables: { env: ['充满挑战', '节奏快速', '需要决断力'], strength: ['开拓新局面', '带领团队冲锋', '快速决策'], field: ['创业', '竞技体育', '销售管理'] },
    confidence: 'probable', ready: true
  },
  {
    signId: 'taurus', topic: 'personality',
    template: '{name}作为{element}星座，展现出{trait}的核心特质。{ruler}的守护使{name}对{sense}有着敏锐的感知，性格中带有{quality}的底色。',
    variables: { trait: ['沉稳踏实', '耐心坚韧', '温和坚定'], sense: ['美与和谐', '物质安全', '自然韵律'], quality: ['可靠', '包容', '执着'] },
    confidence: 'verified', ready: true
  },
  {
    signId: 'taurus', topic: 'love',
    template: '{name}在感情中追求{goal}，不会轻易开始一段关系，但一旦投入便{depth}。{element}属性让{name}更看重{aspect}。',
    variables: { goal: ['长久稳定的伴侣关系', '深层次的情感联结'], depth: ['全心全意', '忠诚不渝', '用心经营'], aspect: ['实际的关怀', '感官的契合', '共同的生活品质'] },
    confidence: 'probable', ready: true
  },
  {
    signId: 'taurus', topic: 'career',
    template: '在职场中，{name}擅长{skill}，{modality}特质使其在需要{requirement}的岗位上表现突出。{ruler}的影响让{name}在{field}方面有天赋。',
    variables: { skill: ['持久专注', '精细管理', '稳健规划'], requirement: ['耐心与毅力', '稳定性与可靠性'], field: ['金融理财', '艺术设计', '农业食品'] },
    confidence: 'probable', ready: true
  },
  {
    signId: 'gemini', topic: 'personality',
    template: '{name}受{ruler}守护，思维{mind}，善于{ability}。{element}属性赋予{name}{social}的社交能力，但也可能显得{weakness}。',
    variables: { mind: ['敏捷多变', '好奇开放', '灵活跳跃'], ability: ['沟通协调', '信息整合', '多角度思考'], social: ['八面玲珑', '幽默风趣', '适应力强'], weakness: ['注意力分散', '不够深入', '犹豫不决'] },
    confidence: 'verified', ready: true
  },
  {
    signId: 'gemini', topic: 'love',
    template: '在恋爱中，{name}渴望{need}，重视精神层面的{aspect}。{element}特质使{name}在关系中追求{freedom}，不喜欢{dislike}。',
    variables: { need: ['智力上的共鸣', '丰富的交流互动'], aspect: ['思想碰撞', '语言沟通', '新鲜感'], freedom: ['适度的个人空间', '不被束缚的感觉'], dislike: ['过度控制', '单调乏味', '情感绑架'] },
    confidence: 'probable', ready: true
  },
  {
    signId: 'gemini', topic: 'career',
    template: '{name}的职业优势在于{advantage}，适合{env}的工作氛围。{modality}特质让{name}能够{adapt}，在{field}领域如鱼得水。',
    variables: { advantage: ['出色的表达能力', '快速学习能力', '多线程处理'], env: ['多元化', '信息密集', '人际互动频繁'], adapt: ['灵活应对变化', '快速切换角色', '跨界整合资源'], field: ['媒体传播', '教育培训', '市场营销'] },
    confidence: 'probable', ready: true
  }
];

/**
 * 确定性语料渲染引擎
 * 同一 signId + topic + variableKey 永远选中同一个词（stableHash 来自 C 底座，返回 number）
 */
export function renderProfileTemplate(
  profile: ZodiacProfileTemplate,
  signName: string,
  elementLabel: string,
  ruler: string,
  modalityLabel: string
): string {
  const seed = stableHash(`${profile.signId}-${profile.topic}`);
  let result = profile.template
    .replace(/\{name\}/g, signName)
    .replace(/\{element\}/g, elementLabel)
    .replace(/\{ruler\}/g, ruler)
    .replace(/\{modality\}/g, modalityLabel);

  for (const [key, values] of Object.entries(profile.variables)) {
    const idx = stableHash(`${seed}-${key}`) % values.length;
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), values[idx]);
  }
  return result;
}
