/**
 * A 域列表页（通用组件，按 kind 渲染）
 */
import { Link } from 'react-router-dom';
import { KIND_META, type B2Kind } from './registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './b2.css';

export interface B2ListProps {
  kind: B2Kind;
  title?: string;
  desc?: string;
}

export default function B2List({ kind, title, desc }: B2ListProps) {
  const meta = KIND_META[kind];
  const listTitle = title ?? meta.title;
  const listDesc = desc ?? meta.desc;
  useDocumentMeta({ title: listTitle });
  return (
    <div className="b2-page">
      <header className="b2-hero">
        <h1>{listTitle}</h1>
        <p className="b2-desc">{listDesc}</p>
        <p className="b2-note">本页内容为命理文化参考，仅供学习与自我观察，不构成对个人命运的断言。</p>
      </header>
      <div className="b2-grid">
        {meta.records.map((r) => (
          <Link key={r.id} to={r.seo.slug} className="b2-card">
            <h3>{r.seo.title.replace(/详解$/, '')}</h3>
            <p>{r.seo.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
