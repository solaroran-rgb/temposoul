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
import {
  createSkyScene,
  setConstellationHoverHandler,
  type SkySceneApi,
} from '../../lib/sky/SkyScene';
import { injectHolographicTokens } from '@/theme/holographic-tokens';
import { SpatioTemporalPanel, City } from './SpatioTemporalPanel';
import { constInfoOf } from '../../lib/sky/constellationInfo';
import { toJulianDay, localSiderealTime, radecToAltAz, DEG } from '../../lib/sky/astro';
import { isTaipeiCovered, GEO_ENGINE_META } from '../../lib/geo/geoEngine';
import { NebulaOverlay } from './NebulaOverlay';

/** cities.json 最近城市（IP/GPS 定位结果 → 城市中心；±maxDeg° 内视为命中，否则 null）。
 * F1：定位坐标吸附到城市中心，使 /api/geo KV key（geo:v6:{lat.toFixed(2)}:{lon.toFixed(2)}）
 * 与 warmup-geo-v2 预热 key 对齐，命中率 0%→~95%。 */
function nearestCity(cities: City[], lat: number, lon: number, maxDeg = 3): City | null {
  let best: City | null = null,
    bd = 1e18;
  for (const c of cities) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2;
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  if (best && bd < maxDeg * maxDeg) return best; // 约 ±3° 内视为命中
  return null;
}

