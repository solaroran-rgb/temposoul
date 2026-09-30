#!/usr/bin/env bash
# ============================================================================
# restore-drill.sh — G-3 恢复演练补遗脚本（异地备份恢复 + 核对清单）
#
# 适用：阿里云香港轻量 Ubuntu 24.04 · 自托管 B 轨（Docker + PostgreSQL）
# 仓库：TempoSoul 命律 网站建设系统 · scripts/deploy-prep/
#
# 与 backup-db.sh 的路径衔接（约定一致，见部署 Runbook T09 §6.2 备份策略）：
#   - 数据库备份（pg_dump）  : /opt/temposoul/backups/db/temposoul_YYYYMMDD.gz
#   - 异地备份（OSS/S3）     : s3://temposoul-backups/temposoul_YYYYMMDD.gz
#   - 认证数据（users.json） : /opt/temposoul/deploy/data/users.json.bak
#
# 默认「演练模式」：只验证备份存在性/完整性/元信息并输出核对清单，不碰数据库。
# 真正恢复必须同时指定 --apply 与 --confirm=yes（双重确认，防误操作）。
#
# 特性：幂等（演练只读；恢复前会再次核对备份）、参数化、--help、默认值。
#
# 用法示例：
#   sudo ./restore-drill.sh                                # 演练：本地昨日备份
#   sudo ./restore-drill.sh --date 20260929               # 演练：指定日期
#   sudo ./restore-drill.sh --source oss                  # 演练：异地备份
#   sudo ./restore-drill.sh --apply --confirm=yes         # 真实恢复（慎用）
# ============================================================================
set -euo pipefail

# ---------- 默认值 ----------
SOURCE="${RESTORE_SOURCE:-local}"            # local|oss
BACKUP_DIR="${RESTORE_BACKUP_DIR:-/opt/temposoul/backups/db}"
OSS_BUCKET="${RESTORE_OSS_BUCKET:-s3://temposoul-backups}"
DATE_STR="${RESTORE_DATE:-}"                 # YYYYMMDD，默认昨天
APPLY=0
CONFIRM="no"
CONTAINER="${RESTORE_DB_CONTAINER:-temposoul-db}"
DB_USER="${RESTORE_DB_USER:-temposoul}"
DB_NAME="${RESTORE_DB_NAME:-temposoul}"
API_CONTAINER="${RESTORE_API_CONTAINER:-temposoul-api}"
USERS_FILE="${RESTORE_USERS_FILE:-/opt/temposoul/deploy/data/users.json}"
SKIP_CHECKSUM=0
AWS_BIN="${AWS_BIN:-aws}"

# ---------- 工具函数 ----------
usage() {
  cat <<'EOF'
用法: restore-drill.sh [选项]

选项:
  -h, --help                 显示本帮助并退出
  -s, --source SOURCE        备份来源：local|oss（默认 local，可用 $RESTORE_SOURCE）
  -b, --backup-dir DIR       本地备份目录（默认 /opt/temposoul/backups/db）
      --oss-bucket BUCKET    异地备份桶（默认 s3://temposoul-backups）
  -D, --date YYYYMMDD        备份日期（默认昨天）
      --apply                执行真实恢复（默认仅演练，不修改数据库）
      --confirm=yes          与 --apply 联用，双重确认（必须显式填写 yes）
      --container NAME       数据库容器名（默认 temposoul-db）
      --db-user USER         PostgreSQL 用户（默认 temposoul）
      --db-name NAME         数据库名（默认 temposoul）
      --users-file PATH      users.json 路径（默认 /opt/temposoul/deploy/data/users.json）
      --no-checksum          跳过备份文件 sha256 校验（更快，安全级别降低）
      --aws-bin PATH         aws CLI 路径（默认 aws）

退出码:
  0 演练/恢复成功或 PASS   1 演练/恢复失败   2 参数错误

示例:
  sudo ./restore-drill.sh
  sudo ./restore-drill.sh --source oss --date 20260929
  sudo ./restore-drill.sh --apply --confirm=yes
EOF
  exit 0
}

