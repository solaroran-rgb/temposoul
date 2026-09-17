// 修正：IT-2.3 依据（数据源 = summaryFact）
export interface SummaryFactInput {
  factKeys?: string[];
  crossPillarRelationCount?: number;
  spousePalaceRelationCount?: number;
  crossBranchCombinationCount?: number;
  tenGodMappingCount?: number;
  favorableCoverageCount?: number;
  unfavorableCoverageCount?: number;
  unavailableCoverageCount?: number;
  promptText?: string;
  sources?: string[];
  limitation?: string;
}

function Row({ label, value }: { label: string; value?: number }) {
  if (typeof value !== 'number') return null;
  return (
    <div className="ts-compat-summary__row">
      <span className="ts-compat-summary__label">{label}</span>
      <span className="ts-compat-summary__value">{value}</span>
    </div>
  );
}

export function CompatibilityEvidenceCard({ summary }: { summary: SummaryFactInput | null }) {
  if (!summary) return <div className="ts-empty">暂无证据汇总数据</div>;
  return (
    <div className="ts-compat-summary">
      <div className="ts-compat-summary__grid">
        <Row label="跨柱关系数" value={summary.crossPillarRelationCount} />
        <Row label="配偶宫关系数" value={summary.spousePalaceRelationCount} />
        <Row label="跨柱合数" value={summary.crossBranchCombinationCount} />
        <Row label="十神映射数" value={summary.tenGodMappingCount} />
        <Row label="有利覆盖数" value={summary.favorableCoverageCount} />
        <Row label="不利覆盖数" value={summary.unfavorableCoverageCount} />
        <Row label="未覆盖数" value={summary.unavailableCoverageCount} />
      </div>
      {summary.promptText && <div className="ts-compat-summary__text">{summary.promptText}</div>}
      {summary.sources && summary.sources.length > 0 && (
        <div className="ts-compat-summary__sources">出处：{summary.sources.join(' / ')}</div>
      )}
      {summary.limitation && (
        <div className="ts-compat-summary__limitation">限制：{summary.limitation}</div>
      )}
      <div className="ts-compat-summary__disclaimer">
        本证据仅供文化研究参考，不构成任何决策依据，不显示匹配分数或成功率。
      </div>
    </div>
  );
}

export default CompatibilityEvidenceCard;
