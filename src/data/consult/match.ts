export interface MatchPreference {
  specialty: 'bazi' | 'ziwei' | 'tarot' | 'astrology' | 'any';
  interests?: string[];
  budget?: number;
}

export interface MatchResult {
  advisorId: string;
  score: number;
  reason: string;
}