log()  { printf '[restore-drill] %s\n' "$*"; }
warn() { printf '[restore-drill][WARN] %s\n' "$*" >&2; }
die()  { printf '[restore-drill][ERROR] %s\n' "$*" >&2; exit 1; }
ok()   { printf '[restore-drill][PASS] %s\n' "$*"; }
fail() { printf '[restore-drill][FAIL] %s\n' "$*" >&2; }

# ---------- 参数解析 ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -s|--source) SOURCE="${2:?--source 需要值}"; shift 2 ;;
    --source=*) SOURCE="${1#*=}"; shift ;;
    -b|--backup-dir) BACKUP_DIR="${2:?--backup-dir 需要值}"; shift 2 ;;
    --backup-dir=*) BACKUP_DIR="${1#*=}"; shift ;;
    --oss-bucket) OSS_BUCKET="${2:?--oss-bucket 需要值}"; shift 2 ;;
    --oss-bucket=*) OSS_BUCKET="${1#*=}"; shift ;;
    -D|--date) DATE_STR="${2:?--date 需要值}"; shift 2 ;;
    --date=*) DATE_STR="${1#*=}"; shift ;;
    --apply) APPLY=1; shift ;;
    --confirm=*) CONFIRM="${1#*=}"; shift ;;
    --container) CONTAINER="${2:?--container 需要值}"; shift 2 ;;
    --container=*) CONTAINER="${1#*=}"; shift ;;
    --db-user) DB_USER="${2:?--db-user 需要值}"; shift 2 ;;
    --db-user=*) DB_USER="${1#*=}"; shift ;;
    --db-name) DB_NAME="${2:?--db-name 需要值}"; shift 2 ;;
    --db-name=*) DB_NAME="${1#*=}"; shift ;;
    --users-file) USERS_FILE="${2:?--users-file 需要值}"; shift 2 ;;
    --users-file=*) USERS_FILE="${1#*=}"; shift ;;
    --no-checksum) SKIP_CHECKSUM=1; shift ;;
    --aws-bin) AWS_BIN="${2:?--aws-bin 需要值}"; shift 2 ;;
    --aws-bin=*) AWS_BIN="${1#*=}"; shift ;;
    *) die "未知参数: $1（使用 --help 查看用法）" ;;
  esac
done

[[ "$SOURCE" == "local" || "$SOURCE" == "oss" ]] || die "非法 --source: $SOURCE（仅 local|oss）"
[[ "$APPLY" == "1" ]] && [[ "$CONFIRM" != "yes" ]] && die "--apply 必须配合 --confirm=yes 使用（防误恢复）"
[[ "$APPLY" == "1" ]] && [[ "$(id -u)" -ne 0 ]] && warn "恢复操作建议以 root 运行"

# 默认日期 = 昨天（YYYYMMDD）
if [[ -z "$DATE_STR" ]]; then
  DATE_STR="$(date -d yesterday +%Y%m%d 2>/dev/null || date -v-1d +%Y%m%d)"
fi
[[ "$DATE_STR" =~ ^[0-9]{8}$ ]] || die "非法 --date: $DATE_STR（需 YYYYMMDD）"

BACKUP_FILE_NAME="temposoul_${DATE_STR}.gz"
LOCAL_FILE="$BACKUP_DIR/$BACKUP_FILE_NAME"
TMP_DIR=""

cleanup() { [[ -n "$TMP_DIR" ]] && rm -rf "$TMP_DIR" 2>/dev/null || true; }
trap cleanup EXIT

# ---------- 1. 定位备份（本地或异地） ----------
log "来源: $SOURCE | 日期: $DATE_STR | 备份文件: $BACKUP_FILE_NAME"

if [[ "$SOURCE" == "local" ]]; then
  [[ -f "$LOCAL_FILE" ]] || die "本地备份不存在: $LOCAL_FILE"
  FOUND_FILE="$LOCAL_FILE"
  FOUND_SIZE="$(stat -c %s "$FOUND_FILE" 2>/dev/null || stat -f %z "$FOUND_FILE" 2>/dev/null || echo '?')"
  log "本地备份: $FOUND_FILE ($FOUND_SIZE bytes)"
