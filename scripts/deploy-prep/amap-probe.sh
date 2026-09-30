#!/usr/bin/env bash
# ============================================================================
# amap-probe.sh — G-12 高德 API 探活补遗脚本（香港 → 高德 API curl 探活 + 延迟测量）
#
# 用途：部署期判断「香港服务器能否直连高德 API、延迟是否可接受」，
#       据此决定首页 3D 楼块是否启用兜底（降级）策略。
#
# 探测目标（高德开放平台，需 Web 端 JS API Key，见
#   docs/2026-09-16_高德JSAPI_Key注册指引_temposoul.md）：
#   - webapi  : https://webapi.amap.com/maps?v=2.0&key=KEY （JS API 入口）
#   - restapi : https://restapi.amap.com/v3/geocode/geo?key=KEY&address=城市（Web 服务 API）
#
# 输出：逐次探测行 + 延迟统计（min/avg/p50/p95/max）+ 可达性结论。
# 特性：幂等（只读网络探活）、参数化、--help、默认值。
#
# 用法示例：
#   ./amap-probe.sh --key <KEY>
#   AMAP_KEY=<KEY> ./amap-probe.sh --endpoint all --probes 10
#   ./amap-probe.sh --key <KEY> --endpoint restapi --city 济南 --output probe.csv
# ============================================================================
set -euo pipefail

# ---------- 默认值 ----------
KEY="${AMAP_KEY:-}"
KEY_FILE="${AMAP_KEY_FILE:-}"
ENDPOINT="${AMAP_ENDPOINT:-all}"            # webapi|restapi|all
PROBES="${AMAP_PROBES:-10}"                 # 探测次数
INTERVAL="${AMAP_INTERVAL:-1}"              # 间隔秒
TIMEOUT="${AMAP_TIMEOUT:-5}"                # curl 超时秒
CITY="${AMAP_CITY:-济南}"                   # restapi geocode 测试城市
OUTPUT="${AMAP_OUTPUT:-}"                   # 输出 CSV 路径（可选）
TLS_VERIFY="${AMAP_TLS_VERIFY:-1}"          # 0=跳过 TLS 校验（不建议）
P95_TARGET_MS="${AMAP_P95_TARGET_MS:-1500}" # p95 阈值（毫秒），供结论判定

# ---------- 工具函数 ----------
usage() {
  cat <<'EOF'
用法: amap-probe.sh [选项]

选项:
  -h, --help                 显示本帮助并退出
  -k, --key KEY              高德 Web 端 JS API Key（或 $AMAP_KEY）
      --key-file PATH        从文件读取 Key（首行）
  -e, --endpoint SPEC        探测目标：webapi|restapi|all（默认 all）
  -n, --probes N             探测次数（默认 10）
  -i, --interval SEC         探测间隔秒（默认 1）
  -t, --timeout SEC          curl 超时秒（默认 5）
  -c, --city CITY            restapi 测试城市（默认 济南）
  -o, --output FILE          结果 CSV 输出路径（可选）
      --no-tls-verify        跳过 TLS 校验（不建议，仅排查网络时用）
      --p95-target-ms N      p95 结论阈值毫秒（默认 1500）

退出码:
  0 可达且 p95 达标   1 部分失败/不可达/p95 超标   2 参数错误

示例:
  ./amap-probe.sh --key xxxx
  AMAP_KEY=xxxx ./amap-probe.sh --endpoint restapi --probes 5
EOF
  exit 0
}

log()  { printf '[amap-probe] %s\n' "$*"; }
warn() { printf '[amap-probe][WARN] %s\n' "$*" >&2; }
die()  { printf '[amap-probe][ERROR] %s\n' "$*" >&2; exit 2; }

# 计算分位数（输入：换行分隔的数字；输出：p50/p95/max，awk 排序法）
percentiles() {
  local f="$1"
  sort -n "$f" | awk '
    { a[NR]=$1; sum+=$1 }
    END {
      if (NR == 0) { print "0 0 0 0"; exit }
      min=a[1]; max=a[NR]; avg=sum/NR;
      p50=a[int((NR+1)*0.50)]; p95=a[int((NR+1)*0.95)];
      if (int((NR+1)*0.50) < 1) p50=a[1];
      if (int((NR+1)*0.95) < 1) p95=a[1];
      printf "%d %d %.1f %d %d\n", min, p50, avg, p95, max
    }'
}

