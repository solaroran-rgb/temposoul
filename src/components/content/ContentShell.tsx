import type { ReactElement, ReactNode } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { guardText } from '@/lib/assertions-guard';
import { useDocumentMeta } from '@/lib/use-document-meta';
import type { ContentBlock } from '@/data/knowledge/schema';
import type { PageState } from '@/types/page-state';
import type { Confidence, ContentCompleteness } from '@/data/content/types';
import './ContentShell.css';

export interface ContentShellProps {
  title: string;
  state: PageState;
  confidence?: Confidence;
  completeness?: ContentCompleteness;
  children?: ReactNode;
  onBack?: () => void;
  noIndex?: boolean;
  emptyHint?: string;
  errorHint?: string;
}

/** IT-8-6 六变体渲染器；每段文本渲染前统一过 guardText */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }): ReactElement {
  return (
    <>
      {blocks.map((b, i) => {
        const block = b as {
          kind: string;
          text?: string;
          items?: string[];
          header?: string[];
          rows?: string[][];
          cite?: string;
          tone?: string;
          ref?: string;
        };
        switch (block.kind) {
          case 'paragraph':
            return (
              <p key={i} className="content-block__p">
                {guardText(block.text ?? '')}
              </p>
            );
          case 'list':
            return (
              <ul key={i} className="content-block__list">
                {(block.items ?? []).map((item, j) => (
                  <li key={j}>{guardText(item)}</li>
                ))}
              </ul>
            );
          case 'table':
            return (
              <table key={i} className="content-block__table">
                {block.header ? (
                  <thead>
                    <tr>
                      {block.header.map((h, j) => (
                        <th key={j}>{guardText(h)}</th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {(block.rows ?? []).map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => (
                        <td key={k}>{guardText(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case 'quote':
            return (
              <blockquote key={i} className="content-block__quote">
                {guardText(block.text ?? '')}
                {block.cite ? <cite>— {guardText(block.cite)}</cite> : null}
              </blockquote>
            );
          case 'callout':
            return (
              <div
                key={i}
                className={`content-block__callout content-block__callout--${block.tone ?? 'info'}`}
              >
                {guardText(block.text ?? '')}
              </div>
            );
          case 'engineRef':
            return (
              <p key={i} className="content-block__ref">
                数据引用：{guardText(block.ref ?? '')}
              </p>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/**
 * 六态内容壳：Topbar + 六态 + Badge + guardText 免责 + PrivacyHint
 * 关键：children 在除 loading 外的所有状态均渲染（idle 态也要能看到表单），
 *      否则初始为 idle 的工具页首屏不显示输入区。
 */
export function ContentShell(props: ContentShellProps): ReactElement {
  const {
    title,
    state,
    confidence,
    completeness,
    children,
    onBack,
    noIndex = false,
    emptyHint = '暂无匹配内容',
    errorHint = '加载失败，请稍后重试',
  } = props;

  useDocumentMeta({ title, noIndex });

  const showChildren = state !== 'loading';

  return (
    <>
      <PageTopbar title={title} onBack={onBack ?? (() => window.history.back())} />
      <main className="content-shell">
        {state === 'loading' && <div className="content-shell__skeleton skeleton" />}

        {showChildren && (
          <section className="content-shell__body">
            {children}

            {(state === 'ok' || state === 'degraded') && confidence !== undefined && (
              <div className="content-shell__badge">
                <ConfidenceBadge confidence={confidence} />
              </div>
            )}

            {state === 'degraded' && (
              <p className="content-shell__stub">
                {completeness === 'stub'
                  ? '该条目内容建设中，当前仅有基础信息'
                  : '该条目内容尚未完整，仅供参考'}
              </p>
            )}
          </section>
        )}

        {state === 'ok-empty' && <p className="content-shell__empty">{emptyHint}</p>}
        {state === 'error' && <p className="content-shell__error">{errorHint}</p>}

        <p className="content-shell__disclaimer">{guardText(title)}</p>
        <PrivacyHint />
      </main>
    </>
  );
}

export default ContentShell;
