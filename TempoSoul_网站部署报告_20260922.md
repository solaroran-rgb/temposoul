# TempoSoul · 命律 — 网站部署报告（完整版）

> **报告日期**：2026-09-22
> **依据**：`TempoSoul_技术交接报告_20260922.md`（交接基线）+ 本次「本地补全 + 测试部署」执行记录
> **代码根**：`E:/KnowledgeOS/项目库/_商业项目/国学出海/国学网站建设/`
> **主交付**：`TempoSoul_人工审计清单_20260922.md`（逐项验收点检表）

---

## 一、初期需求

### 1.1 项目定位与品牌

| 项 | 内容 |
|---|---|
| 产品名 | TempoSoul · 命律（中文「命律」= 生命轨迹 + 宇宙法则） |
| 定位 | 国学 / 命理出海网站，**7 语言国际站** |
| 核心卖点 | **AI 多语命理解读引擎**（八字 / 奇门 / 紫微） |
| Slogan（已拍板） | 中文「循律而生，向心而行。」/ 英文 `Follow the Tempo, Navigate your Soul.` |
| 合规基调（硬红线） | 娱乐/参考数据视角；**禁 fortune-telling 确定性断语**、禁迷信词；需 FTC 式披露「非算命、不预测具体事件、不提供医/法/金建议」 |

### 1.2 原始功能范围（权威口径）

- **功能规划**：140 项（基线口径 128 ✅ / 12 🟡 / 0 🔴，来自全栈部署计划书）。
- **路由体系**：**146 基线路由 × 7 语言 = 1022 条**（`/[lang]/[route]`，lang ∈ zh/en/ja/ko/th/vi/es，默认 `/zh/`）；全站扩展口径 884 = 146 + 738。
- **i18n**：网站 7 语言；AI 解读引擎内部支持 9 语言（另含 ru/fr）。
- **词库**：901 条命理术语，七语全覆盖（zh/en/ja/ko/ru/es/fr），8 大类。
- **增长/GEO**：FAQ 28 问 × 7 语 = 196 条 + JSON-LD；长尾词矩阵 509 行 × 6 语；社媒日历 150 条；邮件序列 21 封；`llms.txt` 68 行。
- **品牌合规**：现金 + 层级分销 = 刑事红线（无多级分销 / 无资金池）；支付/加密/涉密逻辑只走本地，密钥 `${ENV}` 零明文。

### 1.3 迁移动机（为什么自建 ECS）

原 Cloudflare Pages Free 有 **10ms CPU/请求硬限** → 奇门 100% / 紫微 70% 重端点 503（实测为平台限制而非代码问题）。自建 ECS 可根除 503。
目标平台：**阿里云香港地域**（轻量 2C4G 起步，Ubuntu/Debian，免 ICP 备案，人民币支付）。

---

## 二、技术栈与产物

### 2.1 技术栈

| 层 | 技术 | 包管理 |
|---|---|---|
| 前端基础盘 `basis/` | React 19 + Vite 7 + react-router 7 + PWA + SEO + **lunar-typescript**（本次新增，排盘引擎） | npm |
| AI 解读 `ai-interpreter/` | Node 22 生产服务 `prod-server.mjs`（零新增依赖，node:http/fs + SSE） | npm |
| AI 模型 | **DeepSeek** `deepseek-flash`（OpenAI 兼容接口；必须 `thinking:disabled`，base URL 不带 `/v1`） | — |
| 词库 `terminology/` | Python 构建器 → JSON/CSV + Node 翻译引擎（trie 最长匹配 + 热更新） | — |
| 部署 `deploy/` | Docker：nginx:alpine（静态+反代+TLS）+ node:22-alpine（AI/支付/认证服务） | — |
| 测试部署 | 本机 Docker Desktop 29.7.2 + openssl（自签 TLS）+ 浏览器级验证 | — |

> ⚠️ 全库**只有 `basis/` 与 `ai-interpreter/` 两个真实 package.json**（皆 npm）。计划书提及的 `@temposoul/core` pnpm monorepo **不存在**（历史 Agent 虚构），收口审计已修正部署指向。

### 2.2 部署架构（当前实测状态）

