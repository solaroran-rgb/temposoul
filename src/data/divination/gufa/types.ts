export type GufaSchool = 'sanming' | 'guiguzi' | 'jiuxing';
export type Confidence = 'verified' | 'probable' | 'legendary';

export interface GufaSourceRef {
  text: string;
  edition: string;
  confidence: Confidence;
}

export interface GufaEntry {
  id: string;
  school: GufaSchool;
  matchKey: string;
  title: string;
  body: string;
  todayNote?: string;
  source: GufaSourceRef;
  confidence: Confidence;
  ready: boolean;
  disclaimer: string;
}

export interface GufaManifest {
  school: GufaSchool;
  displayName: string;
  entryCount: number;
  rulesetVersion: string;
  sources: GufaSourceRef[];
  degradedMessage: string;
  emptyMessage: string;
}

export interface GufaResultPayload {
  school: GufaSchool;
  entry: GufaEntry;
  todayEntry?: GufaEntry;
  rulesetVersion: string;
  computedAt: string;
}

export interface GufaSubCategory {
  school: GufaSchool;
  key: string;
  label: string;
  matchKeyPrefix: string;
}
