# -*- coding: utf-8 -*-
"""
probe_vector_stack.py —— 向量栈（8899 embed 引擎 / 8877 kb_service）探活 + 8877 自愈守护。

解决的问题（2026-09-30 故障模式）
    8899 宕机 → 8877 向量写入失败（30888 条）；8899 自愈后 8877 进程仍在、/health 仍 200，
    但 embed.healthy 连续 false 且卡死不恢复 → 现有 kb_8877_watchdog（只看 /health 200）
    判定 "OK nothing to do"，最终靠人工回填恢复。本脚本把「人工介入」固化为自动规则。

判定规则
    1) 8877 /health 不可达                     → 计一次异常，满 N 次 → 重启 8877
    2) 8899 存活 且 8877 embed.healthy=false   → 计一次异常，满 N 次 → 重启 8877
    3) 8899 不存活                             → 冻结计数（重启 8877 无效，交给 8899 看门狗）
    4) 8877 健康                               → 计数清零，无副作用

幂等与安全
    - 单实例锁（lock 文件 + 存活 PID 校验），防并发重入
    - 重启前先查端口占用：端口无监听才 spawn（与 UPM / KB8877Watchdog 并存不会重复拉起）
    - 冷却期（默认 900s）+ 每小时上限（默认 3 次）防重启风暴
    - 重启后等待 /health 200（最长 150s）；仍不健康 → 升级告警（日志 + ALERT_WEBHOOK）

用法
    python probe_vector_stack.py                # 正常巡检（由计划任务每 2 分钟调用）
    python probe_vector_stack.py --selftest     # 只探测并打印判定，不动作
    python probe_vector_stack.py --dry-run      # 走完整流程但不真重启（演练）
    python probe_vector_stack.py --force-stuck  # 演练：强制认为 embed 卡死（验收模拟用）
    python probe_vector_stack.py --n 1          # 覆盖连续异常阈值
    python probe_vector_stack.py --loop --interval 120   # 常驻循环（无计划任务权限时的托管方式）

环境变量（可选）
    KB_GUARD_N              连续异常阈值，默认 3
    KB_GUARD_COOLDOWN_S     两次重启最小间隔，默认 900
    KB_GUARD_MAX_PER_HOUR   每小时重启上限，默认 3
    KB_GUARD_WAIT_S         重启后健康等待上限，默认 150
    ALERT_WEBHOOK           告警 webhook（POST JSON）；未设置则只落日志

依赖：仅标准库（netstat/taskkill 用于定位并终止 8877 监听进程）。
"""
import argparse
import datetime
import json
import os
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request

# ----------------------------- 配置 -----------------------------
HERE = os.path.dirname(os.path.abspath(__file__))

KB_HOST = "127.0.0.1"
PORT_8899 = 8899
PORT_8877 = 8877

PYW = r"C:\Users\oran\AppData\Local\Programs\Python\Python312\pythonw.exe"
MAIN = r"E:\KnowledgeOS\kb_service\kb_service\main.py"
CWD = r"E:\KnowledgeOS\kb_service"
SPAWN_LOG = r"E:\KnowledgeOS\logs\kb8877_embed_guard_spawn.log"

LOG_PATH = os.path.join(HERE, "_8877_embed_guard.log")
STATE_PATH = os.path.join(HERE, "_8877_embed_guard_state.json")
LOCK_PATH = os.path.join(HERE, "_8877_embed_guard.lock")
ALERT_PATH = os.path.join(HERE, "_8877_embed_guard.alert")

CREATE_NO_WINDOW = 0x08000000
LOCK_STALE_S = 600
LOG_MAX_BYTES = 2 * 1024 * 1024

_opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))  # 禁代理：本机 HTTPS_PROXY 会劫持 127.0.0.1


def cfg_int(name, default):
    try:
        return int(os.environ.get(name, default))
    except Exception:
        return default


N = cfg_int("KB_GUARD_N", 3)
COOLDOWN_S = cfg_int("KB_GUARD_COOLDOWN_S", 900)
MAX_PER_HOUR = cfg_int("KB_GUARD_MAX_PER_HOUR", 3)
WAIT_S = cfg_int("KB_GUARD_WAIT_S", 150)
WEBHOOK = os.environ.get("ALERT_WEBHOOK", "").strip()


# ----------------------------- 基础工具 -----------------------------
def log(msg):
    line = f"[{datetime.datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    try:
        if os.path.exists(LOG_PATH) and os.path.getsize(LOG_PATH) > LOG_MAX_BYTES:
            os.replace(LOG_PATH, LOG_PATH + ".1")
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass
    print(line, flush=True)


def http_json(url, timeout=4):
    try:
        with _opener.open(url, timeout=timeout) as r:
            if r.status != 200:
                return None
            return json.loads(r.read().decode("utf-8", "replace"))
    except Exception:
        return None


def port_up(port, timeout=2):
    s = socket.socket()
    s.settimeout(timeout)
    try:
        s.connect((KB_HOST, port))
        return True
    except Exception:
        return False
    finally:
        s.close()