# ---------- 参数解析 ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -k|--key) KEY="${2:?--key 需要值}"; shift 2 ;;
    --key=*) KEY="${1#*=}"; shift ;;
    --key-file) KEY_FILE="${2:?--key-file 需要值}"; shift 2 ;;
    --key-file=*) KEY_FILE="${1#*=}"; shift ;;
    -e|--endpoint) ENDPOINT="${2:?--endpoint 需要值}"; shift 2 ;;
    --endpoint=*) ENDPOINT="${1#*=}"; shift ;;
    -n|--probes) PROBES="${2:?--probes 需要值}"; shift 2 ;;
    --probes=*) PROBES="${1#*=}"; shift ;;
    -i|--interval) INTERVAL="${2:?--interval 需要值}"; shift 2 ;;
    --interval=*) INTERVAL="${1#*=}"; shift ;;
    -t|--timeout) TIMEOUT="${2:?--timeout 需要值}"; shift 2 ;;
    --timeout=*) TIMEOUT="${1#*=}"; shift ;;
    -c|--city) CITY="${2:?--city 需要值}"; shift 2 ;;
    --city=*) CITY="${1#*=}"; shift ;;
    -o|--output) OUTPUT="${2:?--output 需要值}"; shift 2 ;;
    --output=*) OUTPUT="${1#*=}"; shift ;;
    --no-tls-verify) TLS_VERIFY=0; shift ;;
    --p95-target-ms) P95_TARGET_MS="${2:?--p95-target-ms 需要值}"; shift 2 ;;
    --p95-target-ms=*) P95_TARGET_MS="${1#*=}"; shift ;;
    *) die "未知参数: $1（使用 --help 查看用法）" ;;
  esac
done

[[ "$ENDPOINT" == "webapi" || "$ENDPOINT" == "restapi" || "$ENDPOINT" == "all" ]] || die "非法 --endpoint: $ENDPOINT"
[[ "$PROBES" =~ ^[0-9]+$ ]] && [[ "$PROBES" -gt 0 ]] || die "非法 --probes: $PROBES"

# Key 来源：--key > --key-file > $AMAP_KEY
if [[ -z "$KEY" && -n "$KEY_FILE" ]]; then
  [[ -f "$KEY_FILE" ]] || die "Key 文件不存在: $KEY_FILE"
  KEY="$(head -n 1 "$KEY_FILE" | tr -d '[:space:]')"
fi
[[ -n "$KEY" ]] || die "缺少 Key：--key <KEY> 或 --key-file <PATH> 或 AMAP_KEY 环境变量（Key 从高德开放平台控制台获取）"

command -v curl >/dev/null 2>&1 || die "curl 未安装"
command -v awk >/dev/null 2>&1 || die "awk 未安装"

TLS_ARGS=()
[[ "$TLS_VERIFY" == "0" ]] && TLS_ARGS+=(-k)

# 探测函数：curl 单次，输出 "code total_ms size_bytes"
probe_once() {
  local url="$1"
  curl -sS "${TLS_ARGS[@]}" --connect-timeout "$TIMEOUT" --max-time "$TIMEOUT" \
    -o /dev/null -w '%{http_code} %{time_total} %{size_download}\n' "$url" 2>/dev/null || echo "000 0 0"
}

# ---------- 主流程 ----------
log "Key: ${KEY:0:6}****（脱敏） | 端点: $ENDPOINT | 次数: $PROBES | 间隔: ${INTERVAL}s | 超时: ${TIMEOUT}s"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

[[ -n "$OUTPUT" ]] && printf 'endpoint,attempt,http_code,latency_ms,size_bytes\n' > "$OUTPUT"

overall_fail=0
overall_p95=0

