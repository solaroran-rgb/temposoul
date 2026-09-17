import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { PageTopbar } from '@/components/PageTopbar';
import { lexicon, type LexiconCategory, type LexiconEntry } from '@/data/lexicon';

/**
 * 词库分类按钮：覆盖 src/data/lexicon.ts + lexicon-extra.ts 中实际出现的
 * 全部 37 个分类，按命理域分为 7 组，每组一行横向滚动，避免按钮撑爆布局。
 */
const CATEGORY_GROUPS: { label: string; items: LexiconCategory[] }[] = [
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

const ALL_ITEMS: ('全部' | LexiconCategory)[] = [
  '全部',
  ...CATEGORY_GROUPS.flatMap((g) => g.items),
];
type CatFilter = (typeof ALL_ITEMS)[number];

export function LexiconPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CatFilter>('全部');
  const [active, setActive] = useState<LexiconEntry | null>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return lexicon.filter((e) => {
      if (cat !== '全部' && (e.category as LexiconCategory) !== cat) return false;
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
          {CATEGORY_GROUPS.map((group) => (
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
      </div>
    </>
  );
}
