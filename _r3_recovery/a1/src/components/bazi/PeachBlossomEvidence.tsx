
// A11-3 · src/components/bazi/PeachBlossomEvidence.tsx · 桃花/神煞证据
import { FortuneEvidenceCard, type EvidenceItem } from '../fortune/FortuneEvidenceCard';

export interface ShensaMap {
  year?: string[];
  month?: string[];
  day?: string[];
  hour?: string[];
  global?: string[];
}

const LABELS: Array<[keyof ShensaMap, string]> = [
  ['year', '年柱'],
  ['month', '月柱'],
  ['day', '日柱'],
  ['hour', '时柱'],
  ['global', '全局'],
];

function safeStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

export function buildShenshaEvidence(s: ShensaMap): EvidenceItem[] {
  const out: EvidenceItem[] = [];
  for (const [k, label] of LABELS) {
    const arr = safeStrings(s[k]);
    for (let i = 0; i < arr.length; i++) {
      out.push({
        id: `${k}-${i}`,
        label,
        value: arr[i],
        source: '@temposoul/core/bazi',
        note: '神煞',
        confidence: 'probable',
      });
    }
  }
  return out;
}

export function PeachBlossomEvidence({ shensha }: { shensha: ShensaMap }) {
  const items = buildShenshaEvidence(shensha);
  return <FortuneEvidenceCard title="神煞证据" items={items} emptyText="暂无神煞，属正常" />;
}

export default PeachBlossomEvidence;

