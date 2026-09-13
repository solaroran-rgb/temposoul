# TempoSoul 命律 · 首页星空系统 任务交接书

> 交接时间：2026-09-13（视觉系统 v2 重做后更新）
> 当前线上：https://109c3e80.temposoul.pages.dev/sky（2026-09-13 视觉重做版：真实立体线框城市 + 5044 星 + 线框仰望者 + 星座标签/连线 + HUD，零 console 错误；预览部署，生产 www 待 promote）
> 项目根：E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统

---

## 一、项目目标

为 TempoSoul 命律网站做首页视觉——"探索命运的节律"。用户进入后看到：
- 纯黑底宇宙星空（按 IP 定位 + 实时时间渲染真实星空）
- 底部一个粒子小人仰望星空
- 脚下青蓝线框 HUD 风城市/山河线稿
- 青蓝线框全息 HUD 面板（观测数据/星图参数/方位标记）

技术栈：React 19 + Vite 7 + Three.js 0.186 + Cloudflare Pages。

---

## 二、当前已完成（已上线）

### 2.1 实时星空渲染
- **文件**：`src/lib/sky/SkyScene.ts`（主场景，主审自写）
- **星表**：`src/lib/sky/stars.data.ts` — 5044 颗星（d3-celestial stars.6.json，mag≤6.0）
- **星座线**：`src/lib/sky/constellations.data.ts` — 566 段
- **天文计算**：`src/lib/sky/astro.ts` — 岁差矩阵 / radecToAltAz / radecToVec3
- **月亮**：`src/lib/sky/moon.ts` — computeMoon + 月相纹理
- **shader**：`src/lib/sky/shaders/star.vert/frag` — 星点着色器（BV 色→RGB）
- **坐标系契约**：+X 东、+Y 天顶、+Z 北，天球半径 R=500，1 unit≈10m
- **相机（v2 新契约）**：`(0,34,-95)` 看向 `(0,18,120)`，fov 58°，near 0.1 / far 2000；微俯视看屋顶线网，小人约在画面 73%、地平线约 40%。旧契约 `(0,40,-180)→(0,35,80) fov60` 已废弃
- **雾**：`FogExp2(0x020204, 0.0016)`；星空/星座/月亮/标签材质统一 `fog:false` 防被吞

### 2.2 IP 自动定位
- **CF Function**：`functions/api/locate.ts` — 用 `request.cf.latitude/longitude/city`
- **前端**：`SkyPage.tsx` 加载 cities.json 后自动找最近城市
- **URL 参数**：已支持 `?lat=..&lon=..&name=..`（手动指定观测点）

### 2.3 GEO_CACHE KV
- KV ID：`c2637a406a8c4e99aab3b1aa364d6770`
- 已绑定进 `wrangler.toml`

### 2.4 UI 面板（HUD 全息风）
- **文件**：`src/pages/SkyPage/SkyPage.tsx`
- 左上：标题面板（命律 · TEMPOSOUL / CELESTIAL OBSERVATION SYSTEM）
- 右上：保存星图 / 切换时空 / 立即开始
- 左中：观测数据面板（位置/纬度/经度/时间）
- 右中：星图参数面板（星等/星数/星座线/仰角）
- 左下：方位十字（N ↑）
- 底部：时间滑块（00-23）
- 右下：版本标记
- 样式：青蓝线框 + 半透明黑底 + 毛玻璃

### 2.5 其他
- **保存星图**：`SkyScene.captureFrame()` → PNG 下载
- **切换时空面板**：`SpatioTemporalPanel.tsx` — 340 城搜索 + datetime-local
- **cities.json**：`public/data/cities.json` — 346 城列表
- **预热脚本**：`scripts/warmup-geo.mjs` — 遍历 cities 调 /api/geo 预热 KV

---

## 三、已知问题（待修）

### 3.1 星点过大（已修复并部署 ✅）
- **问题**：shader 里星点 size 最大 12px，满屏大黄白点
- **修复**：**注意：实际生效 shader 在 `SkyScene.ts` 内联（~L220），外部 `star.vert` 未被 import 仅为参考**。2026-09-13 已同步改内联 → `clamp(2.2*brightness, 0.5, 5.0)`，外部文件同步保持一致
- **状态**：已部署，线上验证通过（SkyPage chunk 含新值）

