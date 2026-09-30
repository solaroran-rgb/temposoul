#!/usr/bin/env bash
# ============================================================================
# alert-5xx.sh — T16 应用错误追踪与 5xx 告警（运维轮询脚本）
#
# 作用：定时（cron / GitHub Actions schedule / UptimeRobot）拉取
#       GET /api/v1/errlog 的聚合与 pending 告警，当 5 分钟内 error/fatal
#       达到阈值（默认 3）即触发告警。
#       - ALERT_WEBHOOK 已配：POST 该 URL（飞书/Slack/通知）；
#       - 未配：输出 [5xx-alert-mock] 日志 + 配置说明（fail-closed 友好降级）。
#   端点侧在超阈值时已 best-effort 直接调 ALERT_WEBHOOK；本脚本为二次巡检，
#   拉到 pending 后通过 ?ack=1 清除，避免重复告警。
#
# 依赖：curl + python3（JSON 解析，python3 缺失时退化为 grep 粗解析）。
# 特性：幂等、参数化、--help、默认值、退出码语义化。
#
# 用法示例：
#   ./alert-5xx.sh                                  # 拉取默认站点，webhook 未配则 mock
#   ./alert-5xx.sh --site https://www.temposoul.com \
#                  --admin-token "$ERRLOG_ADMIN_TOKEN" \
#                  --webhook "$ALERT_WEBHOOK"
#   ./alert-5xx.sh --threshold 5 --json            # 自定义阈值 + 输出原始 JSON
#   ./alert-5xx.sh --dry-run                        # 只评估不发送
# ============================================================================
set -euo pipefail

# ---------- 默认值（可被参数/环境变量覆盖） ----------
SITE="${TS_SITE:-https://www.temposoul.com}"
ADMIN_TOKEN="${ERRLOG_ADMIN_TOKEN:-}"
WEBHOOK="${ALERT_WEBHOOK:-}"
THRESHOLD="${ERRLOG_ALERT_THRESHOLD:-3}"
JSON_OUT=0
DRY_RUN=0
ENDPOINT_SUFFIX="/api/v1/errlog"

usage() {
  cat <<'EOF'
用法: alert-5xx.sh [选项]

选项:
  -h, --help                  显示本帮助并退出
  -s, --site URL              站点基址（默认 $TS_SITE 或 https://www.temposoul.com）
  -t, --admin-token TOKEN     管理令牌（也可用 $ERRLOG_ADMIN_TOKEN；拉取聚合必需）
  -w, --webhook URL           告警 webhook（也可用 $ALERT_WEBHOOK；未配则 mock 日志）
      --threshold N           5 分钟内 error/fatal 达到 N 即告警（默认 3）
      --json                  输出端点原始 JSON（调试用）
      --dry-run               只评估/打印，不发送 webhook、不清除 pending
  -v, --verbose               打印详细信息

退出码:
  0 正常（无论是否触发告警）   1 拉取/解析失败   2 参数错误

示例:
  ./alert-5xx.sh --admin-token "$ERRLOG_ADMIN_TOKEN"
  ./alert-5xx.sh --site https://www.temposoul.com --webhook "$ALERT_WEBHOOK"
EOF
  exit 0
}

log()  { printf '[alert-5xx] %s\n' "$*"; }
warn() { printf '[alert-5xx][WARN] %s\n' "$*" >&2; }
die()  { printf '[alert-5xx][ERROR] %s\n' "$*" >&2; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -s|--site) SITE="$2"; shift 2 ;;
    -t|--admin-token) ADMIN_TOKEN="$2"; shift 2 ;;
    -w|--webhook) WEBHOOK="$2"; shift 2 ;;
    --threshold) THRESHOLD="$2"; shift 2 ;;
    --json) JSON_OUT=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -v|--verbose) VERBOSE=1; shift ;;
    *) die "未知参数: $1（--help 查看用法）" ;;
  esac
done

[[ -n "$ADMIN_TOKEN" ]] || die "需 --admin-token 或 \$ERRLOG_ADMIN_TOKEN（端点 fail-closed，未配返回 503）"
[[ "$THRESHOLD" =~ ^[0-9]+$ ]] || die "--threshold 必须为正整数"

URL="${SITE%%/}${ENDPOINT_SUFFIX}"

