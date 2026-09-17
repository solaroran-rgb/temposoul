import { memo, useCallback, useEffect, useRef, useState } from 'react';

export interface SharePage {
  title: string;
  lines: string[];
}

interface ReportSummaryShareProps {
  reportId: string;
  pages: SharePage[];
  onOpen?: (page: number) => void;
  onDownload?: (page: number) => void;
}

const CARD_W = 720;
const CARD_H = 960;
const BRAND_URL = 'www.temposoul.com';
const BRAND_TAGLINE = '理解生命的规律，而不是预测命运';

function getDpr(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 3);
}

function drawShareCard(canvas: HTMLCanvasElement, page: SharePage): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = getDpr();

  // 物理像素尺寸
  canvas.width = CARD_W * dpr;
  canvas.height = CARD_H * dpr;
  canvas.style.width = `${CARD_W}px`;
  canvas.style.height = `${CARD_H}px`;

  // 以 CSS 像素坐标绘制
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.fillStyle = '#0D1117';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.fillStyle = '#58A6FF';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('命律 TempoSoul', 48, 64);

  ctx.fillStyle = '#E6EDF3';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(page.title, 48, 128);

  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#8B949E';
  const maxLines = Math.min(page.lines.length, 8);
  for (let i = 0; i < maxLines; i += 1) {
    ctx.fillText(page.lines[i], 48, 200 + i * 36);
  }

  ctx.fillStyle = '#6E7681';
  ctx.font = '13px sans-serif';
  ctx.fillText(BRAND_URL, 48, CARD_H - 48);
  ctx.fillText(BRAND_TAGLINE, 48, CARD_H - 24);
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Safari 下延迟回收，避免下载被中断
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

function ReportSummaryShareBase({ reportId, pages, onOpen, onDownload }: ReportSummaryShareProps) {
  const [active, setActive] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const openedRef = useRef(false);

  const current = pages[active];

  // 首次展示时上报
  useEffect(() => {
    if (openedRef.current || pages.length === 0) return;
    openedRef.current = true;
    onOpen?.(1);
  }, [pages.length, onOpen]);

  // active 或 current 变化时重绘预览
  useEffect(() => {
    if (!canvasRef.current || !current) return;
    drawShareCard(canvasRef.current, current);
  }, [current]);

  const select = useCallback(
    (i: number) => {
      setActive(i);
      onOpen?.(i + 1);
    },
    [onOpen],
  );

  const handleDownload = useCallback(() => {
    if (!canvasRef.current || !current) return;
    drawShareCard(canvasRef.current, current);
    downloadCanvas(canvasRef.current, `temposoul-${reportId}-p${active + 1}.png`);
    onDownload?.(active + 1);
  }, [active, current, reportId, onDownload]);

  if (pages.length === 0) return null;

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => select(i)}
            aria-pressed={i === active}
            style={{
              background: i === active ? '#1F6FEB' : '#21262D',
              border: '1px solid #30363D',
              borderRadius: 8,
              color: '#E6EDF3',
              fontSize: 13,
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            第 {i + 1} 页
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: 360,
          height: 'auto',
          border: '1px solid #30363D',
          borderRadius: 12,
          display: 'block',
          background: '#0D1117',
        }}
        aria-label={`分享卡第 ${active + 1} 页：${current.title}`}
      />
      <button
        type="button"
        onClick={handleDownload}
        style={{
          marginTop: 10,
          background: '#21262D',
          border: '1px solid #30363D',
          borderRadius: 8,
          color: '#58A6FF',
          fontSize: 13,
          padding: '8px 14px',
          cursor: 'pointer',
        }}
      >
        下载分享图
      </button>
    </div>
  );
}

export const ReportSummaryShare = memo(ReportSummaryShareBase);
export default ReportSummaryShare;