def pid_on_port(port):
    """返回监听该端口的 PID 列表（netstat 解析，零依赖）。"""
    pids = []
    try:
        out = subprocess.run(
            ["netstat", "-ano", "-p", "TCP"],
            capture_output=True, creationflags=CREATE_NO_WINDOW, timeout=10,
        ).stdout.decode("utf-8", "replace")
    except Exception as e:
        log(f"netstat 失败: {e}")
        return pids
    needle = f":{port} "
    for ln in out.splitlines():
        if "LISTENING" not in ln.upper() or needle not in ln:
            continue
        parts = ln.split()
        try:
            pid = int(parts[-1])
        except Exception:
            continue
        if pid and pid not in pids:
            pids.append(pid)
    return pids


def load_state():
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            s = json.load(f)
        if isinstance(s, dict):
            s.setdefault("strikes", 0)
            s.setdefault("restarts", [])
            return s
    except Exception:
        pass
    return {"strikes": 0, "restarts": []}


def save_state(s):
    tmp = STATE_PATH + ".tmp"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(s, f, ensure_ascii=False)
        os.replace(tmp, STATE_PATH)
    except Exception as e:
        log(f"state 写入失败: {e}")


def acquire_lock():
    """单实例锁；锁文件陈旧（>600s 或 PID 已死）则抢占。"""
    if os.path.exists(LOCK_PATH):
        try:
            age = time.time() - os.path.getmtime(LOCK_PATH)
            with open(LOCK_PATH, "r", encoding="utf-8") as f:
                pid = int((f.read().strip() or "0").split("|")[0])
            alive = False
            if pid:
                try:
                    out = subprocess.run(["tasklist", "/FI", f"PID eq {pid}"],
                                         capture_output=True, creationflags=CREATE_NO_WINDOW,
                                         timeout=10).stdout.decode("utf-8", "replace")
                    alive = str(pid) in out
                except Exception:
                    alive = True
            if age < LOCK_STALE_S and alive:
                return False
        except Exception:
            pass
    try:
        with open(LOCK_PATH, "w", encoding="utf-8") as f:
            f.write(f"{os.getpid()}|{time.time()}")
    except Exception as e:
        log(f"lock 写入失败: {e}")
    return True


def release_lock():
    try:
        os.remove(LOCK_PATH)
    except Exception:
        pass


def alert(msg):
    log(f"ESCALATE {msg}")
    try:
        with open(ALERT_PATH, "a", encoding="utf-8") as f:
            f.write(f"[{datetime.datetime.now():%Y-%m-%d %H:%M:%S}] {msg}\n")
    except Exception:
        pass
    if not WEBHOOK:
        return
    try:
        body = json.dumps({"text": f"[向量栈守护] {msg}"}).encode("utf-8")
        req = urllib.request.Request(WEBHOOK, data=body,
                                     headers={"Content-Type": "application/json"})
        _opener.open(req, timeout=6).close()
        log("webhook 告警已发送")
    except Exception as e:
        log(f"webhook 告警失败: {e}")


# ----------------------------- 探测 -----------------------------
def probe_8899():
    """8899 存活判据：TCP 可连 + /health 返回 status=ok。"""
    if not port_up(PORT_8899):
        return False, "port closed"
    j = http_json(f"http://{KB_HOST}:{PORT_8899}/health", timeout=4)
    if j is None:
        return False, "/health no response"
    ok = str(j.get("status", "")).lower() == "ok"
    return ok, f"/health={j}"


def probe_8877():
    """返回 (reachable, embed_healthy, detail)。"""
    j = http_json(f"http://{KB_HOST}:{PORT_8877}/health", timeout=5)
    if j is None:
        return False, False, "unreachable"
    emb = j.get("embed") or {}
    healthy = bool(emb.get("healthy", False))
    detail = (f"embed.healthy={healthy} consecutive_timeouts={emb.get('consecutive_timeouts')} "
              f"scan_paused={emb.get('scan_paused')} corpus={(j.get('counts') or {}).get('corpus')}")
    return True, healthy, detail


# ----------------------------- 自愈 -----------------------------
def stop_8877():
    pids = pid_on_port(PORT_8877)
    if not pids:
        log("stop: 8877 无监听进程，跳过终止")
        return True
    killed = True
    for pid in pids:
        try:
            subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"],
                           capture_output=True, creationflags=CREATE_NO_WINDOW, timeout=20)
            log(f"stop: taskkill /T /F pid={pid}")
        except Exception as e:
            killed = False
            log(f"stop: pid={pid} 终止失败 {e}")
    deadline = time.time() + 30
    while time.time() < deadline:
        if not pid_on_port(PORT_8877):
            return killed
        time.sleep(1)
    log("stop: 30s 后端口仍被占用")
    return False


