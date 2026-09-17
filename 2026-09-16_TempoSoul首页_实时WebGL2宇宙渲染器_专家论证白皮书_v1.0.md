# TempoSoul 首页「实时 WebGL2 宇宙渲染器」专家论证白皮书 v1.0

- 版本：v1.0（2026-09-16）
- 任务性质：**路线转向后的专家论证稿**。将"程序化 WebGL2 宇宙渲染器"方案整理成可论证的任务书，四位专家各论证所属板块。
- 历史背景：此前 6 条渲染路线（Canvas 像素对齐 / Three.js 城市方盒 / MapLibre 换肤 / 九层 2D / A 混合管线 / B-α+ 四 Pass）全部经用户验收判"无法使用"。核心结论：**像素指标持续变好但"可用"判定不变**——问题不在数据量或精度，而在视觉语言与实现方式。本方案据此转向。

---

## 0. 目标定义（一句话）

**不复制参考图，而是把参考图的视觉语言（黑底青蓝荧光、HUD 线稿、空间纵深、宇宙与人）转换成真正实时生成、可交互、有空间纵深的 WebGL2 场景。**

- 参考图：`D:\下载\图片素材\B-balanced-v2-lovable.png`（唯一视觉语言基准，只取气质，不取像素）。
- 阶段性目标：

| 阶段 | 目标 | 是否进入正式首页 |
|---|---|---|
| V0.1 | 银河 + 星空 + 粒子 + 荧光路径 | 否 |
| V0.2 | 真实星座 + 动态天空 + 鼠标视差 | 否 |
| V0.3 | 人生路径/地形/人物轮廓 | 否 |
| V1.0 | 成熟渲染器接入 Tempo Soul 首页 | 是 |

- 第一阶段不做任何业务功能。

---

## 1. 路线转向的动因（论证背景）

1. 多次尝试停留在"把画面画得像"，而非"构造一个空间"。参考图被当作**结果**去复刻，而非**语言**去转译。
2. 用户感知是"密密麻麻的矩形方块堆叠"——因为没有空间纵深、没有光晕层次、没有视觉层级。
3. 关键改变：不再向执行方下"把首页做得炫一点"的指令（不可验收），改为"建立实时 WebGL2 宇宙渲染器，通过参数和视觉版本逐层选择最终效果"——**把审美问题转化为可逐层验收的工程问题**。

---

## 2. 总体执行节奏（12 步）

```
① 搭建 WebGL Lab 基础渲染器
② 银河粒子（最重要的一层）
③ 星云（低频体积感，非图片）
④ 人生路径（抽象空间线框）
⑤ 灵魂人物（粒子轮廓）
⑥ 星座系统（真实星表数据驱动）
⑦ 鼠标交互（多层视差 + 阻尼）
⑧ Glow / Bloom 后处理
⑨ Debug 参数面板
⑩ 三套视觉 Preset（Cosmic / Minimal / Deep）
⑪ 选定视觉方向
⑫ 接入 Tempo Soul 首页（不重写首页）
```

---

## 3. 硬性技术约束（禁止 / 必须）

### 禁止
- 参考图作为背景；图片模拟银河 / 星云 / 人生路径
- Canvas 2D 冒充 WebGL；CSS glow 代替 WebGL glow；DOM filter
- 静态视频；AI 运行时生成任何视觉内容；3D 人物模型
- 现成网页模板；赛博朋克风；游戏 UI；大量文字
- 引入重量级 3D 引擎（优先原生 WebGL2，不排除 Three.js 但须可控）

### 必须
- WebGL2 + GLSL Shader + GPU 粒子 + 程序化几何 + 实时动画
- 模块化架构（后续可整体迁移到正式首页）
- 60 FPS 优先；移动端自动降级（粒子数 / bloom 分辨率 / 星云复杂度）
- 初始独立实验项目，不修改正式首页

---

## 4. 工程架构（独立实验项目）

```
tempo-soul/（主仓旁）
└─ webgl-lab/
   ├─ index.html
   ├─ src/
   │  ├─ main.js
   │  ├─ renderer/      Renderer / Scene / Camera / RenderTarget
   │  ├─ particles/     GalaxyParticles / StarField / DustField
   │  ├─ environment/   LifeTerrain / NeonPath
   │  ├─ atmosphere/    Nebula / Glow
   │  ├─ interaction/   Interaction
   │  └─ shaders/       galaxy / star / terrain / glow / nebula (.vert/.frag)
   └─ README.md
```

