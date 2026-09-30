# TempoSoul 命律 · 发布回滚 Runbook（应用 / 数据 / 域名三层）

> **文档编号**：T09  
> **版本**：v1.0（2026-09-30）  
> **适用**：CF Pages（A 轨生产主线）+ ECS/Docker（B 轨预发/自托管）  
> **目标**：陌生执行者在发布失败时可按步骤独立完成回滚，全程 < 5 分钟（应用层）/ < 15 分钟（数据层）

---

## 〇、快速决策矩阵

| 故障现象 | 影响面 | 回滚层 | 预计耗时 | 执行者 |
|---|---|---|---|---|
| 首页/路由 5xx、白屏、JS 报错 | 全站 | **应用层** | < 5 min | 值班工程师 |
| AI 解读 503/超时、支付/认证 5xx | 核心功能 | **应用层** | < 5 min | 值班工程师 |
| 数据不一致、用户数据丢失、DB 连接失败 | 数据 | **数据层** | < 15 min | 值班工程师 + DBA |
| 域名解析错误、证书过期、DNS 污染 | 入口 | **域名层** | < 10 min | 值班工程师 + DNS 管理员 |
| 多语言/SEO 异常（sitemap/hreflang） | 部分页面 | **应用层** | < 5 min | 值班工程师 |

**决策原则**：
1. **先止血**：优先回滚应用层（最快恢复服务）。
2. **再查数据**：若数据层异常，先停写（只读模式）再恢复。
3. **最后动域名**：域名层回滚影响最大，仅在应用/数据层无法解决时启用。

---

## 一、应用层回滚

### 1.1 A 轨 · CF Pages（生产主线）

**适用场景**：CF Pages 发布后出现 5xx、白屏、JS 报错、功能异常。

**前置条件**：
- 已记录当前 Deployment ID（`wrangler pages deployment list --project-name temposoul --json`）
- 已确认上一稳定版本 commit（`git log --oneline -5`）

**步骤**：

```bash
# 1. 确认当前部署状态
wrangler pages deployment list --project-name temposoul --json | head -5

# 2. 执行 L1 回滚（自动 stash 未提交改动 → checkout 目标 commit → 构建 → 部署）
bash scripts/rollback-l1.sh <target-commit>

# 3. 验证回滚成功
curl -s https://temposoul.pages.dev/ -o /dev/null -w '%{http_code}\n'   # 预期 200
curl -s https://temposoul.pages.dev/api/health -o /dev/null -w '%{http_code}\n'   # 预期 200

# 4. 记录回滚事件（自动写入 docs/deploy-log.md）
tail -5 docs/deploy-log.md
```

**回滚后检查清单**：
- [ ] 首页 200
- [ ] `/api/health` 200
- [ ] 深链路由（`/bazi` `/ai` `/chart/123`）200
- [ ] 多语言切换正常（zh/en/ja）
- [ ] 无 JS 控制台报错（浏览器 DevTools）

**回滚失败处置**：
- 若 `rollback-l1.sh` 中途失败（构建/部署错误），手动执行：
  ```bash
  git checkout <target-commit>
  pnpm install --frozen-lockfile
  pnpm build
  wrangler pages deploy dist --project-name temposoul --branch main
  ```
- 若回滚后仍异常，检查是否为数据层问题（转 §二）。

---

### 1.2 B 轨 · ECS/Docker（预发/自托管）

**适用场景**：ECS 部署后出现 5xx、容器 unhealthy、API 超时。

**前置条件**：
- 已记录当前镜像 tag（`docker images | grep temposoul`）
- 已确认上一稳定镜像 tag（如 `temposoul-web:20260929`）

**步骤**：

```bash
# 1. 确认当前容器状态
docker compose ps

# 2. 回退到上一镜像（需保留旧标签）
docker compose down --rmi local   # 停服并清理本地镜像（数据卷 ./data 保留）
docker compose up -d --no-build   # 使用旧镜像

# 3. 验证回滚成功
curl -sk https://127.0.0.1/api/health   # 预期 {"status":"ok",...}
curl -s http://127.0.0.1/ -o /dev/null -w '%{http_code} %{redirect_url}\n'   # 预期 301 → https

# 4. 记录回滚事件
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) B 轨回滚：镜像回退至 <old-tag>" >> docs/deploy-log.md
```

**回滚后检查清单**：
- [ ] `docker compose ps` 三容器全 healthy
- [ ] `/api/health` 200
- [ ] 首页 200（HTTPS）
- [ ] 深链路由 200
- [ ] 容器日志无 ERROR（`docker compose logs -f`）

**回滚失败处置**：
- 若容器启动失败，检查 `docker compose logs <service>` 定位错误。
- 若数据卷损坏，转 §二（数据层回滚）。

---

## 二、数据层回滚

### 2.1 数据库备份恢复（pg_dump）

**适用场景**：数据不一致、用户数据丢失、DB 连接失败、迁移脚本执行错误。

**前置条件**：
- 已确认最近一次成功备份时间（`ls -lt /opt/temposoul/backups/db/ | head -5`）
- 已确认备份文件完整性（`gunzip -t <backup-file>.gz`）

