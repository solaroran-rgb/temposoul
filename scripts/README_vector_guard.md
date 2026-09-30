# 向量栈守护（8899 探活 + 8877 embed 卡死自愈）· T01

> 任务卡：T01 守护巡检规则落地（向量库 8877 自动重启）· 2026-09-30

## 1. 它解决什么

2026-09-30 故障模式：8899 宕机 → 8877 向量写入失败（30888 条）；8899 自愈后 **8877 进程仍在、`/health` 仍返回 200，但 `embed.healthy` 连续 false 并卡死**，只能人工回填恢复。

现有 `kb_8877_watchdog.py` 只判 `/health == 200` → 该场景下打印 "OK 8877 up, nothing to do"，**不触发任何动作**；`kb_8899_embed_watchdog.py` 只判 8899 端口通。中间这层"软死"（进程活、embed 卡死）此前无人管 —— 本守护补的正是这一层。

## 2. 环境事实（实测，非臆测）

| 项 | 事实 |
|---|---|
| 8877 | `pythonw.exe E:\KnowledgeOS\kb_service\kb_service\main.py`，cwd `E:\KnowledgeOS\kb_service`；UPM 清单项 `kb-8877`（`E:\Agent OS\boot\agentos_stack\stack.yaml`）；NSSM 服务 `am-memory` 现存但 **stopped/manual**（Session 0 曾撞 WinError 10106，已弃用） |
| 8899 | `llama-server.exe`（qwen3-embedding-0.6b，1024 维），由 NSSM `qwen-embed-cpu` 托管；另有 `kb_8899_embed_watchdog.py` 兜底 |
| 8877 健康端点 | `GET http://127.0.0.1:8877/health` → `{"status":"ok", embed:{healthy, consecutive_timeouts, scan_paused}, counts:{corpus,...}}` |
| 8899 健康端点 | `GET http://127.0.0.1:8899/health` → `{"status":"ok"}` |
| 判据来源 | `main.py:660` → `"healthy": consecutive < 3`（连续 3 次 embed 超时即判不健康） |

## 3. 判定规则

| 探测结果 | 动作 |
|---|---|
| 8877 `/health` 不可达 | 计一次 strike，满 N 次 → 重启 8877 |
| 8899 存活 **且** 8877 `embed.healthy=false` | 计一次 strike，满 N 次 → 重启 8877 |
| 8899 不存活 | **冻结计数**（此时重启 8877 无意义，交给 8899 看门狗） |
| 8877 健康 | 计数清零，零副作用 |

- 默认 `N=3`，探测间隔 120s → **≈6 分钟**内检出并自愈。
- 重启幂等：先查 8877 端口占用 → 无监听才 spawn（与 UPM / `KB8877Watchdog` 并存也不会重复拉起）。
- 冷却 900s、每小时最多 3 次，防重启风暴。
- 重启后最长等 150s 确认 `/health` 且 `embed.healthy=true`；仍失败 → 升级告警（日志 + `_8877_embed_guard.alert` + 可选 `ALERT_WEBHOOK`）。

## 4. 文件位置

| 路径 | 作用 |
|---|---|
| `scripts/probe_vector_stack.py`（本仓库） | **权威源码**，仅标准库依赖 |
| `E:\KnowledgeOS\kb_service\kb_service\kb_8877_embed_guard.py` | 运行副本（与既有看门狗同目录）。**改源码后需同步复制** |
| `scripts/KB8877EmbedGuard.xml` | 计划任务定义（需管理员注册） |
| `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\KB8877EmbedGuard.vbs` | 登录自启 VBS（无计划任务权限时的托管方式，同 `AgentOS_HourlyRepair.vbs` 范式） |

日志 / 状态（运行副本同目录）：
- `_8877_embed_guard.log` —— 每轮探测与动作（>2MB 自动轮转为 `.1`）
- `_8877_embed_guard_state.json` —— `strikes`、`restarts` 时间戳
- `_8877_embed_guard.alert` —— 升级告警留痕（仅在自愈失败时出现）
- `E:\KnowledgeOS\logs\kb8877_embed_guard_spawn.log` —— 拉起进程 stdout/stderr