**基础渲染器（第一步，只搭骨架）**：Renderer / Scene / Camera / RenderTarget / Animation Loop / Resize；WebGL2、requestAnimationFrame、devicePixelRatio 合理限制、自动响应窗口、支持 fullscreen、透明 framebuffer；**预留** post-processing、additive blending、ping-pong framebuffer、shader 管理器、GPU particle system。运行后仅纯黑/深空背景，不做视觉效果。

---

## 5. 各阶段视觉规格（专家论证对象）

### 5.1 银河粒子（V0.1 核心层）
程序化 3D 银河粒子，非星空背景，具明显空间纵深：
- 远处大量微弱星尘 → 中距星体 → 少量近距离高亮粒子
- 银河主体形成弧形/旋臂结构；中央密度高、边缘稀疏
- 亮度自然随机；不允许规则网格；不允许明显重复纹理
- 技术要求：GPU vertex+fragment shader；初始 ≥100,000 粒子（性能允许可 200,000–300,000）；随机种子保证刷新稳定；粒子含 position/size/brightness/depth/random；perspective camera；additive blending；gl_PointSize；fragment 柔和圆形粒子；亮度随深度变化（远小暗、近大亮）；极轻微运动、不似屏保；银河整体极缓慢旋转；60 FPS 优先
- 视觉层级：A 极远微尘 / B 银河主体 / C 近距亮星 / D 极少数特殊高亮星体
- 银河必须是真正 3D 空间，不是平面。

### 5.2 星云（V0.1 第二层）
银河粒子后方的低频体积感：
- 非实体、半透明、大尺度、低频、缓慢变化、不抢银河主体、无"云朵贴图"感
- 可用 procedural noise / FBM / domain warping / smoothstep / fractal noise，控制计算量
- 至少拥有 uTime / uResolution / uCameraPosition / uIntensity / uScale
- 位于银河之后；亮度极低；不覆盖全屏；边缘自然衰减；无矩形边界；极慢形态变化；不允许明显循环动画
- 视觉定位："这是一个真实的巨大宇宙空间"，而非"放了一张星云背景图"。

