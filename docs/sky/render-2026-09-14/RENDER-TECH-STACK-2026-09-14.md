# /sky 首页渲染 —— 技术栈全清单

> 生成：2026-09-14 20:5x ｜ 主控：可吉 / WorkBuddy ｜ 版本：v1
> **性质说明（重要）**：本清单描述的是「渲染方案 + 可部署形态」用到的技术。**该首页尚未部署** —— 线上 `/sky` 仍为 09-13 v2 版本，本轮全部产物零写入、无部署、无 KV 写入。
> 归档目录 `docs/sky/render-2026-09-14/` ｜ `src/` 与 `functions/` 零改动

---

## 总览：技术面分三层

| 技术面 | 何时运行 | 干什么 | 主要载体 |
|---|---|---|---|
| **运行时** | 用户打开页面时（浏览器） | 装载资产 + 渲染真 DOM 文字 + 自适应选档 | `home-web.html` 等 4 个 HTML |
| **生产** | 离线一次性（改设计稿时重跑） | 设计稿 → 资产矩阵 + 场景层 + 引擎文件 | `tools/` 下 10 个 Python 脚本 |
| **验证** | 离线每次交付前 | CDP 取证 + 双门禁判定（像素 / 内容） | `drive_web.js` + `compare_web.py` |

**一句话架构**：`设计稿位图资产（保真度唯一来源）` + `真 DOM 文字（可索引/可复制）` + `JS 自适应选档加载（过 3 秒门槛）`。

---

## 一、运行时技术（浏览器侧）

### 1.1 布局与坐标系统（地基）

| 技术点 | 具体实现 | 解决什么问题 |
|---|---|---|
| 设计稿坐标系 | `#web` 盒子宽高比**恒定 1.981424**，`max(100vw, calc(100vh*1.981424))` | 文字与背景的相对位置在任何视口下永不错位 |
| 负 margin 居中 | `margin-left: calc((100vw - max(...))/2)` | **禁 `transform:translate(-50%,-50%)`** —— 高 969 为奇数时 `-50% = -484.5px` 是半像素，会触发整层重采样，几何全对但像素全错（这是上一版背景只有 53% 一致的真正根因） |
| 设计单位缩放 | CSS 自定义属性 `--u = viewportWidth / 1920`，全站尺寸写 `calc(var(--u)*N)` | 一处改 `--u`，全站等比缩放；文字层与背景层共用同一单位 |
| 铺满 | `object-fit:cover` + `inset:0` | 横版稿铺满任意视口 |

### 1.2 资产加载

| 技术点 | 具体实现 | 作用 |
|---|---|---|
| 场景底图 | `<img id="scene" decoding="sync" fetchpriority="high">` | 同步解码 + 高优先级，抢首屏 |
| 不写死占位 | JS 按档位动态赋 `src`（`ASSETS[tier][ext]`） | 避免白下载无用档位（上一版写死 1080 档，好网档白耗 75KB） |
| 预加载 + 解码门 | `new Image()` 预热 → `img.decode()` Promise → 再上屏 | 确保「首屏计时」记的是**解码完成**时刻，不是网络到达时刻 |

### 1.3 自适应决策（性能达标的关键）

| 技术点 | 具体实现 |
|---|---|
| 网络探测 | `navigator.connection`：`effectiveType` / `downlink` / `saveData` |
| 弱网判定 | `saveData` 为真 或 `effectiveType ∈ {slow-2g, 2g, 3g}`；另支持 `?net=weak\|good` 强制覆盖（供门禁复现） |
| 需求像素 | `max(innerWidth, innerHeight × 1.981424) × min(devicePixelRatio, 2)` |
| 弱网降档 | 需求像素 **× 0.55** |
| 档位选取 | `for (i = TIERS.length-1; i >= 0; i--)` —— **必须高→低遍历**才能取「最小满足档」；从低到高会永远返回最大档，弱网永不降档 |
| 格式选择 | 弱网 → AVIF（能力探测通过）；好网 → 无损 WebP |
| **AVIF 能力探测** | **1×1 AVIF 内联图** + `onload`/`onerror`。**禁用 `canvas.toDataURL('image/avif')`** —— Chrome 恒返 png，探测永远失败 |
| 异步竞态治理 | `boot()` + `BOOTED` 守卫 + `setTimeout(boot, 400)` 兜底 —— 页面 init 若早于异步探测结果，会按未探测状态选错档 |
| 首屏计时 | `performance.now()` / `PerformanceNavigationTiming` / `requestAnimationFrame` → 写入 `window.__PERF.firstFromNav` |

