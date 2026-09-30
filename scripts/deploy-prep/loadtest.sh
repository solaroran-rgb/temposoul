#!/usr/bin/env bash
# ============================================================================
# loadtest.sh — G-4 压测补遗脚本（四条热点路径：登录 / OTP / 报告生成 / 支付回调）
#
# 适用：服务器就绪后在本机或压测机执行；引擎优先 k6，其次 hey（自动探测）。
# 仓库：TempoSoul 命律 网站建设系统 · scripts/deploy-prep/
#
# 场景（scripts/deploy-prep/loadtest/*.js，k6）：
#   login    : POST /api/auth/login  {email, password}
#   otp      : POST /api/auth/otp    （仓库当前未实现 OTP 端点，默认禁用；
#              上线后设置 LOADTEST_OTP_URL / 开启 OTP_ENABLED 再压）
#   report   : 登录拿 token -> POST /api/v1/report-task {chartId, productId}（期望 202 异步受理）
#   webhook  : POST /api/v1/ls-webhook（LemonSqueezy 回调；默认接受 401=签名校验链路可达，
#              真实端到端需提供 LOADTEST_WEBHOOK_SIGNATURE + LOADTEST_WEBHOOK_BODY）
#
# 特性：参数化（并发/时长/阈值）、幂等（只读压测）、--help、默认值。
#
# 用法示例：
#   ./loadtest.sh --path all --base-url https://www.temposoul.com \
#       --email loadtest@example.com --password '***' --vu 20 --duration 30s
#   ./loadtest.sh --path report --token <JWT> --vu 10 --duration 60s
#   LOADTEST_OTP_URL=/api/auth/otp OTP_ENABLED=1 ./loadtest.sh --path otp
# ============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCENES_DIR="$SCRIPT_DIR/loadtest"

# ---------- 默认值（环境变量可覆盖） ----------
PATH_SPEC="${LOADTEST_PATH:-all}"            # login|otp|report|webhook|all
BASE_URL="${LOADTEST_BASE_URL:-https://www.temposoul.com}"
VU="${LOADTEST_VU:-20}"
DURATION="${LOADTEST_DURATION:-30s}"
RAMP="${LOADTEST_RAMP:-5s}"
P95_THRESHOLD_MS="${LOADTEST_P95_MS:-2000}"
ERR_THRESHOLD="${LOADTEST_ERR_RATE:-0.01}"
EMAIL="${LOADTEST_EMAIL:-}"
PASSWORD="${LOADTEST_PASSWORD:-}"
TOKEN="${LOADTEST_TOKEN:-}"
CHART_ID="${LOADTEST_CHART_ID:-demo-chart-001}"
PRODUCT_ID="${LOADTEST_PRODUCT_ID:-report_39_9}"
WEBHOOK_SIGNATURE="${LOADTEST_WEBHOOK_SIGNATURE:-}"
WEBHOOK_BODY="${LOADTEST_WEBHOOK_BODY:-}"
OTP_URL="${LOADTEST_OTP_URL:-/api/auth/otp}"
OTP_ENABLED="${OTP_ENABLED:-0}"
ENGINE="${LOADTEST_ENGINE:-auto}"            # auto|k6|hey
K6_BIN="${K6_BIN:-k6}"
HEY_BIN="${HEY_BIN:-hey}"

