-- Rollback: 2026-09-30 Drop orders table
-- Run this to undo the migration

BEGIN TRANSACTION;

DROP TABLE IF EXISTS orders;
DROP INDEX IF EXISTS idx_orders_user_product_day;

COMMIT;
