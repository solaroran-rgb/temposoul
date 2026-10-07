-- =============================================================================
-- L-06 · 回滚 SQL（倒序逐表 DROP）
-- 生成：2026-10-08 · WorkBuddy（T-11）
-- 用途：docs/db/L-06_schema_追加段.sql 的逆向操作，仅回滚本次新增对象。
-- 纪律：真机执行需豆包批准；先 staging 实测。
--
-- 说明：
--   - DROP 顺序为建表顺序的逆序，优先删依赖方（子表）；
--   - chart_runs 的 ALTER 一并回滚（删索引 → 删列），既有表其余定义不动；
--   - 全部 IF EXISTS，可重复执行。
-- =============================================================================

BEGIN;

-- 1) 既有表增列回滚（先删依赖索引，再删列）
DROP INDEX IF EXISTS uq_chart_runs_default;
DROP INDEX IF EXISTS idx_chart_runs_user_type;
ALTER TABLE chart_runs DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE chart_runs DROP COLUMN IF EXISTS is_default;
ALTER TABLE chart_runs DROP COLUMN IF EXISTS label;
ALTER TABLE chart_runs DROP COLUMN IF EXISTS type;

-- 2) 报告任务 / 咨询订单 / 专家时段 / 专家
DROP TABLE IF EXISTS report_jobs;
DROP TABLE IF EXISTS consult_orders;
DROP TABLE IF EXISTS expert_slots;
DROP TABLE IF EXISTS experts;

-- 3) 案例反馈 / 真实案例
DROP TABLE IF EXISTS cases_feedback;
DROP TABLE IF EXISTS community_cases;

-- 4) 分享墙点赞 / 分享墙
DROP TABLE IF EXISTS wall_share_likes;
DROP TABLE IF EXISTS community_wall_shares;

-- 5) 积分 / 托管流水 / 悬赏回答 / 悬赏
DROP TABLE IF EXISTS community_points;
DROP TABLE IF EXISTS bounty_escrow_ledger;
DROP TABLE IF EXISTS community_bounty_answers;
DROP TABLE IF EXISTS community_bounties;

-- 6) 社区回复 / 主题帖 / 版块
DROP TABLE IF EXISTS community_replies;
DROP TABLE IF EXISTS community_threads;
DROP TABLE IF EXISTS community_boards;

-- 7) 术语百科
DROP TABLE IF EXISTS lexicon_terms;

-- 8) 收藏
DROP TABLE IF EXISTS favorites;

-- 9) AI 消息 / AI 会话
DROP TABLE IF EXISTS ai_messages;
DROP TABLE IF EXISTS ai_threads;

COMMIT;

-- =============================================================================
-- 回滚验证（staging 执行后填写）：
--   SELECT count(*) FROM information_schema.tables WHERE table_schema='public';
--   回滚前：____ 张 → 回滚后：____ 张（应回到迁移前数字）
-- =============================================================================
