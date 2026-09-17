import { useState, useMemo } from 'react';
import { crystalsData, CRYSTALS_META } from '@/data/fortune/crystals';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { trackEvent } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';
type FilterTab = 'zodiac' | 'element';

export default function CrystalsPage() {
 const [state] = useState<PageState>('ok');
 const [activeTab, setActiveTab] = useState<FilterTab>('zodiac');
 const [selectedFilter, setSelectedFilter] = useState<string>('all');

 const zodiacList = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
 const elementList = ['火', '土', '风', '水'];

 const filteredCrystals = useMemo(() => {
 if (selectedFilter === 'all') return crystalsData;
 return crystalsData.filter(c =>
 activeTab === 'zodiac' ? c.zodiac.includes(selectedFilter) : c.element.includes(selectedFilter)
 );
 }, [activeTab, selectedFilter]);

 const handleMallClick = (id: string) => {
 trackEvent('crystal_mall_click', { sku_id: id });
 };

 if (state === 'error' || state === 'degraded') {
 return (
 <div className="page-container">35 <PageTopbar title="水晶/宝石开运" onBack={() => history.back()} />
 <div className="error-state" style={{ padding: '40px', textAlign: 'center', color: '#f87171' }}>
 数据加载失败，请稍后重试。
 </div>
 </div>
 );
 }

 if (state === 'loading') {
 return (
 <div className="page-container">
 <PageTopbar title="水晶/宝石开运" onBack={() => history.back()} />
 <div className="skeleton" style={{ padding: '16px' }}>
 <div className="skeleton-line" style={{ height: '24px', width: '60%', marginBottom: '16px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '100%', marginBottom: '8px' }}></div>
 <div className="skeleton-line" style={{ height: '16px', width: '80%' }}></div>
 </div>
 </div>
 );
 }

 return (
 <div className="page-container">58 <PageTopbar title="水晶/宝石开运" onBack={() => history.back()} />

 <div className="callout-boundary" style={{ margin: '16px', padding: '12px', background: '#2d2d2d', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
 <strong style={{ color: '#fbbf24' }}>⚠️ 文化探索提示：</strong>
 <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#a3a3a3' }}>{guardText(CRYSTALS_META.disclaimer)}</p>
 </div>

 <div className="tabs" style={{ display: 'flex', gap: '8px', padding: '0 16px', marginBottom: '16px' }}>66 <button
 className={activeTab === 'zodiac' ? 'tab-active' : ''}
 onClick={() => { setActiveTab('zodiac'); setSelectedFilter('all'); }}
 style={{ padding: '8px 16px', borderRadius: '20px', background: activeTab === 'zodiac' ? '#3b82f6' : '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
 >
 按星座
 </button>
 <button
 className={activeTab === 'element' ? 'tab-active' : ''}
 onClick={() => { setActiveTab('element'); setSelectedFilter('all'); }}
 style={{ padding: '8px 16px', borderRadius: '20px', background: activeTab === 'element' ? '#3b82f6' : '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
 >
 按五行
 </button>
 </div>

 <div className="filter-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 16px', marginBottom: '16px' }}>83 <button
 onClick={() => setSelectedFilter('all')}
 style={{ padding: '6px 12px', borderRadius: '16px', background: selectedFilter === 'all' ? '#10b981' : '#444', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer' }}
 >
 全部
 </button>
 {(activeTab === 'zodiac' ? zodiacList : elementList).map(item => (
 <button
 key={item}
 onClick={() => setSelectedFilter(item)}
 style={{ padding: '6px 12px', borderRadius: '16px', background: selectedFilter === item ? '#10b981' : '#444', color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer' }}
 >
 {item}
 </button>
 ))}
 </div>

 {filteredCrystals.length === 0 ? (
 <div className="ok-empty" style={{ textAlign: 'center', padding: '40px 16px', color: '#a3a3a3' }}>102 暂无匹配的水晶数据。
 </div>
 ) : (
 <div className="crystal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', padding: '0 16px' }}>106 {filteredCrystals.map(crystal => (
 <div key={crystal.id} className="crystal-card" style={{ background: '#1e1e1e', borderRadius: '12px', padding: '16px', border: '1px solid #333' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
 <h3 style={{ margin: 0, fontSize: '18px', color: '#f3f4f6' }}>{crystal.name}</h3>
 <span style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#d1d5db' }}>111 硬度 {crystal.hardness}
 </span>
 </div>
 <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.5', marginBottom: '12px' }}>115 {guardText(crystal.description)}
 </p>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>118 <ConfidenceBadge confidence={crystal.confidence} />
 <button
 onClick={() => handleMallClick(crystal.id)}
 style={{ padding: '6px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
 >
 查看周边
 </button>
 </div>
 </div>
 ))}
 </div>
 )}

 <div style={{ padding: '24px 16px' }}>132 <PrivacyHint />
 </div>
 </div>
 );
}
