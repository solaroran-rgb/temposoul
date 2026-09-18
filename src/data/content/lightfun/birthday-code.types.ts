export interface BirthdayCodeEntry {
  readonly month: number;
  readonly day: number;
  readonly code_key: string;
  readonly is_leap: boolean;
  readonly keywords: readonly [string, string, string];
  readonly energy_desc: string;
  readonly strength: string;
  readonly risk: string;
  readonly advice: string;
  readonly action: string;
  readonly related_flower: string;
  readonly lucky_color_fun: string;
}
