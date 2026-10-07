/**
 * 七语 i18n 接入位（本批仅中文，不要求 7 语）
 * JinkoujuePage —— 金口诀（大六壬金口诀）起课页（三式重盘组）
 *
 * 引擎：@temposoul/core/divination/jinkoujue  generateJinkoujue({ method, number, customDate })
 *   method: time 时间起课 / number 数字起课(1-∞ 归一十二支) / random 随机起课
 * 可视化落地（对照 A6 02 分册 §11 推荐可视化）：
 *   ① 四位纵列塔（人元→贵神→将神→地分），五行色块、空亡打灰、阴阳用位描金
 *   ② 五动/三动标签矩阵（命中动类 chips）
 * 合规：传统文化娱乐参考；引擎异常显示「排盘数据待补」，不编造盘面。
 */
import { useState, type CSSProperties, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateJinkoujue } from '@temposoul/core/divination/jinkoujue';
import { ParamSnapshot, readParam } from '@/lib/m1-snapshot';

type JinkoujueData = ReturnType<typeof generateJinkoujue>;
type Method = 'time' | 'number' | 'random';

const WUXING_COLOR: Record<string, string> = {
  木: '#4C9A6B', 火: '#D9534F', 土: '#C9A86A', 金: '#C9B458', 水: '#4A7BA6',
};

const wrapStyle: CSSProperties = { maxWidth: 860, margin: '0 auto', padding: '28px 20px 64px', color: 'inherit' };
const cardStyle: CSSProperties = {
  border: '1px solid rgba(140,150,180,0.25)', borderRadius: 12,
  padding: '16px 18px', marginBottom: 14, background: 'rgba(255,255,255,0.03)',
};

function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function compute(method: Method, numberStr: string, dateStr: string): { data: JinkoujueData | null; error: string } {
  try {
    const params: { method: Method; number?: number; customDate?: Date } = { method };
    if (method === 'number') {
      const n = Math.trunc(Number(numberStr));
      if (!Number.isInteger(n) || n < 1) throw new Error('数字起课需提供不小于 1 的整数。');
      params.number = n;
    }
    if (method !== 'random') {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) throw new Error('起课时间无效。');
      params.customDate = d;
    }
    return { data: generateJinkoujue(params), error: '' };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) };
  }
}

const METHOD_OPTS: Method[] = ['time', 'number', 'random'];