def start_8877():
    if pid_on_port(PORT_8877):
        log("start: 端口已有监听，放弃 spawn（防重复拉起）")
        return False
    os.makedirs(os.path.dirname(SPAWN_LOG), exist_ok=True)
    env = dict(os.environ)
    env["KB_NOISE_FILTER"] = "drop"
    try:
        with open(SPAWN_LOG, "ab") as lf:
            subprocess.Popen([PYW, MAIN], cwd=CWD, env=env, stdout=lf, stderr=subprocess.STDOUT,
                             creationflags=CREATE_NO_WINDOW, close_fds=True)
        log(f"start: spawn pythonw {MAIN} (cwd={CWD})")
        return True
    except Exception as e:
        log(f"start: spawn 失败 {e}")
        return False


def wait_healthy():
    deadline = time.time() + WAIT_S
    while time.time() < deadline:
        if port_up(PORT_8877):
            ok, healthy, detail = probe_8877()
            if ok:
                log(f"health: 8877 已恢复（{detail}）")
                return True, healthy
        time.sleep(3)
    return False, False


def restart_8877(state, reason):
    now = time.time()
    if state["restarts"]:
        last = state["restarts"][-1]
        if now - last < COOLDOWN_S:
            log(f"skip restart: 冷却期内（距上次 {int(now - last)}s < {COOLDOWN_S}s），原因={reason}")
            return False
    recent = [t for t in state["restarts"] if now - t < 3600]
    if len(recent) >= MAX_PER_HOUR:
        alert(f"8877 重启次数已达上限（{len(recent)}/{MAX_PER_HOUR} 每小时），停止自愈；原因={reason}")
        return False

    log(f"RESTART 8877 —— 原因：{reason}")
    stop_8877()
    if not start_8877():
        return False
    ok, healthy = wait_healthy()
    state["restarts"] = recent + [now]
    state["strikes"] = 0
    save_state(state)
    if not ok:
        alert(f"8877 重启后 {WAIT_S}s 内未恢复健康，需人工介入；原因={reason}")
        return False
    if not healthy:
        alert(f"8877 重启后进程已起但 embed.healthy 仍为 false，需人工介入；原因={reason}")
        return False
    log("RESTART 8877 —— 完成，embed 已恢复健康")
    return True


# ----------------------------- 主流程 -----------------------------
def run_cycle(args):
    global N
    if args.n:
        N = args.n

    up8899, d8899 = probe_8899()
    ok8877, emb_ok, d8877 = probe_8877()
    log(f"probe: 8899={up8899} ({d8899}) | 8877 reachable={ok8877} ({d8877})")

    if args.selftest:
        print(f"selftest: 8899_up={up8899} 8877_up={ok8877} embed_healthy={emb_ok} "
              f"N={N} dry_run={args.dry_run} force_stuck={args.force_stuck}")
        return 0

    if args.force_stuck:
        emb_ok = False
        log("force-stuck: 演练模式，强制 embed_healthy=false")

    # 判定
    if not ok8877:
        reason, strike = "8877 /health 不可达", True
    elif not up8899:
        reason, strike = "8899 未存活 → 冻结计数（重启 8877 无效，交给 8899 看门狗）", False
    elif not emb_ok:
        reason, strike = "8877 embed.healthy=false（embed 卡死）", True
    else:
        reason, strike = "健康", False

    state = load_state()
    if not strike:
        if state.get("strikes"):
            log(f"OK：异常计数清零（原 {state['strikes']}）—— {reason}")
        else:
            log(f"OK：{reason}")
        state["strikes"] = 0
        save_state(state)
        return 0

    state["strikes"] = int(state.get("strikes", 0)) + 1
    save_state(state)
    log(f"STRIKE {state['strikes']}/{N} —— {reason}")

    if state["strikes"] < N:
        return 0

    if args.dry_run:
        log(f"DRY-RUN：满足重启条件（{reason}），本次不动作")
        return 0

    if not acquire_lock():
        log("skip: 已有守护实例在运行（单实例锁）")
        return 0
    try:
        restart_8877(state, reason)
    finally:
        release_lock()
    return 0


def main():
    ap = argparse.ArgumentParser(description="8899/8877 向量栈探活 + 8877 embed 卡死自愈")
    ap.add_argument("--selftest", action="store_true", help="只探测并打印判定，不动作")
    ap.add_argument("--dry-run", action="store_true", help="走完整流程但不真重启")
    ap.add_argument("--force-stuck", action="store_true", help="演练：强制视作 embed 卡死")
    ap.add_argument("--n", type=int, default=None, help="覆盖连续异常阈值 N")
    ap.add_argument("--loop", action="store_true", help="常驻循环（每 --interval 秒探测一次）")
    ap.add_argument("--interval", type=int, default=120, help="--loop 探测间隔秒数，默认 120")
    args = ap.parse_args()

    if not args.loop:
        return run_cycle(args)

    log(f"loop: 启动常驻守护，间隔 {args.interval}s，N={args.n or N}")
    while True:
        try:
            run_cycle(args)
        except Exception as e:
            log(f"loop: 本轮异常 {e}")
        time.sleep(max(30, args.interval))
    return 0


if __name__ == "__main__":
    sys.exit(main())
