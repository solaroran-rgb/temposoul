/**
 * 深度游标 L0-L4 · 文字化五段切换（禁用纯图形滑块）
 *
 * L0 事实层 | L1 术语层 | L2 白话层 | L3 散文层 | L4 决策层
 *
 * 交互：
 * - 拖动：在轨道上按下并水平拖动，游标跟随指针，松开落在最近档位
 * - 点击：直接点击某一段文字即切换
 * - 键盘：Tab 聚焦后 ←/→ 逐档切换
 * 无障碍：role=slider / aria-valuemin / aria-valuemax / aria-valuenow / aria-valuetext
 */
import { useCallback, useRef, useState } from 'react';

// ─── 类型定义（与 core 引擎对齐） ──────────────────────────────────────────────

export type DepthLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface DepthMarker {
  level: DepthLevel;
  label: string;
  desc: string;
}

export const DEPTH_ORDER: DepthLevel[] = ['L0', 'L1', 'L2', 'L3', 'L4'];

export const DEPTH_MARKERS: DepthMarker[] = [
  { level: 'L0', label: '事实层', desc: '命理术语原文' },
  { level: 'L1', label: '术语层', desc: '十神×宫位' },
  { level: 'L2', label: '白话层', desc: '通俗解读' },
  { level: 'L3', label: '散文层', desc: '意象化表达' },
  { level: 'L4', label: '决策层', desc: '行动建议' },
];

// ─── 类型守卫 ──────────────────────────────────────────────────────────────────

export function isDepthLevel(v: unknown): v is DepthLevel {
  return typeof v === 'string' && (DEPTH_ORDER as string[]).includes(v);
}

/** 在五档间步进（键盘用；direction = ±1） */
export function stepDepth(level: DepthLevel, direction: -1 | 1): DepthLevel {
  const idx = DEPTH_ORDER.indexOf(level);
  const next = Math.max(0, Math.min(DEPTH_ORDER.length - 1, idx + direction));
  return DEPTH_ORDER[next];
}

// ─── 组件 ──────────────────────────────────────────────────────────────────────

export interface DepthSelectorProps {
  /** 当前选中深度，默认 L0 */
  activeLevel?: DepthLevel;
  /** 切换回调 */
  onChange?: (level: DepthLevel) => void;
  /** 每段已渲染句数（用于徽标） */
  sentenceCount?: Partial<Record<DepthLevel, number>>;
  /** 组件宽度限制 */
  compact?: boolean;
}

