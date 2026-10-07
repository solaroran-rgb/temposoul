-- =============================================================================
-- L-06 · DB DDL 追加段（PostgreSQL）
-- 生成：2026-10-08 · WorkBuddy（T-11 社区/内容端点批）
-- 状态：**未执行** —— 真机 DDL 需豆包评审批准后执行（纪律：禁直接执行真机 DDL）
--
-- 约束：
--   1) 只追加新表，不改既有表定义（既有行为零变更）；
--   2) chart_runs 增列用 ALTER，先在 staging 验；
--   3) 每张表含 id / user_id（如有）/ created_at / updated_at + 查询路径索引；
--   4) 全部使用 IF NOT EXISTS，可重复执行（幂等）。
-- =============================================================================

BEGIN;

-- ── 1. AI 会话（既有旁路写入 ai_threads / ai_messages，补齐正式表） ──────────
CREATE TABLE IF NOT EXISTS ai_threads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      text NOT NULL,
  title        text NOT NULL DEFAULT '',
  model        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_threads_user_created ON ai_threads (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS ai_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    uuid NOT NULL REFERENCES ai_threads(id) ON DELETE CASCADE,
  user_id      text NOT NULL,
  role         varchar(16) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content      text NOT NULL,
  tokens_in    integer,
  tokens_out   integer,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_messages_thread_created ON ai_messages (thread_id, created_at);

-- ── 2. 收藏（N-05 target_type 白名单 6 类） ──────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      text NOT NULL,
  target_type  varchar(32) NOT NULL,
  target_id    text NOT NULL,
  note         text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id, created_at DESC);

