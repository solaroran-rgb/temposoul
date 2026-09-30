# 邮件五流定时发送调度器（T03）

> 任务卡：上线待办 #19 · 优先级 P1 · mock 模式可立即运行，Resend key 到位后零改动切真实发送。

## 1. 五流清单

| # | flow | 名称 | 性质 | 退订可拦 | 默认最大尝试 | 触发点现状 |
|---|------|------|------|---------|-------------|-----------|
| 1 | `newsletter_confirm` | 订阅确认信 | marketing | ✅ | 5 | ✅ 已接入 `functions/api/v1/newsletter.ts`（模板统一到 flows.ts，队列不可用时回退原直发） |
| 2 | `register_welcome` | 注册欢迎信 | marketing | ✅ | 5 | ✅ 已接入 `functions/api/auth/[[path]].ts#register` |
| 3 | `otp_code` | OTP 验证码 | transactional | ❌ | 3 | 触发端点尚未落库，模板与策略已就绪 |
| 4 | `password_reset` | 找回密码 | transactional | ❌ | 5 | 触发端点尚未落库，模板与策略已就绪 |
| 5 | `report_delivery` | 深度报告投递 | transactional | ❌ | 6 | ✅ 已接入 `src/lib/server/report/email.ts` |

「退订可拦 = ❌」不是绕过退订：事务邮件（安全凭证、已付费交付物）本就不属于营销触达，
退订语义只作用于 marketing 流；这是行业通行口径，也避免「退订营销后收不到找回密码邮件」。

## 2. 文件结构

```
src/lib/server/mail/
├─ types.ts       类型契约（MailJob / FlowPolicy / DrainResult …）
├─ flows.ts       五流策略 + 模板装配（既有两流文案的**唯一来源**）
├─ store.ts       KV 持久化层（MailQueueStore 接口 + KV 实现 + 编解码）
├─ gates.ts       退订过滤 / 频控 / 成本闸门接入
├─ provider.ts    mock（日志）↔ Resend 通道切换
├─ scheduler.ts   入队 / 到期触发 / 重试 / 租约回收
└─ README.md      本文件
functions/api/v1/mail/dispatch.ts   调度 tick 端点
tests/mail-scheduler.test.ts        单测（14 例）
```

## 3. 数据流

```
触发点 → enqueueMail() ──► KV: mq:job:<uuid>  (status=pending, notBefore)
                                   │
外部 tick ─► POST /api/v1/mail/dispatch ──► drainDue()
                                   │
        ┌──────────────────────────┴──────────────────────────┐
        ▼                                                      ▼
  闸门口（marketing 流查退订）                          成本闸门（report_delivery）
  频控口（固定窗口计数）                               租约认领 → processing
        │                                                      │
   命中 → 取消 / 顺延                              provider.send() → sent | failed | 重试
```

## 4. 存储设计（KV）

| 键 | 说明 | TTL |
|---|---|---|
| `mq:job:<uuid>` | 任务记录（JSON） | pending 不过期；终态 7 天 |
| `mq:dedupe:<key>` | 幂等键 → jobId | 默认 24h |
| `mq:rl:<flow>:<email>:<bucket>` | 频控计数（固定窗口） | 窗口 + 60s |

**命名空间选择**：优先 `MAIL_QUEUE_KV`，未绑定时回落到 `newsletter_emails`（生产已绑定，零配置即可跑）。
两者都缺 → `enqueueMail` 返回 `queue_unavailable`，调用方回退既有直发路径，**绝不静默丢信**。

> 为什么不直接上 D1：本仓库当前无任何 D1 绑定与迁移设施，且 T04（订单落库）并行在建 orders 表。
> `MailQueueStore` 已是窄接口（get/put/delete/list），后续接 D1 只需新增一个实现并在
> `resolveQueueStore` 加分支，调度器零改动。

## 5. 定时触发怎么挂

Cloudflare Pages Functions **不支持** `scheduled` / cron 事件，所以「定时」由外部 tick 驱动：

```
POST /api/v1/mail/dispatch
x-dispatch-token: <MAIL_DISPATCH_TOKEN>
```

