export type QinggongResult = 'male' | 'female';
export type Confidence = 'verified' | 'probable' | 'legendary';
export type AgeConvention = 'lunar-year-plus-one' | 'lunar-year-plus-two';
export type LeapMonthRule = 'merge-to-prev' | 'merge-to-next' | 'standalone';

export interface QinggongRow {
  virtualAge: number;
  lunarMonthResults: Record<number, QinggongResult>;
}

export interface QinggongTable {
  rows: QinggongRow[];
  ageRange: [number, number];
  monthRange: [number, number];
  ageConvention: AgeConvention;
  leapMonthRule: LeapMonthRule;
  source: { text: string; edition: string; confidence: Confidence };
  rulesetVersion: string;
  disclaimer: string;
  ready: boolean;
}

export interface QinggongQuery { virtualAge: number; lunarMonth: number; }

export interface QinggongResultPayload {
  result: QinggongResult;
  virtualAge: number;
  lunarMonth: number;
  rulesetVersion: string;
  computedAt: string;
  sourceNote: string;
}
