/**
 * A 域轻娱乐总览：列出 12 项工具入口
 */
import { Link } from 'react-router-dom';
import { LIGHTFUN_ITEMS } from '@/data/content/lightfun/route-mapping-lightfun';
import { LIGHTFUN_REGISTRY } from '@/data/content/lightfun/lightfun.registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import '@/pages/wiki/batch2/b2.css';

export default function LightFunIndex() {
  useDocumentMeta({ title: '轻娱乐工具大全' });
  return (
    <div className="b2-page">
      <header className="b2-hero">
        <h1>轻娱乐工具大全</h1>
        <p className="b2-desc">测字、生命灵数、生日密码、心理小测等十二款文化娱乐小工具。</p>
        <p className="b2-note">全部内容仅供文化娱乐与自我观察，不构成专业建议，不预测命运。</p>
      </header>
      <div className="b2-grid">
        {LIGHTFUN_ITEMS.map(({ slug }) => {
          const env = LIGHTFUN_REGISTRY[slug];
          return (
            <Link key={slug} to={env.route.path} className="b2-card">
              <h3>{env.i18n.zh_CN.title}</h3>
              <p>{env.i18n.zh_CN.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