### 1.4 文字层（必须真 DOM）

| 技术点 | 具体实现 | 说明 |
|---|---|---|
| 语义结构 | `<h1>命律 TempoSoul</h1>` / `<p>探索命运的节律</p>` / `<a href="#start">立即开始</a>` | 可选中、可复制、可被搜索引擎与读屏器读取 |
| 定位 | 绝对定位 + 百分比（实测值：54.818% / 16.512% 等） | 与设计稿实测几何**0 误差** |
| 横向跨度对齐 | **合成窄化 `transform: scaleX()`** + `transform-origin:50% 50%` | 设计稿是 AI 艺术字、无源字体；系统字体同字高下宽约 17%。反解 `scaleX` 使「跨度 == 设计稿跨度」且「字高保持量级」同时成立。实测倍数：标题 0.8324 / 副标题 0.9545 / CTA 1.1728 |
| 字体就绪后再测量 | `document.fonts.ready.then()` | 防止用 fallback 字体的宽度算错倍数 |
| 几何自测 | `getBoundingClientRect()` + `getComputedStyle()` 反算 `--u` | 门禁通过 `window.__DOMINFO()` 读取 |
| 发光与字距 | `text-shadow` 多层、`letter-spacing` + `text-indent` | 复刻设计稿的字距与辉光 |

### 1.5 动态层

| 技术点 | 具体实现 |
|---|---|
| 星点微光 | **Canvas 2D**：`arc()` 绘制，`Math.pow(Math.random(), 1.5)` 使高度分布压向地平线（`HORIZON = 0.680083`），透明度正弦呼吸 |
| 帧驱动 | `requestAnimationFrame`，`cancelAnimationFrame` 清理 |
| 纯增益设计 | 叠加层（非替换），**不参与像素一致性判定** → 门禁前 `__SETLIVE(false)` 整层关闭 |
| 无障碍 | `matchMedia('(prefers-reduced-motion: reduce)')` 为真则不启动动画 |
| 事件穿透 | `pointer-events:none`，仅 `#ui a` 恢复 `auto` |

### 1.6 响应式与移动端

| 技术点 | 具体实现 |
|---|---|
| 横竖屏判定 | `innerHeight > innerWidth * 1.05` → 加 `html.portrait` 类 |
| **移动端策略** | **「重排」而非「裁字」** —— 横版稿铺竖屏 `cover` 会水平裁掉 77%，标题与 CTA 必被切。竖屏改为 flex 居中列（`flex-direction:column` + `gap:5.2vh` + `padding-top:15vh`），字号独立缩放（46u / 15u / 15u），`title .en` 换行显示 |
| 切换重算 | `resize` / `orientationchange` 监听（`{passive:true}`），并重新测量文字跨度 |
| 单文件版 | `INLINE = true` 时跳过网络逻辑，直接读内联 base64 的 `src` |

### 1.7 元数据与无障碍

| 技术点 | 具体实现 |
|---|---|
| 文档声明 | `<!DOCTYPE html>` + `lang="zh-CN"` + `<meta charset="utf-8">` |
| 视口 | `viewport-fit=cover`（刘海屏适配） |
| 色彩方案 | `<meta name="color-scheme" content="dark">` |
| SEO | `<title>` / `meta description` / `og:title` / `og:description` / `og:type` |
| favicon | **SVG data URI 内联**（零外链） |
| 图片可访问 | `alt="命律 TempoSoul 首页场景"` |
| 拖拽抑制 | `-webkit-user-drag:none`（仅场景图；文字仍可选） |
| 焦点可见 | `:focus-visible` 有明确替代视觉（`outline:none` 但保留边框/辉光） |

---

## 二、资产与编码技术

| 格式 / 技术 | 参数 | 用途 | 实测 |
|---|---|---|---|
| **无损 WebP** | `lossless=True, method=6, quality=100` | 严格档（保真度唯一来源） | 1920 档 1110.6 KB |
| **AVIF** | `quality=75, speed=4` | 视觉档（弱网主力） | 1920 档 **171.2 KB**，PSNR 44.12（视觉无损门槛 42），体积仅为无损的 **15%** |
| PNG | 中间无损链 | 自证转换无损失 | 资产链 `PNG→PNG→WebP` **max diff = 0** |
| **多分辨率金字塔** | `LANCZOS` 重采样，5 档：1920 / 1440 / 1080 / 768 / 390 | 按视口 × DPR 选档 | 2 类资产 × 5 档 × 2~3 格式 = 29 个文件 |
| **文字剥离（inpainting）** | 1) 矩形**全覆盖**蒙版（比阈值分割更彻底，避免鬼影）2) `GaussianBlur(1.5)` 羽化边缘 3) 逐列**垂直线性插值**（取上下各 10px 邻域均值） | 生成「无文字场景层」，让上层用 HTML 排版 | **区域外修改量 = 0**（严格自证：只动了文字区） |
| base64 data URI | 场景层内联 | 单文件版（离线可开、可单文件分发） | `home-web-inline.html` 1.39 MB，首屏 103ms |
| 频率域分解 | FFT 带通分离 | 验证城市带可独立成层（L3 数据层的数学依据） | 城市带高频能量 = 天空带的 **3.65×** |

