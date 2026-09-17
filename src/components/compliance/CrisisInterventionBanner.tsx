import React from 'react';

// 严格遵循决策 28：无具体热线，依赖通用转介表述
export const CrisisInterventionBanner: React.FC = () => {
  const genericText =
    '如果您或您认识的人正在经历心理危机或情绪困扰，请立即联系当地的专业医疗机构、心理咨询热线或紧急救援服务。本平台内容仅供传统文化探索与娱乐参考，不能替代专业医疗建议。';
  return (
    <div className="crisis-banner">
      <span className="crisis-banner__icon">⚠️</span>
      <p className="crisis-banner__text">{genericText}</p>
    </div>
  );
};

export default CrisisInterventionBanner;
