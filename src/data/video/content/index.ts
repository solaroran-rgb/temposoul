// src/data/video/content/index.ts
import type { VideoListResponse } from '@/data/video/schema';

export const VIDEO_PLACEHOLDER: VideoListResponse = {
  categories: [
    { key: 'brand', label: '品牌片' },
    { key: 'tutorial', label: '玩法讲解' },
  ],
  items: [
    { videoId: 'ts-video-001', title: '命律品牌片：时空与节律', category: 'brand', durationSec: 0, coverUrl: '', playUrl: '', ready: false },
    { videoId: 'ts-video-002', title: '首页星空观测台导览', category: 'tutorial', durationSec: 0, coverUrl: '', playUrl: '', ready: false },
    { videoId: 'ts-video-003', title: '十二宫文化短片预告', category: 'brand', durationSec: 0, coverUrl: '', playUrl: '', ready: false },
  ],
};
