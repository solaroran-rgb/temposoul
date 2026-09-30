# TempoSoul 命律 · 网站建设部署进度梳理与下一步方案

> 生成日期：2026-09-27
> 梳理依据：项目根文档（部署报告 2026-09-22 / 生产部署手册 2026-09-22 / 人工审计清单 2026-09-22 / 功能全清单 2026-09-17 / 差距总表 2026-09-20 / 首页论证白皮书 v4.0 2026-09-25 / task_status.md）+ git 分支与提交记录 + 线上实测（DNS / CF Pages / 本地 Docker）
> 代码根：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\`

---

## 〇、当前总体态势（一页速览）

| 维度 | 状态 | 证据 |
|---|---|---|
| A 轨生产主线（CF Pages） | 🟢 `temposoul.pages.dev` 在线（sw v10，2026-09-20 版构建） | 线上实测 200 |
| 生产域名 www.temposoul.com | 🔴 **DNS 已失效**（Non-existent domain） | 阿里 223.5.5.5 / Google 8.8.8.8 均解析失败 |
| B 轨预发（本地 Docker） | 🟡 运行中：web(80/443, unhealthy) / api(healthy) / db(healthy) | docker ps 实测 |
| 最新构建产物 | ✅ dist/ 2026-09-27 01:13 构建（771 文件 / 43.8MB） | 文件指纹 index-C2hcU_Az.js |
| 线上 vs 本地 | 线上 = 9-20 版；本地 9-27 版**未部署** | index.html 指纹对比 |
| 首页 /sky | 🟡 线上 v2（09-13 promote）；本地 v8+ 与 home-preview POC 未合流未部署 | task_status + 白皮书 v4.0 |
| wrangler 认证 | ✅ 已登录（solaroran@gmail.com，OAuth） | whoami 实测 |
| 测试页面 | home-preview / amap-test / docs/sky 预览页 11 个，均本地 | 文件清点 |

---

## 一、最初规划：功能、结构与内容

### 1.1 项目定位与品牌（已拍板）

- 产品名：**TempoSoul · 命律**（中文「命律」= 生命轨迹 + 宇宙法则）
- 定位：国学/命理出海网站，**7 语言国际站**
- 核心卖点：**AI 多语命理解读引擎**（八字 / 奇门 / 紫微）
- Slogan：中文「循律而生，向心而行。」/ 英文 `Follow the Tempo, Navigate your Soul.`
- 合规基调（硬红线）：娱乐/参考数据视角；**禁 fortune-telling 确定性断语**；FTC 式披露「非算命、不预测具体事件、不提供医/法/金建议」

### 1.2 原始功能范围（权威口径）

| 维度 | 规划数 | 说明 |
|---|---|---|
| 功能规划 | **140 项** | 基线口径 128 ✅ / 12 🟡 / 0 🔴 |
| 路由体系 | **146 基线路由 × 7 语言 = 1022 条** | `/[lang]/[route]`，lang ∈ zh/en/ja/ko/th/vi/es |
| i18n | 网站 7 语言；AI 引擎 9 语言（另含 ru/fr） | — |
| 词库 | **901 条**命理术语，七语全覆盖，8 大类 | — |
| 增长/GEO | FAQ 28 问 × 7 语 = 196 条 + JSON-LD；长尾词 509 行 × 6 语；社媒日历 150 条；邮件序列 21 封；llms.txt 68 行 | — |
| 主题体系 | 八字/紫微/西占/黄历/塔罗/灵签/生肖/星座/易经/姓名/民俗/知识库 12 类 | — |
| 五大导航板块 | **50 项入口**：排盘 15 / 运势 7 / 姓名 6 / 平台 10 / 社区·商业 10 | 顶部胶囊下拉 |
| 首页 | 今日节律黄历 + 四功能卡 + 星空/城市 3D 首屏（CT-1/CT-2 视觉标准） | 独立论证线 |
| 商业化 | 订阅/单购报告/支付（PayPal/MOCK）/认证/会员 | 支付前端已就绪 |

### 1.3 结构规划（目录/组件口径）

- 页面组件规划：~190 个（实际落盘 189 个）
- 路由注册：App.tsx 平铺 ~110 + 21 个路由模块拼接 ~90 ≈ 200 条
- 后端：functions/api/v1/*（forum/points/checkout/subscription/refund/auth/search 等）
- 数据：src/data/*（塔罗/易经/紫微/神煞/解梦/星座/水晶/生肖文化等）+ public/geo/*（城市 tile）
- 首页独立线：真实天文星空（HYG v38，8921 星）+ 城市线稿（高德/OSM）+ CT-1/CT-2 视觉标准

---

## 二、目前已部署的内容

### 2.1 A 轨生产主线（CF Pages）— 真身

- 线上入口：`https://temposoul.pages.dev/`（200，sw v10，9-20 版构建）
- 已部署：146 基线路由全真实化（22 核心 + 31 扩展 + 93 深链 = 146）、sitemap.xml 1022 条 loc、robots/manifest/sw、`/sky`（v2）、`/api/*` Workers 端点
- 已实现功能（浏览器级验证通过）：
  - 八字排盘真引擎（lunar-typescript + 真太阳时）｜黄历/择日｜AI 解读（DeepSeek SSE，9 语言）｜词库 901 条 × 7 语｜支付 MOCK 全流程｜认证本地化（scrypt+Bearer）｜PWA

