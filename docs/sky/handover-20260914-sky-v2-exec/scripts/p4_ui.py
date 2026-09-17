# -*- coding: utf-8 -*-
"""P4 执行：NebulaOverlay.tsx（R3/R9）+ SkyPage.tsx（§8.1 / §8.2 / §8.3）"""
import io, os

W = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
def rd(p): return io.open(os.path.join(W, p), encoding="utf-8").read()
def wr(p, t): io.open(os.path.join(W, p), "w", encoding="utf-8", newline="").write(t)
def rep(t, a, b, tag):
    assert a in t, "[MISS] " + tag
    return t.replace(a, b, 1)

# ================= A. NebulaOverlay.tsx =================
P = r"src\pages\SkyPage\NebulaOverlay.tsx"
t = rd(P)

t = rep(t,
"""    // 确定性星云团（种子固定 → 每次渲染一致；集中画面上部 70%）
    const blobs = Array.from({ length: 16 }, (_, i) => ({
      x: ((i * 137.508) % 100) / 100,
      y: 0.03 + (((i * 73.7) % 46) / 100) * 0.46,
      r: 0.16 + (((i * 31.4) % 42) / 100) * 0.34,
      hue: 188 + ((i * 47) % 52), // 青蓝 188 → 深蓝 240
      a: 0.10 + (((i * 17) % 28) / 100) * 0.16,
      drift: 0.2 + ((i * 11) % 20) / 100,
      squash: 0.5 + ((i * 13) % 30) / 100,
    }));""",
"""    /* R3：blob 16 → 9（A3 减法）；α 上限 0.26 → 0.15；只蒙天空区上部 y ≤ 0.70。 */
    const blobs = Array.from({ length: 9 }, (_, i) => ({
      x: ((i * 137.508) % 100) / 100,
      y: 0.03 + (((i * 73.7) % 46) / 100) * 0.42,
      r: 0.16 + (((i * 31.4) % 42) / 100) * 0.34,
      hue: 188 + ((i * 47) % 52), // 青蓝 188 → 深蓝 240
      a: Math.min(0.15, 0.06 + (((i * 17) % 28) / 100) * 0.09),
      drift: 0.2 + ((i * 11) % 20) / 100,
      squash: 0.5 + ((i * 13) % 30) / 100,
    }));

    /* §6.10：分形噪声遮罩（3 octave value noise，乘性 alpha 0.5–1.0），
       禁止 createRadialGradient 直填的硬边贴片感。128×128 平铺、一次性生成。 */
    const noiseTile = document.createElement('canvas');
    noiseTile.width = noiseTile.height = 128;
    {
      const nc = noiseTile.getContext('2d')!;
      const img = nc.createImageData(128, 128);
      const hash = (x: number, y: number) => {
        const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return s - Math.floor(s);
      };
      const oct = (x: number, y: number) => {
        let v = 0, amp = 0.5, fq = 1;
        for (let o = 0; o < 3; o++) {
          const gx = Math.floor(x * fq), gy = Math.floor(y * fq);
          const fx = x * fq - gx, fy = y * fq - gy;
          const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
          const a00 = hash(gx, gy), a10 = hash(gx + 1, gy);
          const a01 = hash(gx, gy + 1), a11 = hash(gx + 1, gy + 1);
          v += amp * ((a00 * (1 - sx) + a10 * sx) * (1 - sy) + (a01 * (1 - sx) + a11 * sx) * sy);
          amp *= 0.5; fq *= 2;
        }
        return v;
      };
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const i4 = (y * 128 + x) * 4;
          img.data[i4] = img.data[i4 + 1] = img.data[i4 + 2] = 255;
          img.data[i4 + 3] = Math.round(255 * (0.5 + 0.5 * oct(x / 22, y / 22)));
        }
      }
      nc.putImageData(img, 0, 0);
    }
    const noisePattern = ctx.createPattern(noiseTile, 'repeat')!;""",
"nebula.blobs")

