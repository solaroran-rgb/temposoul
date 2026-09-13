/**
 * @file 探索星空首屏
 * 集成适配：class SkyScene → 函数式 createSkyScene(canvas)（E3 SceneCoreApi）。
 *   - token 注入：E4 injectHolographicTokens（HUD 样式变量单源）
 *   - 星座悬停：setConstellationHoverHandler 通道（class 版既有功能，函数式由集成层恢复）
 *   - 时空切换：setTimeLocation(date, geo)（内部触发重算 + 城市加载）
 *   - 保存：captureFrame(cb) 回调形态（与 render 同帧，G3）
 *   - UI 布局保留既有实时数据面板（城市/时间/星座信息卡/时间滑块）；
 *     E4 HUDLayout 作为独立组件落库（SVG 引出线 + 高密度面板），其四角面板数据为静态占位，
 *     与实时需求冲突，未强制接管本页（见交付说明）。
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { createSkyScene, setConstellationHoverHandler, type SkySceneApi } from '../../lib/sky/SkyScene';
import { injectHolographicTokens } from '@/theme/holographic-tokens';
import { SpatioTemporalPanel, City } from './SpatioTemporalPanel';
import { constInfoOf } from '../../lib/sky/constellationInfo';
import { toJulianDay, localSiderealTime, radecToAltAz, DEG } from '../../lib/sky/astro';

export function SkyPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SkySceneApi | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [err, setErr] = useState('');
  const [hoveredConst, setHoveredConst] = useState<string | null>(null);

  const applySpatioTemporal = useCallback((lat: number, lon: number, date: Date) => {
    sceneRef.current?.setTimeLocation(date, { lat, lon });
  }, []);

  useEffect(() => {
    if (!mountRef.current || !currentCity) return; // 城市确定后挂载点才存在（loading 分支无 mountRef）
    injectHolographicTokens(); // E4：token → CSS Variables（DOM 层与 WebGL 层同源）
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mountRef.current.appendChild(canvas);
    try {
      const api = createSkyScene(canvas);
      if (!api) { setErr('WebGL2 不可用，已切换静态降级路径'); return; }
      sceneRef.current = api;
      setConstellationHoverHandler(setHoveredConst);
      api.start(null); // 城市数据到达后经 setTimeLocation → swapCity
      // 初始对齐（城市加载先于场景创建时，此前 applySpatioTemporal 已空转）
      api.setTimeLocation(new Date(), { lat: currentCity.lat, lon: currentCity.lon });
      return () => { setConstellationHoverHandler(null); api.dispose(); canvas.remove(); };
    } catch (e: any) {
      setErr(e?.stack || String(e));
    }
  }, [currentCity]);

  useEffect(() => {
    fetch('/data/cities.json')
      .then(r => r.json())
      .then(async (data: City[]) => {
        setCities(data);
        // URL 参数优先：?lat=..&lon=..&name=..
        const usp = new URLSearchParams(window.location.search);
        const pLat = parseFloat(usp.get('lat') || '');
        const pLon = parseFloat(usp.get('lon') || '');
        const pName = usp.get('name') || '自定义观测点';
        if (pLat && pLon) {
          const manual: City = { n: pName, lat: pLat, lon: pLon, py: pName.toLowerCase(), prov: '自定义' };
          setCurrentCity(manual);
          applySpatioTemporal(pLat, pLon, new Date());
          return;
        }
        // 先默认济南
        let jn = data.find(c => c.n === '济南') || data[0];
        // 再尝试 IP 定位
        try {
          const lr = await fetch('/api/locate');
          const lj = await lr.json();
          if (lj.lat && lj.lon) {
            // 在 cities.json 里找最近的城市
            let best = jn, bd = 1e9;
            for (const c of data) {
              const d = (c.lat - lj.lat) ** 2 + (c.lon - lj.lon) ** 2;
              if (d < bd) { bd = d; best = c; }
            }
            jn = best;
          }
        } catch {}
        setCurrentCity(jn);
        applySpatioTemporal(jn.lat, jn.lon, new Date());
      })
      .catch(e => setErr(String(e)));
  }, [applySpatioTemporal]);

  const handleApply = useCallback((city: City, dateTime: string) => {
    setCurrentCity(city);
    setCurrentDateTime(dateTime);
    applySpatioTemporal(city.lat, city.lon, new Date(dateTime));
  }, [applySpatioTemporal]);

  const handleSave = () => {
    if (!sceneRef.current) return;
    sceneRef.current.captureFrame((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `temposoul-${currentCity?.n || 'sky'}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleSlider = (hour: number) => {
    if (!currentCity) return;
    const d = new Date(currentDateTime);
    d.setHours(hour, 0, 0, 0);
    setCurrentDateTime(d.toISOString().slice(0, 16));
    applySpatioTemporal(currentCity.lat, currentCity.lon, d);
  };

  if (err) {
    return <div style={{ color: '#f66', padding: 20, background: '#000', height: '100vh', whiteSpace: 'pre-wrap' }}>{err}</div>;
  }
  if (!currentCity) {
    return <div style={{ color: '#00e5ff', background: '#030305', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>加载星域数据...</div>;
  }

  const hour = new Date(currentDateTime).getHours();

  return (
    <div className="sky-root" style={{ position: 'fixed', inset: 0, background: '#030305', overflow: 'hidden', fontFamily: 'monospace' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      <style>{`
        .sky-root { font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif; letter-spacing: 0.05em; }
        .sky-root .hud-btn { background: transparent; border: 1px solid rgba(0,229,255,0.35); color: #8fe8ff; padding: 8px 18px; border-radius: 2px; cursor: pointer; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 300; transition: all 0.3s; }
        .sky-root .hud-btn:hover { border-color: #00e5ff; color: #fff; box-shadow: 0 0 12px rgba(0,229,255,0.4), inset 0 0 8px rgba(0,229,255,0.1); background: rgba(0,229,255,0.08); }
        .panel-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.6); opacity: 0; pointer-events: none; transition: opacity 300ms ease; backdrop-filter: blur(2px); }
        .panel-overlay.active { opacity: 1; pointer-events: auto; }
        .panel-content { position: absolute; right: 0; top: 0; bottom: 0; width: 320px; background: rgba(3,8,12,0.92); backdrop-filter: blur(16px); border-left: 1px solid rgba(0,229,255,0.2); padding: 32px 28px; transform: translateX(100%); transition: transform 300ms cubic-bezier(0.16,1,0.3,1); display: flex; flex-direction: column; gap: 18px; }
        .panel-content.active { transform: translateX(0); }
        .hud-input { width: 100%; background: rgba(0,229,255,0.03); border: 1px solid rgba(0,229,255,0.2); color: #c8f0fa; padding: 10px 14px; border-radius: 2px; outline: none; box-sizing: border-box; font-size: 13px; }
        .hud-input:focus { border-color: #00e5ff; box-shadow: 0 0 8px rgba(0,229,255,0.2); }
        .hud-btn-primary { margin-top: auto; padding: 14px; border-radius: 2px; border: 1px solid #00e5ff; background: transparent; color: #00e5ff; font-weight: 400; cursor: pointer; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; transition: all 0.3s; }
        .hud-btn-primary:hover { background: rgba(0,229,255,0.1); box-shadow: 0 0 16px rgba(0,229,255,0.3); }
        .city-list-container { max-height: 260px; overflow-y: auto; border: 1px solid rgba(0,229,255,0.15); border-radius: 2px; }
        .city-list-container::-webkit-scrollbar { width: 4px; }
        .city-list-container::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); }
        .city-item { padding: 10px 14px; cursor: pointer; color: rgba(200,240,250,0.5); font-size: 13px; transition: all 0.2s; }
        .city-item:hover { background: rgba(0,229,255,0.08); color: #c8f0fa; }
        .city-item.active { background: rgba(0,229,255,0.15); color: #00e5ff; border-left: 2px solid #00e5ff; }
        .time-slider { -webkit-appearance: none; width: 100%; height: 1px; background: rgba(0,229,255,0.3); outline: none; }
        .time-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #00e5ff; border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px #00e5ff; }
        .const-card { width: 380px; max-width: 92vw; }
        .time-bar { width: 50%; max-width: 440px; }
        .side-panel { transition: opacity 300ms ease; }
        @media (max-width: 1080px) {
          .side-panel { opacity: 0; pointer-events: none; }
          .top-title { padding: 10px 14px !important; }
          .top-title h1 { font-size: 14px !important; letter-spacing: 3px !important; }
          .top-title .sub { font-size: 8px !important; }
          .hud-btn { padding: 6px 10px !important; font-size: 10px !important; }
          .time-bar { width: 62%; }
        }
        @media (max-width: 560px) {
          .hud-btn { padding: 5px 8px !important; font-size: 9px !important; letter-spacing: 0.05em !important; }
          .top-right { gap: 4px !important; }
        }
      `}</style>

      {/* 左上：标题面板 */}
      <div className="top-title" style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, padding: '16px 22px', border: '1px solid rgba(0,229,255,0.5)', background: 'rgba(2,10,18,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 0 20px rgba(0,229,255,0.15)' }}>
        <h1 style={{ margin: 0, fontSize: 18, letterSpacing: 6, color: '#e0f7ff', fontWeight: 300 }}>命律 · TEMPOSOUL</h1>
        <div className="sub" style={{ fontSize: 10, color: 'rgba(0,229,255,0.7)', marginTop: 6, letterSpacing: 3 }}>CELESTIAL OBSERVATION SYSTEM</div>
      </div>

      {/* 右上：按钮组 */}
      <div className="top-right" style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: 8 }}>
        <button className="hud-btn" onClick={handleSave}>保存星图</button>
        <button className="hud-btn" onClick={() => setIsPanelOpen(true)}>切换时空</button>
        <button className="hud-btn" onClick={() => window.location.href = '/'}>立即开始</button>
      </div>

      {/* 左侧面板：观测信息 */}
      <div className="side-panel" style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10, padding: '20px 22px', border: '1px solid rgba(0,229,255,0.45)', background: 'rgba(2,10,18,0.85)', backdropFilter: 'blur(8px)', width: 220, boxShadow: '0 0 20px rgba(0,229,255,0.12)' }}>
        <div style={{ fontSize: 10, color: '#00e5ff', letterSpacing: 3, marginBottom: 12, borderBottom: '1px solid rgba(0,229,255,0.3)', paddingBottom: 8 }}>OBSERVATION DATA</div>
        <div style={{ fontSize: 13, color: 'rgba(220,245,255,0.9)', lineHeight: 2.1 }}>
          <div>位置 <span style={{ float: 'right', color: '#00e5ff', fontWeight: 400 }}>{currentCity.n}</span></div>
          <div>纬度 <span style={{ float: 'right', color: '#00e5ff' }}>{currentCity.lat.toFixed(2)}°N</span></div>
          <div>经度 <span style={{ float: 'right', color: '#00e5ff' }}>{currentCity.lon.toFixed(2)}°E</span></div>
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
      </div>

      {/* 星座信息卡（悬停星座标签显示） */}
      {hoveredConst && (() => {
        const info = constInfoOf(hoveredConst);
        if (!info) return null;
        const jd = toJulianDay(new Date(currentDateTime).getTime());
        const lst = localSiderealTime(jd, currentCity.lon);
        const altAz = radecToAltAz(info.raH * 15 * DEG, info.decD * DEG, lst, currentCity.lat * DEG);
        const altDeg = altAz.alt / DEG;
        const visible = altDeg > 0;
        return (
          <div className="const-card" style={{ position: 'absolute', bottom: 84, left: '50%', transform: 'translateX(-50%)', zIndex: 10, padding: '14px 18px', border: '1px solid rgba(0,229,255,0.5)', background: 'rgba(2,10,18,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 0 24px rgba(0,229,255,0.18)', fontFamily: 'monospace' }}>
            <div style={{ fontSize: 15, color: '#e0f7ff', letterSpacing: 3, fontWeight: 400, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span>{info.zh} <span style={{ fontSize: 11, color: 'rgba(0,229,255,0.75)', marginLeft: 6, letterSpacing: 2 }}>{info.key.toUpperCase()}</span></span>
              <span style={{ fontSize: 10, color: visible ? '#4dffb8' : 'rgba(255,170,120,0.8)', letterSpacing: 1 }}>{visible ? '● 地平线上' : '○ 地平线下'}</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(200,240,250,0.85)', lineHeight: 1.8, marginTop: 8, letterSpacing: 0.5 }}>{info.note}</div>
            <div style={{ display: 'flex', gap: 18, marginTop: 10, fontSize: 11, color: 'rgba(143,232,255,0.75)', letterSpacing: 1 }}>
              <span>主星 · {info.brightest}</span>
              <span>最佳观测 · {info.season}</span>
              <span>当前仰角 · {altDeg.toFixed(1)}°</span>
            </div>
          </div>
        );
      })()}

      {/* 底部时间滑块 */}
      <div className="time-bar" style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 10, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>00</span>
        <input type="range" min={0} max={23} value={hour} onChange={e => handleSlider(Number(e.target.value))} className="time-slider" />
        <span style={{ fontSize: 10, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>23</span>
      </div>

      {/* 右下角：版本标记 */}
      <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 10, fontSize: 9, color: 'rgba(143,232,255,0.4)', letterSpacing: 2 }}>v1.0 · REAL-TIME CELESTIAL RENDER</div>

      <SpatioTemporalPanel
        cities={cities} isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}
        initialCity={currentCity} initialDateTime={currentDateTime}
        onApply={handleApply}
      />
    </div>
  );
}
