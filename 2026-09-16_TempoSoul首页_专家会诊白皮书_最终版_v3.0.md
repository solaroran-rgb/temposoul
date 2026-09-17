# TempoSoul 首页 · 专家会诊白皮书 · 最终版 v3.0（R2 定稿）

> 生成日期：2026-09-16 深夜
> 依据：SOP v1.0；R1 论证稿（230949 前稿）本地审计 + R2 论证稿（20260916_230949）定稿整合
> 状态：**四专家最终技术选型已定死，接口契约冻结，可进入 R3 编码轮**
> 本文件为 R3 编码的**唯一输入**，替代此前所有轮次白皮书

---

## 0. 会诊结论（三句话）

1. **核心诉求**：把高德 3D 白模街景（真实数据）渲染成与样张（mockup-hero-jinan-v2.png）**视觉风格一致**的复刻，带鼠标交互 + 粒子动效。数据链路已通（高德 Key 验证通过、canvas 像素可读实测通过）。
2. **能力边界**：风格高度一致可达成；像素级一致不可求（真实城市数据 ≠ 虚构概念海报，几何差异为容差项）。
3. **最终技术栈（R2 定稿）**：**原生 Canvas 一次性线稿提取（MSQR）→ Three.js 统一渲染上下文（SelectiveBloom + 自发光 Shader + 粒子）→ GSAP/CSS 变量驱动交互**。

---

## Part A 契约纪律 v3.0

### A.1 首行契约确认（专家回复第一行，一字不差）

> 契约确认：我是【专家X·<专业名称>】，已读本文件全部内容，当前为 R3 编码轮，仅执行任务卡 B-X，全程不调用任何工具。

### A.2 基础环境与资产（不变，R3 以 POC 为移植基线）

- 代码根：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\`
- 当前 POC：`home-preview\index.html`（28.5KB）+ `home-preview\stars-data.js`（238KB，8921 星 HYG v38）
- 生产工程：同根 Vite + React 19 + TS 严格模式 + pnpm；入口 `src/App.tsx`；部署 `npx wrangler pages deploy dist --project-name temposoul --branch main`
- 本地联调：hosts `127.0.0.1 local.temposoul.com`；`home-preview\` 起 80 端口服务；访问 `http://local.temposoul.com/index.html`
- 验证脚本：`python E:\KnowledgeOS\_pixel_analysis\county_test\pw_home_v15.py`
- 视觉样板：`E:\KnowledgeOS\项目库\.temposoul-wt\deploy-0913\docs\design\mockup-hero-jinan-v2.png`（压缩版 `county_test\ref_user.png`）

### A.3 接口真相表 IT（冻结版，全部经本地实测/官方公开面核实）

| 编号 | 项 | 冻结值 |
|---|---|---|
| IT-1.1 | 高德 Key | `c322315b4ad609930b96ac97be2ae907` |
| IT-1.2 | securityJsCode | `db6d34fc64f152b4497cf37cce43db2c`（**禁与 Key 颠倒**） |
| IT-1.3 | 高德白名单 | `www.temposoul.com;temposoul.com;local.temposoul.com` |
| IT-1.4 | 3D 楼块参数 | `viewMode:'3D'`、pitch 62、zoom 17、`AMap.Buildings({zooms:[15,20],merge:false,sort:false})`、`setStyle({hideWithoutStyle:false,rejectTexture:true,color1:'#0e4f85',color2:'#1f7fbf'})`、`mapStyle:'amap://styles/dark'` |
| IT-1.5 | 恒星目录 | `window.STAR_CATALOG = [[ra,dec,mag],...]`，8921 颗，mag≤6.5 |
| IT-2 | **canvas 像素可读性（实测通过）** | `toDataURL()` 读出 70 万字符 PNG；同帧 `getImageData` 成功（非透明 0.63%~1.37%，max alpha 250+）；R1 主路线成立 |
| IT-3 | AMap.Buildings 几何读取器 | **确认不存在**（公开面无 getVertices/getFootprint 类方法），几何唯一来源 = canvas 像素 |

### A.4 红线（一票否决，R3 编码同样适用）

- 运行时零 AI（AI 仅构建期可定义风格）；禁止 AI 生图/静态图当背景
- 禁止手绘几何堆砌；禁止从零重绘街景（必须真实像素→线稿）
- 禁止 3D 实体渲染、立体曲面、阴影光影、大面积暖色、杂色
- R3 编码每文件全量输出，禁"与上一版一致"式省略

### A.5 视觉基准（样本提示词，R2 已逐条参数化，见 §3）

样本提示词全文同 v2.0 §A.5（纯黑底/青蓝发光线框/无阴影/多面板 HUD/西班牙文块/单点暖橙）。参数化结果在 §3 色彩锁定表。