```
浏览器 ──HTTPS(80/443)──▶ web (nginx:alpine)
                            ├─ 静态直服 basis/dist（SPA fallback，/assets 一年 immutable）
                            ├─ /api/chat    → api:3001（SSE，禁缓冲，长超时）
                            ├─ /api/health  → api:3001
                            ├─ /api/v1/*    → api:3001（checkout/cancel/refund，限流 10r/m）
                            ├─ /api/auth/*  → api:3001（register/login/me，限流 5r/m）
                            └─ /api/        → api:3001（兜底限流 120r/m）
api (node:22-alpine，内网 expose 3001)
    ├─ prod-server.mjs：/api/chat（DeepSeek SSE）、/api/v1/*（支付）、/api/auth/*（认证）
    └─ 数据卷 ./data:/app/data（认证用户文件 users.json，scrypt 哈希）
```

**本机实测**：`docker compose up -d --build` 全链路跑通（HTTP→HTTPS 301、健康检查 ok、AI 流式解读、支付 MOCK、认证闭环）。

### 2.3 产物清单（含路径）

**交接基线产物（K-A1～K-A6）**
```
代码根: E:/KnowledgeOS/项目库/_商业项目/国学出海/国学网站建设/
├── basis/                        # 前端基础盘
│   ├── src/ (App.tsx · i18n/ · config/nav.ts · routes/route-table.json(146) · lib/terminology.ts)
│   ├── public/terminology.json   # 词库静态副本 176KB
│   ├── scripts/{gen-sitemap.mjs, sync-terminology.mjs, verify-routes*.sh}
├── terminology/                  # 词库 v1.1.0 / 901 条（translator.js + tools/*.py）
├── ai-interpreter/               # AI 解读引擎
│   ├── server/{prod-server.mjs ★, deepseek.mjs, terminology.mjs, prompts/{bazi,qimen,ziwei}.json}
├── deploy/                       # 部署（Dockerfile ×2 · compose · nginx.conf · deploy.sh · rollback.sh）
├── growth/                       # 增长/GEO（faq/ · longtail-words.csv · social-calendar.xlsx · llms.txt）
└── TempoSoul 命律网站全栈平台详细部署计划书（主文件）.md
```

**本次本地补全新增/修改产物**
```
basis/src/lib/engine/             [新增] 排盘引擎 types/solar/bazi/index（lunar-typescript 真排盘 + 真太阳时）
basis/src/lib/ai-chat.ts          [新增] SSE 流式客户端（/api/chat）
basis/src/lib/ai-data.ts          [新增] 排盘→AI 数据适配 + 紫微/奇门示例盘
basis/src/components/BirthChartApp.tsx [新增] 排盘应用（表单+结果+AI 解读三合一）
basis/src/pages/                  [新增] Home/Chart/Almanac/Yijing/Lexicon/Faq/Pricing/Auth/Static（22 路由组件）
basis/src/i18n/ui.ts              [新增] 业务文案层（locale→en→key 回退）
basis/src/App.tsx                 [修改] 22 路由挂载真实组件
basis/src/components/SiteNav.tsx  [修复] 导航链接拼接 bug（toLocalized 误用 → localizePath）
basis/src/styles.css              [扩展] 业务页样式
basis/package.json                [新增依赖] lunar-typescript（动态 import，独立 chunk）
ai-interpreter/server/payments.mjs [新增] PayPal/MOCK 支付模块
ai-interpreter/server/auth.mjs     [新增] 文件存储认证模块（scrypt + Bearer token）
ai-interpreter/server/prod-server.mjs [修改] 挂载支付+认证路由
deploy/docker-compose.yml          [修改] api 数据卷 + AUTH_DB
deploy/README.md                   [重写] 双服务架构手册（消除 pnpm 旧架构误导）
deploy/ssl/                        [新增] 本地自签 TLS（fullchain.pem + privkey.pem）
deploy/.env                        [修改] AI 端点修正（去 /v1）+ PAYMENTS_MOCK=1
basis/src/pages/GenericPages.tsx      [第三轮新增] 93 深链路由批量工厂（makeAiPage/makeChartPage/makeReusePage/makeInfoPage）
basis/src/i18n/ui.ts                    [第三轮修改] 新增 93 组文案（zh/en）
basis/dist/sitemap.xml                  [第三轮生成] 146×7=1022 条 loc（hreflang 交替）
E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统/
├── TempoSoul_人工审计清单_20260922.md  [新增] 逐项人工审计清单（终版，A–K 组覆盖 146 路由）
└── TempoSoul_生产部署手册_20260922.md  [新增] 上线准备 + 外部配合清单
```

