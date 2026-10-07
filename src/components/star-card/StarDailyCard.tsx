/**
 * StarDailyCard · 每日星图双层卡片前端组件（T-06 / B2 升级）
 *
 * 规格命中：
 *  - 双层卡片：全局层（无个人信息）+ 个人层（仅登录用户，uid 哈希隔离）。
 *  - 六态状态机：idle / loading / ok / ok-empty / degraded / error。
 *  - 零依赖天气：渲染服务端下发的节气+气候带静态参考（前端不接第三方天气）。
 *  - 六爻矩阵：登录用户选分类 → /api/star-card?category=… → 四段式解读。
 *  - 合规：固定「仅供参考」口径句；不输出个人信息进全局层。
 *
 * 接线说明：本组件为自包含单元，深链/弹卡触发/路由挂载由集成阶段统一接入；
 * 本文件不修改 App.tsx 等并行批次在改文件。
 */
import React, { useEffect, useState, useCallback } from 'react';

/** 与 /api/star-card 输出对齐的最小前端类型（增量字段，旧字段不变） */
interface CardBlock {
  id: string;
  title: string;
  content: string;
  sourceKey: string;
}
interface WeatherInfo {
  solarTerm: string;
  climateNote: string;
  extremeRisk: boolean;
}
interface DirectionsInfo {
  wealth: { direction: string; note: string };
  sha: { direction: string; note: string };
  noble: { direction: string; note: string };
}
interface DeepLink {
  id: string;
  label: string;
  href: string;
}
interface StarCardData {
  blocks: CardBlock[];
  fallbackLevel: 0 | 1 | 2 | 3;
  ruleVersion: string;
  personalized: boolean;
  weather?: WeatherInfo;
  directions?: DirectionsInfo;
  deepLinks?: DeepLink[];
}
interface LiuyaoView {
  hexagramName: string;
  blocked: boolean;
  sections: { part: string; text: string }[];
}
interface ApiEnvelope {
  ok: boolean;
  data: {
    card: StarCardData;
    ruleVersion: string;
    liuyao: LiuyaoView | null;
  };
}

/** 六态状态机（B2 定稿：idle/loading/ok/ok-empty/degraded/error） */
type CardState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; card: StarCardData; liuyao: LiuyaoView | null }
  | { status: 'ok-empty' }
  | { status: 'degraded'; card: StarCardData; liuyao: LiuyaoView | null }
  | { status: 'error'; message: string };

export interface StarDailyCardProps {
  /** 登录用户 uid 哈希（不传=纯全局层） */
  uidHash?: string;
  /** 气候带静态表（前端不接实时天气） */
  climateZone?: string;
  /** 六爻分类（登录后选） */
  category?: string;
  /** 六爻问题原文（敏感拦截用） */
  q?: string;
  className?: string;
}

const CARD_STYLE: React.CSSProperties = {
  maxWidth: 420,
  margin: '0 auto',
  padding: 20,
  borderRadius: 16,
  background: 'linear-gradient(180deg,#1b2340 0%,#10162e 100%)',
  color: '#e8ecff',
  fontFamily: 'inherit',
  lineHeight: 1.6,
};