run_probe() {
  local name="$1" url="$2" code rest ms size
  local lat_file="$TMP_DIR/${name}.lat"
  : > "$lat_file"
  local fail=0
  for ((i = 1; i <= PROBES; i++)); do
    read -r code rest <<< "$(probe_once "$url")"
    ms="$(awk -v t="$rest" 'BEGIN { printf "%d", t*1000 }')"
    size="$(awk -v b="$rest" 'BEGIN { printf "%d", b }')"
    printf '%s\n' "$ms" >> "$lat_file"
    printf '  %-8s #%-3d http=%-3s lat=%sms size=%sB\n' "$name" "$i" "$code" "$ms" "$size"
    if [[ -n "$OUTPUT" ]]; then
      printf '%s,%d,%s,%s,%s\n' "$name" "$i" "$code" "$ms" "$size" >> "$OUTPUT"
    fi
    [[ "$code" != "200" ]] && fail=1
    [[ $i -lt $PROBES ]] && sleep "$INTERVAL"
  done

  read -r min p50 avg p95 max <<< "$(percentiles "$lat_file")"
  log "===== $name 统计: min=${min}ms p50=${p50}ms avg=${avg}ms p95=${p95}ms max=${max}ms ====="
  if [[ "$fail" == "1" ]]; then
    warn "$name: 存在非 200 响应（网络不可达/Key 无效/接口变更）"
    overall_fail=1
  fi
  if (( p95 > P95_TARGET_MS )); then
    warn "$name: p95=${p95}ms 超过目标 ${P95_TARGET_MS}ms（建议评估兜底策略）"
    overall_fail=1
  fi
  (( p95 > overall_p95 )) && overall_p95=$p95
  # 业务可达性判定（restapi 返回业务 JSON 而非 JS/静态资源时检查 status）
  if [[ "$name" == "restapi" && "$fail" != "1" ]]; then
    local sample
    sample="$(curl -sS "${TLS_ARGS[@]}" --max-time "$TIMEOUT" "${url}&output=JSON" 2>/dev/null | head -c 300)"
    if [[ "$sample" == *'"status":"1"'* ]]; then
      log "restapi 业务判定: 高德返回 status=1（OK），业务可用"
    else
      warn "restapi 业务判定: 未返回 status=1（Key 权限/配额/接口变更），首页楼块需兜底"
      overall_fail=1
    fi
  fi
}

# 构造 URL（Key 含特殊字符时用 --data-urlencode 由 curl 处理）
webapi_url="https://webapi.amap.com/maps"
restapi_url="https://restapi.amap.com/v3/geocode/geo"
# 简单拼接（Key 通常为纯字母数字，风险低；若含特殊字符请改用 --data-urlencode）
webapi_url_full="$webapi_url?v=2.0&key=$KEY"
restapi_url_full="$restapi_url?key=$KEY&address=$(printf '%s' "$CITY" | tr ' ' '+')"

if [[ "$ENDPOINT" == "all" || "$ENDPOINT" == "webapi" ]]; then
  run_probe "webapi" "$webapi_url_full"
fi
if [[ "$ENDPOINT" == "all" || "$ENDPOINT" == "restapi" ]]; then
  run_probe "restapi" "$restapi_url_full"
fi

# ---------- 结论 ----------
if [[ "$overall_fail" == "1" ]]; then
  cat <<EOF

===== 探活结论：不建议直连 / 需兜底 =====
- 存在非 200 或 p95 超标或业务 status 异常。
- 部署期处置建议：
  1) 排查香港 → 高德网络（curl -v 看 TLS/路由；可对比大陆节点延迟）；
  2) 确认 Key 已在高德控制台配置白名单域名（www.temposoul.com）并完成实名；
  3) 首页 3D 楼块启用兜底（降级为静态楼块/隐藏图层），见首页渲染部署文档。
EOF
  exit 1
fi

cat <<EOF

===== 探活结论：可达，p95=${overall_p95}ms <= 目标 ${P95_TARGET_MS}ms =====
- 香港服务器可直连高德 API，无需强制兜底；建议部署后再跑一轮长时压测确认稳定。
- 补充建议：生产环境可将本脚本挂 cron 定时探活（输出落盘供监控）。
EOF
log "完成"
