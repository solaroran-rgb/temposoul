import { memo } from 'react';
import { EvidencePanel, type EvidenceItem } from './EvidencePanel';
import { PlainLanguageLayer } from './PlainLanguageLayer';

export interface DimensionData {
  key: string;
  label: string;
  summary: string;
  plain: string;
  technical?: string;
  actions: string[];
  evidence: EvidenceItem[];
}

interface DimensionCardProps {
  data: DimensionData;
  onEvidenceToggle?: (key: string, open: boolean) => void;
  onPlainToggle?: (key: string, on: boolean) => void;
}

function DimensionCardBase({ data, onEvidenceToggle, onPlainToggle }: DimensionCardProps) {
  return (
    <section
      aria-labelledby={`dim-${data.key}`}
      role="article"
      tabIndex={0}
      style={{
        background: '#161B22',
        border: '1px solid #30363D',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        outline: 'none',
      }}
    >
      <h3 id={`dim-${data.key}`} style={{ color: '#E6EDF3', fontSize: 16, margin: '0 0 6px' }}>
        {data.label}
      </h3>
      <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.7, margin: '0 0 6px' }}>
        {data.summary}
      </p>
      <PlainLanguageLayer
        plain={data.plain}
        technical={data.technical}
        onToggle={(on) => onPlainToggle?.(data.key, on)}
      />
      {data.actions && data.actions.length > 0 ? (
        <ul
          style={{
            color: '#D29922',
            fontSize: 13,
            lineHeight: 1.8,
            margin: '10px 0 0',
            paddingLeft: 18,
          }}
        >
          {data.actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      ) : null}
      <EvidencePanel
        items={data.evidence}
        onToggle={(open) => onEvidenceToggle?.(data.key, open)}
      />
    </section>
  );
}

export const DimensionCard = memo(DimensionCardBase);
export default DimensionCard;