export const StarDailyCard: React.FC<StarDailyCardProps> = ({
  uidHash,
  climateZone = 'temperate',
  category,
  q,
  className,
}) => {
  const [state, setState] = useState<CardState>({ status: 'idle' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const params = new URLSearchParams({ climateZone });
      if (uidHash) {
        params.set('uidHash', uidHash);
        if (category) params.set('category', category);
        if (q) params.set('q', q);
      }
      const res = await fetch(`/api/star-card?${params.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        setState({ status: 'error', message: `服务暂不可用（${res.status}）` });
        return;
      }
      const json = (await res.json()) as ApiEnvelope;
      const card = json.data?.card;
      if (!card || !Array.isArray(card.blocks) || card.blocks.length === 0) {
        setState({ status: 'ok-empty' });
        return;
      }
      // L2/L3 → degraded 态（内容熔断降级，整卡不崩）
      if (card.fallbackLevel >= 2) {
        setState({ status: 'degraded', card, liuyao: json.data?.liuyao ?? null });
        return;
      }
      setState({ status: 'ok', card, liuyao: json.data?.liuyao ?? null });
    } catch (e) {
      setState({ status: 'error', message: e instanceof Error ? e.message : '网络异常' });
    }
  }, [uidHash, climateZone, category, q]);

  useEffect(() => {
    void load();
  }, [load]);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div className={className} style={CARD_STYLE} aria-busy="true" data-state={state.status}>
        <p style={{ opacity: 0.7 }}>星图整理中…</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className={className} style={CARD_STYLE} role="alert" data-state="error">
        <p>今日星图暂时无法加载，请稍后重试。</p>
        <button onClick={() => void load()} style={{ marginTop: 8 }}>
          重新加载
        </button>
      </div>
    );
  }

  if (state.status === 'ok-empty') {
    return (
      <div className={className} style={CARD_STYLE} data-state="ok-empty">
        <p>今日暂无星图内容，明天再来看看。</p>
      </div>
    );
  }

  const { card, liuyao } = state;
  const degraded = state.status === 'degraded';

  return (
    <div
      className={className}
      style={{ ...CARD_STYLE, outline: degraded ? '1px solid #b98a3a' : 'none' }}
      data-state={state.status}
      data-rule-version={card.ruleVersion}
    >
      {/* 全局层（无个人信息） */}
      <section aria-label="今日星图全局层">
        {degraded && <p style={{ fontSize: 12, opacity: 0.7 }}>（内容降级呈现，仅供参考）</p>}
        {card.blocks.map((b) => (
          <div key={b.id} style={{ marginBottom: 12 }}>
            <strong>{b.title}</strong>
            <p style={{ margin: '4px 0 0' }}>{b.content}</p>
          </div>
        ))}

        {/* 零依赖天气（节气+气候带静态参考） */}
        {card.weather && (
          <div style={{ marginBottom: 12 }}>
            <strong>今日气候参考</strong>
            <p style={{ margin: '4px 0 0' }}>
              节气：{card.weather.solarTerm}
              {card.weather.climateNote ? `；${card.weather.climateNote}` : ''}
              {card.weather.extremeRisk ? '（极端天气，建议减少外出）' : ''}
            </p>
          </div>
        )}

        {/* 结构化三方位 */}
        {card.directions && (
          <div style={{ marginBottom: 12 }}>
            <strong>今日方位参考</strong>
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              <li>财神：{card.directions.wealth.direction}（{card.directions.wealth.note}）</li>
              <li>贵人：{card.directions.noble.direction}（{card.directions.noble.note}）</li>
              <li>宜避：{card.directions.sha.direction}（{card.directions.sha.note}）</li>
            </ul>
          </div>
        )}
      </section>

      {/* 个人层（仅登录用户；六爻·每日一问） */}
      {card.personalized && liuyao && (
        <section aria-label="每日一问（个人层）" style={{ borderTop: '1px dashed #4a5580', paddingTop: 12 }}>
          <strong>每日一问（传统参考解读）</strong>
          {liuyao.blocked ? (
            <p style={{ margin: '4px 0 0' }}>{liuyao.sections[0]?.text}</p>
          ) : (
            <div style={{ margin: '4px 0 0' }}>
              <p>卦象：{liuyao.hexagramName}</p>
              {liuyao.sections.map((s, i) => (
                <p key={i} style={{ margin: '2px 0' }}>
                  【{s.part}】{s.text}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 卡底深链区 */}
      {card.deepLinks && (
        <nav style={{ marginTop: 12, borderTop: '1px solid #2c3559', paddingTop: 8 }}>
          {card.deepLinks.map((d) => (
            <a key={d.id} href={d.href} style={{ display: 'block', margin: '4px 0', color: '#9fb4ff' }}>
              {d.label}
            </a>
          ))}
        </nav>
      )}

      <p style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
        以上为传统文化与生活方式的参考信息，仅供娱乐参考。
      </p>
    </div>
  );
};

export default StarDailyCard;
