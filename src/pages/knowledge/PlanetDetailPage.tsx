import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planetsData, type KnowledgeArticle, type ContentBlock } from '@/data/knowledge/planets';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { trackPageView } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

function RenderBlock({ block }: { block: ContentBlock }) {
 switch (block.kind) {
 case 'paragraph':
 return <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#d1d5db', marginBottom: '16px' }}>{block.text}</p>;
 case 'list':
 return (
 <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>20 {block.items.map((item, i) => <li key={i} style={{ fontSize: '15px', lineHeight: '1.7', color: '#d1d5db', marginBottom: '8px' }}>{item}</li>)}
 </ul>
 );
 case 'callout':
 const colors = { boundary: '#f59e0b', info: '#3b82f6', warning: '#ef4444' };
 return (
 <div style={{ margin: '16px 0', padding: '12px 16px', background: '#2d2d2d', borderRadius: '8px', borderLeft: `4px solid ${colors[block.tone]}` }}>27 <p style={{ margin: 0, fontSize: '14px', color: '#e5e7eb' }}>{block.text}</p>
 </div>
 );
 default:
 return null;
 }
}

export default function PlanetDetailPage() {
 const { slug } = useParams<{ slug: string }>();
 const [state, setState] = useState<PageState>('loading');
 const [article, setArticle] = useState<KnowledgeArticle | null>(null);

 useEffect(() => {
 const found = planetsData.find(a => a.slug === slug);
 if (found) {
 setArticle(found);
 setState('ok');
 trackPageView(`/knowledge/planets/${slug}`);
 } else {
 setState('ok-empty');
 }
 }, [slug]);

 if (state === 'loading') {
 return (
 <div className="page-container">
 <PageTopbar title="加载中..." onBack={() => history.back()} />
 <div className="skeleton" style={{ padding: '16px' }}>
 <div className="skeleton-line" style={{ height: '24px', width: '80%', marginBottom: '16px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '100%', marginBottom: '8px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '90%' }}></div>
 </div>
 </div>
 );
 }

 if (state === 'ok-empty' || !article) {
 return (
 <div className="page-container">67 <PageTopbar title="未找到词条" onBack={() => history.back()} />
 <div className="ok-empty" style={{ padding: '40px', textAlign: 'center', color: '#a3a3a3' }}>
 未找到相关的百科词条。
 </div>
 </div>
 );
 }

 return (
 <div className="page-container">77 <PageTopbar title={article.title} onBack={() => history.back()} />

 <article style={{ padding: '16px' }}>
 <h1 style={{ fontSize: '24px', color: '#f3f4f6', marginBottom: '16px' }}>{article.h1}</h1>

 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
 <ConfidenceBadge confidence={article.confidence} />
 <span style={{ fontSize: '12px', color: '#9ca3af' }}>更新于 {article.updatedAt}</span>
 </div>

 {article.sections.map((section, idx) => (
 <section key={idx} style={{ marginBottom: '24px' }}>89 {section.level === 2 ? (
 <h2 style={{ fontSize: '20px', color: '#e5e7eb', marginBottom: '12px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>{section.heading}</h2>
 ) : (
 <h3 style={{ fontSize: '18px', color: '#e5e7eb', marginBottom: '12px' }}>{section.heading}</h3>
 )}
 {section.blocks.map((block, bIdx) => <RenderBlock key={bIdx} block={block} />)}
 </section>
 ))}

 <div style={{ marginTop: '32px', padding: '16px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>99 <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#9ca3af' }}>参考资料</h4>
 <ul style={{ margin: 0, paddingLeft: '20px' }}>101 {article.sources.map((src, i) => (
 <li key={i} style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '4px' }}>103 {src.text} <ConfidenceBadge confidence={src.confidence} />
 </li>
 ))}
 </ul>
 </div>

 {article.relatedSlugs.length > 0 && (
 <div style={{ marginTop: '24px' }}>111 <h4 style={{ fontSize: '16px', color: '#e5e7eb', marginBottom: '12px' }}>关联阅读</h4>
 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
 {article.relatedSlugs.map(s => (
 <Link key={s} to={`/knowledge/planets/${s}`} style={{ padding: '6px 12px', background: '#333', color: '#93c5fd', borderRadius: '16px', fontSize: '13px', textDecoration: 'none' }}>
 {s}
 </Link>
 ))}
 </div>
 </div>
 )}

 <div style={{ marginTop: '24px', padding: '12px', background: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>123 <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{guardText(article.disclaimer)}</p>
 </div>
 </article>

 <div style={{ padding: '24px 16px' }}>128 <PrivacyHint />
 </div>
 </div>
 );
}
