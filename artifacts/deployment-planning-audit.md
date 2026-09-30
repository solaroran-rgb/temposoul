# TempoSoul 命律 · 部署规划审计报告（只读）

- 审计日期：2026-09-20
- 审计性质：**只读审计，未改任何代码**
- 仓库根：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`
- 生产域：https://www.temposoul.com/
- 对照基线：本轮正在修的 9 项 = ①NatalPage 接引擎 ②姓名页 ③灵签/测试页假数据 ④三页统一 L0SummaryCard ⑤12 项特色清单 ⑥加载科学性展示 ⑦translator 接线 ⑧SummaryPage 补真算 ⑨删 L0ConclusionCard

---

## 〇、审计范围与方法

### 阅读的规划/交接/执行文档（任务一）
- `task_status.md`（治理真理源，含 P0–P3 待办 + /sky 批次 410–520 + R3-14/F03/H02）
- `2026-09-17_内容数据完成度审计报告.md`
- `2026-09-17_网站功能全清单.md`
- `2026-09-17_M0-M3全量部署核验收口报告.md`
- `2026-09-17_下一阶段执行方案_v1.0.md`
- `2026-09-18_M0-EXEC执行报告.md`
- `2026-09-18_批2收口执行报告.md`
- `2026-09-18_批2第二阶段收口报告（B-C-D域）.md`
- `2026-09-18_支付接入指引与配置清单.md`
- `2026-09-18_LemonSqueezy配置成果清单.md`
- `2026-09-16_命律网站菜单层级功能缺口深度分析报告.md`
- `2026-09-16_命律网站功能与同行对标差距分析报告.md`

### 实际路由取证（任务二）
- `src/App.tsx`（直连约 100 条 `<Route>`）
- `src/router/*.tsx`：A22 / A23 / A24 / B23 / B24 / Bb / C23 / Cc / D23 / Daily / Dd / DivLearn / Hehun / LightFun / Newsletter / Seo / WestAstro / ZiweiLearn
- `src/routes/*.tsx`：b22-routes / C22Routes / E23Routes
- 以 `path="/...` 正则提取全部注册路径，并对规划点名板块做 Glob/Grep 反查。

---

## 一、任务一：未启动待办清单（本轮 9 项之外）

> 判定口径：文档里列为「待办/未完成/未闭环」，且**不属于**本轮 9 项收尾类工作（结果页/Natal/姓名/灵签/测试/Summary 前端打磨）。

| # | 待办项 | 来源文件 | 一句话内容 | 优先级建议 |
|---|---|---|---|---|
| U1 | **支付真实接通** | LemonSqueezy配置成果清单 / 支付接入指引§6 | LS 仍 Test mode，卡 W-8BEN 中国主体税务表单（工单已发待复）；支付宝/微信/Stripe 代码适配缺口 #1–12 全未动 | **P0** |
| U2 | **AI_API_KEY 配置** | M0-M3收口第二栏 / M0-EXEC第三栏 | `/reports/ten-dim` 链路已就绪，缺 key + 支付，无法真实出 AI 报告 | **P0** |
| U3 | **社区/咨询真实后端** | M0-M3第二栏 / 批2第二阶段§七 | 社区发帖回帖、咨询 IM/匹配/评价均无后端存储，页面仅静态列表 | **P1** |
| U4 | **西占星座 周/月/年 运势 UI** | M0-M3第二栏 / 对标#1 | 数据层 ZodiacScope 已支持四档，但 /fortune/daily 仅日档 UI，缺周/月/年内容矩阵（最大流量入口） | **P1** |
| U5 | **Web Push 推送** | 对标#1/#6 / task_status P1 | 全仓 0 处 pushManager/VAPID；仅邮件 /newsletter，无浏览器推送（留存命门） | **P1** |
| U6 | **SEO 工程化** | task_status P1 | hreflang / schema.org 结构化数据 / GSC+Bing 收录提交 / Lighthouse 正式分复测均未闭环 | **P1** |
| U7 | **生肖文化 8 篇 + wuxing-basics** | 内容数据审计§二.2 / P1-2,P1-6 | zodiac-culture 仅鼠牛虎兔 4 篇；wuxing-basics manifest 列了无正文文件 | **P1** |
| U8 | **/sky 视觉重做线** | task_status 批次 410–520 | v8 已随 M0-EXEC 上线，但 CT-1/真实数据管线/分层合成路线待裁决 Q0–Q7，R1–R13 未修，移动竖屏未处理 | **P1**（独立线） |
| U9 | **积分/Karma 账本后端** | 下一阶段线4批3a§10 | /account/credits·rewards·points 为前端壳，无后端账本 | **P2** |
| U10 | **原生 App（iOS/Android）** | 对标#5/#12 | 仅 PWA，无原生壳/下载页（30/40 同行有） | **P2** |
| U11 | **女性垂直板块** | 对标#14/P2 | 对标 CHANI（经期+月亮周期+冥想），仅 /astrolabe/moon-phase 单页 | **P2** |
| U12 | **i18n 其余 6 语言翻译** | 下一阶段§九 / 对标P2 | 框架在，仅 zh-CN 为主，其余语言未真实翻译 | **P2** |
| U13 | **503 托管决策** | task_status 09-13 | CF Free 10ms CPU 限制致重端点间歇 503；阿里云免备案迁移方案已拍板未执行 | **P2**（待老板决策） |
| U14 | **根域 temposoul.com** | task_status 待办 | 裸域 CNAME 不支持，绑定决策未定 | **P2** |
| U15 | **旧站 1100+ 英文文章迁移** | 对标§七局限④ | temposoul.ai 英文文章是否迁入新站未确认 | **P2**（SEO） |
| U16 | **康熙字典释义人工审校 / 视频真实内容** | 内容数据审计 P2-9/P2-4 | 3500 字释义自动生成待审（39 字空）；/video 仅 3 个 ready=false 空壳 | **P2**（运营型） |
| U17 | **批2 回滚演练 / 工程治理尾项** | 批2收口§五 / task_status P2 | T+24h 生产回滚演练未执行；468 红线@core 映射、tree-shaking 300KB 验收门待决策 | **P2**（ops） |