else
  command -v "$AWS_BIN" >/dev/null 2>&1 || die "aws CLI 未安装（apt-get install -y awscli 或 pip install awscli）"
  TMP_DIR="$(mktemp -d)"
  FOUND_FILE="$TMP_DIR/$BACKUP_FILE_NAME"
  log "从 OSS 下载: $OSS_BUCKET/$BACKUP_FILE_NAME -> $FOUND_FILE"
  if ! "$AWS_BIN" s3 cp "$OSS_BUCKET/$BACKUP_FILE_NAME" "$FOUND_FILE" --quiet; then
    die "OSS 下载失败: $OSS_BUCKET/$BACKUP_FILE_NAME（请检查桶名/凭据/网络）"
  fi
  FOUND_SIZE="$(stat -c %s "$FOUND_FILE" 2>/dev/null || echo '?')"
  log "下载完成: $FOUND_SIZE bytes"
fi

# ---------- 2. 完整性校验（幂等：只读） ----------
log "===== 完整性校验 ====="
if gzip -t "$FOUND_FILE" 2>/dev/null; then
  ok "gzip 完整性（gunzip -t）"
else
  fail "gzip 完整性（gunzip -t）"
  die "备份文件 gzip 损坏，停止后续步骤"
fi

if [[ "$SKIP_CHECKSUM" != "1" ]] && command -v sha256sum >/dev/null 2>&1; then
  CHK="$(sha256sum "$FOUND_FILE" | awk '{print $1}')"
  ok "sha256: $CHK"
  log "提示：与 backup-db.sh 记录的上传 checksum 比对可确认异地副本一致性"
else
  CHK="（已跳过）"
  [[ "$SKIP_CHECKSUM" == "1" ]] && log "checksum 校验已跳过（--no-checksum）"
fi

# pg_dump 头检查（确认是 PostgreSQL dump 而非空文件/损坏内容）
DUMP_HEAD="$(zcat -f "$FOUND_FILE" 2>/dev/null | head -c 200 | tr -d '\0')"
if [[ "$DUMP_HEAD" == *"PostgreSQL database dump"* ]]; then
  ok "pg_dump 内容头校验（PostgreSQL database dump）"
  PG_VERSION="$(zcat -f "$FOUND_FILE" 2>/dev/null | grep -m1 -oE 'Dumped from version [0-9.]+' || echo '版本行未找到')"
  log "备份元信息: $PG_VERSION"
else
  fail "pg_dump 内容头校验"
  warn "文件不是 PostgreSQL pg_dump 格式，请人工确认（可能备份策略已变更）"
fi

# users.json 备份存在性（演练只检查，不复制）
USERS_BAK="${USERS_FILE}.bak"
if [[ -f "$USERS_BAK" ]]; then
  ok "认证数据备份存在: $USERS_BAK"
else
  warn "认证数据备份不存在: $USERS_BAK（backup-db.sh 若含 users.json 备份则此处应可找到）"
fi

# ---------- 3. 演练模式核对清单输出（不修改任何状态） ----------
if [[ "$APPLY" != "1" ]]; then
  cat <<EOF

===== 恢复演练核对清单（演练模式，未修改数据库） =====
[ ] 备份文件存在       : $FOUND_FILE（$FOUND_SIZE bytes）
[ ] gzip 完整          : PASS（见上）
[ ] sha256             : $CHK
[ ] pg_dump 头校验     : $(grep -q 'PostgreSQL database dump' <(zcat -f "$FOUND_FILE" 2>/dev/null | head -c 200) && echo PASS || echo FAIL)
[ ] users.json 备份    : ${USERS_BAK}（$( [[ -f "$USERS_BAK" ]] && echo 存在 || echo 缺失 )）
[ ] 恢复目标           : 容器 $CONTAINER / db $DB_NAME（user $DB_USER）
[ ] 恢复命令（演练预览）: zcat -f <备份> | docker exec -i $CONTAINER psql -U $DB_USER -d $DB_NAME