**步骤**：

```bash
# 1. 停止写入（只读模式）
# 方式 A：停 API 容器（保留 DB 容器）
docker compose stop api

# 方式 B：DB 设置只读（PostgreSQL）
docker exec -it temposoul-db psql -U temposoul -c "ALTER SYSTEM SET default_transaction_read_only = on;"

# 2. 恢复备份
# 方式 A：从本地备份恢复
gunzip -c /opt/temposoul/backups/db/temposoul_$(date -d "yesterday" +%Y%m%d).gz | \
  docker exec -i temposoul-db psql -U temposoul -d temposoul

# 方式 B：从异地备份恢复（OSS/S3）
aws s3 cp s3://temposoul-backups/temposoul_$(date -d "yesterday" +%Y%m%d).gz - | \
  gunzip | docker exec -i temposoul-db psql -U temposoul -d temposoul

# 3. 验证数据完整性
docker exec -it temposoul-db psql -U temposoul -d temposoul -c "SELECT COUNT(*) FROM users;"
docker exec -it temposoul-db psql -U temposoul -d temposoul -c "SELECT COUNT(*) FROM orders;"

# 4. 恢复写入
docker compose start api
# 或
docker exec -it temposoul-db psql -U temposoul -c "ALTER SYSTEM SET default_transaction_read_only = off;"

# 5. 记录回滚事件
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) 数据层回滚：恢复至备份 $(date -d "yesterday" +%Y%m%d)" >> docs/deploy-log.md
```

**回滚后检查清单**：
- [ ] 用户数/订单数与备份前一致
- [ ] API 正常响应（`/api/health` 200）
- [ ] 登录/支付功能正常（MOCK 模式测试）
- [ ] 无数据丢失（抽查关键用户/订单）

**回滚失败处置**：
- 若恢复失败（SQL 错误），检查备份文件是否损坏。
- 若数据不一致，考虑从更早备份恢复（需评估数据丢失范围）。

---

### 2.2 认证数据恢复（users.json）

**适用场景**：认证数据损坏、用户登录失败、token 失效。

**前置条件**：
- 已确认 `deploy/data/users.json` 备份（`ls -lt deploy/data/ | head -5`）

**步骤**：

```bash
# 1. 停止 API 容器
docker compose stop api

# 2. 恢复 users.json
cp deploy/data/users.json.bak deploy/data/users.json

# 3. 启动 API 容器
docker compose start api

# 4. 验证登录功能
curl -X POST https://temposoul.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"***"}'   # 预期 200 + token

# 5. 记录回滚事件
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) 认证数据回滚：恢复 users.json" >> docs/deploy-log.md
```

**回滚后检查清单**：
- [ ] 登录功能正常
- [ ] token 有效（`/api/auth/me` 200）
- [ ] 用户数据完整（抽查）

---

## 三、域名层回滚

### 3.1 DNS A 记录切维护页

**适用场景**：域名解析错误、证书过期、DNS 污染、应用/数据层无法快速恢复。

**前置条件**：
- 已准备维护页（静态 HTML，显示"系统维护中"）
- 已确认 DNS TTL（建议 300s）

**步骤**：

```bash
# 1. 准备维护页（本地）
cat > maintenance.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TempoSoul 命律 · 系统维护中</title>
  <style>
    body { font-family: -apple-system, "Segoe UI", "PingFang SC", sans-serif; text-align: center; padding: 50px; }
    h1 { color: #333; } p { color: #666; }
  </style>
</head>
<body>
  <h1>系统维护中</h1>
  <p>我们正在升级服务，请稍后重试。</p>
  <p>预计恢复时间：30 分钟内</p>
</body>
</html>
EOF

# 2. 部署维护页到 CF Pages（临时项目）
npx wrangler pages deploy maintenance.html --project-name temposoul-maintenance --branch main

# 3. 修改 DNS A 记录指向维护页
# 方式 A：CF DNS（控制台）
#   域名 → DNS → A 记录 → 修改 temposoul.com → 指向 temposoul-maintenance.pages.dev

# 方式 B：域名商 DNS
#   修改 A 记录 → 指向维护页 IP（或 CNAME → temposoul-maintenance.pages.dev）

# 4. 等待 DNS 生效（TTL 300s）
dig temposoul.com A +short   # 预期返回维护页 IP

# 5. 验证维护页
curl -s https://temposoul.com/ | grep "系统维护中"   # 预期命中

# 6. 记录回滚事件
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) 域名层回滚：DNS 切维护页" >> docs/deploy-log.md
```

**回滚后检查清单**：
- [ ] 维护页正常显示
- [ ] DNS 解析正确（`dig temposoul.com A +short`）
- [ ] 无 5xx 错误（维护页 200）

