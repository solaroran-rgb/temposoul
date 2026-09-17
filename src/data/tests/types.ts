export interface TestOption {
  label: string;
  score: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: TestOption[];
}

export interface TestOutcome {
  min: number;
  max: number;
  title: string;
  observation: string;
  reflection: string;
  action: string;
}

export interface TestDef {
  id: string;
  title: string;
  description: string;
  questions: TestQuestion[];
  totalRange: [number, number];
  outcomes: TestOutcome[];
  ready: boolean;
  disclaimer: string;
}
