# TempoSoul 命律 · 生产部署手册（2026-09-22）

## 〇、部署策略声明（双轨收口 · 2026-09-26 落盘）

> **本节为唯一权威定位，覆盖本手册后续所有"ECS 上线"表述。** 项目曾并行两条部署轨道，为避免"到底哪条是生产"的混乱，现正式收口：

| 轨道 | 形态 | 当前状态 | 定位（本次收口） |
|---|---|---|---|
| **A 轨 · CF Pages** | `wrangler.toml` + `pnpm build` → `dist/`，发布到 `temposoul.pages.dev`（v `7bc7d0fa`） | ✅ **已上线、对外可访问** | **生产主线（Production Mainline）** — 所有对外流量、SEO、用户访问均以此为准 |
| **B 轨 · ECS/Docker** | `Dockerfile` + `docker-compose.yml` + `nginx.conf`，阿里云 ECS 容器化 | 🚧 在研/预发，未切生产 | **移植源 + 预发（Migration Source / Staging）** — 用于自托管迁移、性能压测、离线/内网部署，**不作为当前对外生产入口** |

**收口纪律（后续一律遵循）**
1. **A 轨是"真身"**：线上 bug 修复、内容更新、SEO 优化 → 先落 A 轨（`pnpm build` → `wrangler pages deploy dist`）。
2. **B 轨是"备胎"**：仅当需要自托管 / 内网隔离 / 大流量压测时启用；启用前须先把 A 轨当前产物同步进 B 轨镜像，避免两轨代码漂移。
3. **禁止双轨同时对外**：任一时刻只有一个对外生产入口（当前 = A 轨）。B 轨若要接管生产，须走"灰度切流 + A 轨回滚预案"两步，不可静默切换。
4. **构建单一真源**：两轨共用同一 `dist/`（`pnpm build` 产物），B 轨 Dockerfile 只把 `dist/` 打进镜像、不二次构建，杜绝 A/B 产物不一致。

> ⚠️ 本手册下文（§一–§三）描述的是 **B 轨 ECS 上线流程**，属于"移植源/预发"轨道的操作手册；**当前生产以 A 轨 CF Pages 为准**。若你目标是"把已上线的 A 轨迁到 ECS 自托管"，再按下述 B 轨步骤执行。

---

> **状态**：本地已部署到"可上线状态"（146 路由全真实化 + 上线配置复核完毕）。本手册给出：① 上线前检查清单（已自助完成项）；② 需外部配合项（明确列出，不越界代办）；③ 正式上线步骤（部署到阿里云 ECS 的完整流程）。
> **当前实测基线**：146×7 语言路由全 200；sitemap.xml（1022 条 loc）已部署；robots/manifest/sw 200；nginx 生产配置就绪；镜像 temposoul-web/api:latest 与容器一致（index.html md5 一致）。

---

## 一、上线就绪检查清单（已完成 ✅）

| # | 检查项 | 状态 | 证据 |
|---|---|---|---|
| 1 | 146 基线路由全真实化（无占位壳） | ✅ | PAGE_COMPONENTS 全量挂载；146×7 HTTP 全 200 |
| 2 | 导航 48 入口全部可用 | ✅ | 浏览器级逐项实测 |
| 3 | AI 解读全链路（DeepSeek SSE） | ✅ | 流式实测（排盘/测字/解梦）；`/api/health` ok |
| 4 | 八字排盘真引擎 + 真太阳时 | ✅ | 1990-05-15 10:30 → 庚午/辛巳/庚辰/辛巳 |
| 5 | 黄历/择日真实历法 | ✅ | 2026-10-01 宜忌/冲壬寅虎/煞南/大驿土 |
| 6 | 支付 MOCK 全流程可测 | ✅ | PAYMENTS_MOCK=1，MOCK-xxx 下单 |
| 7 | 认证闭环（scrypt + Bearer + 落盘） | ✅ | 注册→登录→me 实测 |
| 8 | sitemap.xml（1022 条 loc + hreflang） | ✅ | `https://127.0.0.1/sitemap.xml` 200 |
| 9 | robots.txt（引用 sitemap + 屏蔽私有） | ✅ | 200 |
| 10 | PWA（manifest + sw） | ✅ | 200 |
| 11 | nginx 生产配置 | ✅ | TLS/gzip/三档限流/SSE 关缓冲/安全头/缓存头 全部就绪（deploy/nginx.conf） |
| 12 | 安全红线 | ✅ | 全库 grep `sk-` 0 命中；.env 不入库不落盘 |
| 13 | 性能基线 | ✅ | 首屏 gzip 144KB ≤ 200KB DoD |
| 14 | 镜像与运行一致 | ✅ | temposoul-web/api:latest = 容器运行代码（md5 校验一致） |

---

## 二、需外部配合项（上线前必须，我不能代办）

| # | 事项 | 需要谁 | 说明 / 接手动作 |
|---|---|---|---|
| 1 | **阿里云 ECS 账户 + 预算** | 你/老板 | 香港地域轻量 2C4G 起步（免 ICP）；提供 SSH 访问后我执行 `deploy/deploy.sh` |
| 2 | **生产域名 + DNS** | 你/老板 | 指向 ECS 公网 IP；DNS TTL 建议 300s |
| 3 | **生产 TLS 证书** | 你/老板 | 域名就绪后可 certbot 自动签发，或阿里云免费证书 |
| 4 | **PayPal 沙箱密钥** | 老板 | Client ID + Secret → `deploy/.env` 改 `PAYMENTS_MOCK=0` → 沙箱真实下单回归 |
| 5 | **母语者走查** | 顾问/母语者 | th/vi/ja/ko/es 页面回退英文的部分，发布前需母语复核（重点：AI prompt 7 语言口径） |
| 6 | **术语终审** | 命理顾问 | 901 条中 265 条 `review` 待终审 |
| 7 | **长尾词搜索量校准** | SEO 顾问 | 509 词需 GSC/Ahrefs 真量回填 |
| 8 | **首页 3D 粒子定稿** | 老板线程 | 完成后并入替换临时首页 |