### 2.2 B 轨预发（本地 Docker）— 备胎

- 运行中：`deploy-web-1`（80/443，unhealthy）、`deploy-api-1`（healthy）、`deploy-db-1`（postgres，healthy）
- 定位：自托管迁移/压测/内网部署的移植源，**不作对外生产入口**

### 2.3 测试/预览页面（本地，未上线）

| 页面 | 路径 | 内容 |
|---|---|---|
| 首页 POC | `home-preview\index.html` + `stars-data.js` | 真实天文星空（8921 星）+ 城市线稿 + HUD，CT-1 构图 |
| 高德测试 | `amap-test\index.html` | 高德 JS API 2.0 + 3D 楼块 Key 验证 |
| IP 首页预览 | `docs\sky\ip-homepage-preview-jinan.html` / `-v2.html` | 真实 IP 定位首页预览 |
| 审计/对拍页 ×7 | `docs\sky\*.html`（REVIEW/PROOF/DIAG/AUDIT/ROUND-500~520C） | 视觉对拍、根因审计留档 |
| 视觉规范 HTML | `docs\design\SKY-VISUAL-STANDARD-v3.html` | 首页视觉标准 v3 |

### 2.4 线上域名异常（重大发现）

- **www.temposoul.com DNS 解析已失效**：阿里云 DNS（223.5.5.5）与 Google DNS（8.8.8.8）均返回 Non-existent domain
- 即：对外生产域名当前**无法访问**；CF Pages 默认域 `temposoul.pages.dev` 仍在线
- 需要你登录阿里云 DNS 控制台核查 `temposoul.com` 的 CNAME/A 记录是否被删除或未续期（本机无法代做）

---

## 三、逐项完成度评估（是否已达"完整完美"）

**结论：未达到。** 页面/路由层已基本收口（140 项规划 ≈200 条路由全部落地），但差距集中在**内容数据空壳**与**后端持久化/闭环**两层。

### 3.1 已完整（无需再补）

- ✅ 146 基线路由全真实化（无占位壳）
- ✅ 八字排盘真引擎 + 真太阳时校正
- ✅ 黄历/择日真实历法
- ✅ AI 解读全链路（SSE 流式，9 语言）
- ✅ 词库 901 条 × 7 语（trie 引擎 79 断言全绿）
- ✅ sitemap.xml 1022 条 loc + hreflang
- ✅ PWA（manifest + sw）、robots、nginx 生产配置、安全红线（密钥零明文）
- ✅ 七政四余 / 八宅 / sitemap 总览独立页（2026-09-20 转绿）

### 3.2 内容数据空壳（壳有肉空，需补）

| 优先级 | 项目 | 现状 | 缺口 |
|---|---|---|---|
| P0 | 塔罗详细牌义 | 78 张仅 10 张详 | 68 张模板占位 |
| P0 | 易经 64 卦白话详解 | 仅 5 卦 | 缺 59 卦 |
| P0 | 紫微 14 主星详解 | 仅 3 颗 | 11 颗全空 |
| P0 | 紫微四化 56 条 | 仅 8 条 stub | 缺 48 条 |
| P0 | 紫微格局详解 | 仅 5 个 stub | 缺 ~25 个 |
| P1 | 二十四节气文章 | 4/24 | 缺 20 |
| P1 | 星座百科详情 36 | 9 条 | 缺 30 条 |
| P1 | 周公解梦词典 | 49 条 | 目标 200+ |
| P1 | 神煞数据 | 8 条 | 常见 30+ |
| P1 | 占星 Wiki | 2 条 | 目标 12 |
| P1 | 诸葛神数 384 签 | 样例级 2.7KB | 全量 |
| P2 | 生肖文化 / 星座周月年 / 水晶 / 卢恩 / 测试库 / 播客新闻 | 样例级 | 持续运营型 |

### 3.3 后端/闭环缺口

| 优先级 | 项目 | 现状 |
|---|---|---|
| P1 | 服务端搜索 `/api/v1/search` | 仅 fuse.js 客户端索引 |
| P1 | 投诉举报端点 | 仅邮箱/表单 |
| P2 | 社区论坛持久化 | 内存 mock（待绑 KV） |
| P2 | 积分账本持久化+鉴权 | 内存 mock 单用户 'local' |
| P2 | DSAR 数据导出 GET 端点 | 仅 DELETE |
| P2 | 邮件触发自动化 | 仅订阅/退订 |
| P2 | 商城目录+下单闭环 | 仅 1 商品 |
| P2 | 咨询 marketplace / 联盟营销 / 分享墙悬赏 VIP | 纯前端壳 |

