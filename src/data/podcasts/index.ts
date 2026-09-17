//  (完整, 已审计)
// ============================================================
export type PodcastCategory = 'divination' | 'nameology' | 'tarot' | 'classics' | 'community';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  category: PodcastCategory;
  audioUrl: string;
  durationSeconds: number;
  publishedAt: string; // ISO date, 用于倒序
  episode: number;
  ready: boolean;
  disclaimer?: string;
}

export const PODCAST_CATEGORIES: ReadonlyArray<{ readonly value: PodcastCategory | 'all'; readonly label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'divination', label: '占卜' },
  { value: 'nameology', label: '姓名学' },
  { value: 'tarot', label: '塔罗' },
  { value: 'classics', label: '典籍' },
  { value: 'community', label: '社区' },
] as const;

export const PODCAST_CATEGORY_LABELS: Record<PodcastCategory, string> = {
  divination: '占卜',
  nameology: '姓名学',
  tarot: '塔罗',
  classics: '典籍',
  community: '社区',
};

export const podcasts: PodcastEpisode[] = [
  { id: 'ep-001', title: '姓名学入门：你的姓氏从哪来', description: '从姓氏源流讲到名字用字习惯，聊聊姓名学作为文化知识而非命运论断的观察方式。', category: 'nameology', audioUrl: '/media/podcasts/ep-001.mp3', durationSeconds: 1860, publishedAt: '2026-09-10', episode: 1, ready: true, disclaimer: '本节目仅供文化学习，不构成命理建议。' },
  { id: 'ep-002', title: '塔罗大阿卡纳的愚人之旅', description: '从 0 号愚人到 21 号世界，拆解大阿卡纳的象征结构。', category: 'tarot', audioUrl: '/media/podcasts/ep-002.mp3', durationSeconds: 1542, publishedAt: '2026-09-08', episode: 2, ready: true, disclaimer: '塔罗作为象征工具与娱乐参考，不用于预测事实。' },
  { id: 'ep-003', title: '紫微斗数与历史名人的命盘故事', description: '以历史人物为例介绍紫微斗数宫位与星曜语言，区分史料与演绎。', category: 'divination', audioUrl: '/media/podcasts/ep-003.mp3', durationSeconds: 2208, publishedAt: '2026-09-05', episode: 3, ready: true, disclaimer: '历史命盘推演属文化演绎，不构成人物评价。' },
  { id: 'ep-004', title: '国学典籍导读：周易卦序的节奏', description: '从乾坤到未济，看周易卦序的起承转合。', category: 'classics', audioUrl: '/media/podcasts/ep-004.mp3', durationSeconds: 1985, publishedAt: '2026-09-02', episode: 4, ready: true, disclaimer: '典籍导读以学术普及为目标，不提供占断。' },
  { id: 'ep-005', title: '社区共创：从姓名考据到词条词源', description: '邀请社区编辑聊聊姓名知识库的共建流程与审核经验。', category: 'community', audioUrl: '/media/podcasts/ep-005.mp3', durationSeconds: 1764, publishedAt: '2026-08-30', episode: 5, ready: true, disclaimer: '社区案例已匿名化处理。' },
  { id: 'ep-006', title: '每日一占：如何理解测字里的字象', description: '拆解字象的文化逻辑，说明测字作为文字游戏的规则。', category: 'divination', audioUrl: '/media/podcasts/ep-006.mp3', durationSeconds: 1432, publishedAt: '2026-08-28', episode: 6, ready: true, disclaimer: '测字为文字文化娱乐，不用于现实决策。' },
];
