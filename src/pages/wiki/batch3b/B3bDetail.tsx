/**
 * 批 3b-B 通用详情页（按 kind + 当前 pathname 精确匹配 detailPath）
 */
import { Link, Navigate, useLocation } from 'react-router-dom';
import { B3B_KIND_META, type B3bKind } from './registry';
import { bRecords } from '@/data/content/b/b.registry';
import type { BDomainRecord } from '@/data/content/b/types';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './b3b.css';

export interface B3bDetailProps {
  kind: B3bKind;
}

function GemBody({ r }: { r: Extract<BDomainRecord, { module: 'crystal' }> }) {
  const d = r.data;
  return (
    <>
      <section className="b3b-section">
        <span className="b3b-swatch" style={{ background: d.hex_color }} />
        <strong>{d.name_zh}</strong>
        <span>莫氏硬度 {d.mohs_hardness}</span>
      </section>
      <section className="b3b-section">
        <h2>文化寓意</h2>
        <p>{d.cultural_meaning}</p>
      </section>
      <section className="b3b-section">
        <h2>审美场景</h2>
        <p>{d.aesthetic_scenario}</p>
      </section>
      <section className="b3b-section">
        <h2>养护建议</h2>
        <p>{d.care_guide}</p>
      </section>
    </>
  );
}

function PalmBody({ r }: { r: Extract<BDomainRecord, { module: 'palmistry' }> }) {
  const d = r.data;
  return (
    <section className="b3b-section">
      <h2>常见形态释义</h2>
      <ul>
        {d.shape_templates.map((s) => (
          <li key={s.shape}>
            <strong>{s.shape}：</strong>
            {s.interpretation}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TermBody({ r }: { r: Extract<BDomainRecord, { module: 'astrology_term' }> }) {
  const d = r.data;
  return (
    <>
      <section className="b3b-section">
        <p>{d.plain_interpretation}</p>
      </section>
      <section className="b3b-section">
        <ul>
          <li>
            <strong>心理功能：</strong>
            {d.psychological_function}
          </li>
          <li>
            <strong>阴影面：</strong>
            {d.shadow_trait}
          </li>
          <li>
            <strong>防御机制：</strong>
            {d.defense_mechanism}
          </li>
          {d.related_zodiacs.length > 0 && (
            <li>
              <strong>关联星座：</strong>
              {d.related_zodiacs.join('、')}
            </li>
          )}
        </ul>
      </section>
    </>
  );
}

function PodcastBody({ r }: { r: Extract<BDomainRecord, { module: 'podcast' }> }) {
  const d = r.data;
  const min = Math.floor(d.duration_sec / 60);
  return (
    <>
      <section className="b3b-section">
        <p>
          时长 {min} 分钟 · 发布 {d.pub_date}
        </p>
        <p>{d.description_html.replace(/<[^>]+>/g, '')}</p>
      </section>
      <section className="b3b-section">
        <h2>节目大纲</h2>
        <ul>
          {d.script_sop_blocks.map((b) => (
            <li key={b.timecode}>
              <strong>
                {b.timecode} {b.segment}：
              </strong>
              {b.content}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function FortuneBody({ r }: { r: Extract<BDomainRecord, { module: 'fortune' }> }) {
  const d = r.data;
  return (
    <>
      <section className="b3b-section">
        <p>
          节奏标签：{d.vibe_index} · {d.publish_date.slice(0, 10)}
        </p>
        {d.content_blocks.map((b, i) =>
          b.type === 'text' ? (
            <p key={i}>{b.content}</p>
          ) : (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          ),
        )}
      </section>
      <section className="b3b-section">
        <h2>行动参考</h2>
        <p>
          <strong>建议做：</strong>
          {d.action_list.do.join('、')}
        </p>
        <p>
          <strong>建议避免：</strong>
          {d.action_list.dont.join('、')}
        </p>
      </section>
    </>
  );
}

function ExpertBody({ r }: { r: Extract<BDomainRecord, { module: 'expert' }> }) {
  const d = r.data;
  return (
    <>
      <section className="b3b-section">
        <p>
          身份：{d.identity} · 审核状态：{d.audit_status} · 警告次数：{d.strike_count}
        </p>
      </section>
      <section className="b3b-section">
        <h2>资质</h2>
        <ul>
          {d.certifications.map((c) => (
            <li key={c.id}>
              {c.type} {c.id}（{c.issuer}）
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function RecordBody({ r }: { r: BDomainRecord }) {
  switch (r.module) {
    case 'crystal':
      return <GemBody r={r} />;
    case 'palmistry':
      return <PalmBody r={r} />;
    case 'astrology_term':
      return <TermBody r={r} />;
    case 'podcast':
      return <PodcastBody r={r} />;
    case 'fortune':
      return <FortuneBody r={r} />;
    case 'expert':
      return <ExpertBody r={r} />;
  }
}

export default function B3bDetail({ kind }: B3bDetailProps) {
  const location = useLocation();
  const meta = B3B_KIND_META[kind];
  const record = bRecords.find((r) => r.detailPath === location.pathname);

  useDocumentMeta({ title: record?.title ?? meta.title });

  if (!record) return <Navigate to={meta.listPath} replace />;

  return (
    <div className="b3b-page">
      <nav className="b3b-crumb">
        <Link to="/">首页</Link> / <Link to={meta.listPath}>{meta.title}</Link> /{' '}
        <span>{record.title}</span>
      </nav>
      <article className="b3b-article">
        <header>
          <h1>{record.title}</h1>
          <p className="b3b-desc">{record.summary}</p>
        </header>
        <RecordBody r={record} />
        <footer className="b3b-meta">
          <p>本内容为民俗文化与心理视角参考，不构成吉凶断言与决策依据。</p>
        </footer>
      </article>
    </div>
  );
}
