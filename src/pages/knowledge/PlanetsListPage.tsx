import { useState } from 'react';
import { Link } from 'react-router-dom';
import { planetsData } from '@/data/knowledge/planets';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function PlanetsListPage() {
 const [state] = useState<PageState>('ok');
 const [category, setCategory] = useState<'planet' | 'sign'>('planet');

 if (state === 'error' || state === 'degraded') {
 return (
 <div className="page-container">
 <PageTopbar title="行星/星座百科" onBack={() => history.back()} />
 <div className="error-state" style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>数据加载失败，请稍后重试。</div>
 </div>
 );
 }

 if (state === 'loading') {
 return (
 <div className="page-container">
 <PageTopbar title="行星/星座百科" onBack={() => history.back()} />
 <div className="skeleton" style={{ padding: '16px' }}>
 <div className="skeleton-line" style={{ height: '40px', width: '100%', marginBottom: '16px' }}></div>
 <div className="skeleton-line" style={{ height: '100px', width: '100%', marginBottom: '16px' }}></div>
 </div>
 </div>
 );
 }

 const filteredData = planetsData.filter(p => p.category === category);

 return (
 <div className="page-container">39 <PageTopbar title="行星/星座百科" onBack={() => history.back()} />

 <div className="tabs" style={{ display: 'flex', gap: '8px', padding: '16px', borderBottom: '1px solid #333' }}>
 <button
 onClick={() => setCategory('planet')}
 style={{ flex: 1, padding: '10px', background: category === 'planet' ? '#3b82f6' : '#222', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
 >
 行星
 </button>
 <button
 onClick={() => setCategory('sign')}
 style={{ flex: 1, padding: '10px', background: category === 'sign' ? '#3b82f6' : '#222', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
 >
 星座
 </button>
 </div>

 {filteredData.length === 0 ? (
 <div className="ok-empty" style={{ padding: '40px', textAlign: 'center', color: '#a3a3a3' }}>暂无相关百科数据。</div>
 ) : (
 <div className="list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', padding: '16px' }}>60 {filteredData.map(article => (
 <Link
 key={article.slug}
 to={`/knowledge/planets/${article.slug}`}
 style={{ textDecoration: 'none', background: '#1e1e1e', borderRadius: '12px', padding: '16px', border: '1px solid #333', color: '#f3f4f6' }}
 >
 <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>{article.title}</h3>
 <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>68 {article.metaDescription}
 </p>
 </Link>
 ))}
 </div>
 )}

 <div style={{ padding: '24px 16px' }}>76 <PrivacyHint />
 </div>
 </div>
 );
}