---

## 三、生产工具链（离线）

| 组件 | 版本 | 用途 |
|---|---|---|
| Python | **3.13.14**（托管版） | 全部离线生产与验证脚本 |
| Pillow | **12.3.0** | 图像读写、LANCZOS 重采样、WebP 无损编码、**内置 AVIF 编码**（`features.check('avif') = True`，经 libavif，**无需额外 `pillow_avif` 模块**） |
| NumPy | **2.5.2** | 逐像素对拍、差异矩阵、蒙版运算 |
| SciPy | **1.18.1** | `ndimage`（连通域/掩码处理） |
| scikit-image | **0.26.0** | 图像指标辅助 |
| Node.js | **22.22.2**（托管版） | 驱动 CDP 取证脚本 |

脚本（`tools/`，全部可复跑）：

| 脚本 | 职责 |
|---|---|
| `make_assets.py` | 多分辨率资产 + 频率分解实验 |
| `make_assets_lossy.py` / `make_assets_avif.py` | 有损 / AVIF 压缩矩阵 |
| `remove_text.py` | 文字剥离 → 场景层 + 实测 UI 几何 |
| `build_engine_v2.py` / `build_mobile.py` / `build_web.py` | 引擎模板生成（注入几何、档位表、AVIF 探测串） |
| `compare_f100.py` / `gate_compare.py` / `compare_web.py` | 像素门禁与分区对拍 |
| `diff_root.py` / `vp_probe.py` / `find_text.py` | 差异溯源 / 视口探针 / 文字区定位 |
| `make_compare.py` | 生成人工可看的对照图 |

---

## 四、验证与门禁

| 组件 | 版本 / 参数 | 说明 |
|---|---|---|
| Node.js | 22.22.2 | 驱动层 |
| **playwright-core** | **1.63.0** | 用 `chromium.connectOverCDP()` 接管**本机真实 Chrome**（不用其自带 chromium） |
| Chrome | **151.0.7922.109** | `--headless=new --remote-debugging-port=9395 --force-device-scale-factor=1 --hide-scrollbars` |
| CDP 命令 | `Network.enable` / `Network.emulateNetworkConditions` / 页面截图 | 网络节流：`latency` + `downloadThroughput` |
| 节流档 | 好网 8 Mbps / 弱网 1.6 Mbps / 慢网 0.4 Mbps | 对应三种真实场景 |
| 视口矩阵 | 1920×969（设计稿原生）/ 390×844 手机 / 834×1112 平板 | 另含 1440×900 / 1280×1024 / 1024×768 探针 |
| DOM 钩子 | `window.__DOMINFO()` | 输出 `h1Count` / `h1Text` / `bodyText` / `selectable` / `title` / `desc` / 三处文字几何 / 自适应倍数 |
| 性能钩子 | `window.__PERF` | `firstFromNav` / `decode` / `tier` / `ext` / `weak` / `avifOk` |
| 隔离钩子 | `window.__SETLIVE(false)` | 关动态层，保证静态对拍干净 |

**双门禁（任一不过，不许交付）**

| 门禁 | 断言项 |
|---|---|
| **像素门禁** | `PSNR` / `max channel diff` / **逐像素一致率 exact%** / `diff≤2` / `diff≤8`；**必须分区报告**（全图 / 背景区 / 三个文字区 / 10 条横带）+ 差异热力图。全图单一数字会掩盖「背景 100%、文字全错」 |
| **内容门禁** | `h1Count ≥ 1`、`h1Text` 非空、`body.innerText` 有真实文案、`selectable = true`、`title` 与 `meta description` 齐全 |

---

## 五、工程编排与环境隔离

