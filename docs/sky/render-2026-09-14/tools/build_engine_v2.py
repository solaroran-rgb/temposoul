# -*- coding: utf-8 -*-
"""设计稿资产化渲染引擎 v2：多格式自适应 + 严格/视觉双档 + 单档内联自包含。"""
import os, base64, json, shutil

AST = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
OUTDIR = r"D:\workbuddy\2026-09-14-09-43-10\_engine"
os.makedirs(OUTDIR, exist_ok=True)

TEMPLATE = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>TempoSoul 命律 · 首页</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#000;overflow:hidden;color:#eaf6ff}
#stage{position:relative;width:100vw;height:100vh;overflow:hidden;background:#000}
#plate{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% var(--focal,62%);display:block;user-select:none;-webkit-user-drag:none}
#fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .35s}
#fx.on{opacity:1}
#hud{position:absolute;left:12px;bottom:12px;font:11px/1.6 ui-monospace,Consolas,monospace;
  color:#39FF14;background:rgba(0,0,0,.6);border:1px solid rgba(57,255,20,.32);border-radius:7px;
  padding:9px 12px;letter-spacing:.02em;z-index:9;max-width:min(56vw,460px)}
#hud .k{color:#7fd7ff}#hud b{color:#9ff}#hud .warn{color:#ffcf5c}
#bar{position:absolute;right:12px;top:12px;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;z-index:9;max-width:70vw}
#bar button{font:11px/1 ui-monospace,Consolas,monospace;color:#9fe4ff;background:rgba(0,18,26,.75);
  border:1px solid rgba(0,229,255,.34);border-radius:6px;padding:8px 10px;cursor:pointer;letter-spacing:.02em}
