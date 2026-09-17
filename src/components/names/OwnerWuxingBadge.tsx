// src/components/names/OwnerWuxingBadge.tsx
import { getOwnerWuxingPreference } from '@/data/onomastics/owner-wuxing-map';

interface Props {
  birthYear: number;
}

export default function OwnerWuxingBadge({ birthYear }: Props) {
  const pref = getOwnerWuxingPreference(birthYear);
  if (!pref) return null;
  return (
    <div className="owner-wuxing-badge">
      <h4>老板五行补益偏好</h4>
      <p>生肖：{pref.ownerZodiac}</p>
      <p>命卦：{pref.ownerMingGua}</p>
      <p>补益五行：{pref.preferredWuxing.join('、')}</p>
    </div>
  );
}
