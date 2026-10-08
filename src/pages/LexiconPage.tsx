import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { PageTopbar } from '@/components/PageTopbar';
import { lexicon, type LexiconCategory, type LexiconEntry } from '@/data/lexicon';
import { CLASSICS_META } from '@/data/classics';
import { useKnowledgeOverview } from '@/hooks/useKnowledgeOverview';

/**
 * 词库分类按钮：覆盖 src/data/lexicon.ts + lexicon-extra.ts 中实际出现的
 * 37 个分类，按命理域分为 7 组，每组一行横向滚动，避免按钮撑爆布局。
 *
 * 服务端优先接线（B-1）：
 * - 挂载时请求 /api/v1/knowledge/overview；
 * - ok → 以服务端 lexicon_categories 为分类全集，仍按下列 7 组映射归位，
 *        映射不到的分类归入「其他」组，不丢弃；
 * - degraded → 回退本静态分组；
 * - 词条搜索/筛选/详情始终使用本地静态词库，不变。
 */
const CATEGORY_GROUPS: { label: string; items: readonly LexiconCategory[] }[] = [
  { label: '基础干支', items: ['基础', '天干', '地支', '五行', '十神', '十二长生', '十干禄'] },
  { label: '干支关系', items: ['天干五合', '地支关系', '干支组合', '三合三会', '纳音'] },
  { label: '神煞格局', items: ['神煞', '八字格局', '紫微四化', '紫微格局'] },
  { label: '紫微斗数', items: ['紫微星曜', '十二宫'] },
  { label: '周易八卦', items: ['八卦', '六十四卦', '十二消息卦', '九宫', '河洛'] },
  {
    label: '星象历法',
    items: ['二十八宿', '北斗七星', '七政四余', '节气', '三元九运', '二十四山'],
  },
  {
    label: '术数流派',
    items: ['奇门遁甲', '六壬', '择日', '风水', '三才四象', '推命体系', '命理流派', '命理典籍'],
  },
];

interface DisplayGroup {
  label: string;
  items: string[];
}

/** 以静态 7 组为「组归属映射」，把服务端分类全集重排为同结构分组；未知分类入「其他」。 */
function buildGroups(serverCategories: string[]): DisplayGroup[] {
  const groupOfCategory = new Map<string, string>();
  for (const g of CATEGORY_GROUPS) for (const c of g.items) groupOfCategory.set(c, g.label);

  const bucket = new Map<string, string[]>();
  for (const g of CATEGORY_GROUPS) bucket.set(g.label, []);
  const extras: string[] = [];

  for (const c of serverCategories) {
    const label = groupOfCategory.get(c);
    if (label) bucket.get(label)!.push(c);
    else extras.push(c);
  }

  const result: DisplayGroup[] = CATEGORY_GROUPS.map((g) => ({
    label: g.label,
    items: bucket.get(g.label)!,
  })).filter((g) => g.items.length > 0);
  if (extras.length > 0) result.push({ label: '其他', items: extras });
  return result;
}

/** 典籍卡片统一形状（服务端 classics 与本地 CLASSICS_META 结构一致）。 */
interface ClassicCard {
  slug: string;
  title: string;
  author: string;
  dynasty: string;
  description: string;
  chapterCount: number;
  ready: boolean;
}

export function LexiconPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('全部');
  const [active, setActive] = useState<LexiconEntry | null>(null);

  const { state, categories, classics } = useKnowledgeOverview();

  const groups: DisplayGroup[] = useMemo(
    () => (state === 'ok' ? buildGroups(categories) : CATEGORY_GROUPS.map((g) => ({ label: g.label, items: [...g.items] }))),
    [state, categories],
  );

  /** 典籍区块：服务端成功用服务端数据，失败降级复用本地 CLASSICS_META。 */
  const classicList: readonly ClassicCard[] = state === 'ok' ? classics : CLASSICS_META;

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return lexicon.filter((e) => {
      if (cat !== '全部' && e.category !== cat) return false;
      if (!needle) return true;
      return (
        e.term.toLowerCase().includes(needle) ||
        e.pinyin.toLowerCase().includes(needle) ||
        e.definition.toLowerCase().includes(needle)
      );
    });
  }, [q, cat]);

  return (
    <>
      <PageTopbar title={t('lexicon.title')} onBack={() => navigate('/')} />
      <div className="lexicon-page">
        <p className="lexicon-subtitle">{t('lexicon.subtitle')}</p>
        {state === 'degraded' && (
          <p className="lexicon-degraded-note">服务端数据暂不可用，已展示本地词库与本地典籍数据。</p>
        )}
        <div className="lexicon-controls">
          <input
            className="lexicon-search"
            placeholder={t('lexicon.searchPlaceholder')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="lexicon-cats">
            <button
              type="button"
              className={`lexicon-cat${cat === '全部' ? ' is-active' : ''}`}
              onClick={() => setCat('全部')}
            >
              {t('lexicon.all')}
            </button>
          </div>
          {groups.map((group) => (
            <div className="lexicon-cat-group" key={group.label}>
              <span className="lexicon-cat-group-label">{group.label}</span>
              <div className="lexicon-cat-group-chips">
                {group.items.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`lexicon-cat${cat === c ? ' is-active' : ''}`}
                    onClick={() => setCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="lexicon-count">
          {results.length} {t('lexicon.count')}
        </p>
        <div className="lexicon-layout">
          <ul className="lexicon-list">
            {results.map((e) => (
              <li key={`${e.term}-${e.category}`}>
                <button
                  type="button"
                  className={`lexicon-item${active === e ? ' is-active' : ''}`}
                  onClick={() => setActive(e)}
                >
                  <span className="lexicon-term">{e.term}</span>
                  <span className="lexicon-pinyin">{e.pinyin}</span>
                  <span className="lexicon-cat-tag">{e.category}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="lexicon-empty">{t('lexicon.noResult')}</li>}
          </ul>
          {active && (
            <aside className="lexicon-detail glass-panel">
              <h3>
                {active.term} <span className="lexicon-pinyin">{active.pinyin}</span>
              </h3>
              <p className="lexicon-detail-cat">
                {t('lexicon.categoryLabel')}：{active.category}
              </p>
              <p className="lexicon-definition">{active.definition}</p>
              <p className="lexicon-source">
                {t('lexicon.source')}：{active.source}
              </p>
            </aside>
          )}
        </div>

        <section className="lexicon-classics">
          <h2 className="lexicon-classics__title">经典典籍</h2>
          <p className="lexicon-classics__sub">命理文化原典导读，仅供研读与文化参考。</p>
          <div className="lexicon-classics-grid">
            {classicList.map((c) => (
              <article className="lexicon-classic-card" key={c.slug}>
                <h3>{c.title}</h3>
                <p className="lexicon-classic-card__meta">
                  {c.dynasty} · {c.author}
                </p>
                <p>{c.description}</p>
                <p className="lexicon-classic-card__foot">
                  <span>{c.chapterCount} 章</span>
                  {c.ready && <span className="lexicon-ready">已上线</span>}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
