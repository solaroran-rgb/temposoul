export type Confidence = 'verified' | 'probable' | 'legendary';
export type QuestionKind = 'sitting-direction' | 'birth-year' | 'floor' | 'room-orientation' | 'layout';
export type Grade = 'good' | 'neutral' | 'caution';

export interface FsOption {
  value: string;
  label: string;
  ruleParam: Record<string, string | number>;
}

export interface FsQuestion {
  id: string;
  kind: QuestionKind;
  text: string;
  options: FsOption[];
  required: boolean;
  i18nKey: string;
}

export interface RuleTrace {
  module: string;
  exportName: string;
  inputs: Record<string, string | number>;
  hitPath: string;
}

export interface FsOutcomeDimension {
  dimension: 'ming_gua' | 'zhai_gua' | 'room_orientation' | 'floor_wuxing';
  grade: Grade;
  note: string;
  ruleTrace: RuleTrace;
}

export interface FsOutcome {
  overallGrade: Grade;
  dimensions: FsOutcomeDimension[];
  suggestions: string[];
  disclaimer: string;
  confidence: Confidence;
  rulesetVersion: string;
  computedAt: string;
}

export interface FsDraft {
  answers: Record<string, string>;
  updatedAt: string;
  rulesetVersion: string;
}

export interface FsManifest {
  questionCount: number;
  rulesetVersion: string;
  degradedMessage: string;
  emptyMessage: string;
}
