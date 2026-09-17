export type Confidence = 'verified' | 'probable' | 'legendary';
export type MansionAuspiciousness = 'auspicious' | 'neutral' | 'inauspicious';
export type Epoch = 'J2000' | 'date';
export type AccuracyGrade = 'high' | 'medium' | 'approx';

export interface MansionAstroLayer {
  distanceStarName: string;
  distanceStarWestern: string;
  eclipticLongitudeDeg: number;
  eclipticEpoch: Epoch;
  precessionNote: string;
  accuracyGrade: AccuracyGrade;
  raRange: [number, number];
  astroSourceRef: string;
  accuracyNote: string;
}

export interface MansionFolkLayer {
  auspiciousness: MansionAuspiciousness;
  animal: string;
  imagery: string;
  verse: string;
  folkSourceRef: string;
}

export interface MansionEntry {
  id: string;
  name: string;
  order: number;
  astro: MansionAstroLayer;
  folk: MansionFolkLayer;
  confidence: Confidence;
  ready: boolean;
  disclaimer: string;
  seo: { description: string; ogTitle: string; ogDescription: string };
}
