# scripts/deploy-prep/ · 部署补遗脚本包（T11）

> 任务卡：T11 ｜ 优先级：P1 ｜ 状态：**只编写不执行**（目标服务器未到货，本目录不执行任何远程操作）
> 对应部署方案审计缺口：**G-1 / G-3 / G-4 / G-12** ｜ 关联文档：部署 Runbook（T09 `docs/runbook-rollback.md`）、T1-10 阿里云迁移预案、`TempoSoul_生产部署手册_20260922.md`

本目录补齐四类部署脚本。全部**幂等、参数化、含 `--help` 与默认值**，服务器就绪后可直接执行。

## 一、目录与脚本清单

| 脚本 | 缺口 | 用途 | 运行位置 | 默认关键路径 |
|---|---|---|---|---|
| `ssl-setup.sh` | G-1 | certbot 签发 + 自动续期（systemd timer 优先 / cron 兜底）+ 到期验证 | 目标服务器（root） | `/etc/letsencrypt/live/<domain>/` |
| `restore-drill.sh` | G-3 | 异地备份恢复演练 + 数据完整性核对清单（默认只演练不碰库） | 目标服务器（root） | `/opt/temposoul/backups/db/` + `s3://temposoul-backups/` |
| `loadtest.sh` + `loadtest/*.js` | G-4 | 四条热点路径压测（登录/OTP/报告生成/支付回调），k6 优先、hey 兜底 | 压测机（可本地） | `https://www.temposoul.com` |
| `amap-probe.sh` | G-12 | 香港 → 高德 API curl 探活 + 延迟统计 + 可达性结论 | 目标服务器 | `webapi.amap.com` / `restapi.amap.com` |
| `alert-5xx.sh` | **T16** | 应用错误追踪与 5xx 告警轮询：拉取 `/api/v1/errlog` 聚合，超阈值（默认 3/5min）触发 `ALERT_WEBHOOK`，未配则 mock 日志 | 运维机 / CI（cron） | `https://www.temposoul.com/api/v1/errlog` |

## 二、逐脚本说明

### 1. ssl-setup.sh（G-1 SSL）
- **做什么**：自动探测 Web 栈（Nginx/Caddy）；certbot 签发证书；安装续期机制；到期验证。
- **幂等**：证书已签发且剩余天数 ≥ 30 天时跳过签发；cron 兜底已存在时不重复写入。
- **Caddy 场景**：Caddy 内置自动证书管理，脚本只做到期巡检与续期机制确认，不强行签发。
- **用法**：
  ```bash
  sudo ./ssl-setup.sh --domain www.temposoul.com --email ops@example.com
  sudo ./ssl-setup.sh --renew-only        # cron/timer 的常驻续期入口（幂等）
  ./ssl-setup.sh --check-only             # 只巡检到期天数与续期机制
  sudo ./ssl-setup.sh --dry-run           # 演练签发（不落盘）
  ```
- **输出**：证书路径（`/etc/letsencrypt/live/<domain>/{fullchain,privkey,chain}.pem`）、到期剩余天数、续期机制状态。
- **失败处理**：certbot 未安装 → 报错并给出安装命令；证书 7 天内到期 → 退出码 1 告警；nginx 服务未就绪自动回退 webroot 模式。
- **衔接**：Nginx 反代配置文件（`nginx.conf`，B 轨）应引用上述证书路径并 `include` 443 服务块；续期后由 `--deploy-hook` 自动 `systemctl reload nginx`。

### 2. restore-drill.sh（G-3 恢复演练）
- **做什么**：验证备份可定位、gzip 完整、内容为 pg_dump、认证数据在位；`--apply` 才真实恢复。
- **与 backup-db.sh 的路径衔接**（与 T09 Runbook §6.2 备份策略一致）：
  - 数据库：`/opt/temposoul/backups/db/temposoul_YYYYMMDD.gz`
  - 异地：`s3://temposoul-backups/temposoul_YYYYMMDD.gz`
  - 认证数据：`/opt/temposoul/deploy/data/users.json.bak`
  - 恢复目标：Docker 容器 `temposoul-db` / db `temposoul` / user `temposoul`（`backup-db.sh` 落库口径一致）
