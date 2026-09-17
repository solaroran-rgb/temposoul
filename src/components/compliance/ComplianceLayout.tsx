import React, { ReactNode } from 'react';

interface ComplianceLayoutProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children: ReactNode;
}

export const ComplianceLayout: React.FC<ComplianceLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="compliance-layout">
      <nav className="compliance-layout__nav" role="tablist" aria-label="合规中心导航">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`compliance-layout__nav-item ${activeTab === tab.key ? 'compliance-layout__nav-item--active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="compliance-layout__content" role="tabpanel">
        {children}
      </main>
    </div>
  );
};
export default ComplianceLayout;