t = rep(t, "      ctx.fillRect(0, 0, w, h * 0.55); // P1b：只蒙上部星空区，下部地貌区保持纯黑保证线稿对比度",
           "      ctx.fillRect(0, 0, w, h * 0.70); // R3/§6.10：只蒙天空区上部 y ≤ 0.70", "nebula.g0")

t = rep(t, "        const gg = ctx.createLinearGradient(0, hy - 30, 0, h * 0.72);",
           "        const gg = ctx.createLinearGradient(0, hy - 30, 0, h * 0.70);", "nebula.branch")

t = rep(t,
"""      if (!reduced) raf = requestAnimationFrame(frame);""",
"""      /* §6.10：叠分形噪声遮罩（destination-in 乘性 alpha，消除硬边贴片感） */
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = noisePattern;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      /* R9/§6.10：星云弥散只到 y ≤ 0.70，smoothstep(0.70, 0.80) 衰减至 0
         （交界带不叠亮；V25 的辉光峰值压暗由 layer L5 承担） */
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      const fy = ctx.createLinearGradient(0, h * 0.70, 0, h * 0.80);
      fy.addColorStop(0, 'rgba(0,0,0,0)');
      fy.addColorStop(0.5, 'rgba(0,0,0,0.5)');
      fy.addColorStop(1, 'rgba(0,0,0,1)');
      ctx.fillStyle = fy;
      ctx.fillRect(0, h * 0.70, w, h * 0.30);
      ctx.restore();

      if (!reduced) raf = requestAnimationFrame(frame);""",
"nebula.mask")

wr(P, t)
print("[OK] NebulaOverlay.tsx  %d chars" % len(t))

# ================= B. SkyPage.tsx =================
P = r"src\pages\SkyPage\SkyPage.tsx"
t = rd(P)

t = rep(t, "  const [hoveredConst, setHoveredConst] = useState<string | null>(null);",
           "  const [hoveredConst, setHoveredConst] = useState<string | null>(null);\n  const [brandHover, setBrandHover] = useState(false); // §8.3：二级入口（悬停品牌区展开）",
        "sky.brandHover.state")

# 根容器底色归 §4.1 token
t = rep(t,
"""    <div className="sky-root" style={{ position: 'fixed', inset: 0, background: '#030305', overflow: 'hidden', fontFamily: 'monospace' }}>""",
"""    <div className="sky-root" style={{ position: 'fixed', inset: 0, background: 'var(--bg-void, #000)', overflow: 'hidden' }}>""",
"sky.root")

# ---- <style> 追加 §8.1/§8.2/§8.3 类（保留既有工具类，SpatioTemporalPanel 仍依赖） ----
t = rep(t,
"""      <style>{`
        .sky-root { font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif; letter-spacing: 0.05em; }""",
"""      <style>{`
        /* §8.1 字体族：中文主标/地名 CJK 栈（T1/T2 禁止 monospace）；拉丁/数值 Space Grotesk；坐标/参数 JetBrains Mono */
        .sky-root { font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif; letter-spacing: 0.05em; }
        .sky-cjk { font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif; }
        .sky-lat { font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif; }
        .sky-mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
        /* §8.3 唯一按钮形态：半透明深青玻璃圆角胶囊；禁止 box-shadow 发光外扩 */
        .glass-pill { background: rgba(18,40,48,0.55); border: 1px solid rgba(120,200,215,0.35);
          border-radius: 999px; padding: 10px 26px; color: rgba(224,247,255,0.95);
          font-size: 14px; letter-spacing: 0.12em; backdrop-filter: blur(6px);
          cursor: pointer; transition: border-color .25s, background .25s; }
        .glass-pill:hover { border-color: rgba(150,222,236,0.62); background: rgba(22,50,60,0.66); }
        .glass-pill--sm { padding: 6px 18px; font-size: 12px; letter-spacing: 0.14em; }
        /* §8.2 字号层级（1920 基准；相邻层级比 ≥1.25×）T1 28 / T2 20 / T3 12 / T5 9 */
        .ui-t1 { font-size: 28px; letter-spacing: 0.18em; font-weight: 300; }
        .ui-t2 { font-size: 20px; letter-spacing: 0.32em; font-weight: 300; }
        .ui-t3 { font-size: 12px; letter-spacing: 0.30em; font-weight: 400; }
        .ui-t5 { font-size: 9px;  letter-spacing: 0.22em; font-weight: 300; }
        @media (max-width: 1080px) {
          .ui-t1 { font-size: 20px !important; }
          .ui-t2 { font-size: 15px !important; }
          .glass-pill { padding: 7px 16px; font-size: 12px; }
        }
        @media (max-width: 560px) {
          .ui-t1 { font-size: 16px !important; letter-spacing: 0.14em !important; }
          .ui-t3 { font-size: 10px !important; }
          .glass-pill { padding: 6px 12px; font-size: 11px; }
        }""",
"sky.style")

