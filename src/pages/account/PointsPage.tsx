// src/pages/account/PointsPage.tsx
// 9.3 积分系统展示页：包裹 PointsSystem 组件
import { PageTopbar } from '@/components/PageTopbar';
import { PointsSystem } from '@/components/user/PointsSystem';

export function PointsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0' }}>
      <PageTopbar title="积分中心" onBack={() => window.history.back()} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        <PointsSystem />
      </div>
    </div>
  );
}
"export default PointsPage;" 
