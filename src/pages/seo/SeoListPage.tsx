/**
 * 线程 C · SEO 内容列表页
 * 路由：/seo（全部）与 /seo/:topic（按主题过滤，静态主题段优先于详情 :slug）
 */
import { Link } from 'react-router-dom';
import { seoArticles, SEO_TOPIC_META, type SeoArticle, type SeoTopic } from '@/data/content/seo50';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './seo.css';

const TOPIC_ORDER: SeoTopic[] = [
  'bazi',
  'ziwei',
  'tarot',
  'astrology',
  'naming',
  'almanac',
  'zodiac',
  'fengshui',
];

export interface SeoListPageProps {
  topic?: SeoTopic;
}

function ArticleCard({ a }: { a: SeoArticle }) {
  const topic = SEO_TOPIC_META[a.topic];
  return (
    <Link to={`/seo/${a.slug}`} className="seo-card">
      <span className="seo-card-tag">{topic.label}</span>
      <h3>{a.title}</h3>
      <p>{a.summary}</p>
    </Link>
  );
}

export default function SeoListPage({ topic }: SeoListPageProps) {
  const filtered = topic ? seoArticles.filter((a) => a.topic === topic) : seoArticles;
  const heading = topic ? SEO_TOPIC_META[topic].label : 'SEO 命理文化科普';
  const desc = topic
    ? SEO_TOPIC_META[topic].desc
    : '八字、紫微、塔罗、星座、姓名、黄历、生肖、风水——50 篇长尾关键词科普，从民俗文化与心理视角聊命理。';

  useDocumentMeta({ title: `${heading} | 命律 SEO 科普` });

  return (
    <div className="seo-page">
      <header className="seo-hero">
        <h1>{heading}</h1>
        <p className="seo-desc">{desc}</p>
        <p className="seo-note">本页内容仅供娱乐与自我觉察，不构成专业建议；AI 生成待专家审计。</p>
      </header>

      <nav className="seo-topic-nav" aria-label="主题筛选">
        <Link to="/seo" className={!topic ? 'is-active' : ''}>
          全部
        </Link>
        {TOPIC_ORDER.map((t) => (
          <Link key={t} to={SEO_TOPIC_META[t].path} className={topic === t ? 'is-active' : ''}>
            {SEO_TOPIC_META[t].label}
          </Link>
        ))}
      </nav>

      <div className="seo-grid">
        {filtered.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
    </div>
  );
}
