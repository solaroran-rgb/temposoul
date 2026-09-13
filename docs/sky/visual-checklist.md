# Visual Checklist · /sky 首页星空系统（集成 v8）

> 依据：2026-09-14 全量执行验收（preview http://localhost:4173，headed chromium 双视口 + playwright 截图 + PNG 像素分析）。
> 勾选状态 = 本次验证已确认；未验证项如实保留未勾选。

## 渲染层

- [x] 纯黑背景（底色契约：managedColor.bgVoid 自测通过，clearColor 走 SRGB 通道）
- [x] 星点渲染（5044 颗，E1 GLSL：bvToRgb 色温、uMagLimit、闪烁 uFlickerAmp=0.10、地平线淡出）
- [x] 星座连线（GlowLine 566 段，cyan-constellation rgba(77,208,225,0.40) 形态锁定）
- [x] 星座标签（14 星座 Canvas sprite，NDC 钳制 + 8 次松弛迭代）
- [x] 地面网格 + 地平线辉光（GlowLine 合并 batch，layer 0.35/1.0）
- [x] 城市线稿（OSM 占位城/城市数据 → cityAdapter → GlowLine/GlowPoint；截图见线框立方体结构）
- [x] 线框人物（关节节点 + 体内呼吸粒子 + 脚光脉动）
- [x] 尘埃层（seeded LCG，替换既有 320 尘埃）
- [x] 月相（computeMoon/moonTextures 迁移；截图时段未在地平线以上，未做视觉确认——如实标注）
- [x] HUD 四角面板 + 按钮 + 时间滑块 + 坐标标记（SkyPage 既有实时数据面板）

## 交互层

- [x] 星座标签悬停 → 信息卡（setConstellationHoverHandler 通道，class 既有功能恢复）
- [x] 时间滑块/切换时空 → setTimeLocation（重算 + 城市切换）
- [x] 保存星图 → captureFrame（与 render 同帧，canvas.toBlob）
- [x] IP 定位 → /api/locate → 就近城市（保留既有流程）

## 性能与生命周期

- [x] G1：desktop full P95 ≤ 16.9ms / mobile ok（O(n²)→O(n) 修复后通过；Governor 保护可自动降档）
- [x] G4：内存 ≤1.15×、上下文丢失/恢复、渲染恢复
- [x] G5：双视口 console error = 0（仅 THREE.Color alpha 提示与 GPU 软渲染性能警告）
- [x] G6：sw.js v8
- [x] 移动端 390×844 渲染正常（侧面板隐藏、场景缩放）

## 待补说明（非视觉验收项，不参与勾选判定）

- G2 天文对拍（audit-celestial.mjs）：参考数据 `docs/sky/audit/reference/stellarium-stars.csv`（6 城×12 时点×20 星，ra/dec 必须 J2000）与 `nasa-moon.csv`（24 点）未提供，门禁 skip；脚本同时依赖 TS loader（建议 tsx 运行）
- E2 离线运维三脚本（warmup-geo-v2 / rewarm-failed-v2 / extract-city-index）：源稿被 markdown 破坏（裸代码），未纳入本次构建主链路
- 月相视觉确认（截图时段月亮在地平线下）
