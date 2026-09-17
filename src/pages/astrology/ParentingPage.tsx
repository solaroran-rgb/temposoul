import { useState } from 'react';
import { parentingData } from '@/data/wiki/astro-wiki';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function ParentingPage() {
 const [state] = useState<PageState>('ok');
 const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

 const selectedArticle = selectedSlug ? parentingData.find(a => a.slug === selectedSlug) : null;

 if (state === 'error' || state === 'degraded') {
 return (
 <div className="page-container">
 <PageTopbar title="育儿占星" onBack={() => history.back()} />
 <div className="error-state" style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>数据加载失败，请稍后重试。</div>
 </div>
 );
 }

 if (state === 'loading') {
 return (
 <div className="page-container">
 <PageTopbar title="育儿占星" onBack={() => history.back()} />
 <div className="skeleton" style={{ padding: '16px' }}>
 <div className="skeleton-line" style={{ height: '60px', width: '100%', marginBottom: '16px' }}></div>
 <div className="skeleton-line" style={{ height: '100px', width: '100%' }}></div>
 </div>
 </div>
 );
 }

 return (
 <div className="page-container">40 <PageTopbar title="育儿占星" onBack={() => history.back()} />

 <div style={{ margin: '16px', padding: '16px', background: '#451a1a', borderRadius: '12px', border: '1px solid #7f1d1d' }}>
 <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#fca5a5' }}>⚠️ 科学育儿优先提示</h3>
 <p style={{ margin: 0, fontSize: '14px', color: '#fecaca', lineHeight: '1.5' }}>45 {guardText('星象仅供性格探索参考，请勿给孩子贴标签。每个儿童都是独特的个体，科学育儿与无条件的爱才是成长的核心。')}
 </p>
 </div>

 {!selectedArticle ? (
 <div className="article-list" style={{ padding: '0 16px' }}>51 {parentingData.map(article => (
 <div
 key={article.slug}
 onClick={() => setSelectedSlug(article.slug)}
 style={{ background: '#1e1e1e', borderRadius: '12px', padding: '16px', border: '1px solid #333', marginBottom: '12px', cursor: 'pointer' }}
 >
 <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#f3f4f6' }}>{article.title}</h3>
 <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>{article.metaDescription}</p>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <ConfidenceBadge confidence={article.confidence} />
 <span style={{ fontSize: '12px', color: '#10b981', background: '#064e3b', padding: '2px 8px', borderRadius: '12px' }}>62 {article.scientific_parenting_tips.length} 条科学建议
 </span>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <article style={{ padding: '0 16px 16px' }}>70 <button
 onClick={() => setSelectedSlug(null)}
 style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '14px', padding: '8px 0', marginBottom: '16px', cursor: 'pointer' }}
 >
 ← 返回列表
 </button>

 <h1 style={{ fontSize: '22px', color: '#f3f4f6', marginBottom: '16px' }}>{selectedArticle.title}</h1>

 <div style={{ margin: '16px 0 24px', padding: '16px', background: '#064e3b', borderRadius: '12px', border: '1px solid #10b981' }}>80 <h4 style={{ margin: '0 0 12px', fontSize: '16px', color: '#6ee7b7' }}>🔬 核心科学育儿建议</h4>
 <ul style={{ margin: 0, paddingLeft: '20px' }}>82 {selectedArticle.scientific_parenting_tips.map((tip, i) => (
 <li key={i} style={{ fontSize: '15px', lineHeight: '1.6', color: '#d1fae5', marginBottom: '8px' }}>{tip}</li>
 ))}
 </ul>
 </div>

 <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#d1d5db', marginBottom: '24px' }}>89 <p>{selectedArticle.content}</p>
 </div>

 <div style={{ marginTop: '24px', padding: '12px', background: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>93 <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{guardText(selectedArticle.disclaimer)}</p>
 </div>
 </article>
 )}

 <div style={{ padding: '24px 16px' }}>99 <PrivacyHint />
 </div>
 </div>
 );
}