- **默认演练模式**（只读）：输出核对清单——备份存在 / gzip 完整 / sha256 / pg_dump 头 / users.json 在位 / 恢复命令预览。
- **真实恢复**（双重确认防误操作）：
  ```bash
  sudo ./restore-drill.sh --source oss --date 20260929 --apply --confirm=yes
  ```
- **失败处理**：备份缺失/损坏立即停止；恢复 SQL 错误落盘 `/tmp/restore-drill-psql.log`；恢复后核对清单（users/orders/report_tasks 行数）由人工对照 backup-db.sh 备份前基线。
- **边界**：不修改既有 backup-db.sh 逻辑，仅引用其路径约定。

### 3. loadtest.sh（G-4 压测）
- **四条热点路径**（k6 场景在 `loadtest/*.js`，公共配置 `common.js`）：
  | 场景 | 端点 | 判定 |
  |---|---|---|
  | login | `POST /api/auth/login` | 200 + token |
  | otp | `POST /api/auth/otp`（可配） | 2xx；**默认禁用**——仓库当前未实现 OTP 端点，上线后 `--otp-enabled --otp-url ...` 启用 |
  | report | 登录 → `POST /api/v1/report-task` | 202 异步受理 |
  | webhook | `POST /api/v1/ls-webhook` | 200/202=接受；401=签名校验链路可达（默认空签名时验证此路径）；真实端到端需 `--webhook-signature` + `--webhook-body` |
- **参数化**：`--vu`（并发，默认 20）、`--duration`（时长，默认 30s）、`--p95-ms`（p95 阈值，默认 2000ms）、`--err-rate`（错误率阈值，默认 1%）。
- **引擎**：自动探测 `k6`（推荐）→ `hey` 兜底；`--engine k6|hey` 强制指定。
- **用法**：
  ```bash
  ./loadtest.sh --path all --vu 20 --duration 30s --email loadtest@x.com --password '***'
  ./loadtest.sh --path report --token <JWT> --vu 10 --duration 1m
  ./loadtest.sh --path webhook --webhook-signature <sig> --webhook-body event.json
  ```
- **输出**：k6 汇总（http_req_duration p95、错误率）+ 阈值判定；退出码 0=全 PASS，1=有 FAIL。
- **失败处理**：阈值未达标 → 退出码 1，建议结合 p95 定位慢查询 / AI 上游（DeepSeek）/ Webhook 签名校验开销。

### 4. amap-probe.sh（G-12 高德探活）
- **做什么**：香港服务器对高德 API 的 curl 探活 + 延迟统计（min/avg/p50/p95/max）+ 可达性结论，供部署期判断是否启用首页楼块兜底。
- **Key**：`--key <KEY>` 或 `AMAP_KEY` 环境变量或 `--key-file <PATH>`（Key 见 `docs/2026-09-16_高德JSAPI_Key注册指引_temposoul.md`）。
- **用法**：
  ```bash
  ./amap-probe.sh --key <KEY> --endpoint all --probes 10 --p95-target-ms 1500
  ./amap-probe.sh --key <KEY> --endpoint restapi --city 济南 -o probe.csv
  ```
- **输出**：逐次探测行 + 统计 + 结论；退出码 0=可达达标，1=不可达/超阈值（建议兜底）。
- **失败处理**：Key 缺失/无效 → 明确报错并提示控制台路径；业务判定检查 `restapi` 返回 `status=1`，否则告警需兜底。

