/**
 * A 域通用工具页：按 slug 渲染 LightFunEnvelope（hero + 声明 + 内容预览）
 * 列表/参数子路由复用同一组件，由路由 :param 决定是否高亮选中项。
 */
import { Link, useParams } from 'react-router-dom';
import { getLightFun, type LightFunSlug } from '@/data/content/lightfun/lightfun.registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import '@/pages/wiki/batch2/b2.css';

function pickList(content: unknown): readonly Record<string, unknown>[] {
  if (content && typeof content === 'object') {
    for (const v of Object.values(content as Record<string, unknown>)) {
      if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && v[0] !== null) {
        return v as readonly Record<string, unknown>[];
      }
    }
  }
  return [];
}

function labelOf(o: Record<string, unknown>): string {
  return String(
    o.name ??
      o.flower ??
      o.char ??
      o.shichen ??
      o.blood_type ??
      o.xiu ??
      o.type_id ??
      o.quiz_id ??
      o.value ??
      o.month ??
      '·',
  );
}

export default function LightFunTool({ slug }: { slug: LightFunSlug }) {
  const env = getLightFun(slug);
  const { id } = useParams();
  useDocumentMeta({ title: env.seo.title });

  const list = pickList(env.content);
  const preview = list.slice(0, 12);

  return (
    <div className="b2-page">
      <header className="b2-hero">
        <h1>{env.seo.title}</h1>
        <p className="b2-desc">{env.seo.description}</p>
        {id ? <p className="b2-note">当前参数：{decodeURIComponent(id)}</p> : null}{' '}
      </header>

      <section className="b2-loop">
        <h2>内容预览</h2>
        {preview.length > 0 ? (
          <div className="b2-grid">
            {preview.map((item, i) => (
              <div key={i} className="b2-card">
                <h3>{labelOf(item)}</h3>
                <p>{String(item.one_line ?? item.reading ?? item.meaning ?? item.text ?? '—')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="b2-note">本工具为交互式轻娱乐页面，按引导操作即可获得解读。</p>
        )}
      </section>

      <section className="b2-loop">
        <h2>内容声明</h2>
        <ul>
          {env.compliance.disclaimers.map((d) => (
            <li key={d.key}>{d.text}</li>
          ))}
        </ul>
      </section>

      <footer className="b2-meta">
        <p>
          <Link to="/">返回首页</Link>
        </p>
      </footer>
    </div>
  );
}
