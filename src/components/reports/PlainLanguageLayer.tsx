import { memo, useState } from 'react';

interface PlainLanguageLayerProps {
  plain: string;
  technical?: string;
  onToggle?: (on: boolean) => void;
}

function PlainLanguageLayerBase({ plain, technical, onToggle }: PlainLanguageLayerProps) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div>
      <p style={{ color: '#E6EDF3', fontSize: 15, lineHeight: 1.8, margin: '8px 0' }}>{plain}</p>
      {technical ? (
        <>
          <button
            type="button"
            onClick={() => {
              const next = !showTechnical;
              setShowTechnical(next);
              onToggle?.(next);
            }}
            aria-expanded={showTechnical}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#58A6FF',
              fontSize: 12,
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {showTechnical ? '隐藏术语原文' : '查看术语原文'}
          </button>
          {showTechnical ? (
            <p
              style={{
                color: '#8B949E',
                fontSize: 13,
                background: '#0D1117',
                border: '1px solid #30363D',
                borderRadius: 8,
                padding: 10,
                marginTop: 8,
              }}
            >
              <code>{technical}</code>
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export const PlainLanguageLayer = memo(PlainLanguageLayerBase);
export default PlainLanguageLayer;