-- ── 3. 术语百科（L-15 内容导入流水线的 PG 落点，字段与 content-schema.json 对齐）──
CREATE TABLE IF NOT EXISTS lexicon_terms (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          varchar(120) NOT NULL UNIQUE,
  category      varchar(32) NOT NULL,
  title_zh      varchar(20) NOT NULL,
  title_en      text NOT NULL,
  tdk_title_zh  varchar(60) NOT NULL,
  tdk_desc_zh   varchar(160) NOT NULL,
  s0_summary    text NOT NULL,
  s1_meaning    text NOT NULL,
  s2_method     text NOT NULL,
  s3_combination text NOT NULL,
  s4_traditional text NOT NULL,
  s5_misconception text NOT NULL,
  s6_source     text NOT NULL,
  s7_selfcheck  text NOT NULL,
  s8_related    text NOT NULL,
  s9_tool       text NOT NULL,
  s10_disclaimer text NOT NULL,
  batch_id      varchar(64),
  version       varchar(16) NOT NULL DEFAULT 'v1.0',
  total_chars   integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lexicon_category ON lexicon_terms (category, slug);
CREATE INDEX IF NOT EXISTS idx_lexicon_batch ON lexicon_terms (batch_id);
-- C-TDK：TDK 标题全库唯一（导入前由 verify-content 先检，DB 层兜底）
CREATE UNIQUE INDEX IF NOT EXISTS uq_lexicon_tdk_title ON lexicon_terms (tdk_title_zh);

-- ── 4. 社区：版块 / 主题帖 / 回复（N-09 canonical） ──────────────────────────
CREATE TABLE IF NOT EXISTS community_boards (
  id           varchar(40) PRIMARY KEY,
  name         text NOT NULL,
  description  text NOT NULL DEFAULT '',
  post_count   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_threads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id     varchar(40) NOT NULL REFERENCES community_boards(id) ON DELETE RESTRICT,
  author_id    text NOT NULL,
  title        varchar(200) NOT NULL,
  excerpt      varchar(200) NOT NULL DEFAULT '',
  content      text NOT NULL,
  status       varchar(16) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  reply_count  integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);
-- keyset 分页索引（禁 OFFSET）：board + created_at + id
CREATE INDEX IF NOT EXISTS idx_threads_board_created ON community_threads (board_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_threads_author ON community_threads (author_id, created_at DESC);

CREATE TABLE IF NOT EXISTS community_replies (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    uuid NOT NULL REFERENCES community_threads(id) ON DELETE CASCADE,
  author_id    text NOT NULL,
  content      text NOT NULL,
  status       varchar(16) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);
CREATE INDEX IF NOT EXISTS idx_replies_thread_created ON community_replies (thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_replies_author ON community_replies (author_id);

-- ── 5. 社区：悬赏（状态机 冻结 → 采纳释放 → 过期退回） ───────────────────────
CREATE TABLE IF NOT EXISTS community_bounties (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id         text NOT NULL,
  title             varchar(200) NOT NULL,
  description       text NOT NULL,
  reward_points     integer NOT NULL CHECK (reward_points BETWEEN 10 AND 500),
  status            varchar(16) NOT NULL DEFAULT 'open'
                     CHECK (status IN ('open', 'solved', 'closed')),
  accepted_answer_id uuid,
  answer_count      integer NOT NULL DEFAULT 0,
  expires_at        timestamptz NOT NULL,
  settled           boolean NOT NULL DEFAULT false,
  ready             boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bounties_status_created ON community_bounties (status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_bounties_author ON community_bounties (author_id, created_at DESC);

CREATE TABLE IF NOT EXISTS community_bounty_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id    uuid NOT NULL REFERENCES community_bounties(id) ON DELETE CASCADE,
  author_id    text NOT NULL,
  content      text NOT NULL,
  status       varchar(16) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_answers_bounty_created ON community_bounty_answers (bounty_id, created_at);
CREATE INDEX IF NOT EXISTS idx_answers_author ON community_bounty_answers (author_id);

-- 悬赏积分托管流水（freeze / release / refund），防重复结算
CREATE TABLE IF NOT EXISTS bounty_escrow_ledger (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id    uuid NOT NULL,
  action       varchar(16) NOT NULL CHECK (action IN ('freeze', 'release', 'refund')),
  points       integer NOT NULL CHECK (points > 0),
  user_id      text NOT NULL,
  note         text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_escrow_bounty ON bounty_escrow_ledger (bounty_id, created_at);
-- 防重复结算：同一悬赏同一动作只允许一条
CREATE UNIQUE INDEX IF NOT EXISTS uq_escrow_bounty_action ON bounty_escrow_ledger (bounty_id, action);

CREATE TABLE IF NOT EXISTS community_points (
  user_id      text PRIMARY KEY,
  balance      integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ── 6. 社区：分享墙 ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_wall_shares (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      text NOT NULL,
  type         varchar(16) NOT NULL
                CHECK (type IN ('chart', 'report', 'starmark', 'sky-event', 'almanac')),
  ref_id       text NOT NULL,
  title        varchar(200) NOT NULL,
  summary      text NOT NULL DEFAULT '',
  share_token  varchar(40) NOT NULL UNIQUE,
  like_count   integer NOT NULL DEFAULT 0,
  status       varchar(16) NOT NULL DEFAULT 'published'
                CHECK (status IN ('published', 'hidden')),
  ready        boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wall_status_created ON community_wall_shares (status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_wall_type ON community_wall_shares (type, created_at DESC);

CREATE TABLE IF NOT EXISTS wall_share_likes (
  share_id     uuid NOT NULL REFERENCES community_wall_shares(id) ON DELETE CASCADE,
  user_id      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (share_id, user_id)
);

-- ── 7. 社区：真实案例 + 案例反馈 ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_cases (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      text NOT NULL,
  category       varchar(16) NOT NULL
                  CHECK (category IN ('bazi', 'ziwei', 'tarot', 'fengshui', 'naming', 'divination')),
  title          varchar(200) NOT NULL,
  summary        text NOT NULL DEFAULT '',
  content        text NOT NULL,
  status         varchar(16) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected', 'deleted')),
  feedback_count integer NOT NULL DEFAULT 0,
  rating_sum     integer NOT NULL DEFAULT 0,
  ready          boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at     timestamptz
);
CREATE INDEX IF NOT EXISTS idx_cases_status_created ON community_cases (status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_cases_author ON community_cases (author_id);

CREATE TABLE IF NOT EXISTS cases_feedback (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      uuid NOT NULL REFERENCES community_cases(id) ON DELETE CASCADE,
  author_id    text NOT NULL,
  rating       smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_case_feedback_case ON cases_feedback (case_id, created_at);

-- ── 8. 专家 / 咨询订单 / 报告任务（N-08 / N-07） ─────────────────────────────
CREATE TABLE IF NOT EXISTS experts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  headline     text NOT NULL DEFAULT '',
  domains      text[] NOT NULL DEFAULT '{}',
  rating_avg   numeric(3, 2) NOT NULL DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  price_cents  integer NOT NULL DEFAULT 0,
  currency     varchar(8) NOT NULL DEFAULT 'CNY',
  status       varchar(16) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'offline', 'suspended')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_experts_status ON experts (status, rating_avg DESC);

CREATE TABLE IF NOT EXISTS expert_slots (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id    uuid NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
  starts_at    timestamptz NOT NULL,
  ends_at      timestamptz NOT NULL,
  status       varchar(16) NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'held', 'booked', 'released')),
  held_by      text,
  held_until   timestamptz,
  order_id     uuid,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS idx_slots_expert_start ON expert_slots (expert_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_slots_status_held_until ON expert_slots (status, held_until);
CREATE UNIQUE INDEX IF NOT EXISTS uq_slots_expert_start ON expert_slots (expert_id, starts_at);

CREATE TABLE IF NOT EXISTS consult_orders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        text NOT NULL,
  expert_id      uuid NOT NULL REFERENCES experts(id) ON DELETE RESTRICT,
  slot_id        uuid REFERENCES expert_slots(id) ON DELETE SET NULL,
  status         varchar(16) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'held', 'completed', 'cancelled', 'refunded')),
  amount_cents   integer NOT NULL DEFAULT 0,
  currency       varchar(8) NOT NULL DEFAULT 'CNY',
  question       text,
  idempotency_key varchar(80),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_consult_orders_user ON consult_orders (user_id, created_at DESC);
-- 幂等：同 key 只一单
CREATE UNIQUE INDEX IF NOT EXISTS uq_consult_idempotency ON consult_orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS report_jobs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        text NOT NULL,
  report_type    varchar(32) NOT NULL,
  params         jsonb NOT NULL DEFAULT '{}'::jsonb,
  status         varchar(16) NOT NULL DEFAULT 'queued'
                  CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  result_ref     text,
  error          text,
  attempts       integer NOT NULL DEFAULT 0,
  idempotency_key varchar(80),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_report_jobs_user ON report_jobs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_jobs_status ON report_jobs (status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_jobs_idempotency ON report_jobs (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- ── 9. 既有表增列（ALTER，先在 staging 验） ──────────────────────────────────
ALTER TABLE chart_runs ADD COLUMN IF NOT EXISTS type       varchar(32);
ALTER TABLE chart_runs ADD COLUMN IF NOT EXISTS label      varchar(64);
ALTER TABLE chart_runs ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;
ALTER TABLE chart_runs ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_chart_runs_user_type ON chart_runs (user_id, type, created_at DESC)
  WHERE deleted_at IS NULL;
-- 单用户最多一个默认盘（部分唯一索引）
CREATE UNIQUE INDEX IF NOT EXISTS uq_chart_runs_default ON chart_runs (user_id)
  WHERE is_default AND deleted_at IS NULL;

COMMIT;

-- =============================================================================
-- 迁移前后表数核对（staging 执行后填写）：
--   迁移前：____ 张
--   迁移后：____ 张（预期 +21）
--   耗时：____ ms
-- =============================================================================
