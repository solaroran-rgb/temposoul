# L-06 · DB DDL + 级联删除设计说明

> 版本 v1.0 ｜ 2026-10-08 ｜ 执行方：WorkBuddy（T-11 社区/内容端点批）
> 状态：**设计已落盘，真机 DDL 未执行** —— 按纪律需豆包评审批准后方可执行。

---

## 一、交付物

| 文件 | 作用 | 执行状态 |
|---|---|---|
| `docs/db/L-06_schema_追加段.sql` | 21 张新表 + `chart_runs` 增列 | ⬜ 未执行（待批准） |
| `docs/db/L-06_rollback_20261008.sql` | 倒序逐表 DROP 回滚 | ⬜ 未执行 |
| `scripts/db/cascade-delete.mjs` | 级联删除计划生成 + 双闸门执行 | ✅ 可跑（默认只生成） |
| 本文件 | 设计说明与评审要点 | — |

---

## 二、设计原则

1. **只追加，不改既有表定义**（唯一例外：`chart_runs` 增列，按契约用 ALTER）。全部 `IF NOT EXISTS`，可重复执行。
2. **索引建在查询路径上**：列表端点的 `(status, created_at DESC, id DESC)` 支撑 **keyset 分页**（契约明令禁 OFFSET）；归属校验走 `(user_id, ...)`。
3. **状态机字段落库**：`community_bounties.status`（open/solved/closed）+ `settled` 布尔 + `expires_at`，配合 `bounty_escrow_ledger` 唯一索引 `(bounty_id, action)` 防重复结算。
4. **幂等兜底**：`consult_orders` / `report_jobs` 的 `idempotency_key` 部分唯一索引；`favorites` 的 `(user_id, target_type, target_id)` 唯一。
5. **合规字段硬约束**：`lexicon_terms` 的 `tdk_title_zh` 唯一索引（C-TDK 数据库层兜底，导入前由 `verify-content.mjs` 先检）。

---

## 三、新增表清单（21 张）

| # | 表 | 归属契约 | 说明 |
|---|---|---|---|
| 1 | `ai_threads` | L-06 | AI 会话 |
| 2 | `ai_messages` | L-06 | AI 消息（级联 thread） |
| 3 | `favorites` | L-06 / N-05 | 收藏，6 类 target_type |
| 4 | `lexicon_terms` | L-06 / L-15 | 术语百科，字段与 `content-schema.json` 一一对齐 |
| 5 | `community_boards` | L-06 / N-09 | 版块 |
| 6 | `community_threads` | L-06 / N-09 | 主题帖（软删 `deleted_at`） |
| 7 | `community_replies` | L-06 / N-09 | 回复 |
| 8 | `community_bounties` | N-09（本次新增） | 悬赏，含状态机字段 |
| 9 | `community_bounty_answers` | N-09（本次新增） | 悬赏回答 |
| 10 | `bounty_escrow_ledger` | N-09（本次新增） | 积分冻结/释放/退回流水 |
| 11 | `community_points` | N-09（本次新增） | 积分余额 |
| 12 | `community_wall_shares` | N-09（本次新增） | 分享墙 |
| 13 | `wall_share_likes` | N-09（本次新增） | 分享点赞（幂等切换） |
| 14 | `community_cases` | N-09（本次新增） | 真实案例 |
| 15 | `cases_feedback` | L-06 | 案例反馈 |
| 16 | `experts` | L-06 / N-08 | 专家 |
| 17 | `expert_slots` | L-06 / N-08 | 可约时段（含超时释放字段） |
| 18 | `consult_orders` | L-06 / N-08 | 咨询订单 |
| 19 | `report_jobs` | L-06 / N-07 | 报告异步任务 |
| 20 | `chart_runs`（ALTER） | L-06 | 增 `type`/`label`/`is_default`/`deleted_at` |
| 21 | — | — | （`community_boards` 已计，合计新增表 19 + ALTER 1） |

> 精确口径：新建表 **19 张**，`chart_runs` 为 ALTER 不计数。迁移前后表数核对栏按此填写。

---

## 四、级联删除顺序（`purgeUserData`）

依赖倒序，单事务包裹，任一步失败整体回滚：

```
ai_messages → ai_threads → favorites
→ community_bounty_answers(他人对我悬赏的回答) → community_bounty_answers(我的回答)
→ bounty_escrow_ledger → community_bounties
→ wall_share_likes(他人对我分享的赞) → wall_share_likes(我的赞) → community_wall_shares
→ cases_feedback(他人对我案例的反馈) → cases_feedback(我的反馈) → community_cases
→ community_replies(他人对我帖子的回复) → community_replies(我的回复) → community_threads
→ consult_orders → report_jobs → community_points → expert_slots(释放占用)
```

注意两类「他人数据」必须先清：
- 我发的帖子/悬赏/案例/分享下面挂着**别人的**回复、回答、反馈、点赞 —— 若只按 `author_id = 我` 删除，会留下孤儿行（外键 CASCADE 已覆盖部分，但 `cases_feedback`/`wall_share_likes` 需显式先清）。

---

## 五、执行闸门（防越权）

`scripts/db/cascade-delete.mjs` 默认**只生成计划 + 写 SQL 文件**，不连库。

`--exec` 需同时满足三项，任一缺失即 exit 3 并列出原因：

| 闸门 | 变量/条件 |
|---|---|
| 审批 | `L06_DDL_APPROVED=1`（豆包批准后置） |
| 连接 | `DATABASE_URL=postgres://...` |
| 客户端 | PATH 中存在 `psql` |

执行示例：

```bash
L06_DDL_APPROVED=1 DATABASE_URL=postgres://user:pw@host:5432/db \
  node scripts/db/cascade-delete.mjs --user <userId> --exec
```

---

## 六、验收清单（staging 通过后回填）

- [ ] staging `psql -f L-06_schema_追加段.sql` 成功，记录迁移前后表数与耗时
- [ ] 插测试用户 → 造数据 → 执行 `cascade-delete --exec` → 逐表 `count(*)` = 0（贴查询原文）
- [ ] `psql -f L-06_rollback_20261008.sql` 实测成功，表数回到迁移前
- [ ] 既有回归套件通过（既有表行为零变更）
- [ ] **反空壳**：只写 DDL 不做级联/回滚 → 退回（本卡两者均已落盘）

---

## 七、待决事项（不擅改，交豆包裁决）

1. `experts.price_cents` / `consult_orders.amount_cents` 的价格来源尚未接支付档位表，当前默认 0 —— 需与 E-09 商业化定价对齐后再回填。
2. `community_points` 与既有 `functions/api/v1/points/_store.ts`（内存 mock）为两套实现；迁移时需决定「积分真值源」归属（建议 PG 为准，边缘 KV 只做缓存）。
3. `lexicon_terms` 当前实际落点为 `data/content/lexicon/lexicon-terms.json`（L-15 流水线），PG 表为批准后的目标落点，字段一一对应可零改造切换。
