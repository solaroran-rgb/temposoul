// 终版修正：符合 D4 任务卡要求，合规声明完整
import React from 'react';
import { Link } from 'react-router-dom';

interface ZeroStateFallbackProps {
  query: string;
}

export const ZeroStateFallback: React.FC<ZeroStateFallbackProps> = ({ query }) => {
  return (
    <div className="zero-state-fallback">
      <div className="zero-state-fallback__banner">
        <h3 className="zero-state-fallback__title">
          {query ? `未找到与 "${query}" 相关的结果` : '请输入搜索内容'}
        </h3>
        <p className="zero-state-fallback__disclaimer">
          ⚠️ 命理内容仅供传统文化探索与娱乐参考，不构成任何绝对化断言、医疗建议或决策依据。
        </p>
      </div>

      <div className="zero-state-fallback__recommendations">
        <h4 className="zero-state-fallback__rec-title">热门功能推荐</h4>
        <ul className="zero-state-fallback__rec-list">
          <li>
            <Link to="/?mode=single&system=bazi" className="zero-state-fallback__link">
              → 八字大运排盘
            </Link>
          </li>
          <li>
            <Link to="/lexicon" className="zero-state-fallback__link">
              → 命理词库百科 (1180+ 词条)
            </Link>
          </li>
          <li>
            <Link to="/name-test" className="zero-state-fallback__link">
              → 姓名综合测试打分
            </Link>
          </li>
          <li>
            <Link to="/pricing" className="zero-state-fallback__link">
              → 高级深度解读方案
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