# ---- 左上品牌（§8.3 保留 + 去边框背景发光 + 二级入口悬停展开） ----
t = rep(t,
"""      {/* 左上：标题面板 + 定位状态徽标 */}
      <div className="top-title" style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, padding: '16px 22px', border: '1px solid rgba(0,229,255,0.5)', background: 'rgba(2,10,18,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 0 20px rgba(0,229,255,0.15)' }}>
        <h1 style={{ margin: 0, fontSize: 18, letterSpacing: 6, color: '#e0f7ff', fontWeight: 300 }}>命律 · TEMPOSOUL</h1>
        <div className="sub" style={{ fontSize: 10, color: 'rgba(0,229,255,0.7)', marginTop: 6, letterSpacing: 3 }}>CELESTIAL OBSERVATION SYSTEM</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 9, letterSpacing: 2, color: locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(143,232,255,0.6)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(143,232,255,0.6)', boxShadow: `0 0 8px ${locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(143,232,255,0.6)'}`, animation: 'pulse 1.6s infinite' }} />
          POSITION · {locSrc === 'gps' ? 'GPS PRECISE' : locSrc === 'ip' ? 'IP CITY-LEVEL' : locSrc === 'manual' ? 'MANUAL' : 'ACQUIRING...'}
        </div>
      </div>

      {/* 右上：按钮组 */}
      <div className="top-right" style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: 8 }}>
        <button className="hud-btn" onClick={handleSave}>保存星图</button>
        <button className="hud-btn" onClick={() => setIsPanelOpen(true)}>切换时空</button>
        <button className="hud-btn" onClick={() => window.location.href = '/'}>立即开始</button>
      </div>""",
"""      {/* §8.3 ① 左上品牌：纯文字浮在星空上（无边框/背景/发光）；二级入口悬停展开 */}
      <div
        style={{ position: 'absolute', top: 28, left: 28, zIndex: 10 }}
        onMouseEnter={() => setBrandHover(true)}
        onMouseLeave={() => setBrandHover(false)}
      >
        <h1 className="sky-cjk ui-t1" style={{ margin: 0, color: '#FFFFFF' }}>命律 TempoSoul</h1>
        <div className="sky-cjk ui-t3" style={{ marginTop: 8, color: 'rgba(255,255,255,0.60)' }}>探索命运的节律</div>
        {/* T5 微注：三层定位状态（红线：不得破坏已解决能力） */}
        <div className="sky-mono ui-t5" style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, color: locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(0,139,153,0.85)' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(0,139,153,0.85)', animation: 'pulse 1.6s infinite' }} />
          {locSrc === 'gps' ? 'GPS PRECISE' : locSrc === 'ip' ? 'IP CITY-LEVEL' : locSrc === 'manual' ? 'MANUAL' : 'ACQUIRING'}
        </div>
        {/* §8.3：保存星图 / 切换时空 移入二级入口（悬停品牌区展开） */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, opacity: brandHover ? 1 : 0, pointerEvents: brandHover ? 'auto' : 'none', transition: 'opacity .25s ease' }}>
          <button className="glass-pill glass-pill--sm" onClick={handleSave}>保存星图</button>
          <button className="glass-pill glass-pill--sm" onClick={() => setIsPanelOpen(true)}>切换时空</button>
        </div>
      </div>

      {/* §8.3 ② 右上：仅保留 1 个「立即开始」玻璃胶囊 */}
      <div style={{ position: 'absolute', top: 28, right: 28, zIndex: 10 }}>
        <button className="glass-pill" onClick={() => { window.location.href = '/'; }}>立即开始</button>
      </div>""",
"sky.brand")

