// 修正：IT-2.1/2.2 依据（不再引用不存在的 resultSummary.triggers）
// 组件名 AnnualTenGodPanel：展示目标年的干支与十神
import type { LiunianItem } from './LiunianTimeline';

export interface AnnualTenGodPanelProps {
  item: LiunianItem | null;
  targetYear: number;
}

export function AnnualTenGodPanel({ item, targetYear }: AnnualTenGodPanelProps) {
  if (!item) {
    return (
      <div className="ts-empty">
        目标年 {targetYear} 未在当前命盘流年数据中（请确认出生年范围覆盖该目标年）
      </div>
    );
  }
  return (
    <div className="ts-annual-tengod-panel">
      <div className="ts-annual-tengod-panel__row">
        <span className="ts-annual-tengod-panel__label">年份</span>
        <span className="ts-annual-tengod-panel__value">{item.year}</span>
      </div>
      <div className="ts-annual-tengod-panel__row">
        <span className="ts-annual-tengod-panel__label">年龄</span>
        <span className="ts-annual-tengod-panel__value">{item.age}</span>
      </div>
      <div className="ts-annual-tengod-panel__row">
        <span className="ts-annual-tengod-panel__label">干支</span>
        <span className="ts-annual-tengod-panel__value">{item.ganZhi}</span>
      </div>
      <div className="ts-annual-tengod-panel__row">
        <span className="ts-annual-tengod-panel__label">天干十神</span>
        <span className="ts-annual-tengod-panel__value">{item.tenGod}</span>
      </div>
      <div className="ts-annual-tengod-panel__row">
        <span className="ts-annual-tengod-panel__label">地支藏干十神</span>
        <span className="ts-annual-tengod-panel__value">{item.tenGodZhi}</span>
      </div>
      <div className="ts-annual-tengod-panel__note">
        说明：以上为引擎计算的该年干支与十神映射，非预测性结论。
      </div>
    </div>
  );
}

export default AnnualTenGodPanel;
