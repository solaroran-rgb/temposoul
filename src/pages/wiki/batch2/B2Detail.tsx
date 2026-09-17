/**
 * A 域详情页（通用组件，按 kind + id 渲染）
 * id 归一化：路由 :id 为记录 id 去掉前缀（ten_god_/shen_sha_/four_transform_/ziwei_pattern_/limit_year_/handwritten_/template_）
 */
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { KIND_META, STATIC_DETAIL_SLUG, type B2Kind } from './registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './b2.css';

export interface B2DetailProps {
  kind: B2Kind;
}

const PREFIX: Record<string, string> = {
  ten_gods: 'ten_god_',
  shen_sha: 'shen_sha_',
  four_transform: 'four_transform_',
  ziwei_patterns: 'ziwei_pattern_',
  limit_year: 'limit_year_',
  transits: '',
  palace_star: '',
  solar_terms: 'solar_term_',
  ziwei_stars_b: 'ziwei_star_b_',
  palaces_b: 'palace_b_',
  bone_weight: 'bone_weight_',
  tarot: 'tarot_',
  dream_dict: 'dream_',
  iching: 'iching_',
  number_divination: 'number_divination_',
  love_divination: 'love_divination_',
  zodiac_encyclopedia: 'zodiac_encyclopedia_',
  zodiac_personality: 'zodiac_personality_',
};

export default function B2Detail({ kind }: B2DetailProps) {
  const { id = '' } = useParams();
  const location = useLocation();
  const meta = KIND_META[kind];

  // 静态详情（transits/solar-return/detail 等无 :id 路由）
  const staticHit = STATIC_DETAIL_SLUG[location.pathname];
  const staticId = staticHit && staticHit.kind === kind ? staticHit.id : '';
  const fullId = PREFIX[kind] ? `${PREFIX[kind]}${id}` : id;
  const record =
    (staticId && meta.records.find((r) => r.id === staticId)) ||
    meta.records.find((r) => r.id === fullId || r.id === id || r.seo.slug.endsWith(`/${id}`));

  if (!record) return <Navigate to={meta.listSlug} replace />;

  useDocumentMeta({ title: record.seo.title });

  return (
    <div className="b2-page">
      <nav className="b2-crumb">
        <Link to="/">首页</Link> / <Link to={meta.listSlug}>{meta.title}</Link> / <span>{record.seo.title}</span>
      </nav>
      <article className="b2-article">
        <header>
          <h1>{record.seo.title}</h1>
          <p className="b2-desc">{record.seo.description}</p>
        </header>
        <section className="b2-body">
          <p>{record.body.plain_reading}</p>
        </section>
        <section className="b2-loop">
          <h2>解读参考</h2>
          <ul>
            <li><strong>核心提示：</strong>{record.body.insight_loop.insight}</li>
            <li><strong>成因：</strong>{record.body.insight_loop.cause}</li>
            <li><strong>表现：</strong>{record.body.insight_loop.manifestation}</li>
            <li><strong>注意：</strong>{record.body.insight_loop.risk}</li>
            <li><strong>建议：</strong>{record.body.insight_loop.suggestion}</li>
            <li><strong>行动：</strong>{record.body.insight_loop.action}</li>
          </ul>
        </section>
        <footer className="b2-meta">
          <p>内容来源：{record.source.classic}·{record.source.chapter}</p>
          <p>本内容为命理文化参考维度，不构成吉凶断言与决策依据。</p>
        </footer>
      </article>
    </div>
  );
}