## 5. 安装

### A. 计划任务（推荐，需管理员 PowerShell）
```powershell
Register-ScheduledTask -Xml (Get-Content .\KB8877EmbedGuard.xml -Raw) -TaskName "KB8877EmbedGuard" -Force
```
注册成功后**删除** Startup 里的 `KB8877EmbedGuard.vbs`，避免双跑。

### B. 启动文件夹常驻（无管理员权限时的现用方案）
已放置 `KB8877EmbedGuard.vbs`；下次登录自动拉起 `pythonw ... --loop --interval 120`（零黑窗）。
本次会话已手动拉起该常驻循环，即时生效。

### 告警（可选）
设置环境变量 `ALERT_WEBHOOK`（用户级）后，升级告警会 POST JSON `{"text": "..."}`；未设置则只落日志。

可调参数（环境变量）：`KB_GUARD_N`(3) / `KB_GUARD_COOLDOWN_S`(900) / `KB_GUARD_MAX_PER_HOUR`(3) / `KB_GUARD_WAIT_S`(150)。

## 6. 验收记录（2026-09-30 实测）

| 步骤 | 命令 / 动作 | 结果 |
|---|---|---|
| 探测自检 | `python kb_8877_embed_guard.py --selftest` | `8899_up=True 8877_up=True embed_healthy=True` ✅ |
| 演练（不动作） | `... --dry-run --force-stuck --n 1` | `STRIKE 1/1 → DRY-RUN：满足重启条件，本次不动作` ✅ |
| 模拟故障 | `taskkill /PID <8877 pid> /T /F` → 8877 返回 000 | 8877 已停 ✅ |
| 自动拉起 | `python kb_8877_embed_guard.py --n 1` | `RESTART → spawn pythonw main.py → 21:24:56 8877 已恢复（embed.healthy=True, corpus=24909）` ✅（耗时 140s，其中 startup 68s） |
| 无副作用 | 健康态再跑一轮 | `OK：健康`，无重启、strikes 归零 ✅ |

## 7. 回滚

1. 停守护：结束 `pythonw ... kb_8877_embed_guard.py --loop` 进程（或管理员 `Unregister-ScheduledTask -TaskName KB8877EmbedGuard -Confirm:$false`）；
2. 删 `%APPDATA%...\Startup\KB8877EmbedGuard.vbs`；
3. 删除运行副本 `E:\KnowledgeOS\kb_service\kb_service\kb_8877_embed_guard.py` 及 `_8877_embed_guard.*`；
4. 8877 本身不受影响（守护只做 stop→start，不改数据、不改索引）。

## 8. 边界（本卡不做）

- 不改向量库业务逻辑、不重建/修改索引、不删数据；
- 默认不重启 8899（8899 由 `qwen-embed-cpu` + `kb_8899_embed_watchdog.py` 负责）；
- 未改动 UPM（`stack.yaml`）与既有两个看门狗；三者并存安全（本守护 spawn 前查端口，端口被占即放弃）。

## 9. 与本卡的偏差（需老板知悉）

1. **脚本落点**：卡面要求放 `scripts/`；但 8877/8899 是 **KnowledgeOS 共享基础设施**，运行态归 `kb_service`，故权威源码存本仓库 `scripts/`，运行副本部署在 `E:\KnowledgeOS\kb_service\kb_service\`（与既有看门狗同目录）。
2. **不是 `.sh`**：本机为 Windows（无 crontab/systemd），改为 Python 脚本 + 计划任务 XML / 启动文件夹 VBS。
3. **调度降级**：本会话令牌 `Register-ScheduledTask` 实测 **Access denied**（非管理员受限令牌），故先用启动文件夹 VBS 常驻循环兜底并已即时生效；拿到管理员终端后按 §5-A 注册计划任务、删除 VBS 即可升级为规范托管。
4. **未提交 git**：仓库当前有 197 项无关改动（`git status --porcelain`），HEAD 为 `5c1e94a`（卡面记载的 `53fd832` 已过时），故只落文件未混提交，待老板决定提交时机。