> 已被本轮或前序闭环覆盖、**未列入**上表：塔罗/易经/紫微 P0 内容（M0-EXEC 已补）、黄历 /almanac 413 修复、批2 四域 738 路由、PricingPage 价格校正、导航 10 组 110 项。

---

## 二、任务二：规划了但代码缺失/仅占位的板块

| 板块 | 文档出处 | 代码现状（实测） |
|---|---|---|
| **社区/论坛真实功能** | 菜单缺口§5.10；对标#3；线4批3a§8 | 路由 `/community`、`/community/board/:id`、`/community/post/:id`、`/community/bounty`、`/community/wall` 已注册；但 `src/pages/community/` 全仓 **0 处 `fetch('/api')`** → 纯静态列表/占位，无发帖、回帖、点赞、后端存储 |
| **真人咨询 marketplace（IM/匹配/评价）** | 菜单缺口§5.11；对标#11；批3a§9 | `/consult`、`/consult/chat`、`/consult/match`、`/consult/free`、`/consult/advisors/:id`、`/consult/apply` 路由+页面壳已注册；无 IM 通道、无实时匹配、无按分钟计费后端，咨询师为静态列表 |
| **Web Push 推送** | 对标#1/#6；菜单缺口§5.12；task_status P1 | 全仓 **0 处** `pushManager/PushManager/VAPID/web-push`；仅有 `/newsletter`（邮件）与 `/reminders`（前端提醒），无浏览器推送订阅 |
| **原生 App（iOS/Android）** | 对标#5/#12；菜单缺口§5.12 | 仅 PWA（Service Worker）；无原生壳、无 App 下载/引导页路由 |
| **七政四余 / 八宅·玄空 独立排盘页** | 菜单缺口§6.2①（七政四余 P1、风水 P1）；对标§2.1#4/#6（引擎已实现） | 引擎层已实现，但 `src/pages/` 下 **无** qizheng/ bazhai/ xuankong 专用页面；仅结果页/输入页 tab 可达，无独立栏目页与 SEO 路由（`/divination/fengshui-test`、`/tools/yangzhai-fengshui-test` 为测试页，非排盘页） |
| **西占星座 周/月/年 内容矩阵** | 对标#1；菜单缺口§5.6；M0-M3第二栏 | `/fortune/daily` 路由在，`daily-fortune.ts:86` `ZodiacScope='today'|'week'|'month'|'year'` 数据层已支持；但页面仅 `?scope=` 读取，无周/月/年切换 UI 与对应内容页（生肖 `/zodiac/fortune` 已四档 tab，西占未补） |
| **女性垂直（经期/月亮周期/冥想）** | 对标#14 / P2-14 | 仅 `/astrolabe/moon-phase` 单月相页；无经期追踪、冥想、女性内容板块 |
| **视频频道真实内容** | 内容数据审计 P2-4；功能全清单§四 | `/video` + `VideoChannelPage` 路由已注册；`src/data/video/content/` 仅 **3 个 ready=false 空壳** |
| **全部功能总览/sitemap 页** | 功能全清单§六.1（明确建议 `/sitemap` 或首页功能矩阵） | 无 `/sitemap` 路由；全站能力仅靠 SiteNav 10 组 110 项下拉承载，无独立总览页 |
| **生肖文化 8 篇 / wuxing-basics** | 内容数据审计 P1-2 / P1-6 | `/knowledge/:slug` 路由在；`zodiac-culture/` 仅 rat/ox/tiger/rabbit **4 个文件**（缺龙蛇马羊猴鸡狗猪）；`wuxing-basics` manifest 列名但无正文文件 |
| **商城/积分真实交易闭环** | 线4批3a§10/§11 | `/shop`、`/account/credits`、`/account/rewards`、`/account/points` 路由+壳在；`shop/products.ts` 仅 1 个商品，积分无后端账本 |
| **支付多渠道（支付宝/微信/Stripe）** | 支付接入指引§6 缺口 #1–12 | `PaymentProvider` 联合类型仅 `lemonsqueezy|paypal|none`；`paypal` 为类型预留未实现；`checkout`/`ls-webhook` 硬编码 LS；alipay/wxpay/stripe 的 checkout 分流、3 个新 webhook、RSA2/AES-GCM/HMAC 异构验签、订单幂等、前端渠道选择 UI、CSP 放开均未做 |