export function DepthSelector(props: DepthSelectorProps) {
  const {
    activeLevel = 'L0',
    onChange,
    sentenceCount = {} as Partial<Record<DepthLevel, number>>,
    compact = false,
  } = props;

  const [hovered, setHovered] = useState<DepthLevel | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  /** 指针 x → 最近档位（按轨道宽度均分五档） */
  const levelFromClientX = useCallback((clientX: number): DepthLevel => {
    const el = trackRef.current;
    if (!el) return activeLevel;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return activeLevel;
    const ratio = (clientX - rect.left) / rect.width;
    const idx = Math.round(ratio * (DEPTH_ORDER.length - 1));
    return DEPTH_ORDER[Math.max(0, Math.min(DEPTH_ORDER.length - 1, idx))];
  }, [activeLevel]);

  /** 拖动开始：按下即吸附最近档位 */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    // 捕获指针，保证移出轨道后仍能收到 move/up
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const level = levelFromClientX(e.clientX);
    setHovered(level);
    onChange?.(level);
  };

  /** 拖动中：游标实时跟随 */
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const level = levelFromClientX(e.clientX);
    setHovered(level);
    onChange?.(level);
  };

  /** 拖动结束：释放指针，落定 */
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // 指针捕获已释放时忽略
    }
    setHovered(null);
  };

  const activeIndex = DEPTH_ORDER.indexOf(activeLevel);

  return (
    <div
      ref={trackRef}
      className="ts-depth-selector"
      role="slider"
      aria-label="深度游标 L0-L4"
      aria-valuemin={0}
      aria-valuemax={DEPTH_ORDER.length - 1}
      aria-valuenow={activeIndex}
      aria-valuetext={`${activeLevel} ${DEPTH_MARKERS[activeIndex].label} · ${DEPTH_MARKERS[activeIndex].desc}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange?.(stepDepth(activeLevel, 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange?.(stepDepth(activeLevel, -1));
        } else if (e.key === 'Home') {
          e.preventDefault();
          onChange?.(DEPTH_ORDER[0]);
        } else if (e.key === 'End') {
          e.preventDefault();
          onChange?.(DEPTH_ORDER[DEPTH_ORDER.length - 1]);
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseLeave={() => {
        if (!draggingRef.current) setHovered(null);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 2 : 4,
        padding: compact ? '6px 8px' : '8px 12px',
        paddingBottom: compact ? 9 : 13,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: compact ? 8 : 12,
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        position: 'relative',
        outline: 'none',
      }}
    >
      {/* 文字化五段：每段一个文字按钮（非纯图形滑块） */}
      {DEPTH_MARKERS.map((m) => {
        const active = m.level === activeLevel;
        const hover = m.level === hovered;
        const count = sentenceCount[m.level] ?? 0;
        // 拖动中游标所在档位也按「选中」高亮，形成跟随感
        const highlight = active || hover;

        return (
          <button
            key={m.level}
            type="button"
            role="presentation"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              draggingRef.current = false;
              setHovered(null);
              onChange?.(m.level);
            }}
            onMouseEnter={() => setHovered(m.level)}
            onMouseLeave={() => setHovered((h) => (h === m.level ? null : h))}
            style={{
              flex: '1 1 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: compact ? '6px 6px' : '8px 8px',
              borderRadius: 8,
              border: 'none',
              cursor: 'grab',
              background: highlight
                ? 'rgba(99,102,241,0.25)'
                : 'transparent',
              color: highlight ? '#a5b4fc' : '#94a3b8',
              transition: 'background 0.12s ease, color 0.12s ease',
              outline: 'none',
              minWidth: 0,
            }}
          >
            {/* 层级标签 */}
            <span
              style={{
                fontSize: compact ? 12 : 13,
                fontWeight: highlight ? 700 : 500,
                letterSpacing: 0.5,
                lineHeight: 1,
              }}
            >
              {m.level}
            </span>
            {/* 中文名 */}
            <span
              style={{
                fontSize: compact ? 10 : 11,
                color: highlight ? '#c7d2fe' : '#64748b',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {m.label}
            </span>
            {/* 句数徽标 */}
            {count > 0 && (
              <span
                style={{
                  fontSize: 9,
                  color: highlight ? '#818cf8' : '#475569',
                  background: highlight ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                  borderRadius: 4,
                  padding: '0 3px',
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                }}
              >
                {count}句
              </span>
            )}
          </button>
        );
      })}

      {/* 档位刻度点（文字化辅助，非滑块图形） */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          bottom: compact ? 3 : 4,
          height: 2,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      >
        {DEPTH_MARKERS.map((m, i) => (
          <span
            key={m.level}
            style={{
              position: 'absolute',
              left: `${(i / (DEPTH_ORDER.length - 1)) * 100}%`,
              top: -2,
              width: 6,
              height: 6,
              borderRadius: 999,
              transform: 'translateX(-50%)',
              background:
                m.level === activeLevel || m.level === hovered
                  ? '#818cf8'
                  : 'rgba(255,255,255,0.18)',
              transition: 'background 0.12s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 深度面板标题（供父组件用） ──────────────────────────────────────────────────

export function depthPanelTitle(level: DepthLevel): string {
  const map: Record<DepthLevel, string> = {
    L0: '📜 事实层 · 命理术语原文',
    L1: '🔤 术语层 · 十神 × 宫位',
    L2: '💬 白话层 · 通俗解读',
    L3: '✍️ 散文层 · 意象化表达',
    L4: '🎯 决策层 · 行动建议',
  };
  return map[level];
}
