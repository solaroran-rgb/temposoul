/**
 * C9-知识库：置信度徽标（本地侧补交：C 交付清单缺该组件）
 */
import type { Confidence } from '../../data/knowledge/schema';

const CONF_LABEL: Record<Confidence, string> = {
  verified: '已核验',
  probable: '较可靠',
  legendary: '传说/文献',
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`confidence-badge confidence-badge--${confidence}`}>
      {CONF_LABEL[confidence] ?? confidence}
    </span>
  );
}
