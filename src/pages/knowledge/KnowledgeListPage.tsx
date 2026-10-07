/**

* C9-终版：知识库列表 /knowledge
* 修复：只读 manifest（不再 import 正文），构建不再因缺文件失败
  */
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { PageTopbar } from '../../components/PageTopbar';
import { KnowledgeCard } from '../../components/knowledge/KnowledgeCard';
import { listMeta, toSearchItems } from '../../data/knowledge/registry';
import type { KnowledgeCategory } from '../../data/knowledge/schema';
import { trackPageView } from '../../lib/analytics';

const CATEGORIES: (KnowledgeCategory | 'all')[] = [
  'all',
  'wuxing',
  'ganzhi',
  'shishen',
  'paipan',
  'shensha',
  'dayun',
  'boundary',
  'solar-terms',
  'zodiac-culture',
  'fengshui',
  // T-10 回炉新增
  'sanshi',
  'divination',
];
const CATEGORY_LABEL: Record<KnowledgeCategory | 'all', string> = {
  all: '全部',
  wuxing: '五行',
  ganzhi: '天干地支',
  shishen: '十神',
  paipan: '排盘基础',
  shensha: '神煞',
  dayun: '大运流年',
  boundary: '边界与理性',
  'solar-terms': '二十四节气',
  'zodiac-culture': '生肖文化',
  fengshui: '风水',
  sanshi: '三式·术数',
  divination: '占卜',
};

export function KnowledgeListPage({
  initialCategory,
}: { initialCategory?: KnowledgeCategory } = {}): React.ReactElement {
  const nav = useNavigate();
  const [category, setCategory] = useState<KnowledgeCategory | 'all'>(initialCategory ?? 'all');
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    void trackPageView('/knowledge');
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(toSearchItems(), {
        keys: ['title', 'summary', 'keywords'],
        threshold: 0.35,
      }),
    [],
  );

  const cards = useMemo(() => {
    let base = listMeta(category === 'all' ? undefined : category);
    if (query.trim()) {
      const hits = new Set(fuse.search(query.trim()).map((r) => r.item.id));
      base = base.filter((m) => hits.has(m.slug));
    }
    return base;
  }, [category, query, fuse]);

  return (
    <>
      <PageTopbar
        title="八字知识库"
        onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
      />
      <main className="knowledge-list">
        <p className="knowledge-list__intro">
          理性命理 + 民俗文化双标注：每篇标明哪些是可核验的结构性事实，哪些是传统文化解读。
        </p>
        <div className="knowledge-list__filters" role="group" aria-label="分类筛选">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`knowledge-list__chip ${category === c ? 'knowledge-list__chip--active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
        <label className="knowledge-list__search">
          <span className="knowledge-list__search-label">搜索文章</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="如：五行、十神、桃花"
          />
        </label>
        {cards.length === 0 ? (
          <p className="knowledge-list__empty">未找到相关文章，换个关键词试试。</p>
        ) : (
          <ul className="knowledge-list__grid">
            {cards.map((m) => (
              <KnowledgeCard key={m.slug} data={m} />
            ))}
          </ul>
        )}
        <BoardTermIndex />
      </main>
    </>
  );
}

/** T-10 回炉 · 板块术语速达（15 篇 WP-18 十段词条 ↔ 对应排盘工具的双向反查入口） */
const BOARD_TERMS: { slug: string; title: string; boardLabel: string; tool: string }[] = [
  { slug: 'qizheng-intro', title: '七政四余入门', boardLabel: '七政四余', tool: '/qizheng' },
  { slug: 'taiyi-intro', title: '太乙神数入门', boardLabel: '太乙神数', tool: '/metaphysics/taiyi' },
  { slug: 'huangji-jingshi-intro', title: '皇极经世入门', boardLabel: '皇极经世', tool: '/metaphysics/huangji-jingshi' },
  { slug: 'wuyun-liuqi-intro', title: '五运六气入门', boardLabel: '五运六气', tool: '/metaphysics/wuyun-liuqi' },
  { slug: 'qimen-intro', title: '奇门遁甲入门', boardLabel: '奇门遁甲', tool: '/divination/qimen' },
  { slug: 'liuyao-intro', title: '六爻入门', boardLabel: '六爻', tool: '/divination/liuyao' },
  { slug: 'meihua-intro', title: '梅花易数入门', boardLabel: '梅花易数', tool: '/divination/meihua' },
  { slug: 'xiaoliuren-intro', title: '小六壬入门', boardLabel: '小六壬', tool: '/divination/xiaoliuren' },
  { slug: 'jinkoujue-intro', title: '金口诀入门', boardLabel: '金口诀', tool: '/divination/jinkoujue' },
  { slug: 'liuren-intro', title: '大六壬入门', boardLabel: '大六壬', tool: '/divination/liuren' },
  { slug: 'lenormand-intro', title: '雷诺曼牌入门', boardLabel: '雷诺曼', tool: '/divination/lenormand' },
  { slug: 'ssgw-intro', title: '三山国王灵签入门', boardLabel: '三山国王灵签', tool: '/divination/ssgw' },
  { slug: 'bazhai-intro', title: '八宅入门', boardLabel: '八宅', tool: '/fengshui/bazhai' },
  { slug: 'xuankong-intro', title: '玄空飞星入门', boardLabel: '玄空飞星', tool: '/fengshui/xuankong' },
  { slug: 'residential-intro', title: '住宅风水入门', boardLabel: '住宅风水', tool: '/fengshui/residential' },
];

function BoardTermIndex(): React.ReactElement {
  const nav = useNavigate();
  return (
    <section
      style={{
        marginTop: 24,
        padding: '14px 16px',
        borderRadius: 12,
        border: '1px solid rgba(140,150,180,0.25)',
        background: 'rgba(255,255,255,0.03)',
      }}
      aria-label="板块术语速达"
    >
      <h2 style={{ margin: '0 0 6px', fontSize: 16 }}>板块术语速达</h2>
      <p style={{ margin: '0 0 10px', fontSize: 13, opacity: 0.75, lineHeight: 1.7 }}>
        15 个板块各一篇十段词条：定义、起法、组合对照、传统口径、常见误解、出处标注与三步自检；每篇附「在工具里看它」直达对应排盘页。
      </p>
      <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {BOARD_TERMS.map((t) => (
          <li key={t.slug} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => nav(`/knowledge/${t.slug}`)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer',
                border: '1px solid rgba(102,201,195,0.5)',
                background: 'transparent',
                color: '#66C9C3',
              }}
            >
              {t.title}
            </button>
            <button
              type="button"
              onClick={() => nav(t.tool)}
              aria-label={`打开${t.boardLabel}排盘`}
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                fontSize: 12,
                cursor: 'pointer',
                border: '1px solid rgba(187,152,99,0.5)',
                background: 'transparent',
                color: '#BB9863',
              }}
            >
              排盘 ↗
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
