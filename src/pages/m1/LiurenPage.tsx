/**
 * 七语 i18n 接入位（本批仅中文，不要求 7 语）
 * LiurenPage —— 大六壬排课页（三式重盘组）
 *
 * 引擎：@temposoul/core/divination/liuren  generateLiuren(customDate, options?)
 *   options.yearBranch 占者出生年地支（可选，不传不取年命）
 *   options.topic      事项类神主题（可选：general/ganqing/shiye/caifu）
 * 可视化落地（对照 A6 02 分册 §12 推荐可视化）：
 *   ① 四课 2×2 + 三传（初→中→末）纵列（核心课式）
 *   ② 天地盘十二支盘面（地盘支 + 天盘加临 + 天将）
 * 能力边界：占时按东八区民用时干支，未做真太阳时（经度）修正（X1-D-13，引擎 timePolicy 已标注）。
 * 合规：传统文化娱乐参考；引擎异常显示「排盘数据待补」，不编造盘面。
 */
import { useState, type CSSProperties, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateLiuren, type LiurenLeiShenTopic } from '@temposoul/core/divination/liuren';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type LiurenData = ReturnType<typeof generateLiuren>;

const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const TOPIC_OPTS: { v: LiurenLeiShenTopic; label: string }[] = [
  { v: 'general', label: '一般事' },
  { v: 'ganqing', label: '感情' },
  { v: 'shiye', label: '事业' },
  { v: 'caifu', label: '财运' },
];

const wrapStyle: CSSProperties = { maxWidth: 960, margin: '0 auto', padding: '28px 20px 64px', color: 'inherit' };
const cardStyle: CSSProperties = {
  border: '1px solid rgba(140,150,180,0.25)', borderRadius: 12,
  padding: '16px 18px', marginBottom: 14, background: 'rgba(255,255,255,0.03)',
};

function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function compute(dateStr: string, yearBranch: string, topic: string): { data: LiurenData | null; error: string } {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) throw new Error('排课时间无效。');
    const opts: { yearBranch?: string; topic?: LiurenLeiShenTopic } = {};
    if (yearBranch) opts.yearBranch = yearBranch;
    if (topic) opts.topic = topic as LiurenLeiShenTopic;
    return { data: generateLiuren(d, opts), error: '' };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