任选其一即可：
- Cloudflare Cron Triggers（Workers 定时调用该 URL）
- UptimeRobot / 腾讯云拨测 / GitHub Actions `schedule`，建议每 1~5 分钟一次
- 已在 `src/lib/server/report/email.ts` 内做了「入队后立刻 drain 一次」的即时补偿，
  即使 tick 没配也能发出，tick 只承担重试与兜底

端点幂等，多打无害；可选 `?max=N` 限制单轮处理量（默认 50，上限 500，单轮时间预算 20s）。

## 6. 重试与恢复

- 指数退避：30s × 2^(n-1)，±20% 抖动，上限 6h；
- 达 `maxAttempts` 转 `failed`，`lastError` 落库可查；
- `processing` 带 60s 租约，租约过期自动 reclaim 回 `pending` —— 覆盖「发送中进程挂掉」；
- 任务持久化在 KV，**重启 / 新 isolate 不丢**（单测「重启恢复」覆盖）。

## 7. 频控表

| flow | 额度 | 窗口 |
|---|---|---|
| `newsletter_confirm` | 3 | 24h |
| `register_welcome` | 1 | 24h |
| `otp_code` | 5 | 10min |
| `password_reset` | 3 | 30min |
| `report_delivery` | 10 | 1h |

命中频控**不消耗重试次数**，只把 `notBefore` 顺延到下一窗口起点。

## 8. mock → Resend 切换

`createMailProvider(env)`：配齐 `RESEND_API_KEY` + `MAIL_FROM` 自动走 Resend，否则走 mock 日志
（前缀 `[mail-mock]`，含 flow / to / subject / text 摘要）。业务代码只依赖 `MailProvider`，
**key 到位后零改动**。

待配置环境变量（用户侧事项，本卡不代配）：

```
RESEND_API_KEY=re_xxxxxxxxxxxx
MAIL_FROM=TempoSoul <noreply@your-domain.com>
MAIL_FROM_NAME=TempoSoul 命律
MAIL_DISPATCH_TOKEN=<强随机串，调度端点鉴权>
MAIL_QUEUE_KV=<KV 命名空间绑定，可选>
```

## 9. 接入指引（`otp_code` / `password_reset` 触发端点尚未落库，模板与策略已就绪）

```ts
import { enqueueMail } from '@/lib/server/mail/scheduler';

// OTP
await enqueueMail(env, {
  flow: 'otp_code',
  to: email,
  payload: { code, ttlMinutes: '10' },
  dedupeKey: `otp:${email}:${code}`,
});

// 找回密码
await enqueueMail(env, {
  flow: 'password_reset',
  to: email,
  payload: { resetUrl, ttlMinutes: '30' },
  dedupeKey: `pwdreset:${tokenId}`,
});
```

已接入的三处均为「入队 → 立即 drain 一次 → 队列不可用时回退原直发」的写法，
新接入点照抄即可保证主流程零回归。

## 10. 已知限制

1. **并发 drain 理论可重复发送**：KV 无 CAS/事务，两个 isolate 同时 claim 同一任务会各发一次。
   缓解：退订/频控/幂等键 + 终态不重发 + 60s 租约。生产建议**单 tick 触发**（只挂一个定时器）。
   接 D1 后可用 `UPDATE ... WHERE status='pending'` 拿到真正的原子认领。
2. 队列靠 `list(prefix)` 全量扫描，任务量到万级需改成分状态索引或换 D1；当前量级（日百级）无压力。
3. mock 模式只写日志，不落盘留存；如需审计请自行接 `console.log` 采集端。

## 11. 测试

```bash
tsx --tsconfig tsconfig.app.json --test tests/mail-scheduler.test.ts
```

14 例覆盖：五流入队 / 参数校验 / 队列不可用时回退 / mock 发送与幂等重投 / 模板文案未漂移 /
指数退避 / 重试上限 / 重试成功 / 频控顺延 / 退订过滤（营销拦、事务放行）/ 幂等去重 /
重启恢复 / 租约回收 / dispatch 鉴权（503·401·200）。
