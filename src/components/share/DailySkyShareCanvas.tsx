/**
 * @file 每日星象 · Canvas→PNG 分享图（S-6 分享片，规格 §5 冻结）
 *
 * 1080×1080 客户端生成，三段布局：
 *   上 40%（0–432）：暗黑星云底 + 星点 + 月相实绘；
 *   中 30%（432–756）：日期 +「今日星象」标题 + 天象事件一行；
 *   下 30%（756–1080）：个性化行 + 文化引文/出处 + 合规句脚注 + 品牌字标。
 * 配色只消费 tokens.css：--bg-void #000000 / --cyan-core #00E5FF /
 *   --accent-lunar #C9D6E8 / --text-primary #E6EDF3（--bg-base #0E1116 作星云过渡）。
 * 标题中文用 --font-serif-zh 栈（Noto Serif SC / Songti SC / serif），正文 Inter。
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { DailySkyPayload } from '@/lib/daily-sky/share';

const W = 1080;
const H = 1080;

// tokens.css 取值（Canvas 无法直读 CSS 变量，硬编码镜像值，改色须同步 tokens.css）
const C_BG_VOID = '#000000'; // --bg-void
const C_BG_BASE = '#0E1116'; // --bg-base
const C_CYAN = '#00E5FF'; // --cyan-core
const C_LUNAR = '#C9D6E8'; // --accent-lunar
const C_TEXT = '#E6EDF3'; // --text-primary
const SERIF_ZH = "'Noto Serif SC','Songti SC',serif"; // --font-serif-zh
const SANS = "'Inter','Noto Sans SC',system-ui,sans-serif";

/** 由 dateKey 派生确定性伪随机种子——同一天星点稳定，跨天不同 */
function seededRandom(seedStr: string): () => number {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i += 1) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const ch of text) {
    if (ctx.measureText(cur + ch).width > maxWidth && cur) {
      lines.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawNebulaAndStars(ctx: CanvasRenderingContext2D, seed: string): void {
  // 底：void → bg-base 垂直渐变，铺满整张 1080×1080（上下无透明区，浅色字在任何平台可读）
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, C_BG_VOID);
  bg.addColorStop(0.4, '#0B0E13');
  bg.addColorStop(1, C_BG_BASE);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 星云团：两处极淡的青/蓝径向光雾
  const rnd = seededRandom(seed);
  const neb1 = ctx.createRadialGradient(W * 0.25, 120, 10, W * 0.25, 120, 320);
  neb1.addColorStop(0, 'rgba(0,229,255,0.10)');
  neb1.addColorStop(1, 'rgba(0,229,255,0)');
  ctx.fillStyle = neb1;
  ctx.fillRect(0, 0, W, 432);
  const neb2 = ctx.createRadialGradient(W * 0.8, 300, 10, W * 0.8, 300, 280);
  neb2.addColorStop(0, 'rgba(143,163,189,0.10)');
  neb2.addColorStop(1, 'rgba(143,163,189,0)');
  ctx.fillStyle = neb2;
  ctx.fillRect(0, 0, W, 432);

  // 星点
  for (let i = 0; i < 150; i += 1) {
    const x = rnd() * W;
    const y = rnd() * 432;
    const r = rnd() * 1.6 + 0.4;
    const a = rnd() * 0.6 + 0.25;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230,237,243,${a.toFixed(2)})`;
    ctx.fill();
  }
}

function drawMoon(ctx: CanvasRenderingContext2D, moonPhase: string): void {
  const cx = W / 2;
  const cy = 210;
  const r = 78;

  // 银辉
  const glow = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 2.4);
  glow.addColorStop(0, 'rgba(201,214,232,0.35)');
  glow.addColorStop(1, 'rgba(201,214,232,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  // 月盘暗底
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(30,38,54,0.9)';
  ctx.fill();

  // 受光面：按月相关键词简化渲染
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = C_LUNAR;
  if (moonPhase.includes('满')) {
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  } else if (moonPhase.includes('新')) {
    // 新月：几乎全暗，仅边缘一线
    ctx.fillRect(cx - r, cy - r, r * 0.18, r * 2);
  } else if (moonPhase.includes('上弦')) {
    ctx.fillRect(cx, cy - r, r, r * 2);
  } else if (moonPhase.includes('下弦')) {
    ctx.fillRect(cx - r, cy - r, r, r * 2);
  } else {
    // 通用（蛾眉/盈凸等）：左暗右亮的半盈
    ctx.fillRect(cx, cy - r, r * 1.35, r * 2);
  }
  ctx.restore();

  // 环形口
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,229,255,0.35)';
  ctx.stroke();
}

function formatDateCN(dateKey: string): string {
  // dateKey = YYYY-MM-DD
  const [y, m, d] = dateKey.split('-');
  return `${y}年${Number(m)}月${Number(d)}日`;
}

/** 渲染 1080×1080 分享图，返回 canvas 元素 */
export function renderDailyShareCanvas(payload: DailySkyPayload): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ===== 上 40%：天象渲染 =====
  drawNebulaAndStars(ctx, payload.dateKey);
  drawMoon(ctx, payload.moonPhase);

  // ===== 分隔线 =====
  ctx.fillStyle = 'rgba(0,229,255,0.25)';
  ctx.fillRect(0, 432, W, 1);

  // ===== 中 30%：主题区（432–756） =====
  ctx.textAlign = 'center';
  ctx.fillStyle = C_LUNAR;
  ctx.font = `300 26px ${SANS}`;
  ctx.fillText(`${formatDateCN(payload.dateKey)} · ${payload.moonPhase}`, W / 2, 500);

  ctx.fillStyle = C_TEXT;
  ctx.font = `300 72px ${SERIF_ZH}`;
  ctx.fillText('今日星象', W / 2, 596);

  ctx.fillStyle = C_CYAN;
  ctx.font = `300 32px ${SANS}`;
  ctx.fillText(payload.skyEventTitle, W / 2, 664);

  // ===== 下 30%：个性化区（756–1080） =====
  ctx.fillStyle = 'rgba(230,237,243,0.92)';
  ctx.font = `300 26px ${SANS}`;
  const noteLines = wrapText(ctx, payload.personalNote, W - 160);
  let y = 748;
  for (const line of noteLines.slice(0, 2)) {
    ctx.fillText(line, W / 2, y);
    y += 40;
  }

  ctx.fillStyle = C_TEXT;
  ctx.font = `italic 300 30px ${SERIF_ZH}`;
  const quoteLines = wrapText(ctx, `「${payload.quote}」`, W - 180);
  y += 18;
  for (const line of quoteLines.slice(0, 2)) {
    ctx.fillText(line, W / 2, y);
    y += 46;
  }

  ctx.fillStyle = C_LUNAR;
  ctx.font = `300 22px ${SANS}`;
  ctx.fillText(`—— ${payload.source}`, W / 2, y + 10);

  // 合规句脚注
  ctx.fillStyle = 'rgba(201,214,232,0.55)';
  ctx.font = `300 20px ${SANS}`;
  ctx.fillText(payload.compliance, W / 2, 992);

  // 品牌字标
  ctx.fillStyle = C_TEXT;
  ctx.font = `300 30px ${SERIF_ZH}`;
  ctx.fillText('命律 · TempoSoul', W / 2, 1042);

  return canvas;
}

/** 下载 PNG（a[download]，文件名 daily-sky-<dateKey>.png） */
export function downloadDailySharePng(payload: DailySkyPayload): void {
  const canvas = renderDailyShareCanvas(payload);
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `daily-sky-${payload.dateKey}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** 系统分享（navigator.share 带 File 优先），不支持则降级为下载 */
export async function shareDailySky(payload: DailySkyPayload): Promise<void> {
  const canvas = renderDailyShareCanvas(payload);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  const file = blob
    ? new File([blob], `daily-sky-${payload.dateKey}.png`, { type: 'image/png' })
    : null;
  if (file && typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: '今日星象' });
      return;
    } catch {
      /* 用户取消或分享失败 → 降级下载 */
    }
  }
  downloadDailySharePng(payload);
}

/** 组件：1080×1080 预览 + 下载/分享按钮（调用方传入 payload） */
export function DailySkyShareCanvas({ payload }: { payload: DailySkyPayload }): ReactElement {
  const ref = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const src = renderDailyShareCanvas(payload);
    const el = ref.current;
    if (el) {
      const ctx = el.getContext('2d');
      ctx?.drawImage(src, 0, 0);
    }
    setTick((t) => t + 1);
  }, [payload]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <canvas
        ref={ref}
        width={W}
        height={H}
        style={{
          width: '100%',
          maxWidth: 360,
          borderRadius: 8,
          border: '1px solid rgba(0,229,255,0.25)',
        }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => downloadDailySharePng(payload)}>下载分享图</button>
        <button onClick={() => void shareDailySky(payload)}>分享今日星象</button>
      </div>
    </div>
  );
}
