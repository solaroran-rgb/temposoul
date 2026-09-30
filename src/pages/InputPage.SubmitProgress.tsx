// 8.1 排盘加载科学性展示
// InputPage 专属：提交排盘 → 跳转结果页之间的纯前端有序步骤指示器。
// 仅做"引擎执行步骤感"的顺序点亮，不做真实逐步骤后端调用，也不假造长时间。
import { useEffect, useRef, useState, type CSSProperties } from 'react';

const STEPS = ['真太阳时校验', '星象 / 历法计算', '文献参考', '白话解读生成'];
const STEP_INTERVAL = 280; // 每个步骤点亮间隔（ms）

interface SubmitProgressProps {
  onDone: () => void;
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(8,12,24,0.82)',
  backdropFilter: 'blur(4px)',
};

const cardStyle: CSSProperties = {
  width: 'min(320px, calc(100vw - 48px))',
  padding: '22px 24px',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(15,23,42,0.92)',
  boxShadow: '0 18px 48px rgba(0,0,0,0.45)',
};

const titleStyle: CSSProperties = {
  fontSize: 13,
  color: '#cbd5e1',
  letterSpacing: '0.04em',
  marginBottom: 14,
};

const listStyle: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 10,
};

function rowStyle(state: 'done' | 'active' | 'pending'): CSSProperties {
  const color =
    state === 'done' ? '#7dd3a8' : state === 'active' ? '#e2e8f0' : '#64748b';
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color,
    transition: 'color .25s ease',
  };
}

function dotStyle(state: 'done' | 'active' | 'pending'): CSSProperties {
  const bg =
    state === 'done'
      ? '#7dd3a8'
      : state === 'active'
        ? '#94a3b8'
        : 'rgba(148,163,184,0.25)';
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: bg,
    flex: '0 0 auto',
    animation: state === 'active' ? 'submit-progress-pulse 1s ease-in-out infinite' : 'none',
  };
}

export function SubmitProgress({ onDone }: SubmitProgressProps) {
  const [lit, setLit] = useState(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const timers: number[] = [];
    STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLit(i + 1), STEP_INTERVAL * (i + 1)));
    });
    // 最后一个步骤点亮后稍作停顿再真正跳转，保持"步骤走完"的观感。
    timers.push(
      window.setTimeout(() => onDoneRef.current(), STEP_INTERVAL * (STEPS.length + 1) + 100),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <div
      className="submit-progress-overlay"
      role="status"
      aria-live="polite"
      aria-label="正在排盘"
      style={overlayStyle}
    >
      <style>{`@keyframes submit-progress-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.35)} }`}</style>
      <div className="submit-progress-card" style={cardStyle}>
        <div style={titleStyle}>正在为你排盘…</div>
        <ol style={listStyle}>
          {STEPS.map((label, i) => {
            const state: 'done' | 'active' | 'pending' =
              i < lit ? 'done' : i === lit ? 'active' : 'pending';
            return (
              <li key={label} style={rowStyle(state)}>
                <span style={dotStyle(state)} aria-hidden="true" />
                <span>{state === 'done' ? `${label} ✓` : label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