---

## 三、功能实现状态

### 3.1 已实现功能（交接基线 + 本次补全）

| 模块 | 能力 | 证据 |
|---|---|---|
| K-A1 基础盘 | 7 语 i18n + 146×7 路由全 200；SEO（title/desc/og/hreflang/JSON-LD）；PWA（manifest+sw）；sitemap 146×7 | dev+preview 双验证；构建 0 错 |
| **业务页面（三轮补全）** | **146 路由全真实化**：第一轮 22 核心 + 第二轮 31 扩展（导航 48 入口）+ **第三轮 93 深链（AI 解读 37 / 真实功能复用 15 / 信息页 41）** | 146×7 路由 HTTP 全 200；浏览器级实测（排盘/解梦 SSE/信息页）渲染正常 |
| **八字排盘引擎（本次）** | lunar-typescript 真计算：四柱/藏干/十神/纳音/五行分布/空亡/大运/起运；**真太阳时校正**（经度+均时差，Meeus 式） | 1990-05-15 10:30 男 → 庚午/辛巳/庚辰/辛巳，大运顺排壬午 8–17 岁 |
| **黄历（本次）** | 宜忌/冲煞/纳音/节气/生肖/星座，按日实时计算 | 实测渲染 |
| **AI 解读（本次并入网站）** | 排盘结果→AI 数据→SSE 流式解读，9 语言可选，可中断 | 真实 DeepSeek 流式输出验证 |
| K-A3 词库 | 901 条 × 7 语；trie 翻译引擎 79 断言全绿；前端词库页可搜可分类 | 实测搜索过滤 |
| K-A4 AI 引擎 | `POST /api/chat` SSE + `GET /api/health`；限流 20 次/分/IP；密钥零落盘 | curl + 浏览器流式验证 |
| **支付（本次代码就绪）** | `POST /api/v1/checkout|cancel|refund`；PayPal REST v2 沙箱代码 + **MOCK 模式**（密钥未到位可全流程测试）；nginx 限流 10r/m | MOCK 下单返回 orderId |
| **认证 Phase 2（本次本地化）** | 注册/登录/会话（scrypt 哈希 + Bearer token + 文件持久化 `deploy/data/users.json`）；登录入口从降级变为可用 | 注册→登录→me 全闭环实测 |
| K-A5 部署 | 双服务编排 + nginx（gzip/缓存/安全头/SSE 关缓冲/三档限流）+ 部署/回滚脚本 | **本次本地 docker 全链路跑通** |
| K-A6 增长/GEO | FAQ 196 条 + JSON-LD；长尾词 509×6；社媒日历 150 条；邮件 21 封；DoD ALL PASS | verify_dod.py |
| 收口审计 7 项 | P0-1 部署错位 / P0-2 词库零消费 / P0-5 生产 404 / P1-3~P1-6 全部修复 | 交接报告 §2.6 |

### 3.2 本次执行中额外修复的缺陷

| 缺陷 | 影响 | 处置 |
|---|---|---|
| SiteNav 导航链接全部错位 | 全站导航不可用（toLocalized 误传路由） | 改用 `localizePath(locale, route)`，实测链接正确 |
| 词库页运行时崩溃 | `r is not iterable`（terminology.json 为 `{meta,terms}` 而非数组） | 取 `data.terms`，901 条全量渲染 |
| AI 端点 404 | deploy/.env 的 `AI_BASE_URL` 带 `/v1` + 模型名不符 | 修正为 `https://api.deepseek.com` + `deepseek-flash` |
| 排盘 getForward API 名 | 排盘报 `getForward is not a function` | 按 lunar-typescript d.ts 改为 `isForward()` |
| 端口 3001 被占用 | 本机另有 freellmapi 服务占 3001 | 测试用 3011；生产容器内仍 3001（不同网络命名空间，无冲突） |

