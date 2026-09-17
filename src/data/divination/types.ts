export type Confidence = 'verified' | 'probable' | 'legendary';

export interface EntrySource {
  text: string;
  confidence: Confidence;
}

export interface EntertainmentEntry {
  id: string;
  title: string;
  body: string;
  source: EntrySource;
  confidence: Confidence;
  ready: boolean;
  disclaimer: string;
}