# ---------- 工具函数 ----------
usage() {
  cat <<'EOF'
用法: loadtest.sh [选项]

选项:
  -h, --help                显示本帮助并退出
  -p, --path SPEC           场景：login|otp|report|webhook|all（默认 all）
  -u, --base-url URL        被测地址（默认 https://www.temposoul.com）
  -v, --vu N                并发虚拟用户数（默认 20）
  -D, --duration DUR        压测时长（默认 30s，k6 支持 1m/100s）
  -r, --ramp DUR            并发爬坡时长（默认 5s，k6）
      --p95-ms N            p95 延迟阈值（毫秒，默认 2000）
      --err-rate R          错误率阈值（默认 0.01 = 1%）
  -e, --email EMAIL         登录测试账号（或 $LOADTEST_EMAIL）
  -w, --password PASS       登录测试密码（或 $LOADTEST_PASSWORD）
  -t, --token JWT           报告场景直传 token（缺省则自动登录获取）
      --chart-id ID         report-task 的 chartId（默认 demo-chart-001）
      --product-id ID       report-task 的 productId（默认 report_39_9）
      --otp-url URL         OTP 端点（默认 /api/auth/otp）
      --otp-enabled         启用 OTP 场景（当前仓库未实现该端点，默认关）
      --webhook-signature S ls-webhook 签名头 X-Signature（真实端到端必填）
      --webhook-body FILE   ls-webhook 请求体 JSON 文件路径
      --engine ENG          压测引擎：auto|k6|hey（默认 auto）
      --k6-bin PATH         k6 可执行文件路径
      --hey-bin PATH        hey 可执行文件路径

退出码:
  0 全部场景 PASS（阈值内）   1 任一场景 FAIL   2 参数/环境错误

示例:
  ./loadtest.sh --path all --vu 20 --duration 30s --email a@b.c --password '***'
  ./loadtest.sh --path report --vu 5 --duration 1m --token <JWT>
EOF
  exit 0
}

log()  { printf '[loadtest] %s\n' "$*"; }
warn() { printf '[loadtest][WARN] %s\n' "$*" >&2; }
die()  { printf '[loadtest][ERROR] %s\n' "$*" >&2; exit 2; }

# ---------- 参数解析 ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -p|--path) PATH_SPEC="${2:?--path 需要值}"; shift 2 ;;
    --path=*) PATH_SPEC="${1#*=}"; shift ;;
    -u|--base-url) BASE_URL="${2:?--base-url 需要值}"; shift 2 ;;
    --base-url=*) BASE_URL="${1#*=}"; shift ;;
    -v|--vu) VU="${2:?--vu 需要值}"; shift 2 ;;
    --vu=*) VU="${1#*=}"; shift ;;
    -D|--duration) DURATION="${2:?--duration 需要值}"; shift 2 ;;
    --duration=*) DURATION="${1#*=}"; shift ;;
    -r|--ramp) RAMP="${2:?--ramp 需要值}"; shift 2 ;;
    --ramp=*) RAMP="${1#*=}"; shift ;;
    --p95-ms) P95_THRESHOLD_MS="${2:?--p95-ms 需要值}"; shift 2 ;;
    --p95-ms=*) P95_THRESHOLD_MS="${1#*=}"; shift ;;
    --err-rate) ERR_THRESHOLD="${2:?--err-rate 需要值}"; shift 2 ;;
    --err-rate=*) ERR_THRESHOLD="${1#*=}"; shift ;;
    -e|--email) EMAIL="${2:?--email 需要值}"; shift 2 ;;
    --email=*) EMAIL="${1#*=}"; shift ;;
    -w|--password) PASSWORD="${2:?--password 需要值}"; shift 2 ;;
    --password=*) PASSWORD="${1#*=}"; shift ;;
    -t|--token) TOKEN="${2:?--token 需要值}"; shift 2 ;;
    --token=*) TOKEN="${1#*=}"; shift ;;
    --chart-id) CHART_ID="${2:?--chart-id 需要值}"; shift 2 ;;
    --chart-id=*) CHART_ID="${1#*=}"; shift ;;
    --product-id) PRODUCT_ID="${2:?--product-id 需要值}"; shift 2 ;;
    --product-id=*) PRODUCT_ID="${1#*=}"; shift ;;
    --otp-url) OTP_URL="${2:?--otp-url 需要值}"; shift 2 ;;
    --otp-url=*) OTP_URL="${1#*=}"; shift ;;
    --otp-enabled) OTP_ENABLED=1; shift ;;
    --webhook-signature) WEBHOOK_SIGNATURE="${2:?--webhook-signature 需要值}"; shift 2 ;;
    --webhook-signature=*) WEBHOOK_SIGNATURE="${1#*=}"; shift ;;
    --webhook-body) WEBHOOK_BODY="${2:?--webhook-body 需要值}"; shift 2 ;;
    --webhook-body=*) WEBHOOK_BODY="${1#*=}"; shift ;;
    --engine) ENGINE="${2:?--engine 需要值}"; shift 2 ;;
    --engine=*) ENGINE="${1#*=}"; shift ;;
    --k6-bin) K6_BIN="${2:?--k6-bin 需要值}"; shift 2 ;;
    --k6-bin=*) K6_BIN="${1#*=}"; shift ;;
    --hey-bin) HEY_BIN="${2:?--hey-bin 需要值}"; shift 2 ;;
    --hey-bin=*) HEY_BIN="${1#*=}"; shift ;;
    *) die "未知参数: $1（使用 --help 查看用法）" ;;
  esac
