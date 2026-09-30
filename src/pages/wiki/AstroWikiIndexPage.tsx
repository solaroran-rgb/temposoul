import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAstroWiki } from '@/i18n/body/content';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';
type CategoryTab = 'all' | 'planet' | 'sign' | 'house' | 'aspect' | 'concept';

export default function AstroWikiIndexPage() {
 const [state] = useState<PageState>('ok');
 const [search, setSearch] = useState('');
 const [activeTab, setActiveTab] = useState<CategoryTab>('all');

 const filteredEntries = useMemo(() => {
 let result = getAstroWiki();
 if (activeTab !== 'all') {
 result = result.filter(e => e.category === activeTab);
 }
 if (search.trim()) {
 const q = search.trim().toLowerCase();
 result = result.filter(e =>
 e.title.toLowerCase().includes(q) ||
 e.pinyin.includes(q) ||
 e.aliases.some(a => a.toLowerCase().includes(q))
 );
 }
 return result;
 }, [search, activeTab]);

 const tabs: { key: CategoryTab; label: string }[] = [
 { key: 'all', label: '全部' },
 { key: 'planet', label: '行星' },
 { key: 'sign', label: '星座' },
 { key: 'house', label: '宫位' },
 { key: 'aspect', label: '相位' },
 { key: 'concept', label: '概念' },
 ];

 if (state === 'error' || state === 'degraded') {
 return (
 <div className="page-container">
 <PageTopbar title="占星百科" onBack={() => history.back()} />
 <div className="error-state" style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>数据加载失败。</div>
 </div>
 );
 }

 return (
 <div className="page-container">52 <PageTopbar title="占星百科 AstroWiki" onBack={() => history.back()} />

 <div style={{ padding: '16px' }}>
 <input
 type="text"
 placeholder="搜索词条（支持拼音/别名）..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #444', borderRadius: '8px', color: '#f3f4f6', fontSize: '14px', boxSizing: 'border-box' }}
 />
 </div>

 <div className="tabs" style={{ display: 'flex', gap: '8px', padding: '0 16px', overflowX: 'auto', marginBottom: '16px' }}>65 {tabs.map(tab => (
 <button
 key={tab.key}
 onClick={() => setActiveTab(tab.key)}
 style={{ padding: '8px 16px', background: activeTab === tab.key ? '#3b82f6' : '#333', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '13px', whiteSpace: 'nowrap', cursor: 'pointer' }}
 >
 {tab.label}
 </button>
 ))}
 </div>

 {filteredEntries.length === 0 ? (
 <div className="ok-empty" style={{ padding: '40px', textAlign: 'center', color: '#a3a3a3' }}>78 {search ? `未找到与 "${search}" 相关的词条。` : '该分类下暂无词条。'}
 </div>
 ) : (
 <div className="wiki-list" style={{ padding: '0 16px' }}>82 {filteredEntries.map(entry => (
 <Link
 key={entry.id}
 to={`/wiki/astrology/${entry.id}`}
 style={{ display: 'block', textDecoration: 'none', background: '#1e1e1e', borderRadius: '12px', padding: '16px', border: '1px solid #333', marginBottom: '12px' }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
 <h3 style={{ margin: 0, fontSize: '16px', color: '#f3f4f6' }}>{entry.title}</h3>
 <span style={{ fontSize: '12px', color: '#9ca3af', background: '#333', padding: '2px 8px', borderRadius: '4px' }}>{entry.category}</span>
 </div>
 <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>{entry.summary}</p>
 </Link>
 ))}
 </div>
 )}

 <div style={{ padding: '24px 16px' }}>99 <PrivacyHint />
 </div>
 </div>
 );
}
