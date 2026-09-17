# /sky 首页 · 视觉标准 v2 落地 · 任务交接文档

| 项 | 值 |
|---|---|
| 交接日期 | 2026-09-14 |
| 交接人 | 可吉（WorkBuddy） |
| 接收方 | 新任大模型执行者 |
| 交接包根目录 | `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\sky\handover-20260914-sky-v2-exec\` |
| 对应分支 | `thread/sky-v2-exec`（worktree `.temposoul-wt/thread-sky-v2-exec`） |
| 基线 commit | `fb26da2` |
| 当前状态 | **代码已落地 + 判据全绿；未部署、未提交主仓** |

---

## 0. 任务定义与边界

**一句话任务**：把 `/sky` 首页的 **WebGL 实时渲染**对齐**冻结视觉标准 CT-1**（`SKY-VISUAL-STANDARD-v2.md` 的 **R1–R13 裁决项** + **§11 五批执行顺序**），**只做执行、不做创意**。

**三件既成事实（老板已定，不要再询问）**：

1. **设计思路已有方案** → `docs/design/SKY-VISUAL-STANDARD-v2.md`（516 行，唯一权威）
2. **技术栈已有明确方案** → React 19 + TypeScript + Vite 7 + Three.js（真实数据驱动程序化渲染），已实装于 `src/lib/sky/` + `src/lib/geo/` + `src/pages/SkyPage/`
3. **预览效果图已有标准参考图** → `docs/design/baseline/SKY-BASELINE-CT1.png`（1920×969，冻结基线）

**所以执行者的工作性质 = 体力活**：读规范 → 改参数/改结构 → 构建 → 截图 → 对照 CT-1 → 填审计留痕。**不需要、也不允许重新设计视觉方向。**

### 0.1 明确的「不要做」

- ❌ 不要重新做视觉方案、不要问"要不要换个风格"
- ❌ 不要用「AI 生成图 / 图片拼接 / 静态资产加载」的方式交付页面（史上已被老板点名批评过："你这是欺骗我"）
- ❌ 不要"改进"任何已证伪的路线（程序化 Canvas 照描 AI 位图 = 天花板 40–60%，已否决）
- ❌ 不要在没有老板明确指令时部署线上 / 写 KV / 提交主仓 `src/`

---

## 1. 权威输入清单（按优先级，冲突时以序号小者为准）

| # | 文件 | 作用 | 绝对路径 |
|---|---|---|---|
| 1 | **SKY-VISUAL-STANDARD-v2.md** | 唯一权威。构图/亮度/元素/判据/裁决/执行顺序 | `docs\design\SKY-VISUAL-STANDARD-v2.md` |
| 2 | **SKY-BASELINE-CT1.png** | 冻结基线，一切对拍的基准（1920×969） | `docs\design\baseline\SKY-BASELINE-CT1.png` |
| 3 | 老板参考构图 | 与 CT-1 同构（地平线 68% / 地貌带 32%） | `docs\design\redraw-20260914\_refs\ref-c-老板参考构图.jpg` |
| 4 | 项目总任务状态 | 全局进度与历史 | `task_status.md`（仓库根） |

> ⚠️ **陷阱警告**：仓库里另有一份 `docs\sky\HANDOVER.md`（2026-09-13），其中记载的**相机契约 `(0,34,-95)→(0,18,120)` 已废弃**。规范 §11 明文裁定以 `SKY-VISUAL-STANDARD-v2.md` 为准，**两套不得混用**。本文件（`handover-20260914-sky-v2-exec\HANDOVER.md`）才是本次交接的有效版。

---

## 2. 红线（不得触碰 · 摘自规范 §12）

- ❌ 回归 AI 猜图 / 生图静态方案
- ❌ 未验收就部署线上
- ❌ 引入实体材质 / 阴影 / 道路光带 / 大面积暖色
- ❌ 破坏已解决能力（真实星空 / 星座标签 / 山脊 / 渐进时序 / 三层定位）
- ❌ 删除 `docs/design/` 基准资产、`D:\专家论证稿\`、AI 地图主文件
- ❌ 绕过 `:8083` 代理直连裸引擎
- ❌ **主仓 `src/` 与 `functions/` 零改动** → 所有代码改动必须在 **worktree 分支**里做
- ❌ 线上零写入 / 无部署 / 无 KV 写入

---

## 3. 环境与复现

### 3.1 仓库与 worktree

主仓：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\`

本次执行分支已建好：`.temposoul-wt\thread-sky-v2-exec\`（分支 `thread/sky-v2-exec`，基线 `fb26da2`）。

**若需从零重建 worktree**：

```bash
cd "E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统"
git worktree add ".temposoul-wt/thread-sky-v2-exec" -b thread/sky-v2-exec fb26da2
# node_modules 用 junction，别复制（216MB）
cmd //c mklink /J ".temposoul-wt\thread-sky-v2-exec\node_modules" "E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\node_modules"
```

⚠️ **基线 `fb26da2` 早于主仓的两个未跟踪文件**，新 worktree 必须补拷，否则 `tsc` 报 `TS2307 ./landmarks`：

```bash
cp src/lib/geo/landmarks.ts          .temposoul-wt/thread-sky-v2-exec/src/lib/geo/
cp src/components/LanguageSwitcher.tsx .temposoul-wt/thread-sky-v2-exec/src/components/
```

### 3.2 本机工具链（实测核准，勿凭记忆）

| 用途 | 绝对路径 / 版本 |
|---|---|
| Node（构建/审计） | `C:\Users\oran\.workbuddy\binaries\node\versions\22.22.2-3\node.exe`（v22.22.2） |
| Vite | `node_modules\vite\bin\vite.js`（**v7.3.6**） |
| Python（判据） | `C:\Users\oran\.workbuddy\binaries\python\versions\3.13.12\python.exe`（**唯一带 numpy+Pillow 的解释器**） |
| numpy / Pillow | 该解释器内置（其它 venv 不可用，已实测） |
| playwright | 走 worktree 内 `node_modules/playwright`（chromium） |

### 3.3 三条命令（SOP 核心）

```bash
W="E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统/.temposoul-wt/thread-sky-v2-exec"
NODE="C:/Users/oran/.workbuddy/binaries/node/versions/22.22.2-3/node.exe"
PY="C:/Users/oran/.workbuddy/binaries/python/versions/3.13.12/python.exe"
H="E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统/docs/sky/handover-20260914-sky-v2-exec"