### A.6 契约缺口回填与新增（最终状态）

| 缺口 | 状态 | 结论/影响 |
|---|---|---|
| #A-01 | ✅ 确认 | AMap.Buildings 无几何读取器，唯一来源 canvas 像素 |
| #A-02 | ✅ **实测通过** | canvas 像素可读，提取主路线成立 |
| #A-03 | ⏳ 待 R3 前实测 | MSQR alpha 阈值（128 vs 64）需在 IT-1.4 实渲染下微调 |
| #A-04 | ⏳ 待 R3 前实测 | 楼块色相分离成功率（H 190-230°/V>55 的分离效果取样确认） |
| #A-05 | ⏳ 待 R3 前实测 | maxShapes 上限 2000 是否覆盖 zoom 17 单屏全部楼块 |
| #C-01 | ⏳ 待确认 | GSAP 免费版许可证是否满足商业部署（不满足则自研 timeline） |
| #D-01 | ⏳ 待确认 | 暖橙点缀位置（建议右下）与专家B 构图判据最终对齐 |

---

## Part B 四专家 R2 定稿（最终技术选型汇总）

### B-A 专家A · 首席三维白模重构与线稿化工程师 — 定稿

**最终选型：原生 Canvas 2D 预处理 + MSQR（Marching Squares）轮廓追踪 + RDP 后处理**

- 流程：`getImageData` → 色相分离（楼块 #0e4f85/#1f7fbf 青蓝色域 vs dark 底色）→ 灰度/二值化（楼块 alpha=255）→ MSQR 等值线追踪 → RDP 抽稀 → `LinePrimitive[]`
- **否决项**：OpenCV.js（~9MB 加载，一次性任务不值得）；手写边缘检测（断线/粘连复杂）；Three.js 旁路（几何与高德实渲染不对位，破坏复刻判据）
- **成熟方案推荐**：① `marchingsquares@1.3.3`（MIT，主选，内建 RDP/多形状/轻量）② 原生 Canvas 色相分离（零依赖预处理）③ OpenCV.js（Apache 2.0，备选：仅 MSQR 漏线时启用，Worker 按需加载）④ Potrace WASM（GPL-2.0，R4 后可选矢量化，暂不启用）
- **R3 输入**：见 §3.1 基元 Schema + §3.2 提取参数终表
- **性能**：单次提取 <150ms（预处理 <20ms + MSQR <50ms），一次性执行不进渲染循环

### B-B 专家B · 全息风格化渲染工程师 — 定稿

**最终选型：Three.js（WebGL2）+ pmndrs/postprocessing（SelectiveBloom）+ 自写 Unlit ShaderMaterial + Line2（Fat Lines）**

- **否决项**：原生 UnrealBloomPass（全屏泛光污染、透明物/HUD 阈值分离差）；自写 Kawase Bloom（成本高、维护失控）；Canvas 2D 描边（性能灾难）
- **成熟方案推荐**：① pmndrs/postprocessing（vanilla 版，SelectiveBloom 按材质隔离泛光，HUD 保持锐利）② three-meshline / Line2（屏幕空间可变线宽，近景 1.5px 远景 1px）③ 自写 ShaderMaterial（Unlit 自发光，硬编码色值，彻底无光照）
- **6 Pass 管线（冻结）**：Pass1 Depth Mask → Pass2 Core Wireframe（#00E5FF，NoBlending）→ Pass3 Grid&Nodes（Additive）→ Pass4 SelectiveBloom（threshold 0.6 / strength 1.2 / radius 0.8，仅线框+粒子泛光）→ Pass5 Particle（交接 C，Additive，depthTest 开/写入关）→ Pass6 HUD&暖橙（交接 D，NormalBlending）
- **移动端降级**：无 WebGL2 或内存 <4GB → 跳过 Pass4，线框 alpha 提升模拟发光
- **体积**：Tree-shaking 后 gzip 增量 <80KB
- **R3 输入**：§3.3 参数终表 + 色彩锁定表 + 地平线基准（Y 40-50%，FOV 45-55°）

### B-C 专家C · GPU 粒子与程序化动效工程师 — 定稿

**最终选型：Three.js Points + ShaderMaterial（与 B 共享同一 WebGLRenderer/Scene/Camera）+ CPU 更新漂移 + GSAP 编排时间轴**