# ---- 删除左侧 OBSERVATION DATA 面板 与 右侧 SKY MAP PARAMETERS 面板 ----
t = rep(t,
"""      {/* 左侧面板：观测信息 */}
      <div className="side-panel" style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10, padding: '20px 22px', border: '1px solid rgba(0,229,255,0.45)', background: 'rgba(2,10,18,0.85)', backdropFilter: 'blur(8px)', width: 220, boxShadow: '0 0 20px rgba(0,229,255,0.12)' }}>
        <div style={{ fontSize: 10, color: '#00e5ff', letterSpacing: 3, marginBottom: 12, borderBottom: '1px solid rgba(0,229,255,0.3)', paddingBottom: 8 }}>OBSERVATION DATA</div>
        <div style={{ fontSize: 13, color: 'rgba(220,245,255,0.9)', lineHeight: 2.1 }}>
          <div>位置 <span style={{ float: 'right', color: '#00e5ff', fontWeight: 400 }}>{city.n}</span></div>
          <div>纬度 <span style={{ float: 'right', color: '#00e5ff' }}>{city.lat.toFixed(2)}°N</span></div>
          <div>经度 <span style={{ float: 'right', color: '#00e5ff' }}>{city.lon.toFixed(2)}°E</span></div>
          <div>定位源 <span style={{ float: 'right', color: locSrc === 'gps' ? '#4dffb8' : '#00e5ff' }}>{locSrc === 'gps' ? 'GPS 精确' : locSrc === 'ip' ? 'IP 城市级' : locSrc === 'manual' ? '手动' : '获取中'}</span></div>
          <div>时间 <span style={{ float: 'right', color: '#00e5ff' }}>{currentDateTime.slice(5,16).replace('T',' ')}</span></div>
        </div>
      </div>

      {/* 右侧面板：星图参数 */}
      <div className="side-panel" style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10, padding: '20px 22px', border: '1px solid rgba(0,229,255,0.45)', background: 'rgba(2,10,18,0.85)', backdropFilter: 'blur(8px)', width: 220, boxShadow: '0 0 20px rgba(0,229,255,0.12)' }}>
        <div style={{ fontSize: 10, color: '#00e5ff', letterSpacing: 3, marginBottom: 12, borderBottom: '1px solid rgba(0,229,255,0.3)', paddingBottom: 8 }}>SKY MAP PARAMETERS</div>
        <div style={{ fontSize: 13, color: 'rgba(220,245,255,0.9)', lineHeight: 2.1 }}>
          <div>星等阈值 <span style={{ float: 'right', color: '#00e5ff' }}>6.0 mag</span></div>
          <div>可见星数 <span style={{ float: 'right', color: '#00e5ff' }}>5044</span></div>
          <div>星座线段 <span style={{ float: 'right', color: '#00e5ff' }}>566</span></div>
          <div>视场角 <span style={{ float: 'right', color: '#00e5ff' }}>58°</span></div>
        </div>
      </div>

      {/* 左下角：坐标十字标记 */}
      <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, border: '1px solid rgba(0,229,255,0.4)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,229,255,0.4)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,229,255,0.4)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, background: '#00e5ff', transform: 'translate(-50%,-50%)', boxShadow: '0 0 6px #00e5ff' }} />
        </div>
        <div style={{ fontSize: 9, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>N ↑</div>
      </div>""",
"""      {/* §8.3：观测数据面板 / 星图参数面板 —— 删除（Q1 定案：隐藏，V7 HUD ≤ 3 处） */}

      {/* §8.3：左下坐标十字 —— 保留但压暗至 L6（α ≤ 0.14） */}
      <div style={{ position: 'absolute', bottom: 28, left: 28, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 26, height: 26, border: '1px solid rgba(0,229,255,0.14)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,229,255,0.14)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,229,255,0.14)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, background: 'rgba(0,229,255,0.14)', transform: 'translate(-50%,-50%)' }} />
        </div>
        <div className="sky-mono ui-t5" style={{ color: 'rgba(0,139,153,0.55)' }}>N ↑</div>
      </div>""",
"sky.panels")

