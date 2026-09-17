import React, { useMemo } from 'react';
import { injectHolographicTokens } from '@/theme/holographic-tokens';

export interface AnchorPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  targetCorner: 'tl' | 'tr' | 'bl' | 'br';
}

interface HUDLayoutProps {
  anchors?: AnchorPoint[];
  children?: React.ReactNode;
}

export function HUDLayout({ anchors = [], children }: HUDLayoutProps) {
  useMemo(() => injectHolographicTokens(), []);

  const svgElements = useMemo(() => {
    return anchors.map((anchor) => {
      let startX = 0,
        startY = 0;
      if (anchor.targetCorner === 'tl') {
        startX = 12;
        startY = 8;
      } else if (anchor.targetCorner === 'tr') {
        startX = 88;
        startY = 8;
      } else if (anchor.targetCorner === 'bl') {
        startX = 12;
        startY = 92;
      } else {
        startX = 88;
        startY = 92;
      }

      const midX = startX + (anchor.x - startX) * 0.6;
      const points = `${startX},${startY} ${midX},${startY} ${midX},${anchor.y} ${anchor.x},${anchor.y}`;

      return (
        <g key={anchor.id}>
          <polyline
            points={points}
            fill="none"
            stroke="var(--cyan-dim)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <path
            d={`M${anchor.x - 4},${anchor.y} h8 M${anchor.x},${anchor.y - 4} v8`}
            stroke="var(--cyan-core)"
            strokeWidth="1.5"
          />
          <text
            x={anchor.x + 8}
            y={anchor.y + 3}
            fill="var(--text-bright)"
            fontSize="10"
            fontFamily="JetBrains Mono"
            className="hud-text-glow"
          >
            {anchor.label}
          </text>
        </g>
      );
    });
  }, [anchors]);

  return (
    <div className="hud-root" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5 }}>
        {svgElements}
      </svg>

      <div className="hud-panel hud-panel--tl">
        <div className="hud-row">
          <span className="hud-label">System</span>
          <span className="hud-value hud-text-glow">TEMPOSOUL</span>
        </div>
        <div className="hud-row">
          <span className="hud-label">Loc</span>
          <span className="hud-value">39.90°N 116.40°E</span>
        </div>
        <div className="hud-row">
          <span className="hud-label">Time</span>
          <span className="hud-value">2026-09-14 21:30</span>
        </div>
      </div>

      <div className="hud-panel hud-panel--tr">
        <div className="hud-row">
          <span className="hud-label">LST</span>
          <span className="hud-value">14h 22m 10s</span>
        </div>
        <div className="hud-row">
          <span className="hud-label">FOV</span>
          <span className="hud-value">58.0°</span>
        </div>
        <div className="hud-row">
          <span className="hud-label">Status</span>
          <span className="hud-value hud-accent-warm">TRACKING</span>
        </div>
      </div>

      <div className="hud-panel hud-panel--bl" style={{ width: '220px' }}>
        <div className="hud-label" style={{ marginBottom: '4px' }}>
          Target Constellation
        </div>
        <div className="hud-value hud-text-glow" style={{ fontSize: '16px', marginBottom: '8px' }}>
          ORION (猎户座)
        </div>
        <div className="hud-row">
          <span className="hud-label">Alt</span>
          <span className="hud-value">42.5°</span>
        </div>
        <div className="hud-row">
          <span className="hud-label">Az</span>
          <span className="hud-value">185.2°</span>
        </div>
      </div>

      <div className="hud-panel hud-panel--br">
        <div className="hud-row">
          <span className="hud-label">Mode</span>
          <span className="hud-value">HOLOGRAPHIC</span>
        </div>
      </div>

      <div className="hud-center-void" />

      <div style={{ pointerEvents: 'auto', zIndex: 20 }}>{children}</div>

      <style>{`
        .hud-center-void {
          position: absolute; z-index: 1; pointer-events: none;
          width: 60%; height: 70%; top: 15%; left: 20%;
        }
        @media (max-width: 1080px) {
          .hud-center-void { width: 70%; height: 70%; top: 15%; left: 15%; }
        }
        @media (max-width: 768px) {
          .hud-center-void { width: 80%; height: 60%; top: 10%; left: 10%; }
          .hud-panel--bl, .hud-panel--br { display: none; }
        }
      `}</style>
    </div>
  );
}
