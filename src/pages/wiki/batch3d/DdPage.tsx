/**
 * DdPage：D 域（起名与商业变现）通用页面渲染器
 * 按 pageId 查注册表，渲染 SEO + 合规声明 + 按 envelope.id 分 payload 渲染 + 商业 CTA
 */
import { Navigate } from 'react-router-dom';
import { DD_PAGES } from './registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './dd.css';

// 各 payload 类型收窄用（与数据文件保持一致）
import type { EnglishNamePayload } from '@/data/content/naming/english-name.data';
import type { BrandNamingPayload } from '@/data/content/naming/brand-naming.data';
import type { ArtisanalNamingPayload } from '@/data/content/naming/artisanal-naming.data';
import type { NameConsultantPayload } from '@/data/content/naming/name-consultant.data';
import type { NamePopularityPayload } from '@/data/content/naming/name-popularity.data';
import type { RhythmCalendarPayload } from '@/data/content/naming/rhythm-calendar.data';
import type { LightFunCommercialEnvelope } from '@/data/content/naming/types';
import type { SyndicatePayload } from '@/data/content/naming/creator-syndicate.data';

const HEAT_LABEL: Record<string, string> = {
  extreme_hot: '极热',
  very_hot: '很热',
  hot: '热门',
  warm: '偏暖',
  normal: '常规',
};

