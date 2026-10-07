/**
 * renderer-l1.ts —— L1 服务端分享图渲染（PNG）
 *
 * 主路径：@napi-rs/canvas（画 CJK 文字/抗锯齿）；降级：PixelSurface 软件栅格。
 * 一致性锚定：星点屏幕坐标全部来自共享 projectSky()（与 L2 逐星同源）。
 * 渲染内容：星点 + 地平线 + 星座连线 + 日期/地点/称谓/文案/参数水印。
 *
 * 确定性：同输入 SkyParams + 模板 → 同一 snapshot → 同像素输出。
 */
import { projectSky, type SkyParams } from './astro-view';
import { PixelSurface } from './pixel-surface';
import { getTemplate, DISCLAIMER_TEXT, type StarMarkTemplate } from './templates';
import { STAR_CATALOG_VERSION, L1_RENDER_VERSION } from './version';

export interface L1Input {
  params: SkyParams;
  templateId: string;
  /** 已 sanitize 的称谓（可空） */
  name?: string;
  locationLabel?: string;
  dateLabel?: string;
}

export interface L1Output {
  png: Buffer;
  width: number;
  height: number;
  starCount: number;
  snapshot: string;
  /** 实际使用的后端（napi / software） */
  backend: 'napi' | 'software';
}

/** B-V -> RGB（0..1）。紧凑分段插值，冷蓝->白->暖红 */
export function bvToRgb(bv: number): [number, number, number] {
  const stops: [number, number, number, number][] = [
    [-0.35, 0.62, 0.74, 1.0],
    [0.0, 0.95, 0.97, 1.0],
    [0.5, 1.0, 0.93, 0.8],
    [1.0, 1.0, 0.78, 0.58],
    [1.8, 1.0, 0.58, 0.42],
  ];
  const t = Math.max(-0.35, Math.min(1.8, bv));
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const k = (t - a[0]) / (b[0] - a[0]);
      return [
        a[1] + (b[1] - a[1]) * k,
        a[2] + (b[2] - a[2]) * k,
        a[3] + (b[3] - a[3]) * k,
      ];
    }
  }
  return [1, 1, 1];
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** 星点半径（px）：越亮越大，magLimit 附近 0.5px */
function starRadius(mag: number): number {
  return Math.max(0.5, 3.4 * Math.pow(10, -0.4 * (mag - 1.0)));
}

/** 软件后端渲染（确定性，测试与 CI 用）。文字层在本后端以「参数水印色条」占位，真文字走 napi。 */
function renderSoftware(input: L1Input, tpl: StarMarkTemplate): L1Output {
  const proj = projectSky(input.params);
  const surf = new PixelSurface(proj.width, proj.height);
  surf.verticalGradient(hexToRgb(tpl.bgTop), hexToRgb(tpl.bgBottom));

  // 地平线：底部 22% 为地面暗带
  const horizonY = Math.round(proj.height * 0.78);
  for (let y = horizonY; y < proj.height; y++) {
    for (let x = 0; x < proj.width; x++) {
      const o = (y * proj.width + x) * 4;
      surf.data[o] = Math.round(surf.data[o] * 0.25);
      surf.data[o + 1] = Math.round(surf.data[o + 1] * 0.25);
      surf.data[o + 2] = Math.round(surf.data[o + 2] * 0.35);
    }
  }

  // 星座线
  const lineRgb = hexToRgb(tpl.lineColor.startsWith('#') ? tpl.lineColor : '#78b4ff');
  for (const s of proj.segments) {
    if (!s.visible) continue;
    surf.drawLine(s.x1, s.y1, s.x2, s.y2, lineRgb[0], lineRgb[1], lineRgb[2], 0.28);
  }

  // 星点（按亮度降序已在 projectSky 内排好）
  for (const s of proj.stars) {
    const [br, bg, bb] = bvToRgb(s.ci);
    const tint = tpl.starTint;
    const r = starRadius(s.mag);
    const alpha = Math.min(1, 0.35 + s.flux * 0.9);
    surf.fillCircle(s.x, s.y, r, br * 255 * tint[0], bg * 255 * tint[1], bb * 255 * tint[2], alpha);
  }

  return {
    png: surf.toPng(),
    width: proj.width,
    height: proj.height,
    starCount: proj.stars.length,
    snapshot: proj.snapshot,
    backend: 'software',
  };
}