export default function LiurenPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nowStr = toLocalInput(new Date());
  // 修复批次2 P1-①：URL 读初始值（带校验，非法回落默认），合法链接直达即复现
  const initDate = readParam(searchParams, 'date', nowStr);
  const initYb = readParam(searchParams, 'yb', '', (v) => (DIZHI.includes(v) ? v : null));
  const initTopic = readParam(searchParams, 'topic', '', (v) =>
    TOPIC_OPTS.some((o) => o.v === v) ? v : null,
  );
  const [dateStr, setDateStr] = useState<string>(initDate);
  const [yearBranch, setYearBranch] = useState<string>(initYb);
  const [topic, setTopic] = useState<string>(initTopic);
  const [result, setResult] = useState<{ data: LiurenData | null; error: string }>(() =>
    compute(initDate, initYb, initTopic),
  );
  const data = result.data;
  const error = result.error;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(compute(dateStr, yearBranch, topic));
    // 提交写回 URL（空选不下发），分享链接可复现
    const params: Record<string, string> = { date: dateStr };
    if (yearBranch) params.yb = yearBranch;
    if (topic) params.topic = topic;
    setSearchParams(params, { replace: true });
  }

  return (
    <main style={wrapStyle}>
      <style>{`
        .ts-lr-fade { animation: tsLrFade .5s ease both; }
        @keyframes tsLrFade { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
        .ts-lr-arrow { color:#BB9863; }
      `}</style>

      <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.6, margin: '0 0 8px' }}>占卜 · 三式</p>
      <h1 style={{ fontSize: 28, margin: '0 0 6px', fontWeight: 700 }}>大六壬 · 起课</h1>
      <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.8, margin: '0 0 18px' }}>
        月将加时起天地盘，布四课、发三传，附九宗门、课体古籍出处与神煞。
      </p>

      <form onSubmit={onSubmit} style={{ ...cardStyle, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13, opacity: 0.8 }}>占时</label>
        <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 8, fontSize: 14, background: 'rgba(0,0,0,0.25)', color: 'inherit', border: '1px solid rgba(140,150,180,0.4)' }} />
        <label style={{ fontSize: 13, opacity: 0.8 }}>年命(选)</label>
        <select value={yearBranch} onChange={(e) => setYearBranch(e.target.value)}
          style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: 'inherit', fontSize: 14 }}>
          <option value="">不取</option>
          {DIZHI.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        <label style={{ fontSize: 13, opacity: 0.8 }}>类神主题(选)</label>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}
          style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: 'inherit', fontSize: 14 }}>
          <option value="">不固定</option>
          {TOPIC_OPTS.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
        <button type="submit" style={{ padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, background: '#BB9863', color: '#1E2126', border: 'none', fontWeight: 600 }}>
          起六壬课
        </button>
      </form>

      {error && (
        <div style={{ ...cardStyle, borderColor: 'rgba(226,78,76,0.5)' }} role="alert">
          <p style={{ margin: 0, fontSize: 14, color: '#E24E4C' }}>排盘数据待补：{error}</p>
        </div>
      )}

      {data && !error && (
        <div className="ts-lr-fade">
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot
            params={{ date: dateStr, yb: yearBranch, topic }}
            engineName="大六壬 · 月将加时"
          />

          {/* 头部卡 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 14 }}>
              <span>{data.dayNight}</span>
              <span>月将 <b>{data.monthLeader}</b></span>
              <span>占时 <b>{data.divinationBranch}</b></span>
              <span>贵人 <b>{data.noblemanBranch || '—'}</b></span>
              <span>旬空 <b>{(data.xunKong || []).join('、') || '无'}</b></span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, opacity: 0.8, marginTop: 8 }}>
              <span>年 {data.ganzhi.year}</span><span>月 {data.ganzhi.month}</span>
              <span>日 {data.ganzhi.day}</span><span>时 {data.ganzhi.hour}</span>
              <span style={{ opacity: 0.7 }}>发用：{data.transmissionRule}{data.transmissionPattern ? `（${data.transmissionPattern}）` : ''}</span>
            </div>
          </div>

          {/* ① 四课 2×2 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>四课</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {data.fourLessons.map((l) => (
                <div key={l.name} style={{ border: '1px solid rgba(140,150,180,0.25)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>{l.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {l.upper} <span style={{ fontSize: 12, color: '#BB9863', fontWeight: 400 }}>{l.god}</span>
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.6, margin: '2px 0 6px' }}>↓</div>
                  <div style={{ fontSize: 16 }}>{l.lower}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{l.relation}</div>
                </div>
              ))}
            </div>
            {data.lessonSummary && <p style={{ fontSize: 13, opacity: 0.75, margin: '10px 0 0', lineHeight: 1.7 }}>{data.lessonSummary}</p>}
          </div>

          {/* ① 三传纵列 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>三传</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.threeTransmissions.map((t, i) => (
                <div key={t.stage}>
                  {i > 0 && <div className="ts-lr-arrow" style={{ textAlign: 'center', fontSize: 14 }}>↓</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(140,150,180,0.25)', borderRadius: 10, padding: '10px 12px', opacity: t.isVoid ? 0.55 : 1 }}>
                    <b style={{ width: 44, fontSize: 14 }}>{t.stage}</b>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>{t.branch}</span>
                    <span style={{ fontSize: 13, color: '#BB9863' }}>{t.god}</span>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>{t.wuxing}{t.seasonState ? `·${t.seasonState}` : ''}</span>
                    {t.isVoid && <span style={{ fontSize: 12, color: '#999' }}>空亡</span>}
                    <span style={{ fontSize: 12, opacity: 0.7, marginLeft: 'auto' }}>{t.relation}</span>
                  </div>
                </div>
              ))}
            </div>
            {data.transmissionSummary && <p style={{ fontSize: 13, opacity: 0.75, margin: '10px 0 0', lineHeight: 1.7 }}>{data.transmissionSummary}</p>}
          </div>

          {/* ② 天地盘 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>天地盘（上：天盘加临+天将 ／ 下：地盘支）</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {data.heavenlyPlate.map((p) => (
                <div key={p.branch} style={{ border: '1px solid rgba(140,150,180,0.2)', borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.under}</div>
                  <div style={{ fontSize: 11, color: '#BB9863' }}>{p.god}</div>
                  <div style={{ fontSize: 12, opacity: 0.6, borderTop: '1px solid rgba(140,150,180,0.2)', marginTop: 3, paddingTop: 3 }}>{p.branch}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, opacity: 0.65, margin: '8px 0 0' }}>日干寄宫：{data.dayStemResidence}</p>
          </div>

          {/* 课体 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>课体与神煞</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {(data.patternTags || []).map((t) => (
                <span key={t} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12.5, background: 'rgba(187,152,99,0.15)', color: '#EECB0D' }}>{t}</span>
              ))}
            </div>
            {(data.shenShaSummary ?? []).length > 0 && (
              <p style={{ fontSize: 12.5, opacity: 0.7, margin: 0, lineHeight: 1.8 }}>神煞：{(data.shenShaSummary ?? []).join('、')}</p>
            )}
          </div>

          {/* 年命 / 类神 */}
          {data.yearMing && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>年命参证</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, opacity: 0.85 }}>{data.yearMing.note}</p>
            </div>
          )}
          {data.leiShen && (
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>类神（{data.leiShen.topic}）</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, opacity: 0.85 }}>
                优先取用天将 {data.leiShen.gods.join('、')}{data.leiShen.branches.length ? ` ／ 支 ${data.leiShen.branches.join('、')}` : ''}
              </p>
            </div>
          )}

          {/* 证据折叠 */}
          <details style={cardStyle}>
            <summary style={{ cursor: 'pointer', fontSize: 14, opacity: 0.85 }}>课体古籍出处与证据链</summary>
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, opacity: 0.85 }}>
              {(data.guaTiFacts || []).map((f) => (
                <div key={f.id} style={{ marginBottom: 8 }}>
                  <b>{f.name}</b>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>{f.sourceTitle}：{f.sourceQuote}</div>
                </div>
              ))}
              <p style={{ fontSize: 12, opacity: 0.65 }}>{data.timePolicy?.note}</p>
            </div>
          </details>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
        仅供传统文化娱乐参考，不构成任何医疗、法律、金融或人生决策建议。板块：liuren（东八区民用时，未做真太阳时修正）。
      </p>
    </main>
  );
}
