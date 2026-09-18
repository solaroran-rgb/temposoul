/**
 * 批 3b-B 通用列表页（按 kind 渲染）
 */
import { Link } from 'react-router-dom';
import { B3B_KIND_META, type B3bKind } from './registry';
import { listBByModule } from '@/data/content/b/b.registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './b3b.css';

export interface B3bListProps {
  kind: B3bKind;
  title?: string;
  desc?: string;
}

export default function B3bList({ kind, title, desc }: B3bListProps) {
  const meta = B3B_KIND_META[kind];
  const records = listBByModule(meta.module);
  useDocumentMeta({ title: title ?? meta.title });
  return (
    <div className="b3b-page">
      <header className="b3b-hero">
        <h1>{title ?? meta.title}</h1>
        <p className="b3b-desc">{desc ?? meta.desc}</p>
        <p className="b3b-note">
          本页内容为民俗文化与心理视角参考，仅供学习与自我观察，不构成对个人命运的断言。
        </p>
      </header>
      <div className="b3b-grid">
        {records.map((r) => (
          <Link key={r.id} to={r.detailPath} className="b3b-card">
            <h3>{r.title}</h3>
            <p>{r.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
