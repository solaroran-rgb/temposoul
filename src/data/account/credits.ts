export interface CreditBalance {
  balance: number;
  currency: 'CNY' | 'USD';
  updatedAt: number;
}

export interface TopUpTier {
  id: string;
  credits: number;
  priceLabel: string;
  ready: boolean;
}

export const TIERS_SEED: TopUpTier[] = [
  { id: 't1', credits: 100, priceLabel: '¥10.00', ready: false },
  { id: 't2', credits: 500, priceLabel: '¥50.00', ready: false },
];
