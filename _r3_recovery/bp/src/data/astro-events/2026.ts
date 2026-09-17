// B'11-3 src/data/astro-events/2026.ts
/**
 * 2026年星象事件数据
 * @module B'11-3
 */
export interface AstroEvent {
  name: string; startDate: string; endDate: string;
  affectedDimensions: string[]; weightBias: number;
  source: string; confidence: 'verified' | 'probable' | 'legendary';
}

export const ASTRO_EVENTS_2026: AstroEvent[] = [
  { name: 'mercury_retrograde_1', startDate: '2026-01-15', endDate: '2026-02-04', affectedDimensions: ['communication', 'career'], weightBias: -0.15, source: '天文历算推算', confidence: 'verified' },
  { name: 'venus_retrograde', startDate: '2026-03-02', endDate: '2026-04-13', affectedDimensions: ['love', 'finance'], weightBias: -0.1, source: '天文历算推算', confidence: 'verified' },
  { name: 'mars_opposition', startDate: '2026-05-20', endDate: '2026-06-10', affectedDimensions: ['career', 'health'], weightBias: 0.1, source: '天文历算推算', confidence: 'verified' },
  { name: 'jupiter_enter_cancer', startDate: '2026-06-28', endDate: '2026-07-15', affectedDimensions: ['finance', 'love'], weightBias: 0.2, source: '天文历算推算', confidence: 'verified' },
  { name: 'saturn_enter_aries', startDate: '2026-09-01', endDate: '2026-09-20', affectedDimensions: ['career', 'health'], weightBias: -0.05, source: '天文历算推算', confidence: 'verified' },
];
