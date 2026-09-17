export interface ChartSummaryLine {
  label: string;
  value: string;
  confidence: 'verified' | 'probable' | 'disputed' | 'legendary';
}
export interface ShareCardModel {
  title: string;
  lines: { label: string; value: string }[];
  footer: string;
}
export interface ChartSummary {
  system: 'bazi' | 'ziwei' | 'astrolabe';
  title: string;
  lines: ChartSummaryLine[];
  exportForShare(): ShareCardModel;
}
