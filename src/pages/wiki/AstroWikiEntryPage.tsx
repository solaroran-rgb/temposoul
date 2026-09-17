import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { astroWikiRegistry } from '@/data/wiki/astro-wiki';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { trackPageView } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';
import type { AstroWikiEntry } from '@/data/wiki/zodiac';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

function parseWikiLinks(content: string) {
 const regex = /\[([^\]]+)\]\(wiki:\/\/([^\/]+)\/([^)]+)\)/g;
 const parts: (string | { text: string; to: string })[] = [];
 let lastIndex = 0;
 let match;

 while ((match = regex.exec(content)) !== null) {
 if (match.index > lastIndex) {
 parts.push(content.substring(lastIndex, match.index));
 }
 parts.push({ text: match[1], to: `/wiki/astrology/${match[3]}` });
 lastIndex = regex.lastIndex;
 }
 if (lastIndex < content.length) {
 parts.push(content.substring(lastIndex));
 }
 return parts;
}

export default function AstroWikiEntryPage() {
 const { id } = useParams<{ id: string }>();
 const [state, setState] = useState<PageState>('loading');
 const [entry, setEntry] = useState<AstroWikiEntry | null>(null);

 useEffect(() => {
 const found = astroWikiRegistry.find(e => e.id === id);
 if (found) {
 setEntry(found);
 setState('ok');
 trackPageView(`/wiki/astrology/${id}`);
 } else {
 setState('ok-empty');
 }
 }, [id]);

 const contentParts = useMemo(() => entry ? parseWikiLinks(entry.content) : [], [entry]);

 if (state === 'loading') {
 return (
 <div className="page-container">
 <PageTopbar title="加载中..." onBack={() => history.back()} />
 <div className="skeleton" style={{ padding: '16px' }}>
 <div className="skeleton-line" style={{ height: '24px', width: '70%', marginBottom: '16px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '100%', marginBottom: '8px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '85%' }}></div>
 </div>
 </div>
 );
 }

 if (state === 'ok-empty' || !entry) {
 return (
 <div className="page-container">67 <PageTopbar title="未找到词条" onBack={() => history.back()} />
 <div className="ok-empty" style={{ padding: '40px', textAlign: 'center', color: '#a3a3a3' }}>
 未找到相关的百科词条。
 </div>
 </div>
 );
 }

 return (
 <div className="page-container">77 <PageTopbar title={entry.title} onBack={() => history.back()} />

 <article style={{ padding: '16px' }}>
 <h1 style={{ fontSize: '24px', color: '#f3f4f6', marginBottom: '8px' }}>{entry.title}</h1>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
 <span style={{ fontSize: '12px', color: '#9ca3af', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>{entry.category}</span>
 <ConfidenceBadge confidence={entry.confidence} />
 </div>

 <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#d1d5db', marginBottom: '24px' }}>87 {contentParts.map((part, i) =>
 typeof part === 'string' ? <span key={i}>{part}</span> : <Link key={i} to={part.to} style={{ color: '#60a5fa', textDecoration: 'underline' }}>{part.text}</Link>
 )}
 </div>

 <div style={{ marginTop: '32px', padding: '16px', background: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>93 <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#9ca3af' }}>参考资料</h4>
 <ul style={{ margin: 0, paddingLeft: '20px' }}>95 {entry.sources.map((src, i) => (
 <li key={i} style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '4px' }}>97 {src.text} <ConfidenceBadge confidence={src.confidence} />
 </li>
 ))}
 </ul>
 </div>

 <div style={{ marginTop: '24px', padding: '12px', background: '#2d2d2d', borderRadius: '8px', textAlign: 'center' }}>104 <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{guardText(entry.disclaimer)}</p>
 </div>
 </article>

 <div style={{ padding: '24px 16px' }}>109 <PrivacyHint />
 </div>
 </div>
 );
}