| 技术点 | 实现 |
|---|---|
| 单文件编排 | PowerShell 脚本把「清残留进程 → 建站点目录 → 起 `http.server` → 探活 → 起 headless Chrome → 跑 drive → 收证据 → 清理」**串在同一次调用**（后台起 `http.server` 会被沙箱回收，必须捆绑） |
| 端口固定 | HTTP `8903` / CDP `9395`（避免端口漂移导致连错实例） |
| 进程清理 | 按命令行特征（`cw_u*` / `remote-debugging-port=93*`）精确 kill 遗留 Chrome，不动用户正常 Chrome |
| 代理隔离 | 清空 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY`，设 `NO_PROXY=127.0.0.1,localhost`（本机 `127.0.0.1` 探活若走代理会拿到 502 假象） |
| 模块路径 | `NODE_PATH` 指向托管 `node_modules`，不污染全局 |
| 原子改模板 | 同文件多处改动一律用 Python 原子 patch + `grep` 校验关键串（同文件并行 Edit 会竞态，前一改动被静默回滚且工具仍报 success） |

---

## 六、**没有用到**什么（同样是技术决策）

| 没用 | 原因 |
|---|---|
| 前端框架（React / Vue / Svelte） | 单页静态首屏，框架只增加体积与首屏 JS 执行成本 |
| 构建工具（webpack / vite / rollup） | 无依赖可打包；构建链是部署复杂度而非价值 |
| **任何第三方 JS** | 页面运行时 JS 全部手写原生，**零 npm 前端依赖** |
| CSS 框架（Tailwind / Bootstrap） | 样式量小且高度定制，框架反而要覆写 |
| **CDN / 外部字体请求** | 零外链：favicon 是内联 SVG data URI，资产同源。第一次渲染不依赖任何第三方可用性 |
| 服务端渲染 / 后端 | 纯静态，可托管于任意静态服务 |
| Canvas 程序化重绘插画 | **已证伪** —— 用矢量重画 AI 高密度位图插画，密度天花板 44%，补 7 轮仍像线稿。根因是介质错，不是参数错 |

---

## 七、部署前置条件（待老板确认落点）

| 项 | 要求 |
|---|---|
| 托管形态 | 纯静态资源即可（HTML + assets/），无需应用服务器 |
| **MIME 类型** | 必须正确返回 `image/avif` 与 `image/webp`；若服务端不认 AVIF 会回落到 webp，弱网首屏会显著变慢 |
| 缓存策略 | 资产带内容指纹/版本号可设长缓存（`immutable`）；HTML 设短缓存 |
| 压缩 | HTML 开 gzip/br；**图片资产不要再压缩**（已有损/无损编码） |
| 与 `src/` `functions/` 的关系 | **本项目硬纪律：`src/` 与 `functions/` 零改动。** 因此该首页若要上线，落点方式需老板明确，本轮未做任何部署动作 |

---

## 八、依赖清单一览（可复现）

```
运行时（浏览器）
  Chrome 151.0.7922.109 / 任何支持 AVIF+WebP 的现代浏览器
  零第三方 JS 依赖 · 零外部字体 · 零 CDN

生产（离线）
  Python 3.13.14
    Pillow       12.3.0   （含内置 libavif → AVIF 编码）
    NumPy        2.5.2
    SciPy        1.18.1
    scikit-image 0.26.0

验证（离线）
  Node.js        22.22.2
    playwright-core 1.63.0
  
编排
  PowerShell（Windows）· 端口 8903(HTTP) / 9395(CDP)
```

---

## 九、实测结论（本清单所支撑的指标）

| 指标 | 结果 |
|---|---|
| 背景层逐像素一致 | **98.8929%**（PSNR 55.66）；背景带 y[484,969) = **100.0000%** |
| 全图逐像素一致 | 91.0987%（缺口 = 三处文字的**字形**差；位置/跨度/中心已 0 误差） |
| 文字几何 | 标题 645px@(54.818%,16.512%) ｜ 副标题 390px@(50%,25.8%) ｜ CTA 290×104@(51.562%,39.628%) —— 与设计稿**差 0** |
| 首屏 | 好网 1249ms ｜ 弱网 803ms ｜ 慢网 2529ms ｜ 手机 1251ms —— **全部 < 3 秒**，0 报错 |
| 内容门禁 | `h1Count=1`、`bodyText="命律TempoSoul 探索命运的节律 立即开始"`、`selectable=true`、`title`+`description` 齐全 |

---

## 十、边界

- 线上 `/sky` **仍为 09-13 v2**，本轮**零部署、零写入、无 KV 写入**
- `src/` 与 `functions/` **零改动**
- 全部产物在 `docs/sky/render-2026-09-14/`