# 拉取聚合 + pending
RESP=$(curl -sS -m 15 -H "x-errlog-token: ${ADMIN_TOKEN}" "${URL}" || true)
[[ -n "$RESP" ]] || die "拉取 ${URL} 失败（端点未部署/令牌错/网络不可达）"
if [[ "$JSON_OUT" -eq 1 ]]; then printf '%s\n' "$RESP"; fi

# 用 python3 解析（缺失则粗解析）
parse_with_python() {
  python3 - "$@" <<'PY'
import sys, json
raw = sys.argv[1]
try:
    data = json.loads(raw)
except Exception as e:
    sys.stderr.write("JSON 解析失败: %s\n" % e); sys.exit(2)
aggs = data.get("aggregations", []) or []
pending = data.get("pending", []) or []
threshold = int(sys.argv[2])
alerts = []
for a in aggs:
    if a.get("level") in ("error", "fatal") and int(a.get("count", 0)) >= threshold:
        alerts.append(a)
# pending 也视为待处理告警
for p in pending:
    alerts.append({"pending": True, "scope": p.get("scope"), "level": p.get("level"),
                   "count": p.get("count"), "firstMsg": p.get("firstMsg"), "firstAt": p.get("firstAt")})
print(json.dumps({"alerts": alerts, "pending_count": len(pending),
                  "webhook_configured": bool(data.get("alertWebhookConfigured"))}, ensure_ascii=False))
PY
}

PARSED=$(parse_with_python "$RESP" "$THRESHOLD" 2>/dev/null) || PARSED=""
if [[ -z "$PARSED" ]]; then
  # python3 不可用或解析失败：粗解析 pending 与 error 聚合行
  warn "python3 不可用，使用粗解析（仅提示 pending 存在）"
  if printf '%s' "$RESP" | grep -q '"pending"'; then
    PARSED='{"alerts":[{"pending":true}],"pending_count":1,"webhook_configured":false}'
  else
    PARSED='{"alerts":[],"pending_count":0,"webhook_configured":false}'
  fi
fi

ALERT_COUNT=$(printf '%s' "$PARSED" | python3 -c 'import sys,json;print(len(json.load(sys.stdin).get("alerts",[])))' 2>/dev/null || echo 0)
WEBHOOK_CFG=$(printf '%s' "$PARSED" | python3 -c 'import sys,json;print("true" if json.load(sys.stdin).get("webhook_configured") else "false")' 2>/dev/null || echo false)

if [[ "$ALERT_COUNT" -eq 0 ]]; then
  log "无超阈值告警（阈值=${THRESHOLD}/5min）。"
  exit 0
fi

log "检测到 ${ALERT_COUNT} 条超阈值告警："
printf '%s' "$PARSED" | python3 -c '
import sys,json
for a in json.load(sys.stdin).get("alerts",[]):
    tag="[pending]" if a.get("pending") else "[agg]"
    print("  %s scope=%s level=%s count=%s firstMsg=%s" % (
        tag, a.get("scope"), a.get("level"), a.get("count"), (a.get("firstMsg") or "")[:80]))
' 2>/dev/null || true

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "[dry-run] 不发送、不清除 pending。"
  exit 0
fi

if [[ -z "$WEBHOOK" ]]; then
  warn "[5xx-alert-mock] ALERT_WEBHOOK 未配置 → 仅本地日志（运维应配置 webhook 或部署端点侧直发）。"
  warn "[5xx-alert-mock] 配置示例：在 Cloudflare Pages → Environment variables 设 ALERT_WEBHOOK=https://<你的通知端点>"
  exit 0
fi

# 发送 webhook
for i in $(seq 1 "$ALERT_COUNT"); do
  curl -sS -m 15 -X POST -H "Content-Type: application/json" \
    -d "$PARSED" "$WEBHOOK" >/dev/null 2>&1 && log "已发送告警 #${i} 至 webhook" \
    || warn "告警 #${i} 发送失败（webhook 不可达）"
done

# 清除 pending（ack），避免重复
ACK=$(curl -sS -m 15 -X POST -H "x-errlog-token: ${ADMIN_TOKEN}" "${URL}?ack=1" || true)
log "pending 清除：${ACK:-n/a}"
exit 0