### 3.2 HUD 面板偏淡（已修复并部署 ✅）
- **问题**：面板不透明度 0.6、字体 11px，几乎看不见
- **修复**：已改 → 不透明度 0.85、字体 13px、边框亮度 0.45、加发光阴影
- **状态**：已部署，线上验证通过

### 3.3 小人太小（已修复并部署 ✅）
- **问题**：400 粒子 + size 0.35，相机距离 180，看不见
- **修复**：已改 → 800 粒子 + size 1.2 + opacity 1.0
- **状态**：已部署，线上验证通过

### 3.4 OSM 城市线稿拉取失败（已修复 ✅ 2026-09-13）
- **CF Function**：`functions/api/geo.ts` — 调 Overpass API
- **根因（两层）**：
  1. **闭合环 DP 退化 bug（核心）**：`simplifyTo` 对闭合环（首尾同点）简化时，首尾基线零长度 → 所有点距离=0 → 只剩 2 点 → 全部被丢弃。修复：对非闭合点列简化（`isClosed ? slice(0,-1) : raw`），eps 6→2 米保留小建筑
  2. **Overpass 服务端算力超时**：`timeout:12` 对超密城区（2km 内上万 building）不够，超时返回部分结果（无 building）。修复：timeout→25、网络等待 8s→15s、镜像按实测速度排序（api.de 1.8s 第一）、过滤 construction/garage/shed/ruins/roof 噪声减负
- **缓存**：key 已升 `geo:v5:`（旧 fallback/空数据缓存作废）；命中镜像经 `x-geo-mirror` 头可查
- **前端配套修复**：`SkyScene.loadOSMCity()` 原代码有越界读 `pts[i+3]`（NaN 警告）+ 河流混入建筑数组且从未 add 场景——已重写（越界防护 + 河流独立 LineSegments）
- **效果**：北京 750 栋 / 成都 752 / 深圳 800（截断）/ 西安 800 / 沈阳 735 / 延吉 800，全部 FULL 模式；真实建筑线稿已上线
- **预热**：`scripts/warmup-geo.mjs` 升级为并发 3 + CSV 落盘，后台预热 346 城进行中

### 3.5 星座标签方位角（已修复 ✅ 2026-09-13）
- **现象**：14 个主要星座 CanvasTexture Sprite，渲染管线通（硬编码 Orion 验证过），但真实位置在相机视锥外
- **原因**：相机 fov 60° 半角 30°，大部分星座偏离中心 >47°
- **修复**：**屏幕空间钳制投影**（`SkyScene.updateConstellationLabels()`）——标签真实方向投影到相机空间，超出视锥的钳制到屏幕边缘 0.88 留白，天文 APP 标准做法；相机固定故静态更新（构造 + resize + 时空切换时）
- **配套**：`v.clone()` 报错已修（radecToVec3 返回普通对象 → `new THREE.Vector3(...)`）
- **代码**：`SkyScene.buildConstellationLabels()` + `updateConstellationLabels()`

### 3.6 时间显示
- 代码用 `new Date()`，应是当前时间
- 之前显示 09-12 是因为浏览器缓存旧版，部署后即对

