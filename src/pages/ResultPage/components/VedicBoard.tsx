/**
 * 吠陀占星结果板（V3）— 最小可用 + 专业盘面
 * 展示：D1 盘面（北/南印度式切换）· 九曜落位 · 月宿 · Vimshottari 大运 · D9 · Yoga/Dosha
 */
import { memo, useState } from 'react';
import { VedicChart } from '@/components/VedicChart';
import type { VedicData, VedicChartStyle } from '@temposoul/core/vedic';

function fmtDate(ms: number) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export const VedicBoard = memo(function VedicBoard(props: {
  title: string;
  name: string;
  data: VedicData;
}) {
  const { title, name, data } = props;
  const [style, setStyle] = useState<VedicChartStyle>(data.chartLayout?.style ?? 'north');
  const mahas = data.vimshottari?.mahadashas ?? [];
  const yogas = (data.yogas ?? []) as Array<{
    key: string;
    name: string;
    sanskrit: string;
    active: boolean;
    condition: string;
    interpretation: string;
    limitations: string[];
  }>;
  const doshas = (data.doshas ?? []) as Array<{
    key: string;
    name: string;
    sanskrit: string;
    active: boolean;
    severity: string;
    condition: string;
    interpretation: string;
    limitations: string[];
  }>;
  const activeYogas = yogas.filter((y) => y.active);
  const activeDoshas = doshas.filter((d) => d.active);

  return (
    <section className="result-showcase-card vedic-showcase-card">
      <div className="result-showcase-head">
        <div>
          <p className="result-section-kicker">{title}</p>
          <h2>{name}</h2>
        </div>
        <div className="result-chip-row">
          <span className="result-chip">{data.birth.dateTime}</span>
          <span className="result-chip">{data.birth.location}</span>
          <span className="result-chip">Lahiri {data.ayanamsa.degrees.toFixed(4)}°</span>
        </div>
      </div>

      <div className="result-summary-grid">
        <div className="result-stat-card result-stat-card-accent">
          <span>上升 Lagna</span>
          <strong>{data.lagna.formatted}</strong>
          <small>{data.lagna.rashi} · 第 {data.lagna.bhava} 宫</small>
        </div>
        <div className="result-stat-card">
          <span>月亮 Chandra</span>
          <strong>{data.grahas.find((g) => g.name === 'Moon')?.formatted ?? '—'}</strong>
          <small>{data.nakshatra.birthMoon.sanskrit} 第 {data.nakshatra.birthMoon.pada} 拍</small>
        </div>
        <div className="result-stat-card">
          <span>当前大运</span>
          <strong>{mahas[0]?.lordLabel ?? '—'}</strong>
          <small>{mahas[0] ? `${mahas[0].durationYears} 年 · ${fmtDate(mahas[0].startMs)} 起` : '—'}</small>
        </div>
        <div className="result-stat-card">
          <span>Yoga / Dosha</span>
          <strong>{activeYogas.length} / {activeDoshas.length}</strong>
          <small>命中 Yoga / Dosha 条数</small>
        </div>
      </div>

      <div className="vedic-board-layout">
        <div className="result-side-card vedic-chart-shell">
          <div className="result-side-head">
            <h3>D1 本命盘</h3>
            <p>Whole Sign 十二宫；可切换北印度 / 南印度盘式。</p>
          </div>
          <div className="vedic-style-switch">
            <button
              type="button"
              className={style === 'north' ? 'vedic-style-btn is-active' : 'vedic-style-btn'}
              onClick={() => setStyle('north')}
            >
              北印度式
            </button>
            <button
              type="button"
              className={style === 'south' ? 'vedic-style-btn is-active' : 'vedic-style-btn'}
              onClick={() => setStyle('south')}
            >
              南印度式
            </button>
          </div>
          <VedicChart lagna={data.lagna} grahas={data.grahas} style={style} />
        </div>

        <div className="vedic-board-side">
          <div className="result-side-card">
            <div className="result-side-head">
              <h3>九曜落位</h3>
              <p>恒星黄经 · 月宿 · 宫位</p>
            </div>
            <div className="vedic-table-wrap">
              <table className="vedic-table">
                <thead>
                  <tr>
                    <th>星曜</th>
                    <th>落座</th>
                    <th>宫</th>
                    <th>月宿</th>
                    <th>度数</th>
                  </tr>
                </thead>
                <tbody>
                  {data.grahas.map((g) => (
                    <tr key={g.name}>
                      <td>
                        {g.label}
                        {g.retrograde ? <span className="vedic-rx"> ᴿ</span> : null}
                      </td>
                      <td>{g.rashi}</td>
                      <td>{g.bhava}</td>
                      <td>{g.nakshatra} · {g.pada}</td>
                      <td>{g.degreeInRashi.toFixed(2)}°</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-side-card">
            <div className="result-side-head">
              <h3>Vimshottari 大运</h3>
              <p>共 {mahas.length} 运 · 合计 120 年</p>
            </div>
            <ol className="vedic-dasha-list">
              {mahas.map((m) => (
                <li key={m.lord} className="vedic-dasha-item">
                  <span className="vedic-dasha-lord">{m.lordLabel}</span>
                  <span className="vedic-dasha-range">
                    {fmtDate(m.startMs)} → {fmtDate(m.endMs)}
                  </span>
                  <span className="vedic-dasha-years">{m.durationYears} 年</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="vedic-yoga-dosha">
        <div className="result-side-card">
          <div className="result-side-head">
            <h3>Yoga 判定（{activeYogas.length}/{yogas.length}）</h3>
            <p>命中条目含触发条件与局限说明</p>
          </div>
          {activeYogas.length === 0 ? (
            <p className="vedic-empty">本次未命中已实现的 Yoga 条目。</p>
          ) : (
            <ul className="vedic-finding-list">
              {activeYogas.map((y) => (
                <li key={y.key}>
                  <strong>{y.name}</strong>
                  <span className="vedic-finding-sanskrit">{y.sanskrit}</span>
                  <p className="vedic-finding-cond">{y.condition}</p>
                  <p className="vedic-finding-interp">{y.interpretation}</p>
                  {y.limitations?.length ? (
                    <p className="vedic-finding-limit">局限：{y.limitations.join('；')}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="result-side-card">
          <div className="result-side-head">
            <h3>Dosha 判定（{activeDoshas.length}/{doshas.length}）</h3>
            <p>参考视角，非确定性断语</p>
          </div>
          {activeDoshas.length === 0 ? (
            <p className="vedic-empty">本次未命中已实现的 Dosha 条目。</p>
          ) : (
            <ul className="vedic-finding-list">
              {activeDoshas.map((d) => (
                <li key={d.key}>
                  <strong>{d.name}</strong>
                  <span className="vedic-finding-severity">[{d.severity}]</span>
                  <p className="vedic-finding-cond">{d.condition}</p>
                  <p className="vedic-finding-interp">{d.interpretation}</p>
                  {d.limitations?.length ? (
                    <p className="vedic-finding-limit">局限：{d.limitations.join('；')}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {data.yogaDoshaPendingReview?.length ? (
        <div className="result-side-card vedic-pending">
          <div className="result-side-head">
            <h3>待命理顾问终审</h3>
            <p>以下条目尚未自动化，本站不臆造结果</p>
          </div>
          <ul className="vedic-pending-list">
            {data.yogaDoshaPendingReview.map((p) => (
              <li key={p.item}>
                <strong>{p.item}</strong>
                <p>{p.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.vargas?.D9 ? (
        <div className="result-side-card">
          <div className="result-side-head">
            <h3>D9 Navamsa 分盘</h3>
            <p>Parashari Chara 规则 · 每宫 9 分</p>
          </div>
          <div className="vedic-d9-grid">
            {data.vargas.D9.placements.map((p) => (
              <span key={p.name} className="vedic-d9-item">
                {p.label} → {p.rashi}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
});