function PayloadView({ envelope }: { envelope: (typeof DD_PAGES)[string]['envelope'] }) {
  const id = envelope.id;
  const p = envelope.payload;

  if (id === 'english-name-persona') {
    const d = p as EnglishNamePayload;
    return (
      <section className="dd-block">
        <h2>测试题（{d.questions.length} 题）</h2>
        <ol className="dd-qlist">
          {d.questions.map((q) => (
            <li key={q.id}>
              <strong>[{q.axis === 'outer' ? '外显' : '内在'}]</strong> {q.text}
              <ul className="dd-opts">
                {q.opts.map((o) => (
                  <li key={o.id}>{o.text}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <h2>推荐英文名（{d.recommendations.length} 个）</h2>
        <div className="dd-cardgrid">
          {d.recommendations.map((r) => (
            <div key={r.name} className="dd-minicard">
              <h3>
                {r.name} <span className="dd-ipa">{r.pronunciation_ipa}</span>
              </h3>
              <p>
                {r.etymology} · {r.phonetic_feature}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (id === 'brand-naming-engine') {
    const d = p as BrandNamingPayload;
    return (
      <section className="dd-block">
        <h2>命名案例（{d.cases.length} 个）</h2>
        {d.cases.map((c) => (
          <div key={c.case_id} className="dd-card">
            <h3>
              {c.industry} · {c.positioning}
            </h3>
            <table className="dd-table">
              <thead>
                <tr>
                  <th>候选名</th>
                  <th>拼音</th>
                  <th>语义</th>
                  <th>类别</th>
                  <th>可注册</th>
                </tr>
              </thead>
              <tbody>
                {c.candidates.map((n) => (
                  <tr key={n.name}>
                    <td>{n.name}</td>
                    <td>{n.pinyin}</td>
                    <td>{n.semantic}</td>
                    <td>{n.trademark_class}</td>
                    <td>{n.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="dd-note">{c.reasoning}</p>
          </div>
        ))}
        <h2>方法论资产</h2>
        {d.methodology_assets.map((a) => (
          <div key={a.asset_id} className="dd-card">
            <h3>{a.title}</h3>
            <p>{a.summary}</p>
            <ul>
              {a.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    );
  }

  if (id === 'artisanal-naming') {
    const d = p as ArtisanalNamingPayload;
    return (
      <section className="dd-block">
        <h2>起名用字（{d.characters.length} 字）</h2>
        <div className="dd-cardgrid">
          {d.characters.map((c, i) => (
            <div key={`${c.character}-${i}`} className="dd-charcard">
              <span className="dd-bigchar">{c.character}</span>
              <p>
                {c.pinyin} · {d.categories[c.psychological_category]}
              </p>
              <p className="dd-note">
                {c.psychological_suggestion} · 康熙{c.kangxi_strokes}画 · 出《{c.source_reference}》
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (id === 'senior-name-consultant') {
    const d = p as NameConsultantPayload;
    return (
      <section className="dd-block">
        <h2>示范解读报告（{d.sample_report.sample_name}）</h2>
        {d.sample_report.dimensions.map((dim, i) => (
          <div key={i} className="dd-card">
            <h3>{dim.dimension}</h3>
            <p>{dim.reading}</p>
            <p className="dd-note">{dim.note}</p>
          </div>
        ))}
        <h2>咨询流程状态机</h2>
        <p>状态：{d.state_machine.states.join(' → ')}</p>
        <ul>
          {d.state_machine.transitions.map((t, i) => (
            <li key={i}>
              {t.from} → {t.to}（触发：{t.trigger}；动作：{t.action}）
            </li>
          ))}
        </ul>
        <h2>服务原则</h2>
        <ul>
          {d.service_principles.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (id === 'name-popularity-trends') {
    const d = p as NamePopularityPayload;
    return (
      <section className="dd-block">
        <h2>官方轨热度榜（2022）</h2>
        {d.official_track.map((track) => (
          <div key={track.gender} className="dd-card">
            <h3>
              {track.gender === 'male' ? '男宝' : '女宝'} Top{track.rankings.length}
            </h3>
            <ol className="dd-rank">
              {track.rankings.map((r) => (
                <li key={`${track.gender}-${r.rank}`}>
                  {r.rank}. {r.name}{' '}
                  <span className="dd-heat">{HEAT_LABEL[r.heat_zone] ?? r.heat_zone}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
        <h2>2024 趋势字热区</h2>
        <div className="dd-cardgrid">
          {Object.entries(d.trend_track.heat_zones).map(([zone, chars]) => (
            <div key={zone} className="dd-minicard">
              <h3>{HEAT_LABEL[zone] ?? zone}</h3>
              <p>{chars.join('、')}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (id === 'life-rhythm-calendar') {
    const d = p as RhythmCalendarPayload;
    const transitions = d.days.filter((day) => day.type === 'transition');
    return (
      <section className="dd-block">
        <h2>
          {d.year} 年节气交接（{transitions.length} 个）
        </h2>
        <p className="dd-note">全年 {d.days.length} 天节律数据已生成，下表为 24 节气交接日参考。</p>
        <table className="dd-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>节气</th>
              <th>交接时间</th>
              <th>物候</th>
              <th>五行</th>
            </tr>
          </thead>
          <tbody>
            {transitions.map((t) => (
              <tr key={t.date}>
                <td>{t.date}</td>
                <td>{t.solar_term}</td>
                <td>{t.exact_transition_time?.slice(5, 16)}</td>
                <td>{t.phenology}</td>
                <td>{t.type === 'transition' ? '交接' : '平气'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  if (id === 'creator-syndicate') {
    const d = p as SyndicatePayload;
    const env = envelope as LightFunCommercialEnvelope<unknown>;
    return (
      <section className="dd-block">
        <h2>分润模型</h2>
        {d.models.map((m) => (
          <div key={m.id} className="dd-card">
            <h3>
              {m.id.toUpperCase()} · 基础 {Math.round(m.base_rate * 100)}%
            </h3>
            <ul>
              {m.tiers.map((t, i) => (
                <li key={i}>
                  门槛 {t.threshold} → 费率 {t.rate}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <h2>合规红线</h2>
        {d.compliance_rules.map((r) => (
          <div key={r.id} className="dd-card">
            <p>{r.text}</p>
            <p className="dd-note">处罚：{r.penalty}</p>
          </div>
        ))}
        <h2>反作弊规则</h2>
        <ul>
          {d.anti_fraud_rules.map((r) => (
            <li key={r.rule_id}>
              {r.rule_id}：{r.description}（{r.action}）
            </li>
          ))}
        </ul>
        <h2>合规素材</h2>
        <ul>
          {d.assets.map((a) => (
            <li key={a.asset_id}>
              {a.asset_id}（{a.type}）— {a.required_disclosure}
            </li>
          ))}
        </ul>
        <p className="dd-cta">
          <a className="dd-btn" href={env.monetization.cta.action}>
            {env.monetization.cta.text}
          </a>
        </p>
      </section>
    );
  }

  return <p className="dd-note">该内容正在建设中。</p>;
}

export default function DdPage({ pageId }: { pageId: string }) {
  const meta = DD_PAGES[pageId];
  useDocumentMeta({ title: meta?.envelope.seo.title ?? '命律' });

  if (!meta) return <Navigate to="/" replace />;

  const isCommercial = meta.envelope.kind === 'lightfun-commercial';

  return (
    <div className="dd-page">
      <header className="dd-hero">
        <h1>{meta.envelope.seo.title}</h1>
        <p className="dd-desc">{meta.envelope.seo.description}</p>
        <p className="dd-note">
          本页内容为命理与命名文化参考，仅供学习与自我观察，不构成对个人命运的断言。
          {isCommercial ? ' 本页含商业推广信息，请理性判断。' : ''}
        </p>
      </header>
      <PayloadView envelope={meta.envelope} />
      <footer className="dd-footer">
        <p>
          内容版本 v{meta.envelope.metadata.version} · 更新于{' '}
          {meta.envelope.metadata.updated_at.slice(0, 10)}
        </p>
      </footer>
    </div>
  );
}