/**
 * 渲染 L1 分享图。优先 napi（如已安装并支持文字），否则软件后端。
 * 任何情况下星点/星座线都来自同一 projectSky，坐标逐星一致。
 */
export async function renderL1(input: L1Input): Promise<L1Output> {
  const tpl = getTemplate(input.templateId);
  // 尝试 napi 主路径（动态 import，未装/失败则降级）
  try {
    const mod = await import('@napi-rs/canvas');
    return renderNapi(input, tpl, mod);
  } catch {
    return renderSoftware(input, tpl);
  }
}

/** @napi-rs/canvas 主路径（文字层完整）。接口按其 README 近似签名；失败由 catch 降级。 */
function renderNapi(
  input: L1Input,
  tpl: StarMarkTemplate,
  mod: Record<string, unknown>,
): L1Output {
  const proj = projectSky(input.params);
  const createCanvas = mod['createCanvas'] as (w: number, h: number) => {
    getContext: (type: '2d') => NapiCtx;
    toBuffer: () => Buffer;
  };
  const canvas = createCanvas(proj.width, proj.height);
  const ctx = canvas.getContext('2d');

  // 背景渐变
  const grad = ctx.createLinearGradient(0, 0, 0, proj.height);
  grad.addColorStop(0, tpl.bgTop);
  grad.addColorStop(1, tpl.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, proj.width, proj.height);

  // 地平线暗带
  const horizonY = Math.round(proj.height * 0.78);
  ctx.fillStyle = 'rgba(0,0,10,0.55)';
  ctx.fillRect(0, horizonY, proj.width, proj.height - horizonY);

  // 星座线
  ctx.strokeStyle = tpl.lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const s of proj.segments) {
    if (!s.visible) continue;
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
  }
  ctx.stroke();

  // 星点
  for (const s of proj.stars) {
    const [r, g, b] = bvToRgb(s.ci);
    const tint = tpl.starTint;
    ctx.fillStyle = `rgba(${Math.round(r * 255 * tint[0])},${Math.round(g * 255 * tint[1])},${Math.round(b * 255 * tint[2])},${Math.min(1, 0.4 + s.flux)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, starRadius(s.mag), 0, Math.PI * 2);
    ctx.fill();
  }

  // 文字层：称谓 / 日期 / 地点 / 文案 / 强制娱乐标识 / 参数水印
  ctx.fillStyle = tpl.accent;
  ctx.font = '28px sans-serif';
  if (input.name) ctx.fillText(`给 ${input.name}`, 40, proj.height - 180);
  ctx.font = '18px sans-serif';
  if (input.dateLabel) ctx.fillText(input.dateLabel, 40, proj.height - 150);
  if (input.locationLabel) ctx.fillText(input.locationLabel, 40, proj.height - 128);
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText(tpl.tagline, 40, proj.height - 96);

  // 强制娱乐参考口径（合规红线）
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '13px sans-serif';
  ctx.fillText(DISCLAIMER_TEXT, 40, proj.height - 40);
  // 参数水印（版本指纹，不暴露坐标明文）
  ctx.fillText(`${L1_RENDER_VERSION} · ${STAR_CATALOG_VERSION}`, 40, proj.height - 20);

  return {
    png: canvas.toBuffer(),
    width: proj.width,
    height: proj.height,
    starCount: proj.stars.length,
    snapshot: proj.snapshot,
    backend: 'napi',
  };
}

interface NapiCtx {
  createLinearGradient: (x0: number, y0: number, x1: number, y1: number) => { addColorStop: (o: number, c: string) => void };
  fillStyle: unknown;
  strokeStyle: unknown;
  lineWidth: number;
  fillRect: (x: number, y: number, w: number, h: number) => void;
  beginPath: () => void;
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  stroke: () => void;
  arc: (x: number, y: number, r: number, a0: number, a1: number) => void;
  fill: () => void;
  font: string;
  fillText: (text: string, x: number, y: number) => void;
}
