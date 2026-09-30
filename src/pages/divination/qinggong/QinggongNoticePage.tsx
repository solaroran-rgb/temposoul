import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';

/**
 * 清宫表（生男生女预测）合规下线说明页。
 * 原交互工具因「性别预测」合规风险已停用；直链 /divination/qinggong 统一落地此说明页。
 */
export default function QinggongNoticePage() {
  return (
    <div className="a23-page">
      <PageTopbar title="功能说明" onBack={() => window.history.back()} />

      <div className="a23-boundary-callout" role="note">
        本功能已暂停服务。
      </div>

      <section style={{ padding: '8px 4px', lineHeight: 1.8, color: '#e2e8f0' }}>
        <h2 style={{ fontSize: 18, margin: '8px 0 12px' }}>清宫表（生男生女预测）已暂停服务</h2>
        <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 12px' }}>
          清宫表为传统民俗趣味推演，无任何科学依据，且涉及胎儿性别预测，
          存在误导与合规风险。出于负责任的文化展示原则，我们已停止该交互工具。
        </p>
        <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 16px' }}>
          我们仍提供大量合规的命理文化内容供您探索，欢迎前往：
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="a23-cta" to="/" style={{ textDecoration: 'none' }}>
            返回首页
          </Link>
          <Link
            className="a23-cta a23-cta--ghost"
            to="/compliance"
            style={{ textDecoration: 'none' }}
          >
            查看平台合规说明
          </Link>
        </div>
      </section>
    </div>
  );
}