### 3.7 星座说明文案 / 关系分析（新增功能 ✅ 2026-09-13）
- **数据**：`src/lib/sky/constellationInfo.ts` — 14 星座（中文名/主星/最佳观测季/一句话说明）
- **交互**：`SkyScene` 增加 mousemove Raycaster 拾取标签 sprite → `onConstellationHover` 回调
- **UI**：`SkyPage` 底部信息卡（中文名/英文名/说明/主星/季节/**此刻可见性与仰角**——由 radecToAltAz 实时计算）

### 3.8 残余 NaN 警告（✅ 已根治 2026-09-13 视觉重做）
- **根因**：`buildConstellations / buildConstellationLabels / buildMoon` 三处误写 `const {lat,lon}=this.opts`，而经纬度实际在 `this.opts.observer`（buildStars/loadOSMCity 写对了）→ lat=undefined → radecToAltAz/radecToVec3 全返回 NaN → 星座线、标签、月亮坐标全 NaN（既不渲染又报 computeBoundingSphere NaN）。
- **修复**：三处统一改为 `this.opts.observer`，console 错误归零，星座线/标签/月亮同时恢复。

### 3.9 视觉系统 v2 重做（✅ 2026-09-13，用户判定旧版"非常差、没法使用"后整体重做）
- **新星空 shader**：uMagLimit 5.5→6.0（5044 颗全显示），size=`clamp(2.8*pow(brightness,0.62),0.75,6.8)`，亮星(mag<2.1)加十字 diffraction spike + 核心/外晕；新增 `buildStarDust` 背景星尘层（1400 点，地平线上半球 R470-490）填补纯黑。
- **线框仰望者 `buildAvatar`**：12 段圆环头部 + 脊柱/肩/双臂微抬/髋/双腿 LineSegments 骨架 + 关节发光点 + 体内呼吸粒子 + 脚边脉动辉光；group scale 1.25，背影面向 +z 星空。
- **立体线框城市 `loadOSMCity`（关键攻坚，见 3.10）**：roof 顶环 + 近景 wall 竖线 + warm 暖橙窗点 + wat 河流；按到相机距离分近/中/远三层（0.85/0.5/0.28 透明度、近实远虚）；小人脚下半径 18 圆形广场留白；h*0.8 压矮；Number.isFinite 全防护。
- **氛围层**：`buildAmbientParticles` 320 漂浮青尘（loop 上升循环）、`buildGround` 透视网格 + 地平线辉光 shader plane、fallback 占位改连续起伏天际线（去门框）。
- **圆点化**：`makeDotTexture()` 64×64 径向渐变贴图，所有 PointsMaterial 用 map 消除默认方块。
- **SkyPage.tsx 响应式**：side-panel/top-title/const-card/time-bar 样式，@media ≤1080px 隐藏两侧面板、≤560 缩按钮，信息卡 max-width92vw；"俯角18°"改"视场角 58°"；onMove 加坐标未变过滤防信息卡误弹。

### 3.10 真实城市线稿不渲染攻坚（✅ 已解决，三个独立根因，教训重要）
现象：OSM 数据正常（800 栋/5808 顶点）、对象 visible、NDC 在屏内、无 NaN，但 roof 顶环就是画不出来。逐一排除颜色/透明度/雾/深度后定位：
1. **异步回调里对象套 Group 不绘制（核心）**：v1 直接 `scene.add(LineSegments)` 可见；v2 改成 `group.add(l); scene.add(group)`（在 async fetch 回调里）后整组不显示，而构造期同步 add 的 avatar Group 正常。**结论/铁律：异步加载的 three 对象直接挂 scene，不要再包一层 Group。**
2. **NormalBlending 在纯黑底上几乎不可见**：能显示的 avatar 用 AdditiveBlending，城市/星座线用 NormalBlending（低 opacity）肉眼近乎消失。城市线、星座线统一改 `AdditiveBlending` 后呈自发光且稳定可见。
3. **标签矩阵时序错误**：`updateConstellationLabels` 原本只在构造期调用，那时 `camera.matrixWorldInverse` 还是单位矩阵（首次 render 后才更新），标签被算到相机身后。改为在渲染循环里每帧更新；并加屏幕分轴钳制 + 8 趟碰撞松弛防标签互相重叠/压 HUD。
- **附带修复 `resize` 健壮性**：容器 clientWidth/Height 为 0 或 NaN（后台标签/首帧未布局）时直接 return，否则 aspect=0/0=NaN 会污染投影矩阵导致整片对象被裁剪。

### 3.11 构建解阻塞：terms-shim（2026-09-13）
- 构建一度报 `Could not load src/lib/i18n/terms-shim`（ZiweiBoard.tsx 引用但文件缺失，系 i18n 分支在途改动）。为不破坏他人在途工作、又解构建阻塞，新增最小垫片 `src/lib/i18n/terms-shim.tsx`，导出 `TermText({zh,en})` 直接透传文本；正式 i18n 层可整体替换，调用方无需改。

---

## 四、关键文件清单

| 文件 | 作用 | 状态 |
|---|---|---|
| `src/lib/sky/SkyScene.ts` | Three.js 主场景（v2 视觉重做：新相机/星空 shader/线框人/立体城市/标签防重叠） | 已部署 109c3e80 |
| `src/lib/i18n/terms-shim.tsx` | TermText 透传垫片（解 i18n 在途构建阻塞，可被正式层替换） | 新增 |
| `src/lib/sky/stars.data.ts` | 5044 星 Float32Array | 已生成 |
| `src/lib/sky/constellations.data.ts` | 566 星座线 | 已生成 |
| `src/lib/sky/astro.ts` | 天文计算 | 已部署 |
| `src/lib/sky/moon.ts` | 月相 | 已部署 |
| `src/lib/sky/shaders/star.vert` | 星点 shader（已改小） | 待部署 |
| `src/pages/SkyPage/SkyPage.tsx` | 主页面 + HUD 面板（响应式/信息卡） | 已部署 109c3e80 |
| `src/pages/SkyPage/SpatioTemporalPanel.tsx` | 时空切换面板 | 已部署 |
| `src/lib/city/geoApi.ts` | fetchCityGeo | 已提取 |
| `src/lib/city/meshBuilder.ts` | 城市几何→Three.js batch | 已提取，未被 SkyScene 使用 |
| `functions/api/geo.ts` | CF Function Overpass 查询 | 已部署，返回 fallback |
| `functions/api/locate.ts` | CF Function IP 定位 | 已部署，生效 |
| `public/data/cities.json` | 346 城列表 | 已修复 JSON 截断 |
| `scripts/gen-stars.mjs` | 星表生成脚本 | CDN URL 已修 |
| `scripts/warmup-geo.mjs` | 全量预热脚本（并发3+CSV） | 首轮 346 城已跑完 |
| `scripts/rewarm-failed.mjs` | 增量补跑失败城（并发2+3次重试） | 补跑 82 城中 |
| `wrangler.toml` | KV 绑定 | 已更新 |

---

## 五、构建部署命令

```bash
cd "E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统"

# Build（跳过 tsc，因 historical-timezone.ts 有预先存在的类型错误）
npx vite build

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist --project-name temposoul --commit-dirty=true

# 本地 dev
npx vite
# http://localhost:5173/sky
```

---

## 六、下一阶段待办（按优先级）

1. ~~**Build + 部署当前修改**~~（✅ 已完成 2026-09-13：星点缩小/HUD 加亮/小人加大，线上 8a128818.temposoul.pages.dev 验证通过）
2. ~~**修 Overpass fallback**~~（✅ 已完成 2026-09-13：闭合环 DP 退化 bug + 服务端超时 + 镜像排序 + loadOSMCity 重写，线上 750+ 栋真实数据）
3. **预热 346 城**（✅ 首轮完成：264 ok / 73 fallback / 9 error，35.2 min，产物 warmup-geo-result.csv/log；⏳ 增量补跑失败城：`scripts/rewarm-failed.mjs` 低并发 2 + 每城 3 次重试，产物 warmup-rewarm-result.csv/log，验证多为 Overpass 临时超时——秦皇岛/天津首次即成功）
4. ~~**修星座标签方位角**~~（✅ 已完成 2026-09-13：屏幕空间钳制投影；视觉重做期进一步修复 opts.observer 解构、每帧更新、防重叠，标签已清晰可见）
5. ~~**星座说明文案 / 关系分析功能**~~（✅ 已完成 2026-09-13：constellationInfo.ts + hover 信息卡 + 实时可见性）
6. **生产域名 promote**：www.temposoul.com/sky 仍是旧版，需 CF Dashboard promote 最新 deployment（**待用户确认 sky 代码入库分支**——sky 文件目前全部未提交，main 无 sky）
7. **国内 150 城预热缓存**（⏳ 随待办 3 增量补跑覆盖全部 346 城）
8. ~~**残余 NaN 警告定位**~~（✅ 已根治 2026-09-13：opts.observer 解构错误，见 3.8，console 已零错误）
9. **桌面宽视口终验**（待办）：当前自动化浏览器宿主被隐藏（window.innerWidth=0、CDP setDeviceMetrics 报 Session not found），竖屏 463 已充分验证；宽屏 @media 布局逻辑标准但未在真实桌面窗口截图终验，promote 前建议人工开一次桌面宽度核对 HUD 并排不重叠。

---

## 七、用户锁定的视觉风格关键词

- 纯深空漆黑背景
- 纯线框网格构建，无实体填充
- 青蓝色发光细线 + 发光节点
- 全息投影质感
- 高对比度冷色调
- 线条外层柔和蓝光光晕
- 漂浮青色发光粒子
- 多面板分区信息图构图
- 高密度信息排布
- 白色无衬线文字
- 极微弱暖橙黄微光作单点点缀

**用户拒绝的方案**：
- 方盒子城市线稿（"像儿童简笔画"）
- 线框球+柱体人物
- 程序波纹铁皮地面（"像要下雨打雷"）
- REALTIME 专家的手写 WebGL2 引擎（gl-matrix 与 Three.js 冲突）