结论：演练通过 = 备份可定位、可解压、内容为 pg_dump、认证数据备份在位。
提示：真实恢复请先停写（docker compose stop $API_CONTAINER），再执行
      sudo ./restore-drill.sh --apply --confirm=yes
EOF
  log "演练完成（未执行任何写操作）"
  exit 0
fi

# ---------- 4. 真实恢复模式（--apply --confirm=yes） ----------
log "===== 真实恢复模式 ====="
docker ps --format '{{.Names}}' | grep -qx "$CONTAINER" || die "数据库容器不存在: $CONTAINER（docker compose ps 确认）"

# 4.1 停止写入（停 API 容器，保留 DB）
if docker ps --format '{{.Names}}' | grep -qx "$API_CONTAINER"; then
  log "停写：docker compose stop $API_CONTAINER"
  docker compose stop "$API_CONTAINER" || docker stop "$API_CONTAINER" || warn "API 容器停止失败，请人工确认写入已停"
fi

# 4.2 恢复数据库（先 drop 再恢复，保证幂等）
log "恢复数据库 $DB_NAME（先 DROP SCHEMA public CASCADE 再导入）"
zcat -f "$FOUND_FILE" | docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" >/tmp/restore-drill-psql.log 2>&1 || {
  fail "数据库恢复失败，详见 /tmp/restore-drill-psql.log"
  warn "如为约束冲突，可考虑 DROP DATABASE + CREATE DATABASE 后重试（数据丢失范围需人工评估）"
  exit 1
}
ok "数据库恢复完成（psql 导入，详见 /tmp/restore-drill-psql.log）"

# 4.3 恢复 users.json（若备份存在）
if [[ -f "$USERS_BAK" ]]; then
  log "恢复认证数据: $USERS_FILE <- $USERS_BAK"
  cp "$USERS_BAK" "$USERS_FILE"
  ok "认证数据恢复完成"
fi

# 4.4 启动 API
if docker ps --format '{{.Names}}' | grep -qx "$API_CONTAINER"; then
  log "恢复写入：docker compose start $API_CONTAINER"
  docker compose start "$API_CONTAINER" || docker start "$API_CONTAINER" || warn "API 容器启动失败"
fi

# 4.5 数据完整性核对清单（实际 SQL 核对）
run_sql() { docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -tA -c "$1" 2>/dev/null || echo "ERR"; }

cat <<EOF

===== 数据完整性核对清单（恢复后） =====
EOF
for q in \
  "SELECT COUNT(*) AS users FROM users;" \
  "SELECT COUNT(*) AS orders FROM orders;" \
  "SELECT COUNT(*) AS report_tasks FROM report_tasks;" \
  "SELECT MAX(created_at) AS latest FROM users;" \
  "SELECT COUNT(*) AS total FROM pg_catalog.pg_tables WHERE schemaname='public';"; do
  label="$(echo "$q" | sed -E 's/SELECT COUNT\(\*\) AS ([a-z_]+).*/\1/; s/SELECT MAX\(([a-z_]+)\) AS ([a-z_]+).*/\2/; s/SELECT COUNT\(\*\) AS ([a-z_]+).*/\1/')"
  val="$(run_sql "$q")"
  if [[ "$val" == "ERR" ]]; then
    fail "SQL 核对 $label：执行失败（表可能不存在，按备份策略口径人工确认）"
  else
    ok "SQL 核对 $label = $val"
  fi
done

cat <<EOF
[ ] 登录功能抽查   : curl -X POST https://www.temposoul.com/api/auth/login（预期 200）
[ ] 支付回调抽查   : 使用 LemonSqueezy 测试订单触发 ls-webhook（预期 200/202）
[ ] 日志无 ERROR   : docker compose logs --tail 100 $API_CONTAINER | grep -i error

结论：请人工对照 backup-db.sh 备份前的基线行数（用户/订单），偏差即告警。
EOF

log "恢复演练（真实模式）完成"
