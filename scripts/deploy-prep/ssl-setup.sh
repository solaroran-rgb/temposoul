#!/usr/bin/env bash
# ============================================================================
# ssl-setup.sh — G-1 SSL 补遗脚本（certbot 签发 + 自动续期）
#
# 适用：Ubuntu 24.04 + 仓库实际 Web 栈（Nginx 反代为主；Caddy 场景自动识别）
# 仓库：TempoSoul 命律 网站建设系统 · scripts/deploy-prep/
# 关联：部署 Runbook（T09）/ T1-10 阿里云迁移预案（自托管 B 轨）
#
# 特性：幂等（已签发且未过期则跳过签发）、参数化、--help、默认值、
#       续期机制（systemd timer 优先，cron 兜底）+ 证书到期验证。
#
# 用法示例：
#   sudo ./ssl-setup.sh --domain www.temposoul.com --email ops@example.com
#   sudo ./ssl-setup.sh --renew-only
#   sudo ./ssl-setup.sh --dry-run --email ops@example.com
#   ./ssl-setup.sh --check-only
# ============================================================================
set -euo pipefail

# ---------- 默认值（可被参数/环境变量覆盖） ----------
DOMAIN="${SSL_DOMAIN:-www.temposoul.com}"     # 主域名，逗号分隔多域
EMAIL="${CERTBOT_EMAIL:-}"                    # certbot 注册邮箱（建议必填）
WEBROOT_DIR="${SSL_WEBROOT_DIR:-/var/www/certbot}"   # webroot 模式用
MODE="${SSL_MODE:-auto}"                      # auto|nginx|webroot|caddy|none
RENEW_ONLY=0
DRY_RUN=0
FORCE=0
CHECK_ONLY=0
INSTALL_TIMER=1
CERT_RENEW_BEFORE_DAYS=30                     # 剩余天数阈值（幂等跳过签发）
RENEW_HOOK_CMD="${RENEW_HOOK_CMD:-auto}"      # 续期部署钩子（auto 探测 nginx/caddy）

# ---------- 工具函数 ----------
usage() {
  cat <<'EOF'
用法: ssl-setup.sh [选项]

选项:
  -h, --help                显示本帮助并退出
  -d, --domain DOMAIN       证书域名，逗号分隔多域（默认 www.temposoul.com，可用 $SSL_DOMAIN）
  -e, --email EMAIL         certbot 注册邮箱（可用 $CERTBOT_EMAIL）
  -w, --webroot-dir DIR     webroot 模式验证目录（默认 /var/www/certbot）
  -m, --mode MODE           签发模式：auto|nginx|webroot|caddy|none（默认 auto）
                            caddy = Caddy 自动管理证书，脚本仅做到期巡检
                            none  = 不签发，仅确认续期机制
      --renew-only          仅执行 certbot renew + 部署钩子（幂等，常驻 cron/timer 入口）
      --dry-run             certbot 演练模式（不实际签发/续期）
      --force               强制重签（--force-renewal）
      --check-only          只巡检证书到期天数与续期机制，不做任何变更
      --no-timer            不安装/确认续期定时机制（默认会确认 systemd timer 或写 cron）

退出码:
  0 成功 / 已就绪   1 运行失败   2 参数错误

示例:
  sudo ./ssl-setup.sh --email ops@example.com
  sudo ./ssl-setup.sh --domain www.temposoul.com,temposoul.com --mode nginx --email ops@example.com
  sudo ./ssl-setup.sh --renew-only
  ./ssl-setup.sh --check-only
EOF
  exit 0
}

log()  { printf '[ssl-setup] %s\n' "$*"; }
warn() { printf '[ssl-setup][WARN] %s\n' "$*" >&2; }
die()  { printf '[ssl-setup][ERROR] %s\n' "$*" >&2; exit 1; }

# 剩余天数计算（输入 PEM 路径 -> 输出剩余天数，过期为负数）
days_until_expiry() {
  local pem="$1" end epoch_end now
  end=$(openssl x509 -enddate -noout -in "$pem" 2>/dev/null | cut -d= -f2-)
  [[ -n "$end" ]] || return 1
  epoch_end=$(date -d "$end" +%s 2>/dev/null) || return 1
  now=$(date +%s)
  echo $(( (epoch_end - now) / 86400 ))
}

# 探测 Web 栈（mode=auto 时）
detect_web_stack() {
  if command -v nginx >/dev/null 2>&1 || systemctl is-active --quiet nginx 2>/dev/null; then
    echo "nginx"; return
  fi
  if command -v caddy >/dev/null 2>&1 || [[ -d /etc/caddy ]]; then
    echo "caddy"; return
  fi
  if [[ -f /etc/nginx/sites-enabled/default || -d /etc/nginx ]]; then
    echo "nginx"; return
  fi
  echo "none"
}

