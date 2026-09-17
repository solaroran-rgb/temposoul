# -*- coding: utf-8 -*-
"""移动端/自适应方案：场景层（无文字）+ HTML UI 层（响应式排版）。"""
import os, base64, json, shutil

AST = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
OUTDIR = r"D:\workbuddy\2026-09-14-09-43-10\_engine"
os.makedirs(OUTDIR, exist_ok=True)
GEO = json.load(open(os.path.join(AST, "ui_geometry.json"), encoding="utf-8"))
AR = 1.981424

# UI 几何 -> 相对设计稿的百分比（用于 HTML 层定位）
def pct(v, total): return round(v / total * 100, 4)
T = GEO["title"]; S = GEO["subtitle"]; C = GEO["cta"]
UI = dict(
    title_top=pct(T["cy"], 969), title_cx=T["cx_pct"],
    title_size=round(T["h"] * 0.80 / 1920 * 100, 4),   # vw
    sub_top=pct(S["cy"], 969), sub_cx=S["cx_pct"],
    sub_size=round(S["h"] * 0.80 / 1920 * 100, 4),     # vw
    cta_top=pct(C["cy"], 969), cta_cx=C["cx_pct"],
    cta_w=round(C["w"] / 1920 * 100, 4),               # vw
    cta_h=round(C["h"] / 969 * 100, 4),                # vh
)
print("=== UI 层定位（1920x969 基准）===")
for k, v in UI.items(): print("  %-12s %.4f%s" % (k, v, "vw" if "size" in k or "w" in k else "%"))

TPL = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>命律 TempoSoul · 探索命运的节律</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;background:#000;overflow:hidden;color:#dfeaee;
  -webkit-font-smoothing:antialiased}
#stage{position:relative;width:100vw;height:100vh;overflow:hidden;background:#000}
#plate{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% var(--focal,62%);display:block;user-select:none;-webkit-user-drag:none}
#fx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .35s}
#fx.on{opacity:1}
/* ---------- HTML UI 层（响应式排版，永不裁切） ---------- */
#ui{position:absolute;inset:0;pointer-events:none;z-index:5}
#ui .in{position:absolute;transform:translate(-50%,-50%)}
#title{top:__T_TITLE_TOP__%;left:__T_TITLE_CX__%;font-family:"Noto Serif SC","Source Han Serif SC","Songti SC",
  "SimSun",Georgia,serif;font-weight:600;letter-spacing:.06em;line-height:1.16;
  font-size:clamp(30px,__T_SIZE__vw,86px);color:#e8f3f6;
  text-shadow:0 0 28px rgba(0,229,255,.28),0 0 60px rgba(0,120,160,.18);
  white-space:nowrap;text-align:center}
#title .en{margin-left:.28em;font-size:.94em;letter-spacing:.10em}
#sub{top:__T_SUB__%;left:__T_SUB_CX__%;font-family:"Noto Serif SC","Songti SC","SimSun",serif;
  font-weight:400;letter-spacing:.26em;line-height:1.5;
  font-size:clamp(13px,__T_SUBSZ__vw,36px);color:#bcd6dd;
  text-shadow:0 0 20px rgba(0,229,255,.20);white-space:nowrap}
#ctawrap{top:__T_CTA__%;left:__T_CTA_CX__%;pointer-events:auto}
#cta{display:inline-flex;align-items:center;justify-content:center;
  width:clamp(150px,__T_CTAW__vw,266px);height:clamp(44px,__T_CTAH__vh,104px);
  border:1px solid rgba(150,230,255,.55);border-radius:clamp(8px,1.1vw,16px);
  font-family:"Noto Serif SC","Songti SC",serif;letter-spacing:.28em;text-indent:.28em;
  font-size:clamp(13px,1.45vw,28px);color:#cfeaf3;background:rgba(4,22,30,.30);
  box-shadow:0 0 24px rgba(0,229,255,.16),inset 0 0 22px rgba(0,229,255,.07);
  backdrop-filter:blur(2px);cursor:pointer;text-decoration:none;
  transition:box-shadow .25s,border-color .25s,background .25s}
#cta:hover{border-color:rgba(190,245,255,.9);background:rgba(0,60,80,.35);
  box-shadow:0 0 34px rgba(0,229,255,.34),inset 0 0 26px rgba(0,229,255,.13)}
