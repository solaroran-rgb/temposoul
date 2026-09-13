# 任务状态：TempoSoul 命律 网站建设系统

## 目标
命理赛道网站建设系统（@temposoul/core「命律 · TempoSoul」体系，2026-08-09 改名，09-11 全面收口上线），排盘/起卦/择日提示词生成 + 网站建设

## 状态：已上线 (production-live)
- 运行状态：**生产已上线**（www.temposoul.com，2026-09-11 域名验证+证书签发完成）
- 版本：@temposoul/core v0.3.0（21 体系证据契约全绿）
- 规模：754档 / 8M
- 末次活动：2026-09-11
- 治理：本文件为治理真理源（2026-08-09 建骨架，09-11 豆包补齐实态）

## 已完成（2026-09-11 实态）
- 改名收口：package.json/title/i18n 7 语言/AUTH_KV/wrangler/README/manifest/robots/sitemap 全部「命律 · TempoSoul」
- M0.2 证据契约：21 体系四字段全绿，回归 1769/1761/8 零回归
- Trust Engine T0-T6 组件落地（b47691b）
- 部署上线：Cloudflare Pages temposoul 项目，生产域名 www.temposoul.com（阿里云 DNS CNAME 已配，Google CA 证书签发）
- 认证激活：AUTH_ENABLED=true，AUTH_SECRET 已设，KV 绑定 AUTH_KV
- 审计修复 6 项（i18n 四语言真实翻译、export 修复、限流测试开关、KV 绑定名统一等）
- git 提交链已推 solaroran-rgb：e1865c5 / af237dd / b709621

## 待办（下一阶段 P0-P3，详见 11_国学出海 主地图/子图A）
- [ ] P0 剩余：未提交 AiSettings 审计提交、task_status 实态（本次已补）
- [ ] P1 埋点（CF Web Analytics 免费）、SEO（hreflang/结构化数据/收录提交）、Lighthouse 验收
- [ ] P2 468 红线重审映射 @temposoul/core、词库 MVP 800 条、tree-shaking 300KB 验收门决策
- [ ] P3 商业化：订阅墙 + 邮件捕获（用户已拍板两项都做）
- [ ] 根域 temposoul.com 决策（CNAME 不支持根域）

## 纪律
- 进度只走：`python _governance/scripts/update_status.py <base64:项目|任务ID|状态|备注>`（脚本未建，暂由豆包直接维护）
- 本文件为唯一进度真理源

## 2026-09-11 · 六线程并行执行合并部署（04093010）
- 线程 A（468 红线映射）✅ commit 42575fb+bf2395d：492 检查点矩阵 + core 测试脚本修复（1506 测试过）
- 线程 B（词库 800）✅ commit c5fe112：1180 条（超目标），校验 0 重复 0 缺字段
- 线程 C（性能/PWA）✅ commit 3848045：initial JS gzip 492→74KB（-85%），sw v3 已上线；Lighthouse 正式分待复测
- 线程 D（法务多语言）✅ commit a0118ff：Privacy/Tutorial 7 语言，134 keys×7 对齐
- 线程 E（架构治理）✅ commit 758b3dd：四议题决策文档 docs/governance/
- 线程 F（GSC/Bing）⏳ GSC meta 已上线，待用户在 GSC 点验证 + 提交 sitemap；Bing 待登录
- 主控收口：HEAD 3b4b197（已推 solaroran-rgb），部署 04093010，www.temposoul.com 生效

## 2026-09-12 · 第二轮 8 线程合并部署（59bb9092）
- g1 Lighthouse 实测 ✅（报告+JSON）｜ g2 468 fail 修复 ✅（UTC→TT/萨摩亚跳日）｜ g3 吠陀排期 ✅ ｜ g4 经纬度库 ✅ ｜ g5 词库按钮+品牌终检 ✅ ｜ g6 tree-shaking（首页省199KB gzip）✅ ｜ g7 治理执行 ✅ ｜ g8 T0-T6 事件+订阅双确认 ✅
- HEAD 07fb977 已推 solaroran-rgb；线上 sw v4 / meta 完整 / 首页无 prompt-engine 预载

