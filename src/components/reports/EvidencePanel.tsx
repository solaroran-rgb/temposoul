import { memo, useEffect, useState } from 'react';

export interface EvidenceItem {
  label: string;
  value: string;
  source?: string;
}

interface EvidencePanelProps {
  items: EvidenceItem[];
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

function EvidencePanelBase({ items, defaultOpen = false, onToggle }: EvidencePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  // props.defaultOpen 变化时同步（仅在明确传入时生效）
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  if (!items || items.length === 0) return null;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        style={{
          background: 'transparent',
          border: '1px solid #30363D',
          borderRadius: 8,
          color: '#58A6FF',
          fontSize: 13,
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        计算证据链 {open ? '收起' : '展开'}
      </button>
      {open ? (
        <ul
          style={{
            margin: '10px 0 0',
            paddingLeft: 18,
            color: '#8B949E',
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          {items.map((it, i) => (
            <li key={i}>
              <span style={{ color: '#E6EDF3' }}>{it.label}</span>：{it.value}
              {it.source ? <em style={{ color: '#6E7681' }}>（来源：{it.source}）</em> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export const EvidencePanel = memo(EvidencePanelBase);
export default EvidencePanel;
