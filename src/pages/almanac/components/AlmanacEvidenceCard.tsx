// 保留第 3 轮实现
import {
  FortuneEvidenceCard,
  type EvidenceItem,
} from '../../../components/fortune/FortuneEvidenceCard';

export function AlmanacEvidenceCard({ items }: { items: EvidenceItem[] }) {
  return (
    <FortuneEvidenceCard
      title="择日证据"
      items={items}
      emptyText="暂无择日证据数据"
      footer={
        <div className="ts-evidence-card__disclaimer">
          本内容基于传统黄历模型，仅供文化研究参考，不构成任何决策依据。
        </div>
      }
    />
  );
}

export default AlmanacEvidenceCard;