- **否决项**：PixiJS（额外引入/离屏合成）、原生 WebGL（重复造轮子）；Canvas 2D 仅作 L2 兜底
- **成熟方案推荐**：① Three.js Points+ShaderMaterial 工作流（主，参考 three.js 官网 hero）② shader-particle-engine（备选，2020 停维护，不主选）③ GSAP（时间轴编排，免费版即可）④ Lenis（条件性：首页有滚动才引入）
- **设备档位矩阵（冻结）**：L0 桌面 3000 粒全动效 60fps；L1 集显/移动中高端 1200/800 粒关流动；L2 移动低端 400 粒 Canvas 2D 仅呼吸 30fps；降级触发：30 帧均耗时 >14ms → L1，>20ms → L2，恢复 <12ms 回升
- **动效参数终表（冻结）**：呼吸 0.05-0.1Hz ±15%；脉冲 0.2Hz 峰值 1.5×；能量流动 5-10px/s；漂移 0.2-0.8px/s 阻尼 0.98 锚点±15px；暖橙 #FFB74D 亮度 0.3× 呼吸周期 8s
- **R3 输入**：§3.4 粒子 Buffer 结构 + 着色器伪代码 + 锚点采样协议

### B-D 专家D · 实时交互与沉浸体验工程师 — 定稿

**最终选型：GSAP Core + 原生 rAF lerp + CSS Custom Properties（--mx/--my）驱动，移动端静态锁定**

- **否决项**：DeviceOrientation 陀螺仪（需授权/晕动症，弃用）；重型动画库（包体积）
- **成熟方案推荐**：① GSAP Core（~38KB，时间轴+回位缓动）② CSS 变量（零体积单向数据流桥，B/C 直接读取）③ Lenis（条件性）
- **参数（冻结）**：视差系数 Layer0-3 = 0.01/0.04/0.12/0.20，max_offset 20px；lerp 系数 0.08/帧；静止判定 300ms；回位 gsap 1.5s power2.out；移动端 `pointer:coarse` → 视差归零静态锁定
- **5.5s 时间轴（冻结）**：T0 容器淡入 0.5s → T0.5 暗网格 1.0s → T1.0 星空按星等分批 2.0s → T2.5 线稿（等 `extraction_complete` 事件）2.0s → T4.0 HUD/暖橙 1.0s → T5.0 粒子激活 + 交互挂载
- **DoD 终表**：见 §5

---

## Part C 整合后统一技术架构（流水线视图）

```
┌─────────────────────────────────────────────────────────────────────┐
│ ① 数据层（一次性，<150ms）                                            │
│    高德 3D 白模渲染（IT-1.4） → getImageData → 色相分离(H190-230/V>55) │
│    → 二值化 → MSQR 轮廓追踪 → RDP 抽稀 → LinePrimitive[]              │
│    （触发：map complete + 1 rAF；视角变化防抖后重提）                   │
├─────────────────────────────────────────────────────────────────────┤
│ ② 渲染层（运行时，Three.js 统一上下文，8-12ms/帧）                    │
│    Pass1 Depth → Pass2 线框(Line2+Unlit) → Pass3 Grid&Nodes          │
│    → Pass4 SelectiveBloom → Pass5 粒子(Points+Additive) → Pass6 HUD   │
│    ＋ 星空层（8921 星真实天文，既有）                                   │
├─────────────────────────────────────────────────────────────────────┤
│ ③ 交互层（GSAP + CSS 变量 --mx/--my）                                 │
│    mousemove → lerp(0.08) → 四层视差系数(0.01/0.04/0.12/0.20)          │
│    → 300ms 静止回位 1.5s power2.out；移动端静态锁定                    │
│    ＋ 5.5s 渐进时间轴编排                                               │
└─────────────────────────────────────────────────────────────────────┘
```

**跨专家接口契约（冻结，R3 必须逐字遵守）**：
- A→B：`LinePrimitive[]`（B 可覆盖 glow/width/opacity，不得改 pts/depth/lod/kind）
- A→C：`LinePrimitive[].pts` 顶点采样（均匀间隔 5px，30% 随机锚点，单建筑 ≤20 点，深度 z=建筑高度归一化）
- A→D：`LinePrimitive[].depth`（视差分层输入）
- D→B/C：CSS 变量 `--mx/--my`（归一化 -1~1），B/C 渲染循环内读取，禁止 JS 逐帧传对象

---

## Part D R3 编码输入清单（汇总四专家，编码轮唯一依据）

### D.1 基元 Schema（专家A 冻结）
```ts
type LinePrimitive = {
  id: string;             // 'bldg_{traceIndex}_contour' | '_facade'
  kind: 'building_contour' | 'facade_edge' | 'roof_grid' | 'road_centerline' | 'water_boundary';
  pts: [number, number][]; // 屏幕归一化 [0,1]×[0,1]
  depth: number;           // [0,1] 0=最远 1=最近
  lod: 0 | 1 | 2;
  glow: number;            // 建议初值 [0,1]，B 可覆盖
  width: number;           // 归一化基准线宽，B 可覆盖
  opacity: number;         // [0,1] 建议初值
  closed: boolean;
  meta: { screenY: number; bbox: [number,number,number,number]; src: 'canvas_edge'|'derived_grid'; traceIndex: number; alphaAtTrace: number };
};
```

