import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ComplianceLayout from '../../components/compliance/ComplianceLayout';
import DsarRequestForm from '../../components/compliance/DsarRequestForm';
import ReportForm from '../../components/compliance/ReportForm';
import { CrisisInterventionBanner } from '../../components/compliance/CrisisInterventionBanner';
import '../../styles/platform-compliance.css';

type TabKey = 'dsar' | 'report' | 'privacy' | 'terms';

export const CompliancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabKey) || 'dsar';

  const setTab = (tab: TabKey) => setSearchParams({ tab });

  const renderContent = () => {
    switch (activeTab) {
      case 'dsar':
        return <DsarRequestForm />;
      case 'report':
        return <ReportForm />;
      case 'privacy':
        return (
          <div className="compliance-content__placeholder">
            <h3>隐私政策补充说明</h3>
            <p>
              本平台基础隐私政策详见{' '}
              <Link to="/privacy" className="text-link">
                /privacy
              </Link>{' '}
              页面。
            </p>
            <p>
              补充承诺：我们遵循数据最小化原则，绝不将您的敏感命理数据用于未经授权的第三方共享或商业化变现。
            </p>
          </div>
        );
      case 'terms':
        return (
          <div className="compliance-content__placeholder">
            <h3>服务条款</h3>
            <p className="text-secondary">[待法务最终审核 V2.0] 服务条款内容将在此处展示。</p>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'dsar', label: 'DSAR 申请' },
    { key: 'report', label: '投诉举报' },
    { key: 'privacy', label: '隐私补充' },
    { key: 'terms', label: '服务条款' },
  ];

  return (
    <div className="compliance-page">
      <CrisisInterventionBanner />
      <ComplianceLayout tabs={tabs} activeTab={activeTab} onTabChange={(key) => setTab(key as TabKey)}>
        {renderContent()}
      </ComplianceLayout>
    </div>
  );
};