export default function JinkoujuePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nowStr = toLocalInput(new Date());
  // 修复批次2 P1-①：URL 读初始值（带校验），合法链接直达即复现
  const initMethod = readParam(searchParams, 'method', 'time', (v) =>
    (METHOD_OPTS as string[]).includes(v) ? (v as Method) : null,
  );
  const initNum = readParam(searchParams, 'num', '3');
  const initDate = readParam(searchParams, 'date', nowStr);
  const [method, setMethod] = useState<Method>(initMethod);
  const [numberStr, setNumberStr] = useState<string>(initNum);
  const [dateStr, setDateStr] = useState<string>(initDate);
  const [result, setResult] = useState<{ data: JinkoujueData | null; error: string }>(() =>
    compute(initMethod, initNum, initDate),
  );
  const data = result.data;
  const error = result.error;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setResult(compute(method, numberStr, dateStr));
    // 提交写回 URL：method 恒带；number 仅数字起课；date 仅非随机起课
    const params: Record<string, string> = { method };
    if (method === 'number') params.num = numberStr;
    if (method !== 'random') params.date = dateStr;
    setSearchParams(params, { replace: true });
  }

  // 四位塔：自上而下 人元 → 贵神 → 将神 → 地分
  const tower = data
    ? [data.positions.renYuan, data.positions.guiShen, data.positions.jiangShen, data.positions.diFen]
    : [];

  return (
    <main style={wrapStyle}>
      <style>{`
        .ts-jk-fade { animation: tsJkFade .5s ease both; }
        @keyframes tsJkFade { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
      `}</style>

      <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.6, margin: '0 0 8px' }}>占卜 · 三式</p>
      <h1 style={{ fontSize: 28, margin: '0 0 6px', fontWeight: 700 }}>金口诀 · 起课</h1>
      <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.8, margin: '0 0 18px' }}>
        以地分、将神、贵神、人元四位一体起课，观阴阳发用与五动三动，直断方位与迟速。
      </p>

      <form onSubmit={onSubmit} style={{ ...cardStyle, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13, opacity: 0.8 }}>起课</label>
        <select value={method} onChange={(e) => setMethod(e.target.value as Method)}
          style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: 'inherit', fontSize: 14 }}>
          <option value="time">时间起课</option>
          <option value="number">数字起课</option>
          <option value="random">随机起课</option>
        </select>
        {method === 'number' && (
          <>
            <label style={{ fontSize: 13, opacity: 0.8 }}>数字</label>
            <input type="number" min={1} value={numberStr} onChange={(e) => setNumberStr(e.target.value)}
              style={{ width: 90, padding: '6px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: 'inherit', border: '1px solid rgba(140,150,180,0.4)' }} />
          </>
        )}
        {method !== 'random' && (
          <>
            <label style={{ fontSize: 13, opacity: 0.8 }}>占时</label>
            <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 8, fontSize: 14, background: 'rgba(0,0,0,0.25)', color: 'inherit', border: '1px solid rgba(140,150,180,0.4)' }} />
          </>
        )}
        <button type="submit" style={{ padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, background: '#BB9863', color: '#1E2126', border: 'none', fontWeight: 600 }}>
          起金口诀课
        </button>
      </form>

      {error && (
        <div style={{ ...cardStyle, borderColor: 'rgba(226,78,76,0.5)' }} role="alert">
          <p style={{ margin: 0, fontSize: 14, color: '#E24E4C' }}>排盘数据待补：{error}</p>
        </div>
      )}

      {data && !error && (
        <div className="ts-jk-fade">
          {/* 参数快照 + 引擎版本角标（修复批次2 P1-①：可复现 URL / 引擎 semver） */}
          <ParamSnapshot
            params={{
              method,
              ...(method === 'number' ? { num: numberStr } : {}),
              ...(method !== 'random' ? { date: dateStr } : {}),
              ...(method === 'random' ? { note: '*随机起课*' } : {}),
            }}
            engineName="金口诀 · 四位起课"
          />

          {/* 头部卡 */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 14 }}>
              <span>{data.methodLabel}</span>
              <span>{data.dayNight}</span>
              <span>月将 <b>{data.monthLeader}</b></span>
              <span>贵人 <b>{data.noblemanBranch}</b></span>
              <span>地分 <b>{data.diFenBranch}</b></span>
              <span>旬空 <b>{(data.xunKong || []).join('、') || '无'}</b></span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, opacity: 0.8, marginTop: 8 }}>
              <span>年 {data.ganzhi.year}</span><span>月 {data.ganzhi.month}</span>
              <span>日 {data.ganzhi.day}</span><span>时 {data.ganzhi.hour}</span>
            </div>
          </div>

          {/* ① 四位塔 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>四位（{data.yinYangUse.pattern}，{data.yinYangUse.rule}）</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {tower.map((p) => {
                const isUse = p.name === data.yinYangUse.usePosition;
                return (
                  <div key={p.name}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                      border: isUse ? '1.5px solid #EECB0D' : '1px solid rgba(140,150,180,0.25)',
                      background: isUse ? 'rgba(238,203,13,0.08)' : 'rgba(255,255,255,0.02)',
                      opacity: p.isVoid ? 0.55 : 1,
                    }}>
                    <span style={{ width: 44, fontSize: 13, opacity: 0.7 }}>{p.name}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {p.stem || ''}{p.branch}
                    </span>
                    {p.god && <span style={{ fontSize: 13, color: '#BB9863' }}>乘{p.god}</span>}
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: WUXING_COLOR[p.element] || '#999' }} title={`${p.element}`} />
                    <span style={{ fontSize: 12, opacity: 0.7 }}>{p.element}·{p.yinYang}·{p.seasonState}</span>
                    {p.isVoid && <span style={{ fontSize: 12, color: '#999' }}>空亡</span>}
                    {isUse && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#EECB0D', fontWeight: 600 }}>▲ 用</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ② 五动三动 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>动类</h3>
            {data.movements.length ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {data.movements.map((m) => (
                  <span key={m.name} title={`${m.trigger}（${m.source}）`}
                    style={{
                      padding: '4px 10px', borderRadius: 999, fontSize: 12.5,
                      border: m.category === '五动' ? '1px solid rgba(226,78,76,0.5)' : '1px solid rgba(76,154,107,0.5)',
                      color: m.category === '五动' ? '#E24E4C' : '#4C9A6B',
                    }}>
                    {m.category}·{m.name}（{m.from}→{m.to}·{m.relation}）
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>未触发五动或三动。</p>
            )}
          </div>

          {/* 断语 + 应期 */}
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>断语</h3>
            <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.8, opacity: 0.9 }}>{data.mainLine}</p>
            {data.yingQi && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>应期方向（用位：{data.yingQi.usePosition}）</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, opacity: 0.8, lineHeight: 1.8 }}>
                  {data.yingQi.clues.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* 证据折叠 */}
          <details style={cardStyle}>
            <summary style={{ cursor: 'pointer', fontSize: 14, opacity: 0.85 }}>起课口径与证据链</summary>
            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, opacity: 0.85 }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>{data.calculation.diFenNote}</li>
                <li>{data.calculation.noblemanRule}（{data.calculation.noblemanDirection}）</li>
                <li>{data.calculation.monthLeaderRule}；{data.calculation.yuanDunRule}</li>
              </ul>
              <p style={{ opacity: 0.7, marginTop: 8 }}>
                四位生克：贵→将 {data.relations.guiToJiang}；贵→人 {data.relations.guiToRen}；
                将→地 {data.relations.jiangToDi}；人→地 {data.relations.renToDi}；贵→地 {data.relations.guiToDi}。
              </p>
            </div>
          </details>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
        仅供传统文化娱乐参考，不构成任何医疗、法律、金融或人生决策建议。板块：jinkoujue。
      </p>
    </main>
  );
}
