// src/components/name/WuxingRefCard.tsx

interface Props {
  wuxing: string;
}

export default function WuxingRefCard({ wuxing }: Props) {
  return (
    <div className="wuxing-ref-card">
      <h4>中文音译五行参考</h4>
      <p>五行属性：{wuxing}</p>
      <p className="disclaimer">基于声母韵母五行通行归类的民俗参考，非精确测算。</p>
    </div>
  );
}