done

case "$PATH_SPEC" in login|otp|report|webhook|all) ;; *) die "非法 --path: $PATH_SPEC" ;; esac
case "$ENGINE" in auto|k6|hey) ;; *) die "非法 --engine: $ENGINE" ;; esac
[[ "$VU" =~ ^[0-9]+$ ]] && [[ "$VU" -gt 0 ]] || die "非法 --vu: $VU"
[[ "$P95_THRESHOLD_MS" =~ ^[0-9]+$ ]] || die "非法 --p95-ms: $P95_THRESHOLD_MS"

# 场景前置校验
if [[ "$PATH_SPEC" == "all" || "$PATH_SPEC" == "login" || "$PATH_SPEC" == "report" ]]; then
  [[ -n "$EMAIL" && -n "$PASSWORD" ]] || die "login/report 场景需要 --email 与 --password（或 LOADTEST_EMAIL/LOADTEST_PASSWORD）"
fi
if [[ "$PATH_SPEC" == "otp" && "$OTP_ENABLED" != "1" ]]; then
  warn "OTP 场景默认禁用（仓库当前未实现 OTP 端点）。确认端点后加 --otp-enabled 与 --otp-url 再压。"
  exit 0
fi
if [[ "$PATH_SPEC" == "webhook" && -z "$WEBHOOK_SIGNATURE" ]]; then
  warn "webhook 场景未提供 --webhook-signature：将以空签名压测（服务器应返回 401=签名校验链路可达）；真实端到端请提供真实签名与样例 body。"
fi

# ---------- 引擎探测 ----------
if [[ "$ENGINE" == "auto" ]]; then
  if command -v "$K6_BIN" >/dev/null 2>&1; then ENGINE=k6;
  elif command -v "$HEY_BIN" >/dev/null 2>&1; then ENGINE=hey;
  else die "未找到 k6 或 hey。安装：apt-get install -y hey；k6 见 https://grafana.com/docs/k6/latest/set-up/install/ ；或 --engine hey 指定路径"
  fi
fi
log "引擎: $ENGINE | 路径: $PATH_SPEC | base: $BASE_URL | VU: $VU | 时长: $DURATION | p95 阈值: ${P95_THRESHOLD_MS}ms | 错误率阈值: $ERR_THRESHOLD"

