// 修正：IT-3.1 依据（移除虚假字段，rhythm 改为静态科普）
// 修正：IT-1.3 依据（PrivacyHint 命名导入，无 props）
// 优化：使用 createPortal 解决移动端 Drawer 滚动穿透与 z-index 陷阱
// 优化：增加 a11y 键盘导航（Escape 关闭）与 aria 属性
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import { PrivacyHint } from '@/components/PrivacyHint';
import './DailyRhythmCard.css';

const RHYTHM_COMPLIANCE_TEXT =
  '本内容基于子午流注等传统养生文化生成，仅作传统文化科普与数字节律参考，非医疗建议。如有健康问题请咨询专业医师。';

export const DailyRhythmCard: React.FC = () => {
  const { data, loading, error } = useAlmanacData();
  const [showEvidence, setShowEvidence] = useState(false);

  // 键盘无障碍支持：按 Escape 关闭 Drawer
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showEvidence) setShowEvidence(false);
    },
    [showEvidence],
  );

  useEffect(() => {
    if (showEvidence) {
      document.addEventListener('keydown', handleKeyDown);
      // 锁定背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showEvidence, handleKeyDown]);

  if (loading) {
    return (
      <div className="daily-rhythm-card daily-rhythm-card--loading" aria-busy="true">
        <div className="skeleton-block" />
        <div className="skeleton-block skeleton-block--sm" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="daily-rhythm-card daily-rhythm-card--error" role="alert">
        <p>节律数据同步中，请稍后刷新重试。</p>
      </div>
    );
  }

  const { lunarDate, ganzhi, recommends, avoids, dayOfficer, clash, gods } = data;
  const ganzhiStr = `${ganzhi.year || ''} ${ganzhi.month || ''} ${ganzhi.day || ''}`.trim();

  const drawerNode = showEvidence
    ? createPortal(
        <div
          className="daily-rhythm-card__drawer"
          onClick={() => setShowEvidence(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-title"
        >
          <div className="daily-rhythm-card__drawer-content" onClick={(e) => e.stopPropagation()}>
            <h4 id="evidence-title">宜忌推导证据</h4>
            <p>
              <strong>建除/值神：</strong>
              {dayOfficer || '暂无'}
            </p>
            <p>
              <strong>冲煞：</strong>
              {clash || '暂无'}
            </p>
            <p>
              <strong>神煞列表：</strong>
            </p>
            <ul>
              {gods.length > 0 ? (
                gods.map((god, i) => (
                  <li key={i}>
                    {god.name} <span className="god-type">({god.type})</span>
                  </li>
                ))
              ) : (
                <li>暂无特殊神煞</li>
              )}
            </ul>
            <button className="drawer-close-btn" onClick={() => setShowEvidence(false)} autoFocus>
              关闭
            </button>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="daily-rhythm-card">
      <header className="daily-rhythm-card__header">
        <h2 className="daily-rhythm-card__title">
          今日节律 · {data.date} {data.weekday}
        </h2>
        <span className="daily-rhythm-card__lunar">{lunarDate}</span>
      </header>

      {ganzhiStr && (
        <div className="daily-rhythm-card__ganzhi">
          <span>{ganzhiStr}</span>
          {clash && <span className="daily-rhythm-card__clash">冲煞：{clash}</span>}
        </div>
      )}

      <section className="daily-rhythm-card__yiji">
        <div className="daily-rhythm-card__yi">
          <h3>宜</h3>
          <ul>
            {recommends.length > 0 ? (
              recommends.map((item, i) => <li key={`yi-${i}`}>{item}</li>)
            ) : (
              <li>诸事皆宜</li>
            )}
          </ul>
        </div>
        <div className="daily-rhythm-card__ji">
          <h3>忌</h3>
          <ul>
            {avoids.length > 0 ? (
              avoids.map((item, i) => <li key={`ji-${i}`}>{item}</li>)
            ) : (
              <li>诸事不忌</li>
            )}
          </ul>
        </div>
        {dayOfficer && (
          <button
            className="daily-rhythm-card__evidence-btn"
            onClick={() => setShowEvidence(true)}
            aria-haspopup="dialog"
          >
            宜忌溯源（{dayOfficer}）
          </button>
        )}
      </section>

      <section className="daily-rhythm-card__rhythm">
        <h3>传统时辰节律</h3>
        <p className="daily-rhythm-card__advice">
          顺应四时，起居有常。子午流注理论认为人体气血运行与时辰相应，建议结合自然节律安排作息。
        </p>
        <PrivacyHint />
        <p className="daily-rhythm-card__compliance">{RHYTHM_COMPLIANCE_TEXT}</p>
      </section>

      {drawerNode}
    </div>
  );
};

export default DailyRhythmCard;