### D.2 提取参数终表（专家A 冻结，初始值待 #A-03/04 实测微调）
| 参数 | 值 |
|---|---|
| 色相范围 H | 190°–230°（青蓝域） |
| 亮度阈值 V | 55（0-255）先试，回退 V>50 纯亮度 |
| MSQR alpha | 128 先试，64 备选 |
| MSQR tolerance(RDP) | 近 1.1 / 中 1.8 / 远 2.5（对应 LOD 0/1/2） |
| MSQR maxShapes | 2000 |
| MSQR bleed | 0 先试，2 备选（防粘连） |
| 短段过滤 | 总长 < 0.004 归一化丢弃 |
| 闭合判据 | 首尾距 < 0.006 |

### D.3 渲染参数终表（专家B 冻结）
| 项 | 值 |
|---|---|
| 线框颜色 | 主 #00E5FF / 景深远 #0066FF |
| 线宽 | 近景 1.5px / 远景 1.0px（Line2） |
| Bloom | threshold 0.6 / strength 1.2 / radius 0.8（Selective，仅线框+粒子） |
| 暗网格 | #020408 过渡，alpha 0.1 |
| 地平线 | 屏幕 Y 40-50%（与样张视觉重心对齐） |
| FOV | 45°–55° |
| 色彩锁定（禁色） | 红/黄/大面积橙/绿/大地色/灰阶阴影（暗部直接 fade 到 #020408） |

### D.4 粒子与动效参数终表（专家C 冻结）
见 §B-C（设备档位矩阵 + 动效参数）。Buffer 结构：`position/aPhase/aSize/aBrightness` Float32Array；着色器：径向渐变圆点 + 指数光晕 + 深度衰减 `gl_PointSize`。

### D.5 交互参数终表（专家D 冻结）
见 §B-D（视差系数/lerp/回位/时间轴/移动端）。

---

## Part E 验收门禁（DoD 终表，R4 逐条勾选）

| # | 判据 | 证据等级 | 验证方法 |
|---|---|---|---|
| 1 | 高德白模线稿提取成功（楼块轮廓清晰、无大面积漏线/粘连） | E2 | 提取结果截图 vs 原白模截图对比 |
| 2 | 线稿复刻样张风格：纯黑底/青蓝发光/无阴影/无实体感 | E1 | 截图并排对比 mockup-hero-jinan-v2.png |
| 3 | 色彩纯净：除单点暖橙外无色杂（HSV 色相偏差 <15°） | E2 | 5 点采样脚本 |
| 4 | 地平线 Y 40-50%，构图与样张视觉重心一致（偏差 <5%） | E1 | 截图测量 |
| 5 | 粒子动效：呼吸/脉冲/流动参数符合终表，克制不花哨 | E1 | 肉眼 + 帧录 |
| 6 | 鼠标交互：四层视差分离明显、阻尼平滑、1.5s 回位无抖动 | E1/E2 | 手测 + Performance 面板 |
| 7 | 移动端：视差静态锁定，FPS ≥55，无白屏 | E3 | DevTools 移动视图 |
| 8 | 性能：主线程 JS <2ms/帧，总帧 <16ms（桌面 60fps） | E3 | Performance 录 10s |
| 9 | 三视图（自动定位/济南/台北）PAGEERRORS none | E2 | pw_home_v15.py |
| 10 | 用户肉眼审核通过（不通过 = 未完成） | E0 | 用户验收 |

---

## Part F 下一步（R3 编码轮）

1. **本地回填前置项**（编码前一次实测）：#A-03/#A-04/#A-05（提取参数微调，用 IT-1.4 实渲染 + getImageData 取样）、#C-01 GSAP 许可证、#D-01 暖橙位置
2. 本地安装依赖：`marchingsquares@1.3.3`、`three`、`@react-three/postprocessing`（或 vanilla pmndrs/postprocessing）、`gsap`
3. 按 Part C 流水线分工：A 输出提取模块 → B 输出渲染管线 → C 输出粒子/动效 → D 输出交互/时间轴；本地统一接线（公共件先行）
4. 逐条跑 Part E DoD；不合格定向退回补交
5. 全部通过 → 接入生产工程 → 本地全量验证 → 部署预览 → 用户线上验收

---

## 附：版本记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 09-16 | 交接清单 SOP 化；四专家 R1 启动 |
| v2.0 | 09-16 | R1 审计 + #A-02 实测回填 + R2 深度论证轮 |
| **v3.0 终版** | **09-16** | **R2 四专家定稿整合：最终技术选型冻结、接口契约冻结、R3 输入清单汇总、DoD 终表；进入 R3 编码轮** |
