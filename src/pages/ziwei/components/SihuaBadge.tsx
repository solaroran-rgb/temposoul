// 修正：加 aria-label 提升无障碍
type SihuaKind = 'lu' | 'quan' | 'ke' | 'ji';

const KIND_LABEL: Record<SihuaKind, string> = {
  lu: '禄',
  quan: '权',
  ke: '科',
  ji: '忌',
};

export function SihuaBadge({ star, kind }: { star: string; kind: SihuaKind }) {
  return (
    <span className={`ts-sihua ts-sihua--${kind}`} aria-label={`${star}${KIND_LABEL[kind]}`}>
      {star}
      {KIND_LABEL[kind]}
    </span>
  );
}

export default SihuaBadge;
