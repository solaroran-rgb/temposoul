export interface AffiliateTier {
  id: string;
  name: string;
  commissionRate: number;
  threshold: number;
}

export interface AffiliateProgram {
  tiers: AffiliateTier[];
  applyUrl?: string;
  ready: boolean;
}

export const PROGRAM_SEED: AffiliateProgram = {
  tiers: [
    { id: 't1', name: '青铜', commissionRate: 0.1, threshold: 0 },
    { id: 't2', name: '黄金', commissionRate: 0.2, threshold: 100000 },
  ],
  ready: false,
};
