/**
 * @file 星空纪念 · 分享名片页（公开只读）
 * 复用真实天文引擎（createSkyScene + setTimeLocation）按快照冻结渲染某一时刻的星空，
 * 叠加纪念文案 / 地点 / 时间 HUD。无需登录；数据来自 /api/v1/sky-events/share/:token。
 */
import { useState, useRef, useEffect, type CSSProperties, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { createSkyScene, type SkySceneApi } from '@/lib/sky/SkyScene';
import { injectHolographicTokens } from '@/theme/holographic-tokens';
import { getPublicSkyEvent, buildShareUrl, type PublicSkyEvent } from '@/lib/skyevent/api';
import { decodeDailyShareToken, type DailySkyPayload } from '@/lib/daily-sky/share';

function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes(),
  )}`;
}

export function SkyEventSharePage() {
  const { token } = useParams<{ token: string }>();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SkySceneApi | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'notfound' | 'error'>('loading');
  const [event, setEvent] = useState<PublicSkyEvent | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setState('notfound');
      return;
    }
    // daily- 前缀 token 自包含 payload，客户端解码渲染，不打 getPublicSkyEvent 后端
    if (token.startsWith('daily-')) return;
    getPublicSkyEvent(token)
      .then((evt) => {
        if (cancelled) return;
        setEvent(evt);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  // 挂载场景并冻结到纪念时刻
  useEffect(() => {
    if (state !== 'ready' || !event || !mountRef.current) return;
    injectHolographicTokens();
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mountRef.current.appendChild(canvas);
    try {
      const api = createSkyScene(canvas);
      if (!api) {
        // WebGL2 不可用：静态降级（深色背景 + 文字）
        canvas.remove();
        return;
      }
      sceneRef.current = api;
      api.start(null);
      api.setTimeLocation(new Date(event.eventTime), { lat: event.lat, lon: event.lng });
    } catch {
      canvas.remove();
    }
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
      canvas.remove();
    };
  }, [state, event]);

  // daily- 前缀分支：客户端解码渲染每日星象落地卡（路由复用 /sky-event/:token，不新增路由）。
  // 解码失败/24h 过期 → 中性失效提示；解码成功 → 每日星象落地卡。
  const dailyPayload: DailySkyPayload | null | undefined = token?.startsWith('daily-')
    ? decodeDailyShareToken(token)
    : undefined;
  if (dailyPayload !== undefined) {
    return dailyPayload ? <DailyLandingCard payload={dailyPayload} /> : <DailyExpiredCard />;
  }

  if (state === 'loading') {
    return <div style={center}>正在读取这片星空…</div>;
  }
  if (state === 'notfound' || state === 'error') {
    return (
      <div style={center}>
        <div style={{ fontSize: 18, color: '#e0f7ff', letterSpacing: 2 }}>
          {state === 'notfound' ? '纪念星空不存在或链接已失效' : '读取失败，请稍后再试'}
        </div>
        <a href="/" style={linkBtn}>
          返回 TempoSoul
        </a>
      </div>
    );
  }

  const shareUrl = buildShareUrl(event!.shareToken);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时忽略 */
    }
  };

  return (
    <div
      className="sky-root"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030305',
        overflow: 'hidden',
        fontFamily: "'Inter','Noto Sans SC',system-ui,sans-serif",
        letterSpacing: '0.05em',
      }}
    >
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* 顶部标题 */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          padding: '16px 22px',
          border: '1px solid rgba(0,229,255,0.5)',
          background: 'rgba(2,10,18,0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 20px rgba(0,229,255,0.15)',
        }}
      >
        <h1
          style={{ margin: 0, fontSize: 18, letterSpacing: 6, color: '#e0f7ff', fontWeight: 300 }}
        >
          命律 · TEMPOSOUL
        </h1>
        <div style={{ fontSize: 10, color: 'rgba(0,229,255,0.7)', marginTop: 6, letterSpacing: 3 }}>
          CELESTIAL MEMORY CARD
        </div>
      </div>

      {/* 右上：分享 / 返回 */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        <button style={hudBtn} onClick={copy}>
          {copied ? '已复制链接' : '复制名片链接'}
        </button>
        <a href="/" style={hudBtn}>
          立即开始
        </a>
      </div>

      {/* 中央：纪念文案 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 6,
          textAlign: 'center',
          maxWidth: '88vw',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: 'rgba(224,247,255,0.97)',
            letterSpacing: 6,
            textShadow: '0 0 14px rgba(0,229,255,0.85), 0 0 40px rgba(0,229,255,0.3)',
            fontWeight: 300,
          }}
        >
          {event!.title}
        </div>
        {event!.note && (
          <div
            style={{
              fontSize: 14,
              color: 'rgba(196,240,255,0.85)',
              letterSpacing: 1,
              marginTop: 16,
              lineHeight: 1.9,
              whiteSpace: 'pre-wrap',
            }}
          >
            {event!.note}
          </div>
        )}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(143,232,255,0.62)',
            letterSpacing: 3,
            marginTop: 18,
          }}
        >
          {event!.locationName} · {event!.lat.toFixed(4)}°N {event!.lng.toFixed(4)}°E
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(143,232,255,0.62)',
            letterSpacing: 3,
            marginTop: 6,
          }}
        >
          {fmtTime(event!.eventTime)} · 此刻星空
        </div>
      </div>

      {/* 底部版权标记 */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 10,
          textAlign: 'right',
          fontSize: 9,
          color: 'rgba(143,232,255,0.4)',
          letterSpacing: 2,
          lineHeight: 2,
        }}
      >
        <div>v1.0 · REAL-TIME CELESTIAL RENDER</div>
        <div>由 TempoSoul 命律生成</div>
      </div>
    </div>
  );
}

const center: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: '#030305',
  color: '#8fe8ff',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'monospace',
  letterSpacing: 2,
};

const hudBtn: CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(0,229,255,0.35)',
  color: '#8fe8ff',
  padding: '8px 18px',
  borderRadius: 2,
  cursor: 'pointer',
  fontSize: 12,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  fontWeight: 300,
  textDecoration: 'none',
};

const linkBtn: CSSProperties = {
  ...hudBtn,
  marginTop: 12,
};

/** 每日星象落地卡（daily- token 客户端解码渲染，零后端请求） */
function DailyLandingCard({ payload }: { payload: DailySkyPayload }): ReactElement {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030305',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: 24,
        fontFamily: "'Inter','Noto Sans SC',system-ui,sans-serif",
        letterSpacing: '0.05em',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 12, color: 'rgba(0,229,255,0.7)', letterSpacing: 4 }}>
        命律 · TEMPOSOUL · {payload.dateKey} · {payload.moonPhase}
      </div>
      <h1
        style={{
          margin: 0,
          fontSize: 34,
          color: '#E6EDF3',
          fontWeight: 300,
          fontFamily: "'Noto Serif SC','Songti SC',serif",
          letterSpacing: 4,
        }}
      >
        {payload.skyEventTitle}
      </h1>
      <div style={{ fontSize: 15, color: 'rgba(201,214,232,0.9)', lineHeight: 1.9, maxWidth: 560 }}>
        {payload.personalNote}
      </div>
      {payload.zodiacLine && (
        <div
          style={{ fontSize: 13, color: 'rgba(143,227,255,0.75)', lineHeight: 1.8, maxWidth: 560 }}
        >
          {payload.zodiacLine}
        </div>
      )}
      <div
        style={{
          fontSize: 16,
          color: '#E6EDF3',
          fontFamily: "'Noto Serif SC','Songti SC',serif",
          maxWidth: 560,
          lineHeight: 1.9,
        }}
      >
        「{payload.quote}」
        <span style={{ fontSize: 12, color: 'rgba(201,214,232,0.6)' }}> —— {payload.source}</span>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(201,214,232,0.5)', letterSpacing: 2 }}>
        {payload.compliance}
      </div>
      <a
        href="/"
        style={{
          ...hudBtn,
          marginTop: 10,
          background: 'rgba(0,229,255,0.12)',
          textTransform: 'none',
          fontSize: 14,
          padding: '12px 32px',
        }}
      >
        开始今日星象
      </a>
    </div>
  );
}

/** daily token 失效/过期（中性文案，不制造焦虑） */
function DailyExpiredCard(): ReactElement {
  return (
    <div style={center}>
      <div style={{ fontSize: 18, color: '#e0f7ff', letterSpacing: 2 }}>
        此分享已过期，去看看今天的星象
      </div>
      <a href="/" style={linkBtn}>
        返回命律
      </a>
    </div>
  );
}