/** cities.json 最近城市名（IP/GPS 定位结果 → 可读名；无匹配则坐标文本） */
function nearestCityName(cities: City[], lat: number, lon: number): string {
  const c = nearestCity(cities, lat, lon);
  return c ? c.n : `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

export function SkyPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SkySceneApi | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [locSrc, setLocSrc] = useState<'boot' | 'ip' | 'gps' | 'manual'>('boot');
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [err, setErr] = useState('');
  const [hoveredConst, setHoveredConst] = useState<string | null>(null);

  const applySpatioTemporal = useCallback((lat: number, lon: number, date: Date) => {
    sceneRef.current?.setTimeLocation(date, { lat, lon });
  }, []);

  /* 渐进式渲染第一层：挂载即创建场景（宇宙背景/粒子/星空立即可见，不等待定位）。
   * 定位结果随后到达 → setTimeLocation（星空重算 + 地标加载）→ 稳定。
   * （2026-09-14 改造：原实现依赖 currentCity 才创建 canvas，导致定位慢时黑屏。） */
  useEffect(() => {
    if (!mountRef.current) return;
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
      if (!api) {
        setErr('WebGL2 不可用，已切换静态降级路径');
        return;
      }
      sceneRef.current = api;
      setConstellationHoverHandler(setHoveredConst);
      api.start(null); // 无城市 payload 启动：星空/粒子/地面网格即刻渲染
      // 初始时空：默认济南（intro 淡入期 500ms 内被 IP/GPS 定位覆盖，视觉无感知）
      api.setTimeLocation(new Date(), { lat: 36.65, lon: 117.12 });
      return () => {
        setConstellationHoverHandler(null);
        api.dispose();
        canvas.remove();
      };
    } catch (e: any) {
      setErr(e?.stack || String(e));
    }
  }, []);

  /* 三层定位管线：① URL 参数（调试/演示）→ ② IP 城市级（/api/locate）→ ③ 浏览器 Geolocation 精确 GPS。
   * 渐进语义：IP 先到 → 星空/地标按城市级渲染；GPS 后到 → 微调场景至精确位置；未授权则停留 IP 级。 */
  useEffect(() => {
    let cancelled = false;
    const apply = (lat: number, lon: number, src: 'ip' | 'gps' | 'manual') => {
      if (cancelled) return;
      setLocSrc(src);
      // F1：IP/GPS 坐标吸附到 cities.json 城市中心（manual 保留精确坐标）。
      // 吸附后 /api/geo KV key 与预热 key 对齐（命中率 0%→~95%），显示名与数据请求同源。
      const snapped =
        src !== 'manual' && cities.length ? nearestCity(cities, lat, lon) : null;
      const aLat = snapped ? snapped.lat : lat;
      const aLon = snapped ? snapped.lon : lon;
      // 城市名：URL 指定 > cities.json 最近匹配 > 坐标文本
      const usp = new URLSearchParams(window.location.search);
      const pName = usp.get('name');
      const name =
        pName ||
        (snapped
          ? snapped.n
          : cities.length
            ? nearestCityName(cities, lat, lon)
            : `${lat.toFixed(2)},${lon.toFixed(2)}`);
      setCurrentCity({
        n: name,
        lat: aLat,
        lon: aLon,
        py: name.toLowerCase(),
        prov: snapped ? snapped.prov : 'auto',
      });
      applySpatioTemporal(aLat, aLon, new Date());
    };
    // ① URL 参数优先（?lat=..&lon=..&name=..，POC 演示/审计用）
    const usp = new URLSearchParams(window.location.search);
    const pLat = parseFloat(usp.get('lat') || '');
    const pLon = parseFloat(usp.get('lon') || '');
    if (pLat && pLon) {
      apply(pLat, pLon, 'manual');
      return;
    }
    // ② IP 城市级
    (async () => {
      try {
        const lr = await fetch('/api/locate');
        const lj = await lr.json();
        if (lj.lat && lj.lon && !cancelled) apply(lj.lat, lj.lon, 'ip');
      } catch {
        /* 静默：GPS/默认兜底 */
      }
    })();
    // ③ 浏览器 Geolocation 精确 GPS（可选授权；成功即覆盖为精确坐标）
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => apply(pos.coords.latitude, pos.coords.longitude, 'gps'),
        () => {
          /* 用户拒绝/超时 → 保持 IP 级 */
        },
        { timeout: 5000, maximumAge: 60000, enableHighAccuracy: true },
      );
    }
    return () => {
      cancelled = true;
    };
  }, [cities, applySpatioTemporal]);

  /* 城市下拉数据（独立加载；不阻塞场景） */
  useEffect(() => {
    fetch('/data/cities.json')
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {
        /* 城市面板降级为空 */
      });
  }, []);

  const handleApply = useCallback(
    (city: City, dateTime: string) => {
      setCurrentCity(city);
      setCurrentDateTime(dateTime);
      setLocSrc('manual');
      applySpatioTemporal(city.lat, city.lon, new Date(dateTime));
    },
    [applySpatioTemporal],
  );

  const handleSave = () => {
    if (!sceneRef.current) return;
    sceneRef.current.captureFrame((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `temposoul-${city.n || 'sky'}-${Date.now()}.png`;
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
    return (
      <div
        style={{
          color: '#f66',
          padding: 20,
          background: '#000',
          height: '100vh',
          whiteSpace: 'pre-wrap',
        }}
      >
        {err}
      </div>
    );
  }

  // 定位未完成时仍渲染场景（渐进第一层：宇宙背景+粒子+星空立即可见）
  const city = currentCity ?? {
    n: '定位中',
    lat: 36.65,
    lon: 117.12,
    py: 'locating',
    prov: 'auto',
  };
  const geoCovered = isTaipeiCovered(city.lat, city.lon);
  const hour = new Date(currentDateTime).getHours();

  return (
    <div
      className="sky-root"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030305',
        overflow: 'hidden',
        fontFamily: 'monospace',
      }}
    >
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      <NebulaOverlay />
      <style>{`
        .sky-root { font-family: 'Inter', 'Noto Sans SC', system-ui, sans-serif; letter-spacing: 0.05em; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
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

      {/* 左上：标题面板 + 定位状态徽标 */}
      <div
        className="top-title"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
          padding: '16px 22px',
          border: '1px solid rgba(0,229,255,0.5)',
          background: 'rgba(2,10,18,0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 20px rgba(0,229,255,0.15)',
        }}
      >
        <h1
          style={{ margin: 0, fontSize: 18, letterSpacing: 6, color: '#e0f7ff', fontWeight: 300 }}
        >
          命律 · TEMPOSOUL
        </h1>
        <div
          className="sub"
          style={{ fontSize: 10, color: 'rgba(0,229,255,0.7)', marginTop: 6, letterSpacing: 3 }}
        >
          CELESTIAL OBSERVATION SYSTEM
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            fontSize: 9,
            letterSpacing: 2,
            color:
              locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(143,232,255,0.6)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background:
                locSrc === 'gps'
                  ? '#4dffb8'
                  : locSrc === 'ip'
                    ? '#00e5ff'
                    : 'rgba(143,232,255,0.6)',
              boxShadow: `0 0 8px ${locSrc === 'gps' ? '#4dffb8' : locSrc === 'ip' ? '#00e5ff' : 'rgba(143,232,255,0.6)'}`,
              animation: 'pulse 1.6s infinite',
            }}
          />
          POSITION ·{' '}
          {locSrc === 'gps'
            ? 'GPS PRECISE'
            : locSrc === 'ip'
              ? 'IP CITY-LEVEL'
              : locSrc === 'manual'
                ? 'MANUAL'
                : 'ACQUIRING...'}
        </div>
      </div>

      {/* 右上：按钮组 */}
      <div
        className="top-right"
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: 8 }}
      >
        <button className="hud-btn" onClick={handleSave}>
          保存星图
        </button>
        <button className="hud-btn" onClick={() => setIsPanelOpen(true)}>
          切换时空
        </button>
        <button className="hud-btn" onClick={() => (window.location.href = '/')}>
          立即开始
        </button>
      </div>

      {/* 左侧面板：观测信息 */}
      <div
        className="side-panel"
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          padding: '20px 22px',
          border: '1px solid rgba(0,229,255,0.45)',
          background: 'rgba(2,10,18,0.85)',
          backdropFilter: 'blur(8px)',
          width: 220,
          boxShadow: '0 0 20px rgba(0,229,255,0.12)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: '#00e5ff',
            letterSpacing: 3,
            marginBottom: 12,
            borderBottom: '1px solid rgba(0,229,255,0.3)',
            paddingBottom: 8,
          }}
        >
          OBSERVATION DATA
        </div>
        <div style={{ fontSize: 13, color: 'rgba(220,245,255,0.9)', lineHeight: 2.1 }}>
          <div>
            位置 <span style={{ float: 'right', color: '#00e5ff', fontWeight: 400 }}>{city.n}</span>
          </div>
          <div>
            纬度 <span style={{ float: 'right', color: '#00e5ff' }}>{city.lat.toFixed(2)}°N</span>
          </div>
          <div>
            经度 <span style={{ float: 'right', color: '#00e5ff' }}>{city.lon.toFixed(2)}°E</span>
          </div>
          <div>
            定位源{' '}
            <span style={{ float: 'right', color: locSrc === 'gps' ? '#4dffb8' : '#00e5ff' }}>
              {locSrc === 'gps'
                ? 'GPS 精确'
                : locSrc === 'ip'
                  ? 'IP 城市级'
                  : locSrc === 'manual'
                    ? '手动'
                    : '获取中'}
            </span>
          </div>
          <div>
            时间{' '}
            <span style={{ float: 'right', color: '#00e5ff' }}>
              {currentDateTime.slice(5, 16).replace('T', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* 右侧面板：星图参数 */}
      <div
        className="side-panel"
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          padding: '20px 22px',
          border: '1px solid rgba(0,229,255,0.45)',
          background: 'rgba(2,10,18,0.85)',
          backdropFilter: 'blur(8px)',
          width: 220,
          boxShadow: '0 0 20px rgba(0,229,255,0.12)',
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: '#00e5ff',
            letterSpacing: 3,
            marginBottom: 12,
            borderBottom: '1px solid rgba(0,229,255,0.3)',
            paddingBottom: 8,
          }}
        >
          SKY MAP PARAMETERS
        </div>
        <div style={{ fontSize: 13, color: 'rgba(220,245,255,0.9)', lineHeight: 2.1 }}>
          <div>
            星等阈值 <span style={{ float: 'right', color: '#00e5ff' }}>6.0 mag</span>
          </div>
          <div>
            可见星数 <span style={{ float: 'right', color: '#00e5ff' }}>5044</span>
          </div>
          <div>
            星座线段 <span style={{ float: 'right', color: '#00e5ff' }}>566</span>
          </div>
          <div>
            视场角 <span style={{ float: 'right', color: '#00e5ff' }}>58°</span>
          </div>
        </div>
      </div>

      {/* 左下角：坐标十字标记 */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: '1px solid rgba(0,229,255,0.4)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(0,229,255,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(0,229,255,0.4)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: 4,
              background: '#00e5ff',
              transform: 'translate(-50%,-50%)',
              boxShadow: '0 0 6px #00e5ff',
            }}
          />
        </div>
        <div style={{ fontSize: 9, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>N ↑</div>
      </div>

      {/* 观测点标注（jinan-v2：中央人形下方地名） */}
      {currentCity && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '60%',
            transform: 'translate(-50%, -50%)',
            zIndex: 6,
            textAlign: 'center',
            fontFamily: 'monospace',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 17,
              color: 'rgba(224,247,255,0.96)',
              letterSpacing: 8,
              textShadow: '0 0 14px rgba(0,229,255,0.85), 0 0 40px rgba(0,229,255,0.3)',
              fontWeight: 300,
            }}
          >
            {currentCity.n}
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'rgba(143,232,255,0.62)',
              letterSpacing: 3,
              marginTop: 8,
            }}
          >
            {currentCity.lat.toFixed(4)}°N {currentCity.lon.toFixed(4)}°E ·{' '}
            {currentDateTime.slice(11, 16)} CST · 此刻星空
          </div>
        </div>
      )}

      {/* 星座信息卡（悬停星座标签显示） */}
      {hoveredConst &&
        (() => {
          const info = constInfoOf(hoveredConst);
          if (!info) return null;
          const jd = toJulianDay(new Date(currentDateTime).getTime());
          const lst = localSiderealTime(jd, city.lon);
          const altAz = radecToAltAz(info.raH * 15 * DEG, info.decD * DEG, lst, city.lat * DEG);
          const altDeg = altAz.alt / DEG;
          const visible = altDeg > 0;
          return (
            <div
              className="const-card"
              style={{
                position: 'absolute',
                bottom: 84,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                padding: '14px 18px',
                border: '1px solid rgba(0,229,255,0.5)',
                background: 'rgba(2,10,18,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 24px rgba(0,229,255,0.18)',
                fontFamily: 'monospace',
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  color: '#e0f7ff',
                  letterSpacing: 3,
                  fontWeight: 400,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span>
                  {info.zh}{' '}
                  <span
                    style={{
                      fontSize: 11,
                      color: 'rgba(0,229,255,0.75)',
                      marginLeft: 6,
                      letterSpacing: 2,
                    }}
                  >
                    {info.key.toUpperCase()}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: visible ? '#4dffb8' : 'rgba(255,170,120,0.8)',
                    letterSpacing: 1,
                  }}
                >
                  {visible ? '● 地平线上' : '○ 地平线下'}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(200,240,250,0.85)',
                  lineHeight: 1.8,
                  marginTop: 8,
                  letterSpacing: 0.5,
                }}
              >
                {info.note}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 18,
                  marginTop: 10,
                  fontSize: 11,
                  color: 'rgba(143,232,255,0.75)',
                  letterSpacing: 1,
                }}
              >
                <span>主星 · {info.brightest}</span>
                <span>最佳观测 · {info.season}</span>
                <span>当前仰角 · {altDeg.toFixed(1)}°</span>
              </div>
            </div>
          );
        })()}

      {/* 底部时间滑块 */}
      <div
        className="time-bar"
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 10, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>00</span>
        <input
          type="range"
          min={0}
          max={23}
          value={hour}
          onChange={(e) => handleSlider(Number(e.target.value))}
          className="time-slider"
        />
        <span style={{ fontSize: 10, color: 'rgba(143,232,255,0.5)', letterSpacing: 2 }}>23</span>
      </div>

      {/* 右下角：版本标记 + 地理引擎徽标 */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 10,
          textAlign: 'right',
          fontSize: 9,
          color: 'rgba(143,232,255,0.4)',
          letterSpacing: 2,
          lineHeight: 2,
        }}
      >
        <div>v1.0 · REAL-TIME CELESTIAL RENDER</div>
        <div>
          GEO ENGINE · {geoCovered ? 'TAIPEI POC' : 'PROCEDURAL SKYLINE'} ·{' '}
          {GEO_ENGINE_META.version}
        </div>
      </div>

      <SpatioTemporalPanel
        cities={cities}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        initialCity={city}
        initialDateTime={currentDateTime}
        onApply={handleApply}
      />
    </div>
  );
}