### 5. alert-5xx.sh（T16 应用错误追踪与 5xx 告警）
- **做什么**：运维侧二次巡检。定时调用 `GET /api/v1/errlog`（管理令牌 `ERRLOG_ADMIN_TOKEN`）拉取 5 分钟聚合与 pending 告警；对 `error/fatal` 级且 5 分钟内次数 ≥ 阈值（默认 3）的桶触发告警。
- **告警去向**：
  - 配置 `ALERT_WEBHOOK`（env 或 `--webhook`）→ `POST` 该 URL（飞书/Slack/通知），随后 `POST /api/v1/errlog?ack=1` 清除 pending，避免重复。
  - 未配置 → 输出 `[5xx-alert-mock]` 日志 + 配置说明（fail-closed 友好降级，不误报）。
- **与端点侧的关系**：`functions/api/v1/errlog.ts` 在超阈值时已 best-effort 直接 `fetch(ALERT_WEBHOOK)`（每窗口一次，去重）；本脚本为**二次巡检 + 兜底**，二者通过 `alerted:` / `pending:` KV 标记去重，每窗口至多一次真实告警。
- **参数化**：`--site`（默认 `https://www.temposoul.com`）、`--admin-token`、`--webhook`、`--threshold`、`--json`、`--dry-run`。
- **用法**：
  ```bash
  ./alert-5xx.sh --admin-token "$ERRLOG_ADMIN_TOKEN"
  ./alert-5xx.sh --site https://www.temposoul.com --webhook "$ALERT_WEBHOOK"
  ./alert-5xx.sh --threshold 5 --dry-run
  ```
- **cron 示例**（每 5 分钟）：
  ```cron
  */5 * * * *  /path/to/alert-5xx.sh --admin-token "$ERRLOG_ADMIN_TOKEN" >> /var/log/temposoul-alert.log 2>&1
  ```
- **依赖**：`curl` + `python3`（JSON 解析；缺失则粗解析）。退出码 0=正常（无论是否触发告警），1=拉取/解析失败，2=参数错误。
- **失败处理**：端点未部署/令牌错 → 明确报错退出 1；webhook 不可达 → 单条告警标记失败但保留 pending 供下次重试。

## 三、与既有脚本的衔接

| 既有脚本 | 状态（仓库现状） | 本包衔接方式 |
|---|---|---|
| `deploy/backup-db.sh`（pg_dump 定时备份） | ⚠️ deploy/ 目录缺失，待合入（T09 标注） | `restore-drill.sh` 默认路径/命名与其完全一致（`/opt/temposoul/backups/db/temposoul_YYYYMMDD.gz` + OSS） |
| `deploy/verify-prod.sh`（生产验收 15 项） | ⚠️ 待合入 | `loadtest.sh` 可作其压测步骤的补充执行器；`amap-probe.sh` 输出可作为验收证据 |
| `deploy/monitor-prod.sh`（/api/health 探活） | ⚠️ 待合入 | 建议生产后把 `amap-probe.sh` 挂 cron 与 monitor 并列 |
| `scripts/rollback-l1.sh`（应用层回滚） | ✅ 已存在 | 不修改；恢复演练只覆盖数据层（G-3 范畴） |

## 四、服务器就绪后的建议执行顺序

1. `amap-probe.sh --key <KEY>` → 确认高德直连可用性，决定首页楼块是否兜底（G-12）；
2. `ssl-setup.sh --domain www.temposoul.com --email <mail>` → 签发证书 + 装续期（G-1），随后在 Nginx 配置中引用证书；
3. 部署 `backup-db.sh` 并跑一次真实备份 → `restore-drill.sh`（演练）确认备份可恢复（G-3）；
4. `loadtest.sh --path all` → 四条热点路径阈值验收（G-4）；
5. 全部通过后由 `verify-prod.sh` 做最终生产验收。

## 五、自检与验收记录

- 语法校验：`shellcheck v0.11.0`（本机下载便携版执行，见任务卡 T11 执行记录）—— 全部脚本通过（0 error）。
- `--help`：四个脚本均已实现并核对输出。
- 幂等/默认值：各脚本含默认值与幂等逻辑（详见各文件头注释）。
- 未执行项：**未在任何远程环境执行**（服务器未到货），本包仅编写、自检、入库。
