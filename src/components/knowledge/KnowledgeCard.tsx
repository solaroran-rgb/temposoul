/**
 * C9-知识库：列表卡片组件（本地侧补交：C 交付清单缺该组件）
 */
import type { ArticleMeta } from '../../data/knowledge/schema';

const CATEGORY_LABEL: Partial<Record<ArticleMeta['category'], string>> = {
  wuxing: '五行',
  ganzhi: '天干地支',
  shishen: '十神',
  paipan: '排盘基础',
  shensha: '神煞',
  dayun: '大运流年',
  boundary: '边界与理性',
};

export function KnowledgeCard({ data }: { data: ArticleMeta }) {
  return (
    <li className="knowledge-card">
      <a className="knowledge-card__link" href={`/knowledge/${data.slug}`}>
        <span className="knowledge-card__cat">
          {CATEGORY_LABEL[data.category] ?? data.category}
        </span>
        <span className="knowledge-card__title">{data.title}</span>
        <span className="knowledge-card__desc">{data.metaDescription}</span>
        <span className="knowledge-card__meta">
          {data.confidence} · {data.readingMinutes} 分钟
          {!data.ready && <em className="knowledge-card__wip">内容整理中</em>}
        </span>
      </a>
    </li>
  );
}