#hud{position:absolute;left:10px;bottom:10px;font:10px/1.55 ui-monospace,Consolas,monospace;
  color:#39FF14;background:rgba(0,0,0,.6);border:1px solid rgba(57,255,20,.3);border-radius:6px;
  padding:7px 9px;z-index:9;max-width:min(70vw,420px);pointer-events:none}
#hud .k{color:#7fd7ff}
</style>
</head>
<body>
<div id="stage">
  <img id="plate" alt="" src="__SRC__" decoding="sync" fetchpriority="high">
  <canvas id="fx"></canvas>
  <div id="ui">
    <h1 id="title" class="in">命律<span class="en">TempoSoul</span></h1>
    <p id="sub" class="in">探索命运的节律</p>
    <div id="ctawrap" class="in"><a id="cta" href="#start">立即开始</a></div>
  </div>
  <div id="hud">…</div>
</div>
<script>
(function(){
"use strict";
var T0=performance.now(),M={nav:T0};
var AR=__AR__, HZ=0.680083, TIERS=[1920,1440,1080,768,390];
var ASSETS=__ASSETS__;
var plate=document.getElementById('plate'), fx=document.getElementById('fx'),
    fxc=fx.getContext('2d'), hudEl=document.getElementById('hud');
var cur={tier:0,ext:''}, stars=[],raf=null,live=false;

function net(){
  var c=navigator.connection||{};
  var et=c.effectiveType||'';
  return {et:et, weak:!!c.saveData||et==='slow-2g'||et==='2g'||et==='3g'};
}
function pickTier(weak){
  var dpr=Math.min(window.devicePixelRatio||1,2);
  var need=Math.round(Math.max(window.innerWidth,window.innerHeight*AR)*dpr);
  if(weak) need=Math.round(need*0.55);
  for(var i=TIERS.length-1;i>=0;i--) if(TIERS[i]>=need) return TIERS[i];
  return TIERS[0];
}
function apply(){
  var n=net(), t=pickTier(n.weak), tt=performance.now();
  cur.tier=t; cur.ext='avif';
  var url=(ASSETS[t]||ASSETS['1920']).avif || (ASSETS[t]||ASSETS['1920']).webp;
  var pre=new Image();
  pre.onload=function(){
    plate.src=url;
    var d=function(){ M.decode=performance.now()-tt; M.first=performance.now()-T0;
      M.url=url; requestAnimationFrame(function(){ M.settled=performance.now()-T0; hud(); }); };
    plate.decode?plate.decode().then(d).catch(d):(plate.onload=d);
  };
  pre.src=url; hud();
}
function updateFocal(){
  var arv=window.innerWidth/window.innerHeight,f=62;
  if(arv>AR) f=66; else if(arv>1.4) f=62; else if(arv>1.0) f=58; else f=54;
  document.getElementById('stage').style.setProperty('--focal',f+'%');
}
function initStars(){
  stars=[];var W=fx.width,H=fx.height,N=Math.round(W*0.45);
  for(var i=0;i<N;i++) stars.push({x:Math.random()*W,y:Math.pow(Math.random(),1.5)*H*HZ,
    r:0.4+Math.random()*1.1,p:Math.random()*6.283,s:0.5+Math.random()*1.5,a:0.09+Math.random()*0.26});
}
function resizeFx(){
  var d=Math.min(window.devicePixelRatio||1,2);
  fx.width=Math.round(fx.clientWidth*d); fx.height=Math.round(fx.clientHeight*d); initStars();
}
function drawFx(t){
  fxc.clearRect(0,0,fx.width,fx.height);
  var W=fx.width,H=fx.height;
  fxc.globalCompositeOperation='lighter';
  for(var i=0;i<stars.length;i++){var s=stars[i],k=0.55+0.45*Math.sin(t*0.001*s.s+s.p);
    fxc.fillStyle='rgba(198,242,255,'+(s.a*k).toFixed(3)+')';
    fxc.beginPath();fxc.arc(s.x,s.y,s.r*k,0,6.2832);fxc.fill();}
  var cx=W*0.5,cy=H*0.935,R=H*0.11,ga=0.036+0.020*Math.sin(t*0.0011);
  var rg=fxc.createRadialGradient(cx,cy,0,cx,cy,R);
  rg.addColorStop(0,'rgba(210,248,255,'+ga.toFixed(3)+')');
  rg.addColorStop(0.45,'rgba(0,229,255,'+(ga*0.42).toFixed(3)+')');
  rg.addColorStop(1,'rgba(0,229,255,0)');
  fxc.fillStyle=rg;fxc.beginPath();fxc.arc(cx,cy,R,0,6.2832);fxc.fill();
  fxc.globalCompositeOperation='source-over';
  raf=requestAnimationFrame(drawFx);
}
function hud(){
  var f=function(v){return (typeof v==='number'&&isFinite(v))?v.toFixed(1)+'ms':'—';};
  var arv=window.innerWidth/window.innerHeight;
  hudEl.innerHTML='<b>场景层+HTML UI</b> ｜ <span class="k">档</span> '+cur.tier+
    ' ｜ <span class="k">首帧</span> '+f(M.first)+' ｜ <span class="k">从导航</span> '+f((M.nav||0)+M.first)+
    '<br><span class="k">视口</span> '+window.innerWidth+'×'+window.innerHeight+' AR '+arv.toFixed(3)+
    ' ｜ <span class="k">自然尺寸</span> '+plate.naturalWidth+'×'+plate.naturalHeight;
  window.__PERF={first:M.first,settled:M.settled,decode:M.decode,firstFromNav:(M.nav||0)+M.first,
    settleFromNav:(M.nav||0)+M.settled,arv:arv,tier:cur.tier,ext:cur.ext,url:M.url||'',
    nav:M.nav,dpr:window.devicePixelRatio||1,w:window.innerWidth,h:window.innerHeight,
    natural:plate.naturalWidth+'x'+plate.naturalHeight,mode:'scene-ui'};
}
document.getElementById('cta').addEventListener('click',function(e){
  e.preventDefault(); hudEl.innerHTML+='<br><span class="k">CTA clicked</span>';
});
window.__SETLIVE=function(on){ if(on!==live){ live=on;
  if(live){fx.className='on';resizeFx();raf=requestAnimationFrame(drawFx);}
  else{fx.className='';if(raf){cancelAnimationFrame(raf);raf=null;}fxc.clearRect(0,0,fx.width,fx.height);} } };
window.__HIDEUI=function(){ document.getElementById('hud').style.display='none'; };
window.addEventListener('resize',function(){updateFocal();if(live)resizeFx();hud();});
updateFocal(); apply();
})();
</script>
</body>
</html>
"""

def build(tag, assets, src):
    h = TPL.replace("__AR__", "%.6f" % AR)
    h = h.replace("__T_TITLE_TOP__", str(UI["title_top"]))
    h = h.replace("__T_TITLE_CX__", str(UI["title_cx"]))
    h = h.replace("__T_SIZE__", str(UI["title_size"]))
    h = h.replace("__T_SUB__", str(UI["sub_top"]))
    h = h.replace("__T_SUB_CX__", str(UI["sub_cx"]))
    h = h.replace("__T_SUBSZ__", str(UI["sub_size"]))
    h = h.replace("__T_CTA__", str(UI["cta_top"]))
    h = h.replace("__T_CTA_CX__", str(UI["cta_cx"]))
    h = h.replace("__T_CTAW__", str(UI["cta_w"]))
    h = h.replace("__T_CTAH__", str(UI["cta_h"]))
    h = h.replace("__ASSETS__", json.dumps(assets, ensure_ascii=False))
    h = h.replace("__SRC__", src)
    p = os.path.join(OUTDIR, "home-%s.html" % tag)
    open(p, "w", encoding="utf-8", newline="").write(h)
    print("  %-30s %9.1f KB" % (os.path.basename(p), len(h.encode('utf-8'))/1024))
    return p

if __name__ == "__main__":
    dst = os.path.join(OUTDIR, "assets"); os.makedirs(dst, exist_ok=True)
    assets = {}
    for w in (1920, 1440, 1080, 768, 390):
        for e in ("avif", "webp"):
            f = os.path.join(AST, "scene_%d.%s" % (w, e))
            if os.path.exists(f): shutil.copy2(f, os.path.join(dst, os.path.basename(f)))
        assets[str(w)] = {"avif": "assets/scene_%d.avif" % w if os.path.exists(os.path.join(AST, "scene_%d.avif" % w)) else None,
                          "webp": "assets/scene_%d.webp" % w}
    print("=== 场景层 + HTML UI 方案 ===")
    # 内联自包含（AVIF 1080，体积友好）
    b = base64.b64encode(open(os.path.join(AST, "scene_1080.avif"), "rb").read()).decode()
    build("mobile-scene-ui-inline", assets, "data:image/avif;base64," + b)
    build("mobile-scene-ui", assets, "assets/scene_1080.avif")
    print("\n输出目录: %s" % OUTDIR)
