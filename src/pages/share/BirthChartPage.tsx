import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { EmailCapture } from '../../components/EmailCapture';
import { usePromptCopyShare } from '../../hooks/usePromptCopyShare';
import type { ChartSummary } from '../../types/chart-summary';
import { trackName } from '../../pages/name/lib/trackName';

function summaryFromState(state: unknown): ChartSummary | null {
  const s = state as { chartSummary?: ChartSummary } | null;
  return s?.chartSummary && typeof s.chartSummary.exportForShare === 'function'
    ? s.chartSummary
    : null;
}

export function BirthChartPage(): React.ReactElement {
  const nav = useNavigate();
  const loc = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendered, setRendered] = useState(false);
  const [dataUrl, setDataUrl] = useState('#');
  const chart = useMemo(() => summaryFromState(loc.state), [loc.state]);
  const model = useMemo(() => chart?.exportForShare() ?? null, [chart]);

  const shareText = useMemo(() => {
    if (!model) return '';
    return [model.title, ...model.lines.map((l) => `${l.label}：${l.value}`), model.footer].join(
      '\n',
    );
  }, [model]);
  const { handleCopy, copyState } = usePromptCopyShare(shareText);

  const onDraw = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs || !model) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const w = 720,
      h = 420;
    cvs.width = w;
    cvs.height = h;
    ctx.fillStyle = '#0B0F1A';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#4DC3FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, w - 32, h - 32);
    ctx.fillStyle = '#E0E6ED';
    ctx.font = '28px sans-serif';
    ctx.fillText(model.title, 40, 70);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#8B9BB4';
    model.lines
      .slice(0, 10)
      .forEach((l, i) => ctx.fillText(`${l.label}：${l.value}`, 40, 120 + i * 26));
    ctx.fillStyle = '#FF4D6D';
    ctx.font = '14px sans-serif';
    ctx.fillText(model.footer, 40, h - 40);
    setRendered(true);
    setDataUrl(cvs.toDataURL('image/png'));
    trackName('trackNameShare', { surface: 'birth-chart' });
  }, [model]);

  return (
    <>
      <PageTopbar title="生辰卡" onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))} />
      <main className="birth-chart">
        {!model ? (
          <p className="birth-chart__empty">
            尚未携带排盘摘要。请先前往排盘页生成，再从结果页进入本页（本页不主动请求排盘接口）。
          </p>
        ) : (
          <>
            <canvas ref={canvasRef} className="birth-chart__canvas" />
            <div className="birth-chart__actions">
              <button type="button" onClick={onDraw}>
                {rendered ? '重新生成卡片' : '生成卡片'}
              </button>
              <button type="button" onClick={() => handleCopy()}>
                复制分享文案（{copyState}）
              </button>
              {rendered && (
                <a
                  className="birth-chart__download"
                  download="temposoul-birth-chart.png"
                  href={dataUrl}
                >
                  下载图片
                </a>
              )}
            </div>
            <p className="birth-chart__boundary">
              卡片为本地生成的前端草稿，不会上传或公开发布；内容含民俗参考，非吉凶预测。
            </p>
            <section className="birth-chart__intent">
              <h3>想要保存进我的卡片册？</h3>
              <p>该功能待社区能力上线，可留下邮箱登记意向（不会创建任何线上内容）。</p>
              <EmailCapture />
            </section>
          </>
        )}
      </main>
      <PrivacyHint />
    </>
  );
}
