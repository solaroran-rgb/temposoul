/**
 * C 域列表页（通用组件，按 kind 渲染）
 */
import { Link } from 'react-router-dom';
import { CC_KIND_META, type CcKind } from './registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './c3c.css';

export interface CcListProps {
  kind: CcKind;
  title?: string;
  desc?: string;
}

export default function CcList({ kind, title, desc }: CcListProps) {
  const meta = CC_KIND_META[kind];
  const listTitle = title ?? meta.title;
  const listDesc = desc ?? meta.desc;
  useDocumentMeta({ title: listTitle });

  // 星历表是工具页，直接展示单条记录内容
  if (kind === 'c_ephemeris') {
    const record = meta.records[0];
    return (
      <div className="c3c-page">
        <header className="c3c-hero">
          <h1>{listTitle}</h1>
          <p className="c3c-desc">{listDesc}</p>
          <p className="c3c-note">
            本页内容为命理文化参考，仅供学习与自我观察，不构成对个人命运的断言。
          </p>
        </header>
        <section className="c3c-body">
          <p>{record.body.plain_reading}</p>
          <div className="c3c-ephemeris-grid">
            {record.extra.kind === 'c_ephemeris' &&
              record.extra.sample_days.map((d) => (
                <div key={d.date} className="c3c-ephemeris-card">
                  <span className="c3c-eph-date">{d.date}</span>
                  <span className="c3c-eph-phase">{d.moon_phase}</span>
                  <span className="c3c-eph-retro">
                    {d.retrograde.length > 0 ? `逆行：${d.retrograde.join('、')}` : '无逆行'}
                  </span>
                </div>
              ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="c3c-page">
      <header className="c3c-hero">
        <h1>{listTitle}</h1>
        <p className="c3c-desc">{listDesc}</p>
        <p className="c3c-note">
          本页内容为命理文化参考，仅供学习与自我观察，不构成对个人命运的断言。
        </p>
      </header>
      <div className="c3c-grid">
        {meta.records.map((r) => (
          <Link key={r.id} to={r.seo.slug} className="c3c-card">
            <h3>{r.seo.title.replace(/(格局详解|导读|占星解读|养育指南|：.*)/, '')}</h3>
            <p>{r.seo.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
