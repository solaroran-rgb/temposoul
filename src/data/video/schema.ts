// src/data/video/schema.ts
export interface VideoCategory {
  readonly key: string;
  readonly label: string;
}

export interface VideoItem {
  readonly videoId: string;
  readonly title: string;
  readonly category: string;
  readonly durationSec: number;
  readonly coverUrl: string;
  readonly playUrl: string;
  readonly ready: boolean;
}

export interface VideoListResponse {
  readonly items: readonly VideoItem[];
  readonly categories: readonly VideoCategory[];
}
