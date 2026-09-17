// 修正：IT-2.3 依据（组件语义为日主关系卡）
export interface DayMasterRelationInput {
  person1Gan?: string;
  person1Wuxing?: string;
  person2Gan?: string;
  person2Wuxing?: string;
  person1ToPerson2?: string;
  person2ToPerson1?: string;
  person2GanAsPerson1TenGod?: string;
  person1GanAsPerson2TenGod?: string;
  promptText?: string;
  sources?: string[];
  limitation?: string;
}

export function DayMasterRelationCard({ relation }: { relation: DayMasterRelationInput | null }) {
  if (!relation) return <div className="ts-empty">暂无日主关系数据</div>;
  return (
    <div className="ts-day-master-relation">
      <div className="ts-day-master-relation__grid">
        <div className="ts-day-master-relation__col">
          <div className="ts-day-master-relation__label">本人日主</div>
          <div className="ts-day-master-relation__value">
            {relation.person1Gan ?? '-'}（{relation.person1Wuxing ?? '-'}）
          </div>
        </div>
        <div className="ts-day-master-relation__col">
          <div className="ts-day-master-relation__label">对方日主</div>
          <div className="ts-day-master-relation__value">
            {relation.person2Gan ?? '-'}（{relation.person2Wuxing ?? '-'}）
          </div>
        </div>
      </div>
      <div className="ts-day-master-relation__rows">
        {relation.person1ToPerson2 && (
          <div className="ts-day-master-relation__row">
            <span>本人对对方</span>
            <span>{relation.person1ToPerson2}</span>
          </div>
        )}
        {relation.person2ToPerson1 && (
          <div className="ts-day-master-relation__row">
            <span>对方对本人</span>
            <span>{relation.person2ToPerson1}</span>
          </div>
        )}
        {relation.person2GanAsPerson1TenGod && (
          <div className="ts-day-master-relation__row">
            <span>对方日干对本人十神</span>
            <span>{relation.person2GanAsPerson1TenGod}</span>
          </div>
        )}
        {relation.person1GanAsPerson2TenGod && (
          <div className="ts-day-master-relation__row">
            <span>本人日干对对方十神</span>
            <span>{relation.person1GanAsPerson2TenGod}</span>
          </div>
        )}
      </div>
      {relation.promptText && (
        <div className="ts-day-master-relation__text">{relation.promptText}</div>
      )}
      {relation.sources && relation.sources.length > 0 && (
        <div className="ts-day-master-relation__sources">出处：{relation.sources.join(' / ')}</div>
      )}
      {relation.limitation && (
        <div className="ts-day-master-relation__limitation">限制：{relation.limitation}</div>
      )}
    </div>
  );
}

export default DayMasterRelationCard;
