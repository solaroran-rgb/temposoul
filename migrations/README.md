# T04: 订单落库 orders 表

## 变更说明

### 新增文件
- `src/lib/server/orders.ts` — D1 订单访问层，提供幂等写入、查询、状态更新
- `migrations/20260930_create_orders_table.sql` — 建表迁移（幂等，可重复执行）
- `migrations/20260930_drop_orders_table.sql` — 回滚脚本

### 修改文件
- `functions/worker.d.ts` — Env 增加 `D1?: D1Database`
- `functions/api/v1/ls-webhook.ts` — 调用 activatePremium 时传入 `env.D1`
- `src/lib/server/payment.ts` — `activatePremium` 增加 `d1` 参数，成功事件时写入 orders 表

## Schema

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  amount INTEGER NOT NULL,  -- 分（integer，前端传 CNY，存储自动转分）
  currency TEXT NOT NULL DEFAULT 'CNY',
  status TEXT NOT NULL,     -- pending | completed | refunded | cancelled
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  paypal_transaction_id TEXT,  -- 预留 live PayPal 字段
  paypal_status TEXT,
  live_trade_id TEXT,          -- 预留 live 通用字段
  live_status TEXT
);

CREATE UNIQUE INDEX idx_orders_user_product_day
  ON orders(user_id, product_id, created_at);
```

## 部署步骤

### 1. 创建 D1 数据库
```bash
wrangler d1 create temposoul-orders
# 记录返回的 DATABASE_ID
```

### 2. 绑定到 Pages
在 `wrangler.toml` 添加：
```toml
[[d1_databases]]
binding = "D1"
database_id = "<DATABASE_ID>"
database_name = "temposoul-orders"
```

### 3. 运行迁移
```bash
wrangler d1 execute temposoul-orders --file=migrations/20260930_create_orders_table.sql
```

### 4. 验证
```bash
wrangler d1 execute temposoul-orders --command="SELECT count(*) FROM orders"
```

## 回滚
```bash
wrangler d1 execute temposoul-orders --file=migrations/20260930_drop_orders_table.sql
```

## 向后兼容

- D1 未绑定时，所有功能正常运行（KV 仍为唯一事实源）
- `activatePremium` 的 `d1` 参数为可选，不传则跳过 DB 写入
- webhook 端点在 `env.D1` 不存在时自动降级

## 预留字段说明

- `paypal_transaction_id` / `paypal_status`: PayPal live 交易号与状态
- `live_trade_id` / `live_status`: 通用 live 支付预留字段

这些字段在 mock 模式下保持 NULL，接入 live 支付时由支付回调填充。
