-- Migration: 2026-09-30 Create orders table
-- idempotent – will not error if table exists

BEGIN TRANSACTION;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  paypal_transaction_id TEXT,
  paypal_status TEXT,
  -- Reserved columns for future PayPal live integration
  live_trade_id TEXT,
  live_status TEXT
);

-- Unique index to prevent identical orders for same user & product within a day
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_user_product_day ON orders(user_id, product_id, created_at);

COMMIT;