// 修正：组装 /almanac/select 页面，调用专家 A 交付的组件
// 修正：IT-1.2 依据（PageTopbar 补全 title 和 onBack）
// 优化：Date Input 深色模式原生适配
// P1-4 适配层：把 useAlmanacData 的 recommends/avoids/gods/dayOfficer/clash
//   映射成专家 A 组件真实 props：YiJiPanel{yi,ji}、AuspiciousHourTable{rows}、AlmanacEvidenceCard{items}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useAlmanacData, type AlmanacDayData } from '@/hooks/useAlmanacData';
import { YiJiPanel, type YiJiItem } from './components/YiJiPanel';
import { AuspiciousHourTable, type HourRow } from './components/AuspiciousHourTable';
import { AlmanacEvidenceCard } from './components/AlmanacEvidenceCard';
import type { EvidenceItem } from '../../components/fortune/FortuneEvidenceCard';
import './SelectPage.css';

/** P1-4：recommends/avoids(string[]) -> YiJiItem[] */
function toYiJi(items: string[]): YiJiItem[] {
  return (Array.isArray(items) ? items : []).map((label) => ({ label }));
}

/** P1-4：gods(AlmanacGod[]) -> HourRow[]（吉神近似映射为时辰行，quality 降级为 neutral） */
function toRows(gods: Array<{ name: string; type: string }>): HourRow[] {
  return (Array.isArray(gods) ? gods : []).map((g, i) => ({
    time: g.name || `吉神 ${i + 1}`,
    branch: g.type || '-',
    quality: 'neutral' as const,
    note: g.type ? `${g.name}（${g.type}）` : g.name,
  }));
}

/** P1-4：dayOfficer/clash/gods -> EvidenceItem[] */
function toItems(day: AlmanacDayData): EvidenceItem[] {
  const out: EvidenceItem[] = [];
  if (day.dayOfficer) {
    out.push({
      id: 'day-officer',
      label: '值日（日禄）',
      value: day.dayOfficer,
      confidence: 'probable',
    });
  }
  if (day.clash) {
    out.push({ id: 'clash', label: '冲煞', value: day.clash, confidence: 'probable' });
  }
  (Array.isArray(day.gods) ? day.gods : []).forEach((g, i) => {
    out.push({
      id: `god-${i}`,
      label: g.name || `吉神 ${i + 1}`,
      value: g.type || undefined,
      confidence: 'legendary',
    });
  });
  return out;
}

export const SelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { data, loading, error } = useAlmanacData(targetDate);

  return (
    <div className="almanac-select-page">
      <PageTopbar title="智能择日" onBack={() => navigate(-1)} />

      <div className="almanac-select-page__controls">
        <label className="date-label">
          选择日期：
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="date-input"
          />
        </label>
      </div>

      <div className="almanac-select-page__content">
        {loading && <div className="almanac-select-page__loading">正在推演吉日...</div>}
        {error && (
          <div className="almanac-select-page__error" role="alert">
            数据加载失败：{error}
          </div>
        )}

        {data && !loading && (
          <div className="almanac-select-page__results">
            <YiJiPanel yi={toYiJi(data.recommends)} ji={toYiJi(data.avoids)} />
            <AuspiciousHourTable rows={toRows(data.gods)} />
            <AlmanacEvidenceCard items={toItems(data)} />
          </div>
        )}
      </div>

      <footer className="almanac-select-page__footer">
        <PrivacyHint />
        <p className="almanac-select-page__disclaimer">
          择日结果基于传统历法算法与民俗典籍，仅供文化参考，不构成现实决策的必然依据。
        </p>
      </footer>
    </div>
  );
};

export default SelectPage;
