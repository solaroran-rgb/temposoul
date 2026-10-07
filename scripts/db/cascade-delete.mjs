#!/usr/bin/env node
/**
 * L-06 · 级联删除（用户数据清除）
 *
 * 用法：
 *   node scripts/db/cascade-delete.mjs --user <userId> [--out <file>] [--exec]
 *
 * 双闸门（纪律：真机 DDL/DML 禁直接执行）：
 *   1) 默认只「生成计划 + 写 SQL 文件」，不连库、不执行；
 *   2) --exec 需同时满足：环境变量 L06_DDL_APPROVED=1 且 DATABASE_URL 已设置且 psql 在 PATH；
 *      任一不满足即拒绝并给出明确原因。
 *
 * 删除顺序：子表 → 父表（依赖倒序），单事务包裹，逐表返回删除计数。
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const userId = arg('user');
const exec = process.argv.includes('--exec');
const outFile = arg('out', null);

if (!userId) {
  console.error('用法：node scripts/db/cascade-delete.mjs --user <userId> [--out <file>] [--exec]');
  process.exit(2);
}

/**
 * 级联删除计划（依赖倒序）。
 * 每条：{ table, where, note }
 * where 中的 $1 统一绑定 userId。
 */
const PLAN = [
  { table: 'ai_messages', where: 'user_id = $1', note: 'AI 会话消息' },
  { table: 'ai_threads', where: 'user_id = $1', note: 'AI 会话' },
  { table: 'favorites', where: 'user_id = $1', note: '收藏' },
  // 悬赏：回答 / 托管流水 / 悬赏本体（本体删除会级联 answers）
  {
    table: 'community_bounty_answers',
    where: 'bounty_id IN (SELECT id FROM community_bounties WHERE author_id = $1)',
    note: '他人对自己悬赏的回答（随悬赏一并清除）',
  },
  { table: 'community_bounty_answers', where: 'author_id = $1', note: '本人发布的回答' },
  { table: 'bounty_escrow_ledger', where: 'user_id = $1', note: '本人积分托管流水' },
  { table: 'community_bounties', where: 'author_id = $1', note: '本人发布的悬赏' },
  // 分享墙
  {
    table: 'wall_share_likes',
    where: 'share_id IN (SELECT id FROM community_wall_shares WHERE user_id = $1)',
    note: '他人对本人分享的点赞',
  },
  { table: 'wall_share_likes', where: 'user_id = $1', note: '本人的点赞' },
  { table: 'community_wall_shares', where: 'user_id = $1', note: '本人的分享' },
  // 案例
  {
    table: 'cases_feedback',
    where: 'case_id IN (SELECT id FROM community_cases WHERE author_id = $1)',
    note: '他人对本人案例的反馈',
  },
  { table: 'cases_feedback', where: 'author_id = $1', note: '本人发布的案例反馈' },
  { table: 'community_cases', where: 'author_id = $1', note: '本人提交的案例' },
  // 社区帖子（回复先于主题帖）
  {
    table: 'community_replies',
    where: 'thread_id IN (SELECT id FROM community_threads WHERE author_id = $1)',
    note: '他人对本人帖子的回复',
  },
  { table: 'community_replies', where: 'author_id = $1', note: '本人发布的回复' },
  { table: 'community_threads', where: 'author_id = $1', note: '本人发布的帖子' },
  // 订单 / 任务 / 积分 / 时段占用
  { table: 'consult_orders', where: 'user_id = $1', note: '咨询订单' },
  { table: 'report_jobs', where: 'user_id = $1', note: '报告任务' },
  { table: 'community_points', where: 'user_id = $1', note: '积分余额' },
  { table: 'expert_slots', where: 'held_by = $1', note: '被本人占用的专家时段（释放）' },
];

function buildSql() {
  const lines = [];
  lines.push('-- L-06 级联删除 · 自动生成');
  lines.push(`-- user_id = '${userId.replace(/'/g, "''")}'`);
  lines.push(`-- 生成时间：${new Date().toISOString()}`);
  lines.push('-- 单事务包裹；任一步失败整体回滚。');
  lines.push('');
  lines.push('BEGIN;');
  lines.push('');
  for (const step of PLAN) {
    lines.push(`-- ${step.note}`);
    lines.push(`DELETE FROM ${step.table} WHERE ${step.where.replace('$1', `'${userId.replace(/'/g, "''")}'`)};`);
  }
  lines.push('');
  lines.push('COMMIT;');
  lines.push('');
  lines.push('-- 验证：逐表 count 应为 0');
  for (const step of PLAN) {
    lines.push(`-- SELECT count(*) FROM ${step.table} WHERE ${step.where.replace('$1', `'${userId.replace(/'/g, "''")}'`)};`);
  }
  return lines.join('\n');
}

const sql = buildSql();
const target = outFile
  ? resolve(ROOT, outFile)
  : join(ROOT, 'docs', 'db', `purge-user-${userId}-${Date.now()}.sql`);

mkdirSync(dirname(target), { recursive: true });
if (!existsSync(target) || outFile) {
  writeFileSync(target, sql, 'utf8');
}

console.log(`\n[cascade-delete] 用户 ${userId}`);
console.log(`  删除步骤 ${PLAN.length} 步（依赖倒序，单事务）：`);
PLAN.forEach((s, i) => console.log(`    ${String(i + 1).padStart(2)}. ${s.table.padEnd(28)} ${s.note}`));
console.log(`\n  SQL 已写入：${target}`);

if (!exec) {
  console.log('\n  未执行（默认只生成计划）。执行需：');
  console.log('    L06_DDL_APPROVED=1 DATABASE_URL=postgres://... \\');
  console.log(`    node scripts/db/cascade-delete.mjs --user ${userId} --exec`);
  process.exit(0);
}

// ── 执行闸门 ────────────────────────────────────────────────────────────────
const blockers = [];
if (process.env.L06_DDL_APPROVED !== '1') blockers.push('未设置 L06_DDL_APPROVED=1（需豆包批准）');
if (!process.env.DATABASE_URL) blockers.push('未设置 DATABASE_URL');
const psqlCheck = spawnSync('psql', ['--version'], { encoding: 'utf8' });
if (psqlCheck.error || psqlCheck.status !== 0) blockers.push('PATH 中未找到 psql');

if (blockers.length) {
  console.error('\n[cascade-delete] 拒绝执行：');
  blockers.forEach(b => console.error(`  ✗ ${b}`));
  process.exit(3);
}

console.log('\n[cascade-delete] 闸门通过，执行中…');
const run = spawnSync('psql', [process.env.DATABASE_URL, '-v', 'ON_ERROR_STOP=1', '-f', target], {
  encoding: 'utf8',
});
if (run.status !== 0) {
  console.error('[cascade-delete] 执行失败：');
  console.error(run.stderr || run.stdout);
  process.exit(1);
}
console.log(run.stdout);
console.log('[cascade-delete] 完成。请按 SQL 末尾的验证语句逐表核对 count = 0。');
process.exit(0);