### 已对齐、无需再列的板块（反查通过）
- 站内搜索 `/search`、单次报告 `/reports/ten-dim`、退款 `/refund`、登录注册 `/login·/register`、会员 `/membership`、十维报告壳 → 路由已注册。
- 轻娱乐 12 项（测字/指纹/生命灵数/生日密码/生日花语/心理测试/血型/生男生女/眼跳喷嚏/名人星盘/宿度/阳宅测试）→ LightFunRoutes 等已注册。
- 学习路径 `/learn/ziwei`、`/learn/divination`、`/learn/tarot/curriculum` → 已注册。
- 生辰卡裂变 `/share/birth-chart`、水逆 `/astrolabe/retrograde`、土星回归 `/astrolabe/saturn-return`、二十八宿 `/astrolabe/mansions` → 已注册。
- 批2 四域 738 条 SEO 内容路由（A24/B24/静态 wiki）→ 已注册并有数据。

---

## 三、结论摘要

1. **本轮 9 项属「结果页/详情页前端打磨」收尾**；真正的 P0 未启动项集中在 **支付真实接通（U1）与 AI_API_KEY（U2）**——前端/后端链路均已就绪，卡在外部密钥与 LS 税务身份。
2. **最大结构性缺口（任务二）**：批3a 平台化板块（社区/咨询/商城/积分）**页面壳全有、路由全注册、但零后端**——`src/pages/community/` 无一处 API 调用，是典型「规划已落代码壳、能力未实现」。
3. **留存/增长层**：Web Push、原生 App、西占星座周月年、女性垂直是对标报告点名的「留存命门」，代码层基本未动。
4. **/sky 视觉线（U8）**与本轮独立，且历史批次已多次推翻方向，建议单独裁决后再启动，不要并入本轮收尾。

*报告生成：豆包 · 只读审计 · 2026-09-20*
