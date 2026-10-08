/**
 * ① HomeHero（S-6 首页片）：真实星空全屏 Hero。
 *
 * 三层渲染降级链（绝不白屏）：
 *   层1 WebGL2：动态 import createSkyScene（three.js 独立 chunk，不阻塞首屏），
 *              成功即覆盖于最上层；WebGL2 不可用 / 抛错 / chunk 加载失败 → 摘除 canvas。
 *   层2 Canvas2D：StarfieldBackground 粒子增强（已内置 prefers-reduced-motion 静态帧、
 *              移动端按面积降星数）。
 *   层3 SVG 静态深空 data-URI + 深空渐变（CSS 最底层，永远在位）。
 *
 * 数据驱动：WebGL 层以「此刻」真实天文时刻 setTimeLocation 渲染（真实月相/星位，
 * 由既有 sky lib 的 computeMoon 计算）；reduced-motion 下不加载重型 three.js，静态帧呈现。
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SkySceneApi } from '@/lib/sky/SkyScene';
import { injectHolographicTokens } from '@/theme/holographic-tokens';
import { StarfieldBackground } from '@/components/StarfieldBackground';

export function HomeHero() {
  const navigate = useNavigate();
  const webglMountRef = useRef<HTMLDivElement | null>(null);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion：静态帧（层2 Canvas2D 单帧 + 层3 SVG 兜底），不加载 three.js
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let cancelled = false;
    let api: SkySceneApi | null = null;
    let canvas: HTMLCanvasElement | null = null;

    // 层1：异步加载 WebGL 场景；任何失败都落到下方 Canvas2D / SVG 层
    import('@/lib/sky/SkyScene')
      .then(({ createSkyScene }) => {
        if (cancelled || !webglMountRef.current) return;
        injectHolographicTokens();
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        webglMountRef.current.appendChild(canvas);
        try {
          api = createSkyScene(canvas);
        } catch {
          api = null;
        }
        if (!api) {
          // WebGL2 不可用（createSkyScene 内部已判 isWebGL2Available 返回 null）
          canvas.remove();
          canvas = null;
          return;
        }
        // 数据驱动：以「此刻」真实天文时刻渲染（月相/星位真实）；取中性中纬度视角。
        api.start(null);
        api.setTimeLocation(new Date(), { lat: 35.0, lon: 110.0 });
        if (!cancelled) setWebglReady(true);
      })
      .catch(() => {
        /* three.js chunk 加载失败：保持层2/层3，绝不白屏 */
      });

    return () => {
      cancelled = true;
      try {
        api?.dispose();
      } catch {
        /* 销毁失败忽略 */
      }
      canvas?.remove();
    };
  }, []);

  function scrollToToday() {
    document.getElementById('today-sky')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section className="home-hero" aria-label="命律首页星空">
      <div className="home-hero__bg" aria-hidden="true" />
      <StarfieldBackground />
      <div
        ref={webglMountRef}
        className="home-hero__webgl"
        aria-hidden="true"
        data-webgl-ready={webglReady ? '1' : '0'}
      />
      <div className="home-hero__inner">
        <p className="home-hero__brand">命律 · TempoSoul</p>
        <h1 className="home-hero__title">真实星空之下，今日一句</h1>
        <p className="home-hero__subtitle">
          以天文数据还原此刻月相与星位，搭配东方文化经典引文，中性呈现。
        </p>
        <div className="home-hero__ctas">
          <button type="button" className="home-btn home-btn--primary" onClick={scrollToToday}>
            查看今日新款
          </button>
          <button
            type="button"
            className="home-btn home-btn--secondary"
            onClick={() => navigate('/sky')}
          >
            探索星空
          </button>
        </div>
        <p className="home-hero__trust">天文数据驱动 · 多语支持 · 合规呈现</p>
      </div>
    </section>
  );
}
