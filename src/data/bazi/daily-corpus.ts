// A11-2 · src/data/bazi/daily-corpus.ts · 三主题语料
export type DailyTheme = 'focus' | 'advice' | 'reminder';

export interface DailyCorpusGroup {
  main: string[];
  sub: string[];
  seasonal: string[];
}

export interface DailyCorpus {
  theme: DailyTheme;
  salt: string;
  groups: DailyCorpusGroup[];
  source: string;
  confidence: 'legendary';
  ready: boolean;
}

export const DAILY_CORPUS: Record<DailyTheme, DailyCorpus> = {
  focus: {
    theme: 'focus',
    salt: 'f1',
    groups: [
      {
        main: ['宜集中精力处理单一线索', '适合梳理近期积压事项'],
        sub: ['专注一件小事胜过铺开多件', '宜静心观察，不急于表态'],
        seasonal: ['季节交替宜缓进', '时令变化宜保守'],
      },
      {
        main: ['可将注意力放在熟悉领域', '宜与熟人沟通推进协作'],
        sub: ['适合复盘而非拓新', '宜简化选择'],
        seasonal: ['顺应季节节奏', '注意作息规律'],
      },
      {
        main: ['宜安排需要耐心的细活', '适合处理流程性事务'],
        sub: ['可从容推进，不慌不忙', '宜整理环境以助思路'],
        seasonal: ['换季宜稳不宜急', '留意气候变化'],
      },
      {
        main: ['宜把复杂问题拆小处理', '适合专注学习或研究'],
        sub: ['宜独自完成深度工作', '可将大目标切分为阶段'],
        seasonal: ['按季调节安排', '避开极端时段'],
      },
      {
        main: ['宜保持稳定节奏，不求快', '适合维护已有秩序'],
        sub: ['宜观察他人的步调', '宜减少外部干扰源'],
        seasonal: ['顺时而行', '留出缓冲时间'],
      },
    ],
    source: "本平台原创语料（示例；B' 域全量供给前占位）",
    confidence: 'legendary',
    ready: false,
  },
  advice: {
    theme: 'advice',
    salt: 'a2',
    groups: [
      {
        main: ['遇分歧宜先听后说', '可主动询问对方需求'],
        sub: ['宜用具体事实代替情绪表达', '适合把想法写下来再讨论'],
        seasonal: ['季节之交宜多沟通', '气候多变宜留余地'],
      },
      {
        main: ['宜与协作者明确分工', '可先做小范围验证再推广'],
        sub: ['宜用清单减少遗漏', '适合先处理确定性事项'],
        seasonal: ['顺季节安排节奏', '关注身体信号'],
      },
      {
        main: ['宜觉察情绪再行动', '可把困扰说给信任的人'],
        sub: ['宜先照顾自己再照顾他人', '适合用文字整理思路'],
        seasonal: ['换季时情绪易浮动', '给情绪留出口'],
      },
      {
        main: ['宜少承诺多完成', '可拒绝超出能力范围的事'],
        sub: ['宜用一句肯定替代多句解释', '适合以行动回应质疑'],
        seasonal: ['顺时保持边界', '不必勉强自己'],
      },
      {
        main: ['宜多看长期收益而非短期', '可先确认目标再投入'],
        sub: ['宜对未知保持一点耐心', '适合逐步加码而非一次到位'],
        seasonal: ['按季播种按季收获', '耐心是长期资产'],
      },
    ],
    source: "本平台原创语料（示例；B' 域全量供给前占位）",
    confidence: 'legendary',
    ready: false,
  },
  reminder: {
    theme: 'reminder',
    salt: 'r3',
    groups: [
      {
        main: ['规律饮食与睡眠有助于状态稳定', '适度活动身体，避免久坐'],
        sub: ['多喝水，注意眼疲劳', '天气变化注意增减衣物'],
        seasonal: ['换季注意保暖', '昼夜温差大留意'],
      },
      {
        main: ['整理环境即整理心情', '与人交流不必强求共鸣'],
        sub: ['情绪起伏属正常，不必苛责自己', '保持一项小习惯即可'],
        seasonal: ['换季作息宜调', '保持规律起居'],
      },
      {
        main: ['关注身边人的小善意', '允许自己什么都不做一会儿'],
        sub: ['一次专注一件事即可', '记录一件今日的小收获'],
        seasonal: ['节气转换宜静心', '给自己留白'],
      },
      {
        main: ['减少无效信息摄入', '把手机放远一些'],
        sub: ['闭眼深呼吸三次', '打开窗户换换空气'],
        seasonal: ['顺时调息', '自然节律助放松'],
      },
      {
        main: ['睡前远离屏幕片刻', '把明天的第一件事写在纸上'],
        sub: ['给自己准备一杯热饮', '听一段安静的音乐'],
        seasonal: ['按季调养作息', '早睡是最好的修复'],
      },
    ],
    source: "本平台原创语料（示例；B' 域全量供给前占位）",
    confidence: 'legendary',
    ready: false,
  },
};

export function pickFromGroup(group: DailyCorpusGroup, seedInt: number, salt2: string): string {
  const pools: string[][] = [group.main, group.sub, group.seasonal];
  const a = Math.abs(seedInt) % pools.length;
  const b = (Math.abs(seedInt) + salt2.charCodeAt(0)) % (pools[a]?.length ?? 1);
  return pools[a]?.[b] ?? '—';
}

/** A11-2 补：整篇语料确定性取句（DailyPage 依赖；group 由 seed 轮选） */
export function pickSentence(corpus: DailyCorpus, seedInt: number): string {
  const groups = corpus.groups;
  if (!groups || groups.length === 0) return '—';
  const g = groups[Math.abs(seedInt) % groups.length];
  return pickFromGroup(g, seedInt, corpus.salt);
}
