/**
 * 合婚报告库 · 列表页
 * 复用教程域通用样式（.learn-*），渲染报告卡片网格。
 */
import { Link } from 'react-router-dom';
import { HEHUN_REPORTS, HEHUN_DISCLAIMER } from '@/data/content/hehun';
import { useDocumentMeta } from '@/lib/use-document-meta';
import '../../learn/shared/learn.css';

export default function HehunList() {
  useDocumentMeta({ title: '八字合婚报告' });
  const sorted = [...HEHUN_REPORTS].sort((a, b) => a.order - b.order);

  return (
    <div className="learn-page">
      <header className="learn-hero">
        <h1>八字合婚报告</h1>
        <p className="learn-desc">
          七篇文化导读：从合婚框架、日主、配偶宫到日常相处，把传统合婚讲清楚。
        </p>
        <p className="learn-note">{HEHUN_DISCLAIMER}</p>
        <span className="learn-badge">AI 生成 · 待专家审计</span>
      </header>
      <div className="learn-grid">
        {sorted.map((r) => (
          <Link key={r.id} to={r.slug} className="learn-card">
            <span className="learn-card__no">报告 {String(r.order).padStart(2, '0')}</span>
            <h3>{r.title}</h3>
            <p>{r.summary}</p>
            <span className="learn-card__meta">约 {r.readMinutes} 分钟</span>
          </Link>
        ))}
      </div>
      <footer className="learn-meta">
        <p>交互式合盘工具请前往「八字合盘」；本页为合婚话题的文化报告库，不输出配对分数。</p>
      </footer>
    </div>
  );
}