#bar button.on{background:rgba(0,229,255,.26);color:#fff;border-color:rgba(0,229,255,.9)}
#bar button:hover{border-color:rgba(0,229,255,.7)}
@media(max-width:760px){#hud{font-size:10px;max-width:82vw;line-height:1.5}#bar button{font-size:10px;padding:7px 8px}}
</style>
</head>
<body>
<div id="stage">
  <img id="plate" alt="TempoSoul 命律" src="__SRC__" decoding="sync" fetchpriority="high">
  <canvas id="fx"></canvas>
  <div id="bar">
    <button id="bAuto" class="on">自动</button>
    <button id="bStrict">F100 严格</button>
    <button id="bVisual">F99 视觉</button>
    <button id="bLive">实时微光</button>
  </div>
  <div id="hud">…</div>
</div>
<script>
(function(){
"use strict";
var T0 = performance.now(), M = { nav: T0 };

var AR = 1.981424;        /* 设计稿宽高比（锁定） */
var HORIZON = 0.680083;   /* 地平线 y/H */
var TIERS = [1920,1440,1080,768,390];
var IS_INLINE = __IS_INLINE__;     /* 内联自包含 */
var SINGLE = __SINGLE__;           /* 单档模式（内联） */
var ASSETS = __ASSETS__;           /* 生产外链路径 */

var plate = document.getElementById('plate');
var fx = document.getElementById('fx'), fxc = fx.getContext('2d');
var hudEl = document.getElementById('hud');
var cur = { kind:'auto', tier:0, ext:'', weak:false };

var AVIF_OK = false;
(function(){
  var im = new Image();
  im.onload  = function(){ AVIF_OK = true;  boot(); };
  im.onerror = function(){ AVIF_OK = false; boot(); };
  im.src = 'data:image/avif;base64,__AVIF_PROBE__';
  setTimeout(function(){ boot(); }, 400);        /* 兜底：探测异常也必须启动 */
})();

var FORCE_NET = (location.search.match(/[?&]net=(weak|good)/) || [])[1] || '';
function net(){
  var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  var et = c.effectiveType || '';
  var weak = FORCE_NET === 'weak' ? true
           : FORCE_NET === 'good' ? false
           : (!!c.saveData || et === 'slow-2g' || et === '2g' || et === '3g');
  return { et: et || FORCE_NET, save: !!c.saveData, dl: c.downlink || 0, weak: weak };
}
function pickTier(weak){
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var need = Math.round(Math.max(window.innerWidth, window.innerHeight * AR) * dpr);
  if (weak) need = Math.round(need * 0.55);      /* 弱网主动降档 */
  for (var i = TIERS.length - 1; i >= 0; i--)    /* 取「最小满足」档 */
    if (TIERS[i] >= need) return TIERS[i];
  return TIERS[0];
}
function resolve(kind){
  var n = net(), weak = n.weak, ext;
  if (SINGLE) ext = __SINGLE_EXT__;
  else if (kind === 'strict') ext = 'webp';
  else if (kind === 'visual') ext = AVIF_OK ? 'avif' : 'webp';
  else ext = weak ? (AVIF_OK ? 'avif' : 'webp') : 'webp';
  return { tier: pickTier(weak), ext: ext, weak: weak };
}
function urlFor(tier, ext){
  if (SINGLE) return plate.getAttribute('src') || plate.src;
  var m = ASSETS[tier] || ASSETS['1920'];
  return m[ext] || m['webp'];
}

/* ---------- 加载与打点 ---------- */
var seq = 0;
function mark(){
  M.first = performance.now() - T0;
  requestAnimationFrame(function(){
    M.settled = performance.now() - T0;
    M.firstFromNav = (M.nav || 0) + M.first;
    M.settleFromNav = (M.nav || 0) + M.settled;
    hud();
  });
}
function load(kind){
  var r = resolve(kind), my = ++seq;
  cur.kind = kind; cur.tier = r.tier; cur.ext = r.ext; cur.weak = r.weak;
  var url = urlFor(r.tier, r.ext), t = performance.now();
  if (SINGLE){                    /* 已在 img.src，只需打点 */
    if (plate.complete) mark();
    else plate.onload = mark;
    hud(); return;
  }
  var pre = new Image();
  pre.onload = function(){
    if (my !== seq) return;
    plate.src = url;
    var done = function(){
      if (my !== seq) return;
      M.decode = performance.now() - t; M.url = url.slice(0, 80); mark();
    };
    plate.decode ? plate.decode().then(done).catch(done) : (plate.onload = done);
  };
  pre.onerror = function(){ if (my === seq) hud('资产加载失败: ' + url.slice(0, 60)); };
  pre.src = url; hud();
}

function updateFocal(){
  var arv = window.innerWidth / window.innerHeight, f = 62;
  if (arv > AR) f = 66; else if (arv > 1.4) f = 62; else f = 58;
  document.getElementById('stage').style.setProperty('--focal', f + '%');
}

/* ---------- 实时微光层 ---------- */
var stars = [], raf = null, live = false;
function initStars(){
  stars = []; var W = fx.width, H = fx.height, N = Math.round(W * 0.5);
  for (var i = 0; i < N; i++)
    stars.push({ x: Math.random()*W, y: Math.pow(Math.random(),1.5)*H*HORIZON,
                 r: 0.4+Math.random()*1.2, p: Math.random()*6.283,
                 s: 0.5+Math.random()*1.6, a: 0.10+Math.random()*0.28 });
}
function resizeFx(){
  var d = Math.min(window.devicePixelRatio || 1, 2);
  fx.width = Math.round(fx.clientWidth * d); fx.height = Math.round(fx.clientHeight * d);
  initStars();
}
function drawFx(t){
  fxc.clearRect(0,0,fx.width,fx.height);
  var W = fx.width, H = fx.height;
  fxc.globalCompositeOperation = 'lighter';
  for (var i=0;i<stars.length;i++){
    var s=stars[i], k=0.55+0.45*Math.sin(t*0.001*s.s+s.p);
    fxc.fillStyle='rgba(198,242,255,'+(s.a*k).toFixed(3)+')';
    fxc.beginPath(); fxc.arc(s.x,s.y,s.r*k,0,6.2832); fxc.fill();
  }
  var hy=H*HORIZON, bh=H*0.05, amp=0.028+0.014*Math.sin(t*0.0007);
  var g=fxc.createLinearGradient(0,hy-bh,0,hy+bh*1.6);
  g.addColorStop(0,'rgba(0,229,255,0)');
  g.addColorStop(0.5,'rgba(150,238,255,'+amp.toFixed(3)+')');
  g.addColorStop(1,'rgba(0,229,255,0)');
  fxc.fillStyle=g; fxc.fillRect(0,hy-bh,W,bh*2.6);
  var cx=W*0.5, cy=H*0.935, R=H*0.11, ga=0.038+0.020*Math.sin(t*0.0011);
  var rg=fxc.createRadialGradient(cx,cy,0,cx,cy,R);
  rg.addColorStop(0,'rgba(210,248,255,'+ga.toFixed(3)+')');
  rg.addColorStop(0.45,'rgba(0,229,255,'+(ga*0.42).toFixed(3)+')');
  rg.addColorStop(1,'rgba(0,229,255,0)');
  fxc.fillStyle=rg; fxc.beginPath(); fxc.arc(cx,cy,R,0,6.2832); fxc.fill();
  fxc.globalCompositeOperation='source-over';
  raf = requestAnimationFrame(drawFx);
}

/* ---------- HUD ---------- */
var HUD_ERR = '';
function hud(err){
  if (err) HUD_ERR = err;
  var f = function(v){ return (typeof v==='number' && isFinite(v)) ? v.toFixed(1)+'ms' : '—'; };
  var arv = window.innerWidth/window.innerHeight;
  var kindTxt = SINGLE ? (__SINGLE_EXT__==='webp' ? 'F100 严格(逐像素)' : 'F99 视觉(AVIF)')
                       : (cur.kind==='auto' ? '自动' : (cur.kind==='strict' ? 'F100 严格(逐像素)' : 'F99 视觉(AVIF)'));
  var band = cur.ext==='webp' ? '无损 WebP' : 'AVIF q75';
  hudEl.innerHTML =
    '<b>' + kindTxt + '</b> ｜ <span class="k">档</span> ' + cur.tier + ' × ' + band + '<br>' +
    '<span class="k">首帧</span> ' + f(M.first) + ' ｜ <span class="k">从导航</span> ' + f(M.firstFromNav) +
      ' ｜ <span class="k">解码</span> ' + f(M.decode) + '<br>' +
    '<span class="k">视口</span> ' + window.innerWidth + '×' + window.innerHeight +
      ' AR ' + arv.toFixed(3) + ' / 稿 ' + AR.toFixed(3) + ' ｜ <span class="k">DPR</span> ' + (window.devicePixelRatio||1) + '<br>' +
    '<span class="k">资产</span> ' + (IS_INLINE ? '内联自包含' : '外链') + ' ｜ <span class="k">自然尺寸</span> ' +
      plate.naturalWidth + '×' + plate.naturalHeight + (HUD_ERR ? '<br><span class="warn">'+HUD_ERR+'</span>' : '');
  window.__PERF = { first: M.first, settled: M.settled, decode: M.decode,
                    firstFromNav: M.firstFromNav, settleFromNav: M.settleFromNav,
                    arv: arv, kind: cur.kind, tier: cur.tier, ext: cur.ext, weak: cur.weak,
                    inline: IS_INLINE, single: SINGLE, url: M.url || '',
                    nav: M.nav, dpr: window.devicePixelRatio||1,
                    w: window.innerWidth, h: window.innerHeight,
                    natural: plate.naturalWidth + 'x' + plate.naturalHeight, avif: AVIF_OK };
}

/* ---------- 控件 ---------- */
function setBtn(){
  document.getElementById('bAuto').className   = cur.kind==='auto'   ? 'on':'';
  document.getElementById('bStrict').className = cur.kind==='strict' ? 'on':'';
  document.getElementById('bVisual').className = cur.kind==='visual' ? 'on':'';
  document.getElementById('bLive').className   = live                ? 'on':'';
}
document.getElementById('bAuto').onclick   = function(){ load('auto');   setBtn(); };
document.getElementById('bStrict').onclick = function(){ load('strict'); setBtn(); };
document.getElementById('bVisual').onclick = function(){ load('visual'); setBtn(); };
document.getElementById('bLive').onclick   = function(){
  live = !live; setBtn();
  if (live){ fx.className='on'; resizeFx(); raf = requestAnimationFrame(drawFx); }
  else { fx.className=''; if(raf){ cancelAnimationFrame(raf); raf=null; } fxc.clearRect(0,0,fx.width,fx.height); }
  hud();
};
window.addEventListener('resize', function(){ updateFocal(); if(live) resizeFx(); hud(); });
window.__SETMODE = function(m){ if (m==='live') document.getElementById('bLive').click(); else { load(m); setBtn(); } };
window.__SETLIVE = function(on){ if (on !== live) document.getElementById('bLive').click(); };
window.__HIDEUI = function(){ document.getElementById('hud').style.display='none';
                             document.getElementById('bar').style.display='none'; };

var BOOTED = false;
function boot(){
  if (BOOTED) return; BOOTED = true;
  updateFocal();
  if (SINGLE){                                  /* 单档：隐藏档位按钮，直接打点 */
    ['bAuto','bStrict','bVisual'].forEach(function(id){
      var e = document.getElementById(id); if (e) e.style.display = 'none'; });
    cur.tier = __SINGLE_TIER__; cur.ext = __SINGLE_EXT__;
    load('strict');
  } else {
    setBtn(); load(__INIT_KIND__);
  }
}
})();
</script>
</body>
</html>
"""


def build(tag, is_inline, src, single_ext="'webp'", single_tier=1920, init_kind="'auto'",
          external_assets=None, single=True):
    html = TEMPLATE.replace("__IS_INLINE__", "true" if is_inline else "false")
    html = html.replace("__SINGLE__", "true" if single else "false")
    html = html.replace("__SINGLE_EXT__", single_ext)
    html = html.replace("__SINGLE_TIER__", str(single_tier))
    html = html.replace("__INIT_KIND__", init_kind)
    if is_inline:
        html = html.replace("__ASSETS__", "{}")
    else:
        html = html.replace("__ASSETS__", json.dumps(external_assets or {}, ensure_ascii=False))
    html = html.replace("__SRC__", src)
    html = html.replace("__AVIF_PROBE__",
                        open(os.path.join(AST, "probe_1x1_avif.b64")).read().strip())
    p = os.path.join(OUTDIR, "home-%s.html" % tag)
    open(p, "w", encoding="utf-8", newline="").write(html)
    print("  %-34s %9.1f KB" % (os.path.basename(p), len(html.encode('utf-8')) / 1024))
    return p


def b64(path):
    mime = "image/avif" if path.endswith(".avif") else "image/webp"
    return "data:%s;base64,%s" % (mime, base64.b64encode(open(path, "rb").read()).decode())


if __name__ == "__main__":
    mtx = json.load(open(os.path.join(AST, "matrix.json")))
    ext_assets = {}
    dst = os.path.join(OUTDIR, "assets")
    os.makedirs(dst, exist_ok=True)
    for r in mtx:
        w = r['w']
        ext_assets[str(w)] = {"webp": "assets/plate_%d.webp" % w,
                              "avif": ("assets/plate_%d.avif" % w) if r.get('avif75_kb') else None}
        for e in ("webp", "avif"):
            f = os.path.join(AST, "plate_%d.%s" % (w, e))
            if os.path.exists(f):
                shutil.copy2(f, os.path.join(dst, "plate_%d.%s" % (w, e)))

    print("=== 生产外链版（自适应档位 + 可切严格/视觉）===")
    build("prod-auto", False, "assets/plate_1080.avif", external_assets=ext_assets, single=False)

    print("\n=== 内联自包含版（单档）===")
    build("inline-strict", True, b64(os.path.join(AST, "plate_1920.webp")),
          single_ext="'webp'", single_tier=1920, single=True)
    build("inline-visual", True, b64(os.path.join(AST, "plate_1920.avif")),
          single_ext="'avif'", single_tier=1920, single=True)
    build("inline-visual-1080", True, b64(os.path.join(AST, "plate_1080.avif")),
          single_ext="'avif'", single_tier=1080, single=True)
    print("\n输出目录: %s" % OUTDIR)