### 5.3 人生路径（核心视觉，抽象空间）
概念："人在宇宙中面对一条复杂、未知、不断变化的人生路径。"
- 前景：极弱人形/灵魂轮廓；中景：大量复杂、断续、角度变化的荧光线框结构（代表人生环境/选择/阻碍/转折/路径）；远景：银河宇宙
- **明确不做**：城市、房屋、道路、真实山脉。是"抽象的人生空间"。
- 程序化几何：line segments / polyline / procedural terrain / noise / random walk / distance field；形成大量 `/ \ __ /\ \__ / \` 复杂线框
- 必须具空间透视、远近关系、遮挡关系、深度、不规则性；不全部放在同一 Z 平面；真正 3D 空间
- 颜色不写死，统一冷色荧光参数由 shader 控制（uTime / uIntensity / uDepth / uNoise / uPerspective / uMouse）
- 动画：线框不整体移动，仅极轻微呼吸、局部亮度变化、极慢能量流动
- 鼠标：空间轻微视差（camera target + foreground/midground/background parallax 多层），非整页晃动

### 5.4 人物轮廓（灵魂剪影）
不做 3D 人物模型（成本高且易俗）：
- GPU particle + procedural points 构成极其抽象人形轮廓（可识别头/肩/身体/手臂，非具体肖像）
- 位于屏幕下方偏中央；像"由宇宙粒子暂时聚合形成的人"
- 粒子透明度极低、边缘轻微发光、内部透明；不成为主视觉（银河仍是最大空间）
- 鼠标移动时轮廓不跟随，仅极轻微视差；粒子极轻微漂浮但轮廓稳定、不散掉

### 5.5 星座系统（真实感天空）
不是固定星座背景，而是按时间和位置生成天空：
- 第一版先做真实星点系统：CelestialSky，输入 latitude/longitude/date/time，输出当前天空星体位置
- 不要求完整天文学精度，但必须：位置稳定、时间变化改变天空、地理位置变化改变天空、星座线按星体位置自动连接
- 星座线：非常细、非常暗、仅部分区域可见；不成为主视觉；"宇宙本身正在运行"
- 预留参数：city / timezone / hemisphere

### 5.6 鼠标交互（"宇宙在回应我"）
- InteractionManager：输入 mouseX/mouseY/normalizedX/normalizedY/velocity；输出 cameraTarget/parallax/particleInfluence/glowInfluence
- 多层视差（由弱到强）：Background ≈ 不动 < Galaxy 轻微 < Constellation 稍明显 < Terrain 更明显 < Foreground 最明显
- 所有层有阻尼（lerp/damping 缓慢跟随）；鼠标停止后缓慢恢复；禁止拖拽整页、大幅旋转、过度晃动、3D 游戏式操作。"观察宇宙，不是操控游戏。"

### 5.7 Glow / Bloom 后处理
- 禁止 CSS box-shadow / DOM filter；用 WebGL2 framebuffer：Pass1 正常场景 → Pass2 提取高亮 → Pass3 水平 blur → Pass4 垂直 blur → Pass5 additive composite（Final = Scene + Bloom）
- Bloom 强度必须克制：高亮星体柔和光晕；荧光路径轻微光晕；普通粒子无明显光晕；背景无光晕
- 避免"霓虹灯网站"效果；光应是"宇宙中的微弱能量"，不是赛博朋克夜店
- 参数全部暴露：threshold / intensity / radius / exposure

### 5.8 Debug 参数面板
- 参数：Galaxy Density / Size / Rotation、Star Brightness / Size、Nebula Intensity、Terrain Density / Depth / Glow、Soul Opacity、Bloom Threshold / Intensity / Radius、Camera Parallax、Particle Motion、Atmosphere
- 实时调整立即反映；支持 reset / save preset / load preset；至少三个预设：PRESET_A_COSMIC / PRESET_B_MINIMAL / PRESET_C_DRAMATIC
- 仅开发模式显示，正式构建可关闭；不修改正式首页

### 5.9 三套视觉版本（不赌单版本）
- A Cosmic：银河强 / 星云中 / 人物弱 / 人生路径中 / Glow 中 / 整体神秘
- B Minimal：银河弱 / 星云极弱 / 人物极弱 / 人生路径少 / Glow 低 / 大量黑色空间
- C Deep：银河强 / 空间纵深强 / 前景强 / 人生路径复杂 / 星座细节强 / Glow 较强
- 同一渲染器三个 preset，用户只做视觉选择。

### 5.10 接入正式首页（最后一步）
- 禁止重写首页、改变业务逻辑、删除现有组件、改变路由
- 只新增 `TempoSoulWebGLBackground`：Hero = WebGL Canvas + Foreground Content（Logo/Slogan/CTA）
- Canvas：absolute、full viewport、pointer-events:none；HTML UI 在上层；WebGL 只负责宇宙空间
- responsive desktop/tablet/mobile；移动端自动降粒子数/bloom 分辨率/星云复杂度
- WebGL 初始化失败：自动 fallback 纯 CSS/渐变背景，不得白屏；完成后生产构建测试

---

## 6. 验收标准（给执行方的门禁）

- 视觉四眼序列：① 第一眼不是"一个网页"，而是"一个巨大的宇宙空间"；② 第二眼发现"宇宙里面有一个人"；③ 第三眼发现"这个人正在面对一条复杂的路径"；④ 第四眼意识到"这里面其实就是 Tempo Soul"。
- 禁止项 / 必须项见 §3。

---

## 7. 待专家论证的关键问题（按板块分工）

> 规则：每位专家只论证自己所属板块；先输出方案（本轮不输出代码）；输出前自我审计，确保方案可工程化、可验收、无歧义。

### 7.1 首席天体可视化工程师（板块：银河粒子 / 星云 / 星座系统 / 天文数据层）
1. 程序化 3D 银河的数学分布方案：如何生成旋臂结构（对数螺旋 + 噪声扰动？）、中央密度核与边缘衰减函数，使 10 万–30 万粒子呈现"银河"而非"球状星团"或"平面盘"？
2. 星云层：FBM/domain warping 的分形参数与计算量预算，如何做到"低频体积感、无矩形边界、无循环感"，与银河粒子在深度上如何衔接？
3. 星座系统：第一版"不要求完整天文学精度"的最小实现——恒星时/地平坐标的精度等级（需到分？）、星表选型（Hipparcos 亮星子集？）、星座连线数据来源；经纬度+时间变化的最小可感知差异设计。
4. 亮度/深度/大小的衰减曲线具体参数建议（远小暗、近大亮），使粒子层级 A/B/C/D 成立。
5. 星云与银河的空间关系：同相机空间还是背景球壳？深度排序与 blend 顺序。

### 7.2 空间线框与环境架构师（板块：人生路径 / 人物轮廓 / 程序化几何）
1. "抽象人生空间"的程序化几何方案：以 noise / random walk / distance field 生成"复杂、断续、角度变化的荧光线框"的具体算法路径；如何保证 3D 空间纵深与遮挡关系（而非单平面堆叠）？
2. 线框密度/角度分布/断裂规则：如何呈现"人生环境的复杂与未知"，又不落入"杂乱矩形堆叠"（此前失败原因）？
3. 人物轮廓：GPU 粒子构成"可识别头肩身臂、非具体肖像"的抽象人形——轮廓点采样方案（人体骨骼比例 + 噪声偏移？）、透明度/发光边缘参数、稳定性约束（不散掉）。
4. 冷色荧光参数体系：统一的 uIntensity/uDepth/uNoise/uPerspective/uMouse 如何映射到最终颜色与亮度，避免"霓虹灯"感？
5. 前景/中景/远景的 Z 分布与相机移动范围设计（配合专家 D 的视差）。

### 7.3 实时图形与性能工程师（板块：渲染器骨架 / 交互 / Bloom / 参数面板 / 性能）
1. 10 万–30 万粒子 + Bloom 五 Pass 在桌面/移动端的帧预算与可行性；GPU instancing / 单 draw 策略、粒子 buffer 管理（ping-pong 是否需要？）。
2. Bloom 实现规格：提取高亮阈值、降采样倍数、水平/垂直 blur 的 kernel 与迭代次数、additive 合成权重；参数默认值建议（threshold/intensity/radius/exposure），保证"微弱能量"而非"霓虹"。
3. 多层视差交互：每层视差系数与阻尼（lerp 系数）的具体建议；如何避免相机抖动与机械感。
4. 参数面板架构：uniform 联动方案（避免每帧查找 location）、preset 存储格式；移动端降级策略的具体触发条件（粒子数/bloom 分辨率/星云复杂度）。
5. 基础渲染器：透明 framebuffer、post-processing 管线预留、shader 管理器、resize/DPR 的正确实现要点。

### 7.4 沉浸式交互与视觉总监（板块：分层合成 / 三 Preset / 视觉验收 / 用户感知）
1. 分层合成顺序与每层视觉权重：银河→星云→路径→人物→星座→HUD，各层在亮度/密度/景深上的推荐占比，使"四眼序列"成立。
2. 三套 Preset（Cosmic/Minimal/Deep）的差异化定位与参数矩阵：各自面向什么用户感知？如何避免三套看起来差不多？
3. "宇宙微弱能量 vs 赛博朋克夜店"的边界：Bloom 与颜色饱和度、线框密度在哪些参数组合下会越界？给出可量化红线。
4. 交互节奏：鼠标视差阻尼、粒子呼吸、能量流动的速度范围，让用户感到"宇宙在回应我"而非"页面在动"。
5. 验收判据：四眼序列如何转成可执行的验收项（可让非设计人员逐项打勾）？

---

## 8. 论证输出要求

1. 每位专家输出**所属板块的完整技术方案**（算法、参数、数据结构、渲染流程），本轮不输出代码。
2. 输出前自我审计：方案是否可工程化、是否可验收、是否有不可替代的明确结论；不符合则修订后再交付。
3. 方案须标注：依赖的输入数据（星表/无外部依赖）、性能预算、移动端降级、与相邻板块的接口（如 §7.2 的 Z 分布需与 §7.3 视差、§7.4 分层对接）。
4. 若某问题跨板块，标"需协同：板块 X/Y"并给出建议协调人。

---

## 9. 下一步

- 将本白皮书分发给四位专家，按 §7 各板块产出方案；
- 汇总后进入 WebGL Lab 第 ① 步（基础渲染器骨架），按 §2 节奏逐层实施；
- V0.1–V0.3 验收通过前不接入正式首页；接入按 §5.10 最小侵入方式。
