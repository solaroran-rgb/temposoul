/**
 * T13 · 专家数据存储
 *
 * 提供专家在线状态管理，用于撮合服务读取。
 */

import type { Advisor } from './types';

const SEED: Advisor[] = [
  {
    id: 'adv-bazi-01',
    name: '张真人',
    specialty: 'bazi',
    rating: 4.9,
    isOnline: true,
    intro: '八字命理专家，从业 15 年，擅长四柱推演。',
    price: 200,
    ready: true,
  },
  {
    id: 'adv-zw-01',
    name: '李命师',
    specialty: 'ziwei',
    rating: 4.8,
    isOnline: true,
    intro: '紫微斗数传承人，精通三方四正与命盘分析。',
    price: 180,
    ready: true,
  },
  {
    id: 'adv-tarot-01',
    name: 'Catherine',
    specialty: 'tarot',
    rating: 4.7,
    isOnline: false,
    intro: '塔罗牌占卜师，擅长情感与决策咨询。',
    price: 120,
    ready: false,
  },
  {
    id: 'adv-astro-01',
    name: '赵星象',
    specialty: 'astrology',
    rating: 4.6,
    isOnline: true,
    intro: '西方占星师，提供本命盘与流年运势解读。',
    price: 150,
    ready: true,
  },
  {
    id: 'adv-other-01',
    name: '王道长',
    specialty: 'other',
    rating: 4.5,
    isOnline: false,
    intro: '风水堪舆师，专注于住宅与阴宅布局。',
    price: 300,
    ready: false,
  },
];

export class AdvisorStore {
  private advisors = new Map<string, Advisor>();

  constructor(seed: Advisor[]) {
    for (const a of seed) this.advisors.set(a.id, a);
  }

  getAll(): Advisor[] {
    return Array.from(this.advisors.values());
  }

  getById(id: string): Advisor | undefined {
    return this.advisors.get(id);
  }

  getOnline(): Advisor[] {
    return this.getAll().filter((a) => a.isOnline);
  }

  getBySpecialty(specialty: string): Advisor[] {
    return this.getAll().filter((a) => a.specialty === specialty && a.isOnline);
  }

  /** 切换在线状态（用于测试与手动管理） */
  setOnline(id: string, online: boolean): void {
    const a = this.advisors.get(id);
    if (a) a.isOnline = online;
  }

  /** 切换 ready 状态（用于模拟专家回复准备） */
  setReady(id: string, ready: boolean): void {
    const a = this.advisors.get(id);
    if (a) a.ready = ready;
  }
}

export const advisorStore = new AdvisorStore(SEED);
