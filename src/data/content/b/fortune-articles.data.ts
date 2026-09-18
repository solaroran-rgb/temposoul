/**
 * B-5 运势新闻（节气文章）：6 篇全量（smooth/moderate/cautious）
 * 来源：专家 B R3 回收稿 §B-5
 * 路由：/insights[/:article_id]
 */
import type { BDomainRecord } from './types';
import { createArticleRecord } from './_runtime';

const articlesRaw = [
  {
    article_id: 'art_spring_2026',
    title: '春分节气：顺应生发之气的精力管理指南',
    vibe_index: 'smooth' as const,
    publish_date: '2026-03-20T08:00:00Z',
    sourceRef: '专家B R3回收稿 §B-5',
    content_blocks: [
      {
        type: 'text' as const,
        content:
          '春分时节昼夜平分，自然界阳气生发。本文从节气物候角度，提供春季作息调整与情绪舒展的建议。',
      },
    ],
    action_list: { do: ['早晨散步 15 分钟', '整理办公桌'], dont: ['熬夜消耗', '生闷气'] },
  },
  {
    article_id: 'art_mercury_q3',
    title: '水星逆行期：信息沟通的复盘与校准指南',
    vibe_index: 'cautious' as const,
    publish_date: '2026-09-15T08:00:00Z',
    sourceRef: '专家B R3回收稿 §B-5',
    content_blocks: [
      { type: 'text' as const, content: '水逆期间信息传递易出现延迟，建议放缓重大决策节奏。' },
    ],
    action_list: { do: ['备份数据', '二次确认'], dont: ['冲动签合同', '情绪化发信'] },
  },
  {
    article_id: 'art_summer_solstice',
    title: '夏至：阳极阴生，如何管理你的情绪峰值',
    vibe_index: 'moderate' as const,
    publish_date: '2026-06-21T08:00:00Z',
    sourceRef: '专家B R3回收稿 §B-5',
    content_blocks: [
      { type: 'text' as const, content: '夏至情绪与精力达到顶峰，需注意物极必反的心理调适。' },
    ],
    action_list: { do: ['增加午休', '冥想'], dont: ['剧烈运动', '冲动承诺'] },
  },
  {
    article_id: 'art_eclipse_2026',
    title: '日食月食季：清理与重启的心理契机',
    vibe_index: 'cautious' as const,
    publish_date: '2026-08-10T08:00:00Z',
    sourceRef: '专家B R3回收稿 §B-5',
    content_blocks: [
      { type: 'text' as const, content: '食相带来突发变动，是清理旧有模式的契机。' },
    ],
    action_list: { do: ['记录情绪', '断舍离'], dont: ['挑起冲突', '开新项目'] },
  },
  {
    article_id: 'art_autumn_equinox',
    title: '秋分：收敛锋芒，建立内在的秩序感',
    vibe_index: 'smooth' as const,
    publish_date: '2026-09-22T08:00:00Z',
    sourceRef: '专家B R3回收稿 §B-5',
    content_blocks: [
      { type: 'text' as const, content: '秋分后阴气渐长，心理上需要从外放转向内在整合。' },
    ],
    action_list: { do: ['阶段复盘', '温热饮食'], dont: ['无效社交', '盲目投资'] },
  },
  {
    article_id: 'art_winter_solstice',
    title: '冬至：在至暗时刻，守护内心的微光',
    vibe_index: 'moderate' as const,
    publish_date: '2026-12-21T08:00:00Z',
    sourceRef: '专家B R3回收稿 §B-5',
    content_blocks: [
      { type: 'text' as const, content: '冬至接纳生命的低谷期，是孕育新生的必经之路。' },
    ],
    action_list: { do: ['充足睡眠', '家人陪伴'], dont: ['高强度社交', '深夜做决定'] },
  },
];

export const fortuneArticles: BDomainRecord[] = articlesRaw.map((a) =>
  createArticleRecord(
    a.article_id,
    {
      title: a.title,
      listPath: '/insights',
      detailPath: `/insights/${a.article_id}`,
      summary: a.title,
      tags: ['运势', '节气'],
    },
    a,
  ),
);