# ---- 中央地名：T2（20px / 0.32em / 300 / text-bright@0.96）；去 monospace；去 translateY 半像素 ----
t = rep(t,
"""        <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translate(-50%, -50%)', zIndex: 6, textAlign: 'center', fontFamily: 'monospace', pointerEvents: 'none' }}>
          <div style={{ fontSize: 17, color: 'rgba(224,247,255,0.96)', letterSpacing: 8, textShadow: '0 0 14px rgba(0,229,255,0.85), 0 0 40px rgba(0,229,255,0.3)', fontWeight: 300 }}>{currentCity.n}</div>
          <div style={{ fontSize: 10, color: 'rgba(143,232,255,0.62)', letterSpacing: 3, marginTop: 8 }}>{currentCity.lat.toFixed(4)}°N {currentCity.lon.toFixed(4)}°E · {currentDateTime.slice(11, 16)} CST · 此刻星空</div>
        </div>""",
"""        <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translateX(-50%)', zIndex: 6, textAlign: 'center', pointerEvents: 'none' }}>
          <div className="sky-cjk ui-t2" style={{ color: 'rgba(255,255,255,0.96)' }}>{currentCity.n}</div>
          <div className="sky-mono ui-t5" style={{ marginTop: 10, color: 'rgba(0,139,153,0.85)' }}>{currentCity.lat.toFixed(4)}°N {currentCity.lon.toFixed(4)}°E · {currentDateTime.slice(11, 16)} CST · 此刻星空</div>
        </div>""",
"sky.citylabel")

# ---- 底部时间滑块：保留核心交互，去掉 00/23 之外装饰 ----
t = rep(t,
"""      <div className="time-bar" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 10, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>00</span>
        <input type="range" min={0} max={23} value={hour} onChange={e => handleSlider(Number(e.target.value))} className="time-slider" />
        <span style={{ fontSize: 10, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>23</span>
      </div>""",
"""      <div className="time-bar" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
        <span className="sky-mono ui-t5" style={{ color: 'rgba(0,139,153,0.55)' }}>00</span>
        <input type="range" min={0} max={23} value={hour} onChange={e => handleSlider(Number(e.target.value))} className="time-slider" aria-label="观测时刻" />
        <span className="sky-mono ui-t5" style={{ color: 'rgba(0,139,153,0.55)' }}>23</span>
      </div>""",
"sky.timeslider")

# ---- 右下版本标记：压暗至 cyan-dim @0.4，8px ----
t = rep(t,
"""      <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10, textAlign: 'right', fontSize: 9, color: 'rgba(143,232,255,0.4)', letterSpacing: 2, lineHeight: 2 }}>""",
"""      <div className="sky-mono" style={{ position: 'absolute', bottom: 28, right: 28, zIndex: 10, textAlign: 'right', fontSize: 8, letterSpacing: '0.22em', color: 'rgba(0,139,153,0.4)', lineHeight: 2 }}>""",
"sky.version")

wr(P, t)
print("[OK] SkyPage.tsx  %d chars" % len(t))
print("P4 DONE")