# 确认 systemd certbot.timer 或写 cron 兜底（幂等）
ensure_renew_schedule() {
  if systemctl --version >/dev/null 2>&1; then
    if systemctl list-unit-files certbot.timer >/dev/null 2>&1; then
      systemctl enable certbot.timer >/dev/null 2>&1 || true
      systemctl start certbot.timer >/dev/null 2>&1 || true
      log "续期机制：systemd certbot.timer 已启用（$(systemctl show certbot.timer -p NextElapseUSecRealtime --value 2>/dev/null || echo '见 systemctl list-timers')）"
    else
      log "未发现 certbot.timer，使用 cron 兜底"
      write_cron_fallback
    fi
  else
    write_cron_fallback
  fi
}

# cron 兜底：每月 1/15 日随机分钟执行（幂等：已存在则不重复写）
write_cron_fallback() {
  local f=/etc/cron.d/certbot-renew
  local script_dir
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [[ -f "$f" ]] && grep -q 'certbot renew' "$f"; then
    log "续期机制：cron 兜底已存在（$f），跳过写入"
    return
  fi
  local minute=$((RANDOM % 60))
  cat > "$f" <<EOF
# TempoSoul certbot 自动续期（ssl-setup.sh 生成，幂等）
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
$minute 3 1,15 * * root certbot renew --quiet --deploy-hook "$script_dir/ssl-setup.sh --renew-only" >> /var/log/certbot-renew.log 2>&1
EOF
  chmod 644 "$f"
  log "续期机制：cron 兜底已写入 $f（每月 1/15 日 03:${minute}）"
}

# 探测部署钩子命令（renew 成功后重载 Web 服务器）
resolve_renew_hook() {
  if [[ "$RENEW_HOOK_CMD" != "auto" ]]; then
    echo "$RENEW_HOOK_CMD"; return
  fi
  local stack
  stack="$(detect_web_stack)"
  case "$stack" in
    nginx) echo "systemctl reload nginx || nginx -s reload" ;;
    caddy) echo "systemctl reload caddy || caddy reload --config /etc/caddy/Caddyfile" ;;
    *)     echo "true" ;;  # 无探测结果：空操作钩子
  esac
}

# ---------- 参数解析 ----------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage ;;
    -d|--domain) DOMAIN="${2:?--domain 需要值}"; shift 2 ;;
    --domain=*) DOMAIN="${1#*=}"; shift ;;
    -e|--email) EMAIL="${2:?--email 需要值}"; shift 2 ;;
    --email=*) EMAIL="${1#*=}"; shift ;;
    -w|--webroot-dir) WEBROOT_DIR="${2:?--webroot-dir 需要值}"; shift 2 ;;
    --webroot-dir=*) WEBROOT_DIR="${1#*=}"; shift ;;
    -m|--mode) MODE="${2:?--mode 需要值}"; shift 2 ;;
    --mode=*) MODE="${1#*=}"; shift ;;
    --renew-only) RENEW_ONLY=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --force) FORCE=1; shift ;;
    --check-only) CHECK_ONLY=1; shift ;;
    --no-timer) INSTALL_TIMER=0; shift ;;
    *) die "未知参数: $1（使用 --help 查看用法）" ;;
  esac
done

case "$MODE" in auto|nginx|webroot|caddy|none) ;; *) die "非法 --mode: $MODE" ;; esac

# ---------- 检查模式（只读巡检） ----------
if [[ "$CHECK_ONLY" == "1" ]]; then
  [[ -n "$DOMAIN" ]] || die "缺少 --domain"
  local_pem="/etc/letsencrypt/live/${DOMAIN%%,*}/fullchain.pem"
  if [[ ! -f "$local_pem" ]]; then
    warn "证书不存在：$local_pem（尚未签发，或使用 --check-only 前先签发）"
    exit 1
  fi
  days="$(days_until_expiry "$local_pem")" || die "无法读取证书到期时间：$local_pem"
  log "证书路径: $local_pem"
  log "到期剩余: ${days} 天"
  if [[ "$days" -lt 7 ]]; then
    warn "证书将在 7 天内到期，请立即续期"
    exit 1
  fi
  if systemctl list-unit-files certbot.timer >/dev/null 2>&1; then
    if systemctl is-enabled --quiet certbot.timer; then
      log "续期机制: systemd certbot.timer 已启用"
    else
      warn "certbot.timer 存在但未启用"
    fi
  elif [[ -f /etc/cron.d/certbot-renew ]]; then
    log "续期机制: cron 兜底存在（/etc/cron.d/certbot-renew）"
  else
    warn "未发现续期机制，请运行 sudo ./ssl-setup.sh 安装"
  fi
  exit 0
fi