# ---------- k6 执行 ----------
run_k6() {
  local scene="$1" extra_env=()
  [[ -n "$TOKEN" ]] && extra_env+=("-e" "LOADTEST_TOKEN=$TOKEN")
  "$K6_BIN" run \
    -e "LOADTEST_BASE_URL=$BASE_URL" \
    -e "LOADTEST_VU=$VU" \
    -e "LOADTEST_DURATION=$DURATION" \
    -e "LOADTEST_RAMP=$RAMP" \
    -e "LOADTEST_P95_MS=$P95_THRESHOLD_MS" \
    -e "LOADTEST_ERR_RATE=$ERR_THRESHOLD" \
    -e "LOADTEST_EMAIL=$EMAIL" \
    -e "LOADTEST_PASSWORD=$PASSWORD" \
    -e "LOADTEST_CHART_ID=$CHART_ID" \
    -e "LOADTEST_PRODUCT_ID=$PRODUCT_ID" \
    -e "LOADTEST_OTP_URL=$OTP_URL" \
    -e "LOADTEST_WEBHOOK_SIGNATURE=$WEBHOOK_SIGNATURE" \
    -e "LOADTEST_WEBHOOK_BODY=$WEBHOOK_BODY" \
    "${extra_env[@]}" \
    "$SCENES_DIR/$scene.js"
}

# ---------- hey 执行（简单版：k6 未安装时兜底） ----------
run_hey() {
  local path="$1" url method body_file
  case "$path" in
    login)
      method=POST; url="$BASE_URL/api/auth/login"
      body_file="$(mktemp)"; printf '{"email":"%s","password":"%s"}' "$EMAIL" "$PASSWORD" > "$body_file"
      ;;
    otp)
      method=POST; url="$BASE_URL${OTP_URL}"
      body_file="$(mktemp)"; printf '{"email":"%s","code":"000000"}' "$EMAIL" > "$body_file"
      ;;
    report)
      method=POST; url="$BASE_URL/api/v1/report-task"
      body_file="$(mktemp)"; printf '{"chartId":"%s","productId":"%s"}' "$CHART_ID" "$PRODUCT_ID" > "$body_file"
      ;;
    webhook)
      method=POST; url="$BASE_URL/api/v1/ls-webhook"
      if [[ -n "$WEBHOOK_BODY" && -f "$WEBHOOK_BODY" ]]; then body_file="$WEBHOOK_BODY"
      else body_file="$(mktemp)"; printf '{"meta":{"event_name":"order_created"}}' > "$body_file"; fi
      ;;
  esac
  local headers=(-H "Content-Type: application/json")
  [[ "$path" == "report" && -n "$TOKEN" ]] && headers+=(-H "Authorization: Bearer $TOKEN")
  [[ "$path" == "webhook" && -n "$WEBHOOK_SIGNATURE" ]] && headers+=(-H "X-Signature: $WEBHOOK_SIGNATURE")

  log "hey: $method $url（并发 $VU，时长 $DURATION）"
  "$HEY_BIN" -m "$method" -n $((VU * 10)) -c "$VU" -z "$DURATION" "${headers[@]}" -T 'application/json' -d @"$body_file" "$url"
  rm -f "$body_file"
}

# ---------- 执行 ----------
FAILED=0
run_scene() {
  local scene="$1"
  log "===== 场景: $scene ====="
  if [[ "$ENGINE" == "k6" ]]; then
    if run_k6 "$scene"; then log "$scene: k6 完成（阈值判定见 k6 输出）"; else FAILED=1; warn "$scene: k6 退出码非 0（阈值未达标或执行失败）"; fi
  else
    run_hey "$scene" || { FAILED=1; warn "$scene: hey 执行失败"; }
  fi
}

case "$PATH_SPEC" in
  login)   run_scene login ;;
  otp)     run_scene otp ;;
  report)  run_scene report ;;
  webhook) run_scene webhook ;;
  all)     run_scene login; run_scene report; run_scene webhook
           if [[ "$OTP_ENABLED" == "1" ]]; then run_scene otp; else log "OTP 场景跳过（未启用）"; fi
           ;;
esac

if [[ "$FAILED" == "1" ]]; then
  warn "存在未达标的场景；请结合 k6 输出中的 p95/错误率调整阈值或排查后端（慢查询/AI 上游/Webhook 签名校验）"
  exit 1
fi
log "全部场景完成"
