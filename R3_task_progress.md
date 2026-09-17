# TempoSoul 商河首页 · R3 执行进度

> [来源: Hermes @ 2026-09-16] 路线A：Three.js 生产引擎（白皮书 v3.0）；GSAP → 自研 rAF timeline。
> 目标：用高德真实像素→MSQR 线稿，渲染成与样张风格一致的**商河**首页 HTML。

## 任务目标
商河首页：高德真实 3D 白模像素 → MSQR 线稿 → Three.js 6Pass + SelectiveBloom + 星空(Points) + 粒子 + 四层视差。风格=样张（纯黑/青蓝线框/无阴影/单点暖橙）。

## 已完成
- [ ] 读取交接清单 / 样张分析 / POC index.html / stars-data.js / pw_home_v15.py
- [ ] 读取白皮书 v3.0 终版（技术选型冻结）
- [ ] p5js 判定：不适合当主引擎（白皮书 B-B 否决 Canvas 2D 路线）
- [ ] 路线决策：A（Three.js）；GSAP→自研 rAF（用户已确认"按你的方法"）

## 进行中
- [ ] **阶段1 · 本地回填实测**：⚠️ 卡在 IT-2 像素可读性
  - 高德 Buildings 楼块在 DOM 截图里**确实渲染**（商河 3D 白模可见，深灰近黑体块+浅细线）
  - 但 amap canvas 的 toDataURL/readPixels/getImageData **全读空**（nonBlackPct=0, dataUrlLen=12662 近空图）
  - **根因**：POC 用 WebGLMap，WebGL back buffer 不保留，前缓冲不可 readPixels（IT-2 前提在此环境不成立）
  - 白皮书 IT-2 "实测通过" 与本环境实测**矛盾** → 需决策换路线

## 下一步
1. 起 80 端口服务 + hosts local.temposoul.com
2. 无头 Chrome 渲染商河高德白模，抓 canvas 像素取样
3. 定提取参数阈值 → 落盘 extraction_params.md
4. → R3 编码（A 提取 → B 渲染 → C 粒子 → D 交互 → 聚焦商河）
5. → pw_home_v15.py 验证（改商河三视图）→ 勾 DoD → 迁移生产

## 已改动文件
- E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\R3_task_progress.md（本文件，新建）

## 未决问题
- #C-01 GSAP 许可 → 已决定弃用，自研 rAF，风险消除
- #A-03/#A-04/#A-05 阈值 → 阶段1 实测中

## 关键事实（冻结）
- 高德 Key c322315b4ad609930b96ac97be2ae907 / securityJsCode db6d34fc64f152b4497cf37cce43db2c（勿颠倒）
- 白名单 www.temposoul.com;temposoul.com;local.temposoul.com（localhost 直连被拒）
- 商河坐标 lng 117.1572, lat 37.3109
- 高德 3D 楼块：viewMode 3D / pitch 62 / zoom 17 / Buildings{zooms:[15,20],merge:false,sort:false} / setStyle{rejectTexture:true,color1:#0e4f85,color2:#1f7fbf} / mapStyle dark
- 星表 window.STAR_CATALOG=[[ra,dec,mag]] 8921 颗
- 本地验证：python E:\KnowledgeOS\_pixel_analysis\county_test\pw_home_v15.py
