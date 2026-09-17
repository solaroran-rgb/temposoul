/**
 * NebulaOverlay —— P1b 星云氛围层（jinan-v2 视觉基准：深空枝杈星云 + 弥散团块）
 * 独立 Canvas 2D 叠加层，位于 WebGL 场景之上、HUD 之下（pointer-events: none）。
 * 程序化生成：确定性种子团块（青蓝/深蓝弥散）+ 地平线枝杈条带 + 缓慢漂移呼吸。
 * 性能：DPR 上限 1.5；prefers-reduced-motion 时仅渲染静态一帧。
 */
import { useEffect, useRef } from 'react';

export function NebulaOverlay() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 确定性星云团（种子固定 → 每次渲染一致；集中画面上部 70%）
    const blobs = Array.from({ length: 16 }, (_, i) => ({
      x: ((i * 137.508) % 100) / 100,
      y: 0.03 + (((i * 73.7) % 46) / 100) * 0.46,
      r: 0.16 + (((i * 31.4) % 42) / 100) * 0.34,
      hue: 188 + ((i * 47) % 52), // 青蓝 188 → 深蓝 240
      a: 0.1 + (((i * 17) % 28) / 100) * 0.16,
      drift: 0.2 + ((i * 11) % 20) / 100,
      squash: 0.5 + ((i * 13) % 30) / 100,
    }));

    function resize() {
      if (!canvas || !ctx) return;
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(now: number) {
      if (!canvas || !ctx) return;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      // 上部深空微光（左上为主，jinan-v2 星云偏上）
      const g0 = ctx.createRadialGradient(w * 0.28, h * 0.1, 0, w * 0.28, h * 0.1, w * 0.72);
      g0.addColorStop(0, 'rgba(8,46,88,0.28)');
      g0.addColorStop(0.55, 'rgba(4,24,52,0.10)');
      g0.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g0;
      ctx.fillRect(0, 0, w, h * 0.55); // P1b：只蒙上部星空区，下部地貌区保持纯黑保证线稿对比度

      // 星云弥散团块（呼吸 + 慢漂移）
      for (const b of blobs) {
        const x = b.x * w + Math.sin(t * 0.045 + b.drift * 7) * 26;
        const y = b.y * h + Math.cos(t * 0.03 + b.drift * 5) * 12;
        const r = b.r * w * 0.6;
        const breathe = 0.85 + 0.15 * Math.sin(t * 0.35 + b.drift * 9);
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, `hsla(${b.hue}, 82%, 46%, ${b.a * breathe})`);
        rg.addColorStop(0.55, `hsla(${b.hue}, 76%, 30%, ${b.a * 0.42})`);
        rg.addColorStop(1, 'hsla(204, 72%, 22%, 0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * b.squash, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 地平线枝杈星云（细长弥散条带，双层 sin 波扭曲；jinan-v2 下半部与地貌交界处的枝杈）
      const hy = h * 0.42; // P1b：枝杈星云位于星空底部（地貌区上方），不再蒙住山体
      ctx.save();
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.moveTo(-20, hy + 8 + k * 10);
        for (let x = 0; x <= w + 24; x += 24) {
          const y =
            hy +
            Math.sin(x * 0.008 + t * 0.1 + k * 1.9) * 16 +
            Math.sin(x * 0.021 - t * 0.06 + k) * 9 +
            k * 6;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + 20, h + 60);
        ctx.lineTo(-20, h + 60);
        ctx.closePath();
        const gg = ctx.createLinearGradient(0, hy - 30, 0, h * 0.72);
        gg.addColorStop(0, `rgba(0,128,196,${0.13 - k * 0.03})`);
        gg.addColorStop(1, 'rgba(0,58,110,0)');
        ctx.fillStyle = gg;
        ctx.fill();
      }
      ctx.restore();

      // 细微青色粒子浮尘（星云带内）
      ctx.save();
      for (let i = 0; i < 26; i++) {
        const px = ((i * 61.8 + t * 4) % (w + 60)) - 30;
        const py = h * (0.32 + (((i * 37.3) % 22) / 100) * 0.24);
        ctx.fillStyle = `rgba(120,225,255,${0.1 + (((i * 13) % 12) / 100) * 0.12})`;
        ctx.fillRect(px, py, 1.4, 1.4);
      }
      ctx.restore();

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    if (reduced) {
      frame(0);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
}
