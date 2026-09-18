/**
 * 入门教程通用列表页组件（按 records 渲染章列表）
 * 由 ziwei / divination 两个课程的薄页面注入数据与文案。
 */
import { Link } from 'react-router-dom';
import type { LessonRecord } from '@/data/content/learn';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './learn.css';

export interface LessonListPageProps {
  records: readonly LessonRecord[];
  courseTitle: string;
  courseDesc: string;
  basePath: string;
}

const LEVEL_LABEL: Record<LessonRecord['level'], string> = {
  beginner: '入门',
  elementary: '进阶',
};

export default function LessonListPage({
  records,
  courseTitle,
  courseDesc,
  basePath,
}: LessonListPageProps) {
  useDocumentMeta({ title: courseTitle });
  const sorted = [...records].sort((a, b) => a.order - b.order);

  return (
    <div className="learn-page">
      <header className="learn-hero">
        <h1>{courseTitle}</h1>
        <p className="learn-desc">{courseDesc}</p>
        <p className="learn-note">仅供娱乐与自我觉察，不构成对个人命运的断言或任何专业建议。</p>
        <span className="learn-badge">AI 生成 · 待专家审计</span>
      </header>
      <div className="learn-grid">
        {sorted.map((r) => (
          <Link key={r.id} to={r.slug} className="learn-card">
            <span className="learn-card__no">第 {r.order} 章</span>
            <h3>{r.title}</h3>
            <p>{r.summary}</p>
            <span className="learn-card__meta">
              {LEVEL_LABEL[r.level]} · 约 {r.readMinutes} 分钟
            </span>
          </Link>
        ))}
      </div>
      <footer className="learn-meta">
        <p>本课程为命理文化入门参考，内容由 AI 生成、待专家审计。路径：{basePath}</p>
      </footer>
    </div>
  );
}
