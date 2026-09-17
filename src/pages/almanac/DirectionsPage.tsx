// src/pages/almanac/DirectionsPage.tsx
// B16-补交终版：IT-8-1 修正 —— useAlmanacData 返回 {data, loading, error}；
// ganzhi 为对象（Record），通过 data.ganzhi.day 提取日干支字符串后再调 extractDayStem
import { useState, useEffect, useMemo } from 'react';
import type { ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import {
  buildHourlyDirections, getMahjongLuckySeat, extractDayStem, getCurrentHourBranch,
  type HourlyDirection, type EarthlyBranch, DIR_ANGLES
} from '@/lib/direction-calculator';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './directions-page.css';

const DIR_LABELS: Record<string, string> = { N: '正北', NE: '东北', E: '正东', SE: '东南', S: '正南', SW: '西南', W: '正西', NW: '西北' };

export default function DirectionsPage(): ReactElement {
  const today = new Date().toISOString().slice(0, 10);
  const { data, loading, error } = useAlmanacData(today);
  const [activeTab, setActiveTab] = useState<EarthlyBranch>(getCurrentHourBranch());
  const [pageState, setPageState] = useState<PageState>('idle');
  const [hourlyDirs, setHourlyDirs] = useState<HourlyDirection[]>([]);

  useEffect(() => { trackPageView('/almanac/directions'); }, []);

  useEffect(() => {
    if (loading) { setPageState('loading'); return; }
    if (error || !data) { setPageState('error'); return; }
    try {
      // IT-8-1：ganzhi 为对象结构，取 .day 字段的干支字符串
      const gz = data.ganzhi as Record<string, unknown> | undefined;
      const dayGanzhi = typeof gz?.day === 'string' ? gz.day : '';
      const dayStem = extractDayStem(dayGanzhi);
      if (!dayStem) { setPageState('degraded'); return; }
      setHourlyDirs(buildHourlyDirections(dayStem));
      setPageState('ok');
    } catch { setPageState('degraded'); }
  }, [loading, error, data]);

  const currentDir = useMemo(() => hourlyDirs.find(d => d.hourBranch === activeTab) || hourlyDirs[0], [hourlyDirs, activeTab]);
  const luckySeat = currentDir ? getMahjongLuckySeat(currentDir.wealth) : null;

  return (
    <div className="directions-page">
      <PageTopbar title="今日方位" onBack={() => window.history.back()} />
      {pageState === 'loading' && <div className="skeleton directions__skeleton" />}
      {pageState === 'error' && <div className="directions__error">方位数据加载失败</div>}

      {(pageState === 'ok' || pageState === 'degraded') && (
        <>
          <div className="directions__tabs">
            {hourlyDirs.map(d => (
              <button key={d.hourBranch} className={`directions__tab ${d.hourBranch === activeTab ? 'directions__tab--active' : ''}`} onClick={() => setActiveTab(d.hourBranch)}>
                <span className="directions__tab-branch">{d.hourBranch}时</span>
                <span className="directions__tab-time">{d.timeRange}</span>
              </button>
            ))}
          </div>

          {currentDir && (
            <div className="directions__compass">
              <div className="directions__compass-ring">
                <div className="directions__compass-label directions__compass-label--n">北</div>
                <div className="directions__compass-label directions__compass-label--s">南</div>
                <div className="directions__compass-label directions__compass-label--e">东</div>
                <div className="directions__compass-label directions__compass-label--w">西</div>

                <div className="directions__needle directions__needle--wealth" style={{ transform: `translate(-50%, -50%) rotate(${DIR_ANGLES[currentDir.wealth]}deg) translateY(-70px)` }}>
                  <span style={{ transform: `rotate(${-DIR_ANGLES[currentDir.wealth]}deg)` }}>财</span>
                </div>
                <div className="directions__needle directions__needle--joy" style={{ transform: `translate(-50%, -50%) rotate(${DIR_ANGLES[currentDir.joy]}deg) translateY(-50px)` }}>
                  <span style={{ transform: `rotate(${-DIR_ANGLES[currentDir.joy]}deg)` }}>喜</span>
                </div>
                <div className="directions__needle directions__needle--fortune" style={{ transform: `translate(-50%, -50%) rotate(${DIR_ANGLES[currentDir.fortune]}deg) translateY(-30px)` }}>
                  <span style={{ transform: `rotate(${-DIR_ANGLES[currentDir.fortune]}deg)` }}>福</span>
                </div>
              </div>
            </div>
          )}

          {currentDir && (
            <div className="directions__info">
              <div className="directions__info-row"><span className="directions__info-label">财神方位</span><span className="directions__info-value directions__info-value--highlight">{DIR_LABELS[currentDir.wealth]}</span></div>
              <div className="directions__info-row"><span className="directions__info-label">喜神方位</span><span className="directions__info-value">{DIR_LABELS[currentDir.joy]}</span></div>
              <div className="directions__info-row"><span className="directions__info-label">福神方位</span><span className="directions__info-value">{DIR_LABELS[currentDir.fortune]}</span></div>
            </div>
          )}

          {luckySeat && (
            <div className="directions__mahjong">
              <h3 className="directions__mahjong-title">麻将吉位参考</h3>
              <div className="directions__mahjong-seat">
                <span className="directions__mahjong-label">上风位</span>
                <span className="directions__mahjong-value">{DIR_LABELS[luckySeat]}</span>
              </div>
              <p className="directions__mahjong-note">基于财神方位对面推算，仅供民俗文化参考</p>
            </div>
          )}

          <div className="directions__disclaimer">
            ⚠️ 本页面所有内容仅供传统民俗文化研究与娱乐参考，不构成任何形式的赌博指导或投资建议。请理性看待，遵守当地法律法规。
          </div>
        </>
      )}
      <PrivacyHint />
    </div>
  );
}