**恢复生产**：
```bash
# 1. 确认应用/数据层已恢复
curl -s https://temposoul.pages.dev/ -o /dev/null -w '%{http_code}\n'   # 预期 200

# 2. 修改 DNS A 记录指回生产
#   修改 A 记录 → 指向 temposoul.pages.dev（或原生产 IP）

# 3. 等待 DNS 生效
dig temposoul.com A +short   # 预期返回生产 IP

# 4. 验证生产
curl -s https://temposoul.com/ -o /dev/null -w '%{http_code}\n'   # 预期 200

# 5. 记录恢复事件
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) 域名层恢复：DNS 切回生产" >> docs/deploy-log.md
```

---

## 四、演练清单（季度执行）

### 4.1 应用层演练（CF Pages）

| # | 步骤 | 预期结果 | 实际结果 | 执行人 | 日期 |
|---|---|---|---|---|---|
| 1 | 记录当前 Deployment ID | 获取 ID | | | |
| 2 | 执行 `rollback-l1.sh <target-commit>` | 回滚成功 | | | |
| 3 | 验证首页/深链/health | 全 200 | | | |
| 4 | 记录回滚事件 | deploy-log.md 新增条目 | | | |
| 5 | 重新部署当前版本 | 恢复原状态 | | | |

### 4.2 数据层演练（pg_dump）

| # | 步骤 | 预期结果 | 实际结果 | 执行人 | 日期 |
|---|---|---|---|---|---|
| 1 | 执行 `backup-db.sh` | 备份成功 | | | |
| 2 | 删除测试数据 | 数据清空 | | | |
| 3 | 恢复备份 | 数据完整 | | | |
| 4 | 验证用户数/订单数 | 与备份前一致 | | | |
| 5 | 记录演练结果 | deploy-log.md 新增条目 | | | |

### 4.3 域名层演练（DNS 切维护页）

| # | 步骤 | 预期结果 | 实际结果 | 执行人 | 日期 |
|---|---|---|---|---|---|
| 1 | 部署维护页 | 维护页可访问 | | | |
| 2 | 修改 DNS A 记录 | DNS 生效 | | | |
| 3 | 验证维护页 | 显示"系统维护中" | | | |
| 4 | 切回生产 | 生产正常 | | | |
| 5 | 记录演练结果 | deploy-log.md 新增条目 | | | |

---

## 五、事故记录模板

```markdown
## 事故记录 · <YYYY-MM-DD>

**事故编号**：INC-<YYYYMMDD>-<序号>  
**发生时间**：<UTC 时间>  
**发现方式**：<监控告警 / 用户反馈 / 主动巡检>  
**影响面**：<全站 / 部分功能 / 数据 / 域名>  
**严重等级**：<P0 全站不可用 / P1 核心功能异常 / P2 部分功能异常>

### 时间线
| 时间 (UTC) | 事件 | 执行人 |
|---|---|---|
| HH:MM | 发现异常 | |
| HH:MM | 启动回滚 | |
| HH:MM | 回滚完成 | |
| HH:MM | 验证恢复 | |

### 根因分析
<技术根因 + 触发条件>

### 回滚动作
- **回滚层**：<应用 / 数据 / 域名>
- **执行命令**：<具体命令>
- **耗时**：<分钟>

### 改进措施
- [ ] <措施 1>
- [ ] <措施 2>

### 关联文档
- 部署日志：docs/deploy-log.md
- 监控告警：<告警 ID>
```

---

## 六、附录

### 6.1 脚本清单

| 脚本 | 路径 | 用途 | 状态 |
|---|---|---|---|
| rollback-l1.sh | `scripts/rollback-l1.sh` | CF Pages L1 回滚 | ✅ 已存在 |
| backup-db.sh | `deploy/backup-db.sh` | pg_dump 定时备份 | ⚠️ 待合入（deploy/ 目录缺失） |
| verify-prod.sh | `deploy/verify-prod.sh` | 生产验收 15 项 | ⚠️ 待合入（deploy/ 目录缺失） |
| monitor-prod.sh | `deploy/monitor-prod.sh` | /api/health 探活 | ⚠️ 待合入（deploy/ 目录缺失） |

> **注**：`deploy/` 目录在当前工作树不存在，相关脚本在另一条分支/工作树（如 `.temposoul-wt/deploy-0913/`）。Runbook 引用其路径时标注"若未合入则引用其路径并标注"。

### 6.2 备份策略

| 备份类型 | 频率 | 保留期 | 存储位置 |
|---|---|---|---|
| 数据库（pg_dump） | 每日 03:00 | 14 份 | `/opt/temposoul/backups/db/` + OSS |
| 认证数据（users.json） | 每日 03:00 | 7 份 | `deploy/data/` + OSS |
| 配置（.env） | 手动 | 永久 | 安全渠道（不入库） |

### 6.3 监控告警

| 监控项 | 阈值 | 告警渠道 |
|---|---|---|
| `/api/health` 连续失败 | 3 次 | ALERT_WEBHOOK |
| 5xx 错误率 | > 1% | ALERT_WEBHOOK |
| DNS 解析失败 | 1 次 | ALERT_WEBHOOK |
| 证书到期 | < 7 天 | ALERT_WEBHOOK |

---

*本 Runbook 由 T09 任务卡编制；引用脚本路径与仓库现状一致（deploy/ 目录缺失已标注）。密钥与敏感配置未在本文档中出现。*