**明确范围**：以上 8 项外，其余上线准备工作（配置复核、构建、sitemap、性能基线、部署脚本、回滚方案）已全部由我完成。

---

## 三、正式上线步骤（ECS 就绪后执行）

### 3.1 准备（一次性）
```bash
# 1. ECS 上安装 Docker + Compose（Ubuntu/Debian）
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # 重登生效

# 2. 拉取代码与配置（或 scp 上传 deploy/ 目录 + basis/dist）
# 目录结构：deploy/ {docker-compose.yml, Dockerfile, Dockerfile.api, nginx.conf, .env, ssl/, data/}
```

### 3.2 配置生产环境
```bash
# deploy/.env 生产值（关键项；密钥只写键名，值从安全渠道获取）
#   AI_API_KEY=<真实值>          # DeepSeek 密钥（当前 .env 已有真实值，生产复用或轮换）
#   PAYMENTS_MOCK=0              # 切换真实 PayPal（需沙箱/生产密钥）
#   PAYPAL_CLIENT_ID=<值>  PAYPAL_CLIENT_SECRET=<值>
#   AUTH_DB=/app/data/users.json
```

### 3.3 TLS 证书（域名解析生效后）
```bash
# 方案 A：certbot（推荐，自动续期）
sudo apt install certbot
sudo certbot certonly --standalone -d temposoul.com -d www.temposoul.com
cp /etc/letsencrypt/live/temposoul.com/fullchain.pem deploy/ssl/
cp /etc/letsencrypt/live/temposoul.com/privkey.pem  deploy/ssl/
# 方案 B：阿里云免费证书 → 下载 Nginx 版 → 放入 deploy/ssl/（文件名保持一致）

# nginx.conf 已按生产配置就绪（443 + 80→301 + http2 + HSTS）
```

### 3.4 构建 + 启动
```bash
cd deploy
# 注意：Docker Desktop BuildKit gRPC 问题 → 本地构建用 legacy builder（详见 README）
# ECS Linux 原生 Docker 一般无此问题，可直接：
docker compose up -d --build
docker compose ps                  # web 与 api 均 healthy

# 验收（判据全绿）：
curl -sk https://127.0.0.1/api/health          # {"status":"ok",...}
curl -s  http://127.0.0.1/ -o /dev/null -w '%{http_code} %{redirect_url}\n'   # 301 → https
curl -sk https://127.0.0.1/sitemap.xml -o /dev/null -w '%{http_code}\n'       # 200
# 重端点稳定性：对 /api/chat 连打 100 请求统计，5xx=0
```

### 3.5 DNS 切换 + 验证
```bash
# DNS 指向 ECS 公网 IP → 等 TTL 生效 → 从公网验证：
curl -s https://www.temposoul.com/ -o /dev/null -w '%{http_code}\n'   # 200
# 7 语言抽查：/en/bazi/dayun /th/almanac /ja/ziwei/palaces 均 200
```

### 3.6 上线后必做
- [ ] Lighthouse 复测（desktop ≥90；mobile 复测并优化，见 perf-report.md §五）——桌面已达标 91，移动端 78 待迁移后复测
- [ ] Google Search Console 提交 sitemap；Bing Webmaster 同步
- [ ] 支付沙箱→生产切换回归（下单/取消/退款 + webhook 校验）
- [ ] 监控：容器日志（`docker compose logs -f`）+ 限流阈值观察

---

## 四、回滚方案（< 5 分钟）

```bash
cd deploy
docker compose down --rmi local     # 停服并清理本地镜像（数据卷 ./data 保留）
# 或快速回退到上一镜像（需保留旧标签）：
docker compose up -d --no-build     # 使用旧镜像
# DNS 层：CF/域名商 TTL=300s，紧急回退可切回旧部署
```

---

## 五、上线后性能优化路线（可选，不阻塞上线）

| 项 | 现状 | 动作 | 预期 |
|---|---|---|---|
| 路由级代码分割 | 主 bundle 144KB gzip | App.tsx 改 React.lazy（100+ 页面） | 首屏 ↓ 至 ~90KB |
| sky-hero 大图 | 4MB PNG | WebP 转换 + 响应式 picture | 首屏图片 ↓70% |
| 中文字体子集化 | 全量 CJK | woff2 子集 + font-display swap | 移动端字体阻塞 ↓ |
| Brotli | gzip 已开 | ngx_brotli 镜像 | 传输再省 ~15% |

> 说明：当前首屏 144KB 已满足 ≤200KB DoD，以上均为可选项；移动端 Lighthouse 78 分是唯一未达标 DoD，建议迁移后优先处理 sky-hero 图片与字体（perf-report.md §五 执行顺序：1→4→3→2）。

---

## 六、安全红线复核（上线前最后确认）

- [ ] 全库 `grep -r "sk-"` 0 命中（密钥零明文）
- [ ] `.env` 不入 git、不入云盘、不回传日志
- [ ] nginx 安全头在位：X-Content-Type-Options / X-Frame-Options DENY / HSTS / Permissions-Policy
- [ ] 支付/认证端点限流在位（10r/m、5r/m）
- [ ] AI 解读合规口径：FTC 式披露 + 禁确定性断语（已在全部 AI 页与信息页内置）

---

*本手册由本地部署实测基线编制；生产环境网络/服务器差异可能带来 ±3-5 分性能波动，上线后按 perf-report.md §六 SOP 复测并回填。密钥与敏感配置未在本手册中出现。*