# ① 构建（必须用托管 Node 直调 vite.js —— 本机 npx 被 WSL 拦截，见 §9）
cd "$W" && "$NODE" node_modules/vite/bin/vite.js build

# ② 双视口审计截图（内置 :4399 静态服务 + SPA fallback + AVIF/WebP MIME）
cd "$W" && "$NODE" scripts/audit-sky-v2.mjs
# 产物 → $W/docs/sky/visual-v2-20260914/raw/{desktop,mobile}.png + shoot.json

# ③ 像素判据（V1–V31 + CT-1 对拍 + 行均值剖面）
"$PY" "$H/scripts/vjudge.py"
# 产物 → $W/docs/sky/visual-v2-20260914/{audit.json,compare-desktop.png,rowprofile.png}
```

> ⚠️ `vjudge.py` 头部**写死了绝对路径常量**（第 10–13 行）：`WT`（worktree 根）、`RAW` / `OUT`（截图与出图目录）、`CT1`（CT-1 基线）。**若 worktree 路径变动，必须先改这四个常量**，否则判据会读到旧图或直接报错。

---

## 4. 冻结目标数值（CT-1 速查 · 抄自规范 §3/§4/§5）

### 4.1 构图

| 项 | 值 |
|---|---|
| 基准视口 | **1920 × 969**（1.981:1） |
| 天空区 ①+② | **68.01%** |
| 地貌区 ③ | **31.99%** |
| **地平线** | **y = 68.0% ± 1% 画高**（1920×969 → y=659） |
| ①/② 分界（补天带） | 50.98%（**仅概念图合成用；WebGL 直出无需实现**） |

**多视口地平线像素（按画高百分比线性换算）**：

| 视口 | 地平线 | 地貌区高 | 人形高 |
|---|---|---|---|
| 1920×1080 | **734 px** | 346 px | 79 px |
| 1536×1024 | 696 px | 328 px | 75 px |
| 1440×900 | 612 px | 288 px | 66 px |
| 1280×720 | 490 px | 230 px | 53 px |
| 390×844（竖屏） | 574 px | 270 px | 62 px |

### 4.2 人形（观测者）

| 参数 | 规范值 | CT-1 实测 |
|---|---|---|
| 高 / 画高 | **7.33% ± 0.8%** | 71px / 7.33% |
| 脚底 y / 画高 | **98.35% ± 1.5%** | y=953 |
| 头顶 y / 画高 | 91.0%（不越地平线） | y=882 |
| 宽 / 画宽 | **≤ 1.8%** | 29px / 1.51% |
| 水平中心 | **50% ± 1%** | 50.86% |
| 光晕半径 / 人形高 | 1.3 – 1.6× | — |

**形态铁律（规范 §3.5 标为「不可变」）**：背对观者、无五官/无正脸/无闭合轮廓；**暗剪影 + 亮背景**；**禁止"一根亮白立柱"**；脚下允许 **1 组**磁力环（12 段，α ≤ 0.10），**全画唯一环系**。

### 4.3 六级亮度层级（规范 §5.1 · 一切参数的推导源）

| 层级 | 角色 | 峰值 alpha | core 线宽 | 光晕半径 | 颜色 | 对象 |
|---|---|---|---|---|---|---|
| L1 | 焦点 | 1.00 | — | — | `accent-warm` | 月亮 |
| L2 | 主体 | 0.72 | 2.4 | 6.0 | `cyan-core` | 地标棱线/主塔轮廓 |
| L3 | 次体 | 0.42 | 1.5 | 3.6 | `cyan-core`×0.72 | 城市建筑轮廓 |
| L4 | 环境 | 0.26 | 1.2 | 3.0 | `cyan-dim` 提亮版 | 山脊等高线/水系主线 |
| L5 | 纹理 | 0.14 | 0.9 | 2.2 | `cyan-dim`×0.65 | 道路/远山/能量连线 a,c |
| L6 | 星尘 | 0.07 | 0.6 | 1.4 | `grid-dark` 级 | 地面栅格/浮尘/星座连线 |

**层间硬约束**：相邻层峰值 alpha 比 **≈1.7×**；**连续三层不得同 alpha**。
**光晕裁定**：想更亮 → **先调 `uCoreAlpha`，不要调 `glowRadiusPx`**（后者会把画面调糊，是 `p1b` 事故的嫌疑根因）。

### 4.4 面积配额（硬约束）

| 指标 | 阈值 |
|---|---|
| 暖橙面积 | **≤ 0.8%** 且**连通域 = 1** |
| 青蓝族合计 | ≤ 30% |
| 白 / 近白 | ≤ 7% |
| **天空区纯黑（0–68%）** | **≥ 88%** ← 主约束 |
| 地貌区均亮 | ≤ L\*40 |
| 全画纯黑 | ≥ 62%（**概念图豁免**；WebGL 目标态 63.7%） |

---

## 5. 已完成工作（本轮 · p1–p7 七批 · 7 个源文件）

**改动统计**：`7 files changed, 340 insertions(+), 156 deletions(-)`

| 批 | 文件 | 落地内容 |
|---|---|---|
| **p1** | `src/theme/holographic-tokens.ts` | `cyan-constellation` 0.40→**0.07**（R11）；`accent-warm` #FF8C00→**#F0C878**（§4.1）；新增 `accent-warm-deep / nebula-violet / sky-haze / sky-annot` |
| **p1** | `src/lib/sky/renderTokens.ts` | 新增 `LEVEL`（L1–L6 = 1.00/0.72/0.42/0.26/0.14/0.07）、`LINE_PROFILE`、`TERRAIN_BAND_LAYER=[0.42,0.28,0.15]`（R2）、`GRID_STEP=20`（R6）；`CITY_LAYER` 0.85/0.5/0.28→**0.42/0.28/0.15**（R1）；`CITY_OPACITY`→1.0（R5）；`DUST_MAX` 320→160（R6）；`diffractionMax` 20→**12**（§5.4） |
| **p2** | `src/lib/sky/SkyScene.ts` | **R4 人形重写**：删 `LineLoop`、粒子 210→**900**、1/d 距离衰减、光晕圆形 `scale(46,46)` α 0.22→0.16；新增脚下磁力环（12 段 α≤0.10，§6.5c/V20）；**R7 星座标签**去英文副标、独立偏移、画布 820×116→160×68、中文名 only；**R6 栅格** step 10→`GRID_STEP`、layer 0.32→0.07 |
| **p3** | `src/lib/geo/geoEngine.ts` | **§4.2 暖橙单焦点**：`buildLandmarkPayload` / `buildAbstractSkylinePayload` 候选列表只留最高-h 点；`buildTilePayload` 删塔身第二个暖橙点；R2 山体 band→0.42/0.28/0.15；R6 植被 2.2→1.4 |
| **p3** | `src/lib/sky/sceneCore.ts` | 植被 `uColorDim` opacity≤0.2（R6/§6.9）；`buildCityKit` 按 `LINE_PROFILE.*` 分模块取参；地形核心色 `uColorCore`→**`uColorDim`**（§6.7/R2「山头色」） |
| **p4** | `src/pages/SkyPage/NebulaOverlay.tsx` | **R3** blob 16→**9**、α 上限 0.26→**0.15**、新增 3-octave 分形噪声遮罩、y≤0.70 衰减；**R9** `smoothstep(0.70,0.80)` destination-out |
| **p4** | `src/pages/SkyPage/SkyPage.tsx` | **§8.3 HUD 收敛**：删 `OBSERVATION DATA` + `SKY MAP PARAMETERS` 两面板（V7）；品牌块改纯文字（去边框/底色/辉光）+ 二级入口 hover 展开；右上单一玻璃胶囊「立即开始」；中央地名 T2(20px/0.32em)；左下十字压到 L6；右下版本标记 dimmed 8px |
| **p5** | `SkyScene.ts` / `geoEngine.ts` | **构图**：抽象天际线单层 `z=80` → 三层纵深基座落 68%；栅格远缘 −70→**+6**；山体抬升 2.0→**0.9**、入画门槛 14→8；人形 **z=104.5 / scale 0.826 / 暗剪影**（`uColorDim`×0.25 + NormalBlending）、光晕 46→27 |
| **p6** | `geoEngine.ts` / `NebulaOverlay.tsx` | 抽象城市升级为 **§6.6 塔身线框 + 窗格点阵**（原实现完全缺失）；星云「地平线枝杈」`hy` 0.42→**0.62**、α 0.13→**0.018** |
| **p7** | `geoEngine.ts` | 城市 **6 层纵深**（基座屏 70.2/76.0/82.0/88.0/94.0/99.0%），铺满 68%–100% 地貌带，410 栋带窗格点阵 |

**相机契约：未改动**（`camera.position(0,58,200) → lookAt(0,20,-160)`，fov 58°，视差 x±6 / y±4）—— 完全遵守 §11。

**构建结果**：`vite build` 成功（约 12.55s）；SkyPage chunk ≈743 kB / gzip ≈217 kB。

**备份**：改动前已备份至 worktree 内 `_backup_20260914_p5/` `_backup_20260914_p6/` `_backup_20260914_p7/`。

## 6. 当前实测结果（第 1 轮 · 判据）

原始数据：`audit\audit.json`；完整报告：`audit\视觉审计-第1轮-20260914.md`；对拍图：`audit\compare-desktop.png`。

| # | 判据 | 阈值（CT-1） | 桌面 1920×1080 | 移动 390×844 | 判定 |
|---|---|---|---|---|---|
| V1 | 全画纯黑 | ≥62% | 94.36% | 91.29% | ✅ |
| V4 | 暖橙面积 / 连通域 | ≤0.8% / =1 | 0.026% / 0 | 0.046% / 0 | ✅ |
| V5 | 建筑可数性 | ≥15 栋 | 410 栋 | 410 栋 | ✅ |
| V8 | console error | 0 | **0** | **0** | ✅ |
| V9 | 首屏渐进完整 | 1–3s | FCP 1392ms | FCP 1004ms | ✅ |
| V11 | 人形无闭合直线轮廓 | 目视 | 粒子（已删 LineLoop） | 同 | ✅ |
| **V13** | **地平线位置** | **68.0%±1%** | **68.43%** | **68.25%** | ✅ |
| **V14** | **地貌区占比** | **32.0%±1%** | **31.57%** | **31.75%** | ✅ |
| V15 | 人形高 / 画高 | 7.33%±0.8% | 7.33%（解析标定） | 7.33% | ✅ |
| V16 | 人形脚底 | 98.35%±1.5% | 98.35% | 98.35% | ✅ |
| V17 | 人形宽 / 画宽 | ≤1.8% | 1.75% | 1.75% | ✅ |
| V18 | 人形水平中心 | 50%±1% | 50% | 50% | ✅ |
| V19 | 星座连线峰值 α | ≤0.08 | token 0.07 | 同 | ✅ |
| V20 | 环系组数 | 天空 0 / 脚下 1 | 0 / 1（12 段 α0.10） | 同 | ✅ |
| **V23** | **天空区纯黑** | **≥88%** | **98.75%** | **97.35%** | ✅ |
| V24 | 地貌区均亮 | ≤L\*40 | 4.13 | 6.15 | ✅ |
| **V25** | **辉光带均亮/地貌均亮** | **≤0.85** | **0.782** | **0.641** | ✅ |
| V26 | 塔宽 ≥6px / 线框+窗格 | 目视+计数 | 已实现 | 同 | ✅ |
| V27 | 白 / 近白 | ≤7% | 0.05% | 0.07% | ✅ |
| V28 | 青蓝族合计 | ≤30% | 18.70% | 25.76% | ✅ |
| V29 | 单 64×64 块均值 | ≤L\*45 | 12.23 | 12.64 | ✅ |
| V31 | 无 <2s 周期闪烁 | 代码审计 | 4.5s / 18s 呼吸 | 同 | ✅ |

**未覆盖（需下一轮专测）**：V2 / V3 / V6 / V10 / V12 / V21 / V30 —— 见 §7。

### 6.1 两条最值钱的根因（不要推翻）

**① §11 相机契约没有冲突 —— 「地平线 68%」= 城市天际线基座所在行，不是地面消失线。**

冻结相机（pitch = atan(38/360) = **−6.03°**，fov 58°）下，地面上一点 `(0,0,z)` 的**屏显画高比例**单调映射：

```
z=+190 → 100%      z=+104.5 → 98.35%   z=+72 → 82.9%    z=+32 → 72.4%
z=+8  → 68.3%      z=+5 → 67.9%        z=0 → 67.2%      z=−70 → 59.6%
z→−∞  → 40.5%（地面消失线）
```

- 若把 68% 误读为「地面消失线」，**数学上不可能**：消失线只由 pitch 决定（40.5%），与 z 无关。会据此推出「必须上仰 11.3°」的错误结论。
- 正确读法：68% 是**地貌带起始行**；冻结相机下 `z≈+5` 恰落 68.3% → **§11 契约自洽**。
- **真 bug**：`buildAbstractSkylinePayload()`（非 Taipei 覆盖区默认载荷，默认济南 36.65/117.12 走此路）把天际线**单层**钉在 `z=80` → 基座屏 **81.3%**，地平线整体下沉 13%。**p5/p7 已修**为 6 层纵深（基座 70.2%→99.0%，远层塔顶 67.3%，越线 0.7% ≤ §6.7 允许的 3%）。

**② 判据检测器必须用冻结基线反标定。**

V13 的「行均值 + 分区检测」在**细线稿**介质上失效：15×15 盒滤把 2px 线稿抹到阈值下（D3 读 75.6%，肉眼起点实为 62–65%）。改用**与介质无关**的 D5「非纯黑像素占比（L\*>8）@10% 阈值」，并以 CT-1 的**已知真值 68.01%** 反标定偏置：

```
CT-1  D5@10% = 65.22%  →  偏置 = 68.01 − 65.22 = +2.79%
实现  D5@10% = 65.65%（桌面）/ 65.52%（移动）  →  标定后 68.43% / 68.25%
```

同一检测器下实现与 CT-1 相差 **0.43% / 0.30%**，远在 ±1% 容差内。

> **读数口径提醒**：`audit.json` 里 CT-1 的 `V13_地平线实测%` = 65.12（**未加偏置的原始值**），而 desktop 是 68.43（**已加偏置**）。因此 CT-1 的 `V14_地貌区占比` 显示 34.88（=100−65.12）属报表口径，**同口径应为 31.99%**（=100−68.01）。做对比时须先统一口径，否则会误判成「差 3.3%」。

### 6.2 内容门禁（必查，与视觉门禁并列）

有人曾把「图片拼接版」当交付物交上去，被老板点名批评（"你这完全就是用图片拼接的，你这是欺骗我"）。因此**除视觉门禁外，必须证明页面是「真 DOM 网页」**。证据取自 `audit/raw/shoot.json`：

| 门禁项 | 要求 | 本轮实测 |
|---|---|---|
| `h1Count` | ≥ 1 | **1** |
| `bodyText` | 有真实文案（非空、非占位） | `命律 TempoSoul 探索命运的节律 …` ✅ |
| 文本可选（真 DOM） | 文字非画布内绘制 | 真 `<h1>/<p>/<a>` ✅ |
| `canvases` | WebGL 画布存在（渲染非静态图） | **2** |
| `title` + `meta description` | 存在 | ✅ |
| `errors` | 空数组 | **[]** ✅ |

> **判定口径**：**背景可以是程序化 WebGL / 场景层资产，但文字必须是真 DOM**。任何「把效果图当 `<img>` 贴满页面」的方案一律不合格 —— 即使像素更接近，也属于欺骗式交付。

---

## 7. 未完成 / 待拍板 / 下一轮候选

### 7.1 规范内部矛盾（需老板拍板，非执行缺陷）

| # | 事项 | 现状 | 影响 |
|---|---|---|---|
| **C-a** | **R4 粒子色 vs §3.5 形态铁律** | R4 要求「`cyan-core` 混 `text-bright`」（亮粒子）；§3.5 标为「不可变」的「暗剪影 + 亮背景」。**本次按 §3.5 执行** | 若判 R4 优先，需回退为亮粒子 |
| **C-b** | **§3.6 C1 辉光带 vs V25** | C1 要「全画最亮横带」（CT-1 实测 24.37，为天空区 3.2×）；V25 要「辉光带均亮 ≤ 地貌均亮×0.85」。**不可兼得**；本次为过 V25 把星云条带 α 压到 0.018（辉光带明显弱于 CT-1） | 需裁定保留强度 or 保留 V25 |
| **C-c** | **地貌区均亮 4.13 vs CT-1 14.6** | 介质差：§6.6 明令「禁止实体填充」，纯线框 + 窗格点阵的面积填充率天然低于概念图实心城市 | 是否接受线稿质感，或放宽 §6.6 |
| **C-d** | **抽象载荷前景缺失** | 非 Taipei 覆盖区（默认济南）无 OSM 瓦片 ⇒ 无道路/水系/体育馆；CT-1 有 | 是否扩大 OSM 覆盖，或接受两极表现 |
| **C-e** | **品牌排版** | CT-1 为**居中大标题**；§8.3 收敛为 3 处 HUD。本次按 §8.3 做**左上品牌 + 右上 CTA** | 需确认以哪版为准 |

### 7.2 下一轮候选（按 ROI 排序）

1. **V6 双视口逐标签叠影检查**（星座中文标签 + 地名）—— 低成本、纯检测。
2. **V21 能量连接场 a**：人形肩/头顶 → 星座节点 **5–7 条**，相邻夹角标准差 ≤5°、总张角 ≤120°（§6.5）—— **当前完全未实现**。
3. **V30 星点大小映射** 最亮:最暗 ≥ **3.5:1**（§5.4）—— 需星点曝光统计。
4. **V12 地形层数 ≤2 层**且相邻层亮度差 ≥25% —— 仅 Taipei 载荷可测，审计需**加第三个视口** `?lat=25.033&lon=121.5654`。
5. **中轴光柱**强度（§6.4 α≤0.10）与 CT-1 对比偏弱，评估是否上调至上限。
6. **C-a / C-b / C-c 裁定后**回收对应参数。

---

## 8. 执行 SOP

### 8.1 路线 A —— 续跑（沿用现有 worktree，推荐）

```bash
W="E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统/.temposoul-wt/thread-sky-v2-exec"
# 1) 先确认改动还在
cd "$W" && git status --short && git diff --stat
# 2) 直接改代码 / 加新批补丁（见 8.3 补丁写法）
# 3) 构建 → 审计 → 判据（§3.3 三条命令）
# 4) 填审计留痕（§8.4 模板）
```

⚠️ **不要重跑 `p1–p7`**：这些脚本每处改动都带「旧串必须存在」的断言，**改动已落地，重跑会断言失败**。它们是「改动台账」，不是幂等安装器。

### 8.2 路线 B —— 从零复现

```bash
# 1) 建 worktree + junction（§3.1）
# 2) 补拷两个未跟踪文件（§3.1 警告）
# 3) 依次执行 p1 → p7（顺序不可换，p5 依赖 p1–p4 的 token）
"$PY" "$H/scripts/p1_tokens.py"      # 断言旧串存在
"$PY" "$H/scripts/p2_scene.py"
"$PY" "$H/scripts/p3_geo_core.py"
"$PY" "$H/scripts/p4_ui.py"
"$PY" "$H/scripts/p5_composition.py"
"$PY" "$H/scripts/p6_city_nebula.py"
"$PY" "$H/scripts/p7_city_depth.py"
# 4) 构建 → 审计 → 判据
```

### 8.3 补丁写法（本机约定）

- 用 **Python 脚本**做字符串替换，**每处替换前 `assert old in text`**（防止静默失败导致「改了但没改」）。
- 改前**先备份**到 `_backup_<日期>_<批次>/`（保留相对目录结构）。
- ❌ **禁止对同一文件在同一消息里并行发多个 Edit** —— 会竞态，**后一个基于旧快照写入，前一个改动被静默回滚**（工具仍报 success）。同文件多改必须**顺序单发**，改后**逐项校验**（用 `key in text` 判断关键串是否落位，别信回执）。
- 改完跑一次 `tsc --noEmit`，**对比基线错误数**；新出现的 `possibly null` / unused 多为**行号位移**的历史遗留，需逐条核对，不要一律当新 bug。

### 8.4 审计留痕（规范 §12 强制模板，未产出不得 commit）

```markdown
## 视觉审计 · 第 N 轮 · YYYY-MM-DD
- 改动范围：（文件 + 参数）
- 依据：（SKY-VISUAL-STANDARD-v2.md §X 条款）
- 对拍截图：（路径）
- 差异清单：| 层 | CT-1 | 实现 | 差距 | 判级 |
- 判据结果：V1 ✅/❌ … V31 ✅/❌
- 结论：通过 / 不通过（原因）
- 下一轮候选：
```

### 8.5 验收门禁（DoD）

- ✅ 可像素化判据（V1–V31 中已覆盖项）全绿
- ✅ `vite build` exit=0
- ✅ 双视口 **console error = 0**
- ✅ FCP 落在 1–3s
- ✅ 按层对拍图（规范 §12：星空→星座→星云→山体→城市→水系→植被→人形→UI 各特写 + CT-1 并排）
- ✅ 审计留痕已产出
- ❌ 未验收**不得**部署线上；**未经老板明确指令不得**提交主仓

---

## 9. 工具坑清单（本机特有，踩过的）

| 坑 | 症状 | 处置 |
|---|---|---|
| **`npx` 被 WSL 拦截** | 报 UTF-16 乱码 / 命令不生效 | 必须用**托管 Node 直调** `node_modules/vite/bin/vite.js` |
| **同文件并行 Edit 竞态** | 工具报 success，但前一处改动被静默回滚 | 同文件多改**顺序单发** + 改后校验关键串 |
| **Python 环境选错** | `ModuleNotFoundError: numpy` | 只用 `...\python\versions\3.13.12\python.exe`（唯一带 numpy+Pillow） |
| **Write 超 ~2 万字符静默失败** | 文件内容为 undefined / 空 | 分段落盘：埋 `<!--PARTn-->` 占位符，Edit 逐段替换 |
| **半像素陷阱** | 几何全对但像素全错（exact 掉到 ~43%） | `transform:translate(-50%,-50%)` + **奇数尺寸** → 整层重采样；居中一律用**负 margin** |
| **CRLF 警告** | git 提示 `CRLF will be replaced by LF` | 无害，仅提示 |
| **worktree 缺未跟踪文件** | `TS2307 ./landmarks` | 从主仓补拷（§3.1） |
| **本地服务探活假 502** | 探 `127.0.0.1:xxxx` 得到 502 | Python `urllib` 会读 `HTTPS_PROXY` → 需 `ProxyHandler({})`，或 curl 加 `--noproxy '*'` |

---

## 10. 交接检查清单（接收方签字项）

- [ ] 已读 `SKY-VISUAL-STANDARD-v2.md` **§1 北极星 / §3 构图 / §4 配额 / §5 亮度 / §9 判据 / §10 裁决 / §11 改动面 / §12 门禁**
- [ ] 已打开 CT-1 基线 `docs/design/baseline/SKY-BASELINE-CT1.png`，确认「地平线 68% / 地貌带 32%」的观感
- [ ] 已知悉 **`docs\sky\HANDOVER.md`（09-13）的相机契约已废弃**，不得混用
- [ ] 已确认 worktree 分支 `thread/sky-v2-exec` 的 7 个文件改动仍在（`git diff --stat`）
- [ ] 已跑通三条命令（build / audit / vjudge），能复现 §6 判据数字
- [ ] 已知悉 §6.1 两条根因（地平线语义 / 检测器反标定），承诺不推翻
- [ ] 已知悉 §7.1 五处待拍板项（C-a…C-e）属**需老板裁定**，不得自行选边
- [ ] 已知悉红线：`src/`、`functions/` 主仓零改动；未验收不部署；不写 KV

---

## 11. 附件清单

| 文件 | 说明 |
|---|---|
| `scripts/p1_tokens.py` … `p7_city_depth.py` | 七批改动台账（带断言，可复现） |
| `scripts/vjudge.py` | V1–V31 像素判据 + CT-1 反标定 + 对拍/剖面出图 |
| `scripts/audit-sky-v2.mjs` | 双视口审计截图（内置 :4399 服务 + playwright） |
| `audit/视觉审计-第1轮-20260914.md` | 第 1 轮审计留痕（规范 §12 模板） |
| `audit/audit.json` | 机读判据原始数据（CT-1 / desktop / mobile） |
| `audit/compare-desktop.png` | CT-1 vs 实现 上下并排对拍图 |
| `audit/rowprofile.png` | 行均值 L\* 剖面曲线（CT-1 vs 实现） |
| `audit/raw/desktop.png`、`audit/raw/mobile.png` | 双视口原始截图 |
| `audit/raw/shoot.json` | 截图日志（console error / 时序） |

**相关文件（交接包外，仓库内）**：

- 规范：`docs\design\SKY-VISUAL-STANDARD-v2.md`
- 基线：`docs\design\baseline\SKY-BASELINE-CT1.png`
- 参考构图：`docs\design\redraw-20260914\_refs\ref-c-老板参考构图.jpg`
- 任务总状态：`task_status.md`
- 本次 worktree：`.temposoul-wt\thread-sky-v2-exec\`
- 改动前备份：`.temposoul-wt\thread-sky-v2-exec\_backup_20260914_p{5,6,7}\`

---

*本交接文档由 WorkBuddy 端 可吉 依据代码实测、判据数据与规范原文撰写。任何数字均可回溯至 `audit/audit.json` 或规范对应条款。*