### 3.3 尚未实现（更新后状态）

| # | 缺口 | 状态 | 卡点 / 接手动作 |
|---|---|---|---|
| 1 | **支付闭环 K-A0 验收** | 🔶 代码就绪，验收待密钥 | 老板补 PayPal 沙箱 Client ID+Secret → `PAYMENTS_MOCK=0` → 沙箱真实下单 |
| 2 | **业务页面 93 深链路由** | ✅ **146 路由全真实化** | 第三轮补齐 93 深链（AI 解读 37 / 真实功能复用 15 / 信息页 41），无占位壳 |
| 3 | **紫微/奇门排盘引擎** | 🔴 未实现 | lunar-typescript 1.8.x 无对应 API；需引入专门命理库或专家校验后接入（当前示例盘 + AI 解读，页内已标注） |
| 4 | **ECS 真机部署** | 🔶 本地已验证 | 阿里云账户 + 预算 → `./deploy.sh` + 生产证书 + DNS 切换，验收 5xx=0 |
| 5 | **TLS 生产证书** | 🔶 本地自签已生成 | 生产域名就绪后 certbot / 阿里云免费证书 |
| 6 | **母语者复核** | 🔴 待人工 | th/vi AI prompt + growth FAQ/邮件（ja/ko/ru/es/fr）发布前走查；UI 非中英语言当前回退英文 |
| 7 | **术语人审** | 🔴 待人工 | 14 条 `review:true` + 251 条增量，需命理顾问终审 |
| 8 | **UI 首页定稿** | 🔴 老板线程 | 3D 粒子首页完成后并入，替换当前临时首页 |
| 9 | **长尾词搜索量校准** | 🔴 待外部数据 | 509 词需过 GSC/Ahrefs 真量 |
| 10 | **认证正式化** | 🔶 本地化已可用 | Phase 2 迁移至安全存储 + 订阅状态持久化（docs/kv-migration.md） |

**性能基线与变更说明**：交接基线首屏 gzip 92.10KB → 第一轮业务页 ≈101KB → 第二轮扩展页并入主 bundle ≈132KB → **第三轮 93 深链并入后 144KB gzip（≤200KB DoD 仍达标）**。lunar-typescript 已**动态 import 代码分割为独立 chunk**（仅排盘页触发加载），不进入首屏。后续可选路由级代码分割，把首屏压回 ≈100KB（上线后可选项，见生产部署手册）。

---

## 四、下一步计划（按 ROI 排序）

| 优先级 | 事项 | 依赖 | 动作 |
|---|---|---|---|
| P0 | **支付闭环验收** | 老板提供沙箱密钥 | 配置后 `PAYMENTS_MOCK=0`，沙箱下单→取消→退款全流程回归 |
| P0 | **紫微/奇门引擎接入** | 命理库选型/专家校验 | 评估专门排盘库（或自研算法 + 顾问校验），替换示例盘 |
| ✅ | **93 深链路由填充** | **已完成（第三轮）** | 146 基线路由 100% 真实化：AI 解读 37 / 真实功能复用 15 / 信息页 41；sitemap.xml 1022 条 loc 已部署 |
| P1 | **ECS 真机部署** | 阿里云账户 + 预算 | `deploy.sh` + 生产 TLS + DNS 切换 + 5xx=0 验收 |
| P2 | **质量收尾** | 顾问 + 母语者 | 术语人审（265 条）→ 母语走查（th/vi + 多语 UI）→ 长尾词校准 |
| P2 | **UI 首页定稿** | 老板线程 | 并入 3D 粒子首页，回测首屏基线 |
| P3 | **认证/订阅正式化** | Phase 2 排期 | 安全存储迁移 + 订阅状态 + 支付回调校验（webhook） |

**近期验收入口**：`https://127.0.0.1/`（本地测试环境，自签证书首次点「高级→继续前往」）；逐项点检见 `TempoSoul_人工审计清单_20260922.md`（A–I 九组 40+ 项）。

---

*报告完。所有事实均来自交接报告基线或本次实测记录；密钥与敏感配置未在本报告中出现。*
