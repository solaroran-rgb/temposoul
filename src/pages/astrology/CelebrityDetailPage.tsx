// B23-1 src/pages/astrology/CelebrityDetailPage.tsx
/**
 * 名人星盘详情页：信息卡 + 文化解读 + 免责 + 转化钩子。
 * 个人结果页强制 noindex；archived / 无效 ID 走 ok-empty。
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCelebrityById, CELEBRITY_FIELDS } from '@/data/astrology/celebrity-charts';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function CelebrityDetailPage() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<PageState>('loading');
  // degraded：星盘可视化渲染失败时降级为文字版资料（预留：未来接入 AstrolabeChart 失败时置 true）
  const [degraded] = useState(false);

  const chart = useMemo(() => (id ? getCelebrityById(id) : undefined), [id]);

  // 个人结果页强制 noindex
  useDocumentMeta({ title: chart ? `${chart.h1} | TempoSoul` : '名人星盘资料 | TempoSoul', noIndex: true });

  useEffect(() => {
    trackPageView(`/astrology/celebrities/${id ?? ''}`);
    if (!id) {
      setState('error');
      return;
    }
    // 模拟防御：无效 id 或 archived → ok-empty
    if (!chart || chart.status !== 'active') {
      setState('ok-empty');
      return;
    }
    setState('ok');
  }, [id, chart]);

  if (state === 'loading') return <div className="route-fallback"><div className="skeleton" /><div className="skeleton" /></div>;

  if (state === 'ok-empty') {
    return (
      <main className="page-celebrity-detail">
        <PageTopbar title="名人星盘资料" onBack={() => nav(-1)} />
        <p className="celebrity-empty" role="status">
          未找到该条目，或该条目已下线。
          <Link to="/astrology/celebrities">返回列表</Link>
        </p>
      </main>
    );
  }

  if (state === 'error') {
    return (
      <main className="page-celebrity-detail">
        <PageTopbar title="名人星盘资料" onBack={() => nav(-1)} />
        <div role="alert">
          页面加载异常。
          <button type="button" onClick={() => setState('ok')}>重试</button>
        </div>
      </main>
    );
  }

  if (!chart) return null;

  return (
    <main className="page-celebrity-detail">
      <PageTopbar title={chart.name} onBack={() => nav(-1)} />

      {degraded && <p className="celebrity-note">星盘图渲染暂不可用，以下为文字版资料。</p>}

      <article className="celebrity-detail-card">
        <h1 className="celebrity-detail__h1">{chart.h1}</h1>
        <dl className="celebrity-detail__facts">
          <div><dt>领域</dt><dd>{CELEBRITY_FIELDS.find((f) => f.key === chart.field)?.label}</dd></div>
          <div><dt>出生日期</dt><dd>{chart.birthData.date.slice(0, 10)}（UTC 记日）</dd></div>
          <div><dt>出生地</dt><dd>{chart.birthData.locationName}（{chart.birthData.lat.toFixed(2)}, {chart.birthData.lng.toFixed(2)}）</dd></div>
          <div><dt>资料来源</dt><dd>{chart.birthData.source}</dd></div>
          <div><dt>置信度</dt><dd>{chart.birthData.confidence}</dd></div>
        </dl>

        <section className="celebrity-detail__interpret">
          <h2>文化解读</h2>
          <p>{guardText(chart.interpretation.summary)}</p>
          <ul>
            {chart.interpretation.keyAspects.map((a) => (
              <li key={a}>{guardText(a)}</li>
            ))}
          </ul>
          <p className="celebrity-disclaimer">{guardText(chart.interpretation.disclaimer)}</p>
        </section>
      </article>

      {chart.relatedSlugs.length > 0 && (
        <nav className="celebrity-related" aria-label="相关条目">
          <h2>相关名人</h2>
          <ul>
            {chart.relatedSlugs.map((slug) => (
              <li key={slug}>
                <Link to={`/astrology/celebrities/${slug}`}>{slug}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <aside className="celebrity-cta">
        <p>想看看自己的生日星座？可前往生日配对工具体验。</p>
        <Link to="/compatibility/birthday" className="btn-primary">去试试</Link>
      </aside>

      <PrivacyHint />
    </main>
  );
}