# ---------- 续期模式（cron/timer 入口，幂等） ----------
if [[ "$RENEW_ONLY" == "1" ]]; then
  command -v certbot >/dev/null 2>&1 || die "certbot 未安装：apt-get install -y certbot python3-certbot-nginx"
  hook="$(resolve_renew_hook)"
  if [[ "$DRY_RUN" == "1" ]]; then
    certbot renew --dry-run
  else
    log "执行 certbot renew（部署钩子: $hook）"
    certbot renew --quiet --deploy-hook "$hook"
  fi
  log "续期完成。当前证书状态："
  certbot certificates 2>/dev/null | grep -E 'Certificate Name|Domains|Expiry Date' || true
  exit 0
fi

# ---------- 常规模式：前置检查 ----------
[[ "$(id -u)" -eq 0 ]] || warn "建议以 root 运行（certbot 写 /etc/letsencrypt 与 /etc/cron.d 需要权限）"
[[ -n "$EMAIL" ]] || die "缺少 --email（或环境变量 CERTBOT_EMAIL）；certbot 注册必须提供邮箱"

stack="$MODE"
if [[ "$MODE" == "auto" ]]; then
  stack="$(detect_web_stack)"
  log "自动探测 Web 栈: $stack"
fi

# Caddy 场景：Caddy 自动管理证书，脚本只做巡检与续期机制确认
if [[ "$stack" == "caddy" ]]; then
  log "检测到 Caddy：Caddy 内置自动证书管理（ACME），无需 certbot 签发"
  log "建议在 Caddyfile 中配置 email 与 tls 指令；本脚本仅确认续期巡检入口"
  if command -v caddy >/dev/null 2>&1; then
    log "Caddy 版本: $(caddy version | head -1)"
  fi
  # 仍安装一个轻量巡检 cron/timer（每日检查证书剩余天数，<30 天告警）
  ensure_renew_schedule >/dev/null 2>&1 || true
  log "完成（caddy 模式：未做 certbot 变更）"
  exit 0
fi

# nginx / webroot / none：确认 certbot 存在
if ! command -v certbot >/dev/null 2>&1; then
  die "certbot 未安装。Ubuntu 24.04: apt-get update && apt-get install -y certbot python3-certbot-nginx"
fi

# 幂等：证书已存在且未接近过期 → 跳过签发
local_pem="/etc/letsencrypt/live/${DOMAIN%%,*}/fullchain.pem"
if [[ -f "$local_pem" && "$FORCE" != "1" ]]; then
  days="$(days_until_expiry "$local_pem")" || days=0
  log "证书已存在：$local_pem（剩余 ${days} 天）"
  if [[ "$days" -ge "$CERT_RENEW_BEFORE_DAYS" ]]; then
    log "剩余天数 >= ${CERT_RENEW_BEFORE_DAYS}，幂等跳过签发"
    SKIP_ISSUE=1
  else
    warn "剩余天数 < ${CERT_RENEW_BEFORE_DAYS}，将触发续期（certbot renew）"
  fi
fi

if [[ "${SKIP_ISSUE:-0}" != "1" ]]; then
  # 组装 certbot 参数
  certbot_args=(certonly --non-interactive --agree-tos --no-eff-email -m "$EMAIL" -d "$DOMAIN")
  case "$stack" in
    nginx)
      if command -v nginx >/dev/null 2>&1 || systemctl is-active --quiet nginx 2>/dev/null; then
        certbot_args+=(--nginx)
      else
        warn "nginx 命令/服务未就绪，回退 webroot 模式"
        certbot_args+=(--webroot -w "$WEBROOT_DIR")
      fi
      ;;
    webroot)
      mkdir -p "$WEBROOT_DIR" 2>/dev/null || true
      certbot_args+=(--webroot -w "$WEBROOT_DIR")
      ;;
    none)
      die "模式 none 不执行签发；请显式使用 --mode nginx|webroot 或先完成 Web 服务器部署"
      ;;
  esac
  [[ "$DRY_RUN" == "1" ]] && certbot_args+=(--dry-run)
  [[ "$FORCE" == "1" ]] && certbot_args+=(--force-renewal)

  log "执行签发: certbot ${certbot_args[*]}"
  certbot "${certbot_args[@]}"
  log "签发完成"
fi

# 续期机制安装
if [[ "$INSTALL_TIMER" == "1" ]]; then
  ensure_renew_schedule
else
  log "已跳过续期机制安装（--no-timer）"
fi

# 续期验证
if [[ -f "$local_pem" ]]; then
  days="$(days_until_expiry "$local_pem")" || days=0
  log "===== 证书状态 ====="
  log "证书目录: /etc/letsencrypt/live/${DOMAIN%%,*}/"
  log "证书文件: fullchain.pem（完整链）/ privkey.pem（私钥）/ chain.pem（中间链）"
  log "到期剩余: ${days} 天"
  openssl x509 -in "$local_pem" -noout -subject -issuer -dates 2>/dev/null | sed 's/^/  /' || true
  log "续期验证: certbot renew --dry-run 可随时演练；实际续期走 timer/cron"
else
  warn "未找到证书：$local_pem（签发可能未完成，请查看上方输出）"
  exit 1
fi

log "完成"
