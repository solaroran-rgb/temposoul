// src/components/content/ContentBlocks.tsx
import type { ReactElement } from 'react';
import { applyGuard } from '@/lib/guard-utils';
import type { LocalContentBlock } from '@/data/content/entry-types';

export function ContentBlocks({ blocks }: { blocks: LocalContentBlock[] }): ReactElement | null {
  if (blocks.length === 0) return null;
  return (
    <div className="content-blocks">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'paragraph': {
            const safe = applyGuard(b.text);
            return safe ? <p key={i} className="content-blocks__p">{safe}</p> : null;
          }
          case 'list': {
            const items = b.items.map((it) => applyGuard(it)).filter((x) => x !== '');
            if (items.length === 0) return null;
            return b.ordered
              ? <ol key={i} className="content-blocks__ol">{items.map((t, j) => <li key={j}>{t}</li>)}</ol>
              : <ul key={i} className="content-blocks__ul">{items.map((t, j) => <li key={j}>{t}</li>)}</ul>;
          }
          case 'table': {
            const headers = b.headers.map((h) => applyGuard(h));
            return (
              <div key={i} className="content-blocks__table-wrap">
                <table className="content-blocks__table">
                  <thead><tr>{headers.map((h, j) => <th key={j} scope="col">{h}</th>)}</tr></thead>
                  <tbody>
                    {b.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => <td key={ci}>{applyGuard(cell)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case 'quote': {
            const safe = applyGuard(b.text);
            return safe
              ? <blockquote key={i} className="content-blocks__quote">{safe}{b.cite ? <cite className="content-blocks__cite">—— {applyGuard(b.cite)}</cite> : null}</blockquote>
              : null;
          }
          case 'callout': {
            const safe = applyGuard(b.text);
            return safe
              ? <aside key={i} className={`content-blocks__callout content-blocks__callout--${b.tone}`}>{safe}</aside>
              : null;
          }
          case 'engineRef':
            return (
              <div key={i} className="content-blocks__engine-ref">
                <span className="content-blocks__engine-tag">{b.engine}</span>
                <code className="content-blocks__engine-code">{b.ref}</code>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