### 3.4 首页（独立论证线）

- ⚠️ **两套代码未合流**：`home-preview\index.html`（独立 POC）与主仓 `src/pages/SkyPage/`（React 组件）是两套实现
- ⚠️ 线上 `/sky` 仍为 09-13 v2；本地 v8+（四专家集成 + CT-1 落地 + 质感补齐）**未部署**
- ⚠️ 视觉标准已冻结（CT-1→CT-2→v3.0c→论证计划书 8 项裁决），R3 编码轮未正式启动（依赖 marchingsquares/three/postprocessing/gsap 未安装）
- ⚠️ 首页验收红线 R2「禁部署未验收」—— 老板目检通过前不得上线

### 3.5 外部阻塞项（需你/资源配合）

| 项 | 阻塞点 |
|---|---|
| 支付闭环验收 | PayPal/LemonSqueezy 沙箱密钥 → PAYMENTS_MOCK=0 |
| AI key | `/reports/ten-dim` 真实出报告需 API key |
| 母语者复核 | th/vi/ja/ko/es 页面回退英文部分 |
| 术语人审 | 901 条中 265 条 review 待终审 |
| 长尾词校准 | 509 词需 GSC/Ahrefs 真量 |
| 旧站迁移 | temposoul.ai 1100+ 英文文章 |
| 原生 App / Web Push | VAPID 密钥、原生壳 |

---

## 四、需要进一步补充填充的内容

### 4.1 本轮可补（无外部阻塞）
1. **P0 内容数据批量生产**：塔罗 68 张牌义 / 易经 59 卦白话 / 紫微 11 主星 + 48 四化 + 25 格局
2. **P1 内容收口**：节气 20 篇 / 星座百科 30 条 / 解梦 151+ 条 / 神煞 22+ 条 / 占星 Wiki 10 条 / 诸葛神数 384 签
3. **P1 后端端点**：服务端搜索 / 投诉举报 / 社区+积分绑 KV 持久化 / DSAR 导出
4. **N32 吉日多场景路由**：is-lucky 5 场景仅注册 marriage 1 条，补 4 条
5. **N33 首页黄历数据缺陷**：查根因闭环

### 4.2 需外部资源后补
- 支付密钥、AI key、母语走查、术语终审、VAPID、旧站数据源、ECS 真机

### 4.3 首页补充
- home-preview 与主仓 SkyPage **代码合流**（推荐以主仓 React 版为基底，移植 POC 的天文/城市/构图资产）
- 视觉标准 v3.0c 的 R1-R13 裁决项落地 + 三地基裁决（渲染路线 / 金标准 / Q-C1）
- 老板目检 → 验收 → 才可部署线上（红线 R2）

---

## 五、下一步工作与任务清单

### 5.1 P0（立即）
1. **修复 www.temposoul.com DNS**（你操作：阿里云 DNS 控制台核查记录）
2. **部署测试页面上线**（本方案执行部分：本地服务 + CF Pages 预览）
3. 首页代码合流方案评审 → R3 编码轮启动（S0-S3 路线图）

### 5.2 P1（内容 + 后端）
4. 塔罗/易经/紫微 P0 内容批量生产（AI 生产 + 人审）
5. 节气/星座/解梦/神煞/诸葛 P1 内容收口
6. 服务端搜索 + 投诉端点 + 社区/积分 KV 持久化
7. 最新 dist（9-27 构建）部署 A 轨生产

### 5.3 P2（质量 + 商业化）
8. 支付沙箱回归（密钥到位后）
9. 母语走查 + 术语人审 + 长尾词校准
10. 商城/联盟/邮件自动化闭环

---

## 六、本次执行结果（测试页面部署）

### 6.1 部署方式
- **本地可访问**：静态服务器（Python http.server）+ 所有测试页面
- **线上可访问**：CF Pages 部署（wrangler 已认证，solaroran@gmail.com）

### 6.2 部署清单
| # | 页面 | 来源路径 |
|---|---|---|
| 1 | 首页 POC（真实天文星空） | `home-preview\index.html` + `stars-data.js` |
| 2 | 高德 3D 楼块 Key 测试 | `amap-test\index.html` |
| 3 | IP 首页预览 v1/v2 | `docs\sky\ip-homepage-preview-jinan*.html` |
| 4 | 视觉对拍/审计页 ×7 | `docs\sky\REVIEW/PROOF/DIAG/AUDIT/ROUND-*.html` |
| 5 | 视觉规范 v3 | `docs\design\SKY-VISUAL-STANDARD-v3.html` |
| 6 | 总览索引页 | 自动生成 `index.html` |

### 6.3 交付路径
（见下方执行结果输出——本地 file:/// 链接 + http:// 链接 + 线上 https:// 链接）

---

*方案完。本文件为部署进度梳理的权威快照（2026-09-27），后续进度以 task_status.md + 本文件更新为准。*