## 2026-09-13 · 四线程上线前加固合并部署（046ebf70/70feeecd，sw v7）
- 线程 T1（排盘规则审计）✅ 合并 2271369：21 体系排盘规则逐条审计收口
- 线程 T2（三级转译审计）✅ 合并 2c949a7：M1 运行时约束（temperature=0 + COMPLIANCE_RULES + OutputFuse 熔断）
- 线程 T3（多语言实现）✅ 合并 b9de693：L0 查表 + 术语注入 + i18n-nightly CI + BP1 会签材料；主控融合 proxy.ts（T3 翻译档 + M1 合规锁，防回归）
- 线程 T4（基础设施）✅ 合并 cc985cd：500→400 时区/农历修复 + 元学八体系/紫微占卜端点内懒加载（1102 修复两片）
- 主控收口：codex/website-basic-settings HEAD 723010f 已推 solaroran-rgb；docs 收口 8d7ade4（thread/t3 分支）
- 回归：core 1550/1550（修复 bazi-chart-board 两例 I18nProvider）、api 108、prompt 229 全绿
- 部署：wrangler pages deploy --branch main → Production 046ebf70（首部署 promotion 未生效，二次 70feeecd 触发切换），www.temposoul.com 已生效（sw=v7、时区冲突返回 400）
- 验收：repro_503 3 轮 → 5xx 未清零。诊断：500 全消（T4 修复生效）；剩余 503 为 CF Free 10ms CPU 限制（qimen/ziwei/bazi 重端点间歇性，liuren 基本稳定；200 响应内容正确）。**需用户决策：升级 CF Workers Paid（US$5/月，CPU 30s）**
- 待办：**阿里云免备案迁移（正式上线时执行，用户已拍板）**——CF Paid 不可行（无美元支付），方案=中国站+香港地域（轻量 ¥24-34/月 或 FC ¥0），详见 AI地图 部署日志 2026-09-13_阿里云免备案迁移方案；qizheng 验收 case 参数（repro 脚本 hour 字段）；sky /sky v2 **已 promote 生产（09-13，www.temposoul.com/sky，deploy 155745ce）**；四项开发全部完成并合并生产（32cbb16）：南半球月令✅实现 / 城市库✅扩容108525城 / Swiss Ephemeris⏸不迁移 / 出生范围⏸不放开（后两项保守收口待签字）；GSC/Bing

## 2026-09-14 · /sky 首页星空系统 四专家代码全量集成（本地就绪，待部署）
- **背景**：外部四专家会诊（E1 天体可视化 / E2 城市数字孪生 / E3 实时图形性能 / E4 沉浸视觉）三轮交付 + 修复回执，用户下令全量执行
- **集成**：E1-E4 全部代码落库并组装（SkyScene class→createSkyScene 函数式架构重组、E2 OSM 城市管线、E3 渲染模块+gate、E4 token/HUD）；PATCH-1~6 应用；sw bump v8
- **验证（真实执行）**：vite build ✅ / tsc sky/city 零错误 ✅ / selftest ALL PASS ✅ / playwright 双视口渲染 ✅（星点/星座线/标签/网格/城市线稿/人形全渲染）/ baseline diff 0.96% ✅
- **门禁**：G1 性能 PASS（O(n²)→O(n) 修复 + 预热 render 后 desktop full P95≤16.9ms）/ G3 checklist PASS / G4 PASS / G5 0err PASS / G6 sw v8 PASS；**G2 天文对拍 skip（参考 CSV 未提供）**
- **git**：HEAD 561545e（7f12004 全量集成 + 561545e 性能/门禁修正），分支 thread/t3-i18n-accuracy，未 push
- **部署状态（审计）**：**未部署**。线上 www.temposoul.com 实查 sw.js = v6（旧版），/sky 仍为 09-13 v2（155745ce）；本地 v8 已就绪待 `npx vite build && npx wrangler pages deploy dist --project-name temposoul --branch main`
- **待补**：G2 对拍参考数据（stellarium-stars.csv 6城×12时点×20星 J2000 + nasa-moon.csv 24点）待用户导出；E2 离线运维三脚本源稿被 markdown 破坏未纳入（不影响构建链）；月相视觉确认（截图时段在地平线下）
