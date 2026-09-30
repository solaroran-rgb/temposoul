// common.js — 四条热点路径压测公共配置（k6）
// 供 login/otp/report/webhook 场景共享：baseUrl、阈值、登录 helper。
// 所有参数经 __ENV 注入（loadtest.sh 自动传递，也可手动 k6 run -e KEY=V）。
//
// 阈值语义：
//   http_req_duration: p(95) < LOADTEST_P95_MS（默认 2000ms）
//   http_req_failed  : 错误率 < LOADTEST_ERR_RATE（默认 1%）
//   webhook 场景额外容忍 401（签名校验链路可达即视为处理完成，见 webhook.js）

import http from 'k6/http';
import { check } from 'k6';

export const baseUrl = (__ENV.LOADTEST_BASE_URL || 'https://www.temposoul.com').replace(/\/+$/, '');
export const p95Ms = Number(__ENV.LOADTEST_P95_MS || 2000);
export const errRate = Number(__ENV.LOADTEST_ERR_RATE || 0.01);
export const vu = Number(__ENV.LOADTEST_VU || 20);
export const duration = __ENV.LOADTEST_DURATION || '30s';
export const ramp = __ENV.LOADTEST_RAMP || '5s';

// 场景通用 options：先爬坡到目标并发，再保持时长
export function makeOptions(extraThresholds = {}) {
  return {
    scenarios: {
      main: {
        executor: 'ramping-vus',
        exec: 'default',
        startVUs: 1,
        stages: [
          { duration: ramp, target: vu },
          { duration, target: vu },
        ],
        gracefulStop: '10s',
      },
    },
    thresholds: {
      http_req_failed: [`rate<${errRate}`],
      http_req_duration: [`p(95)<${p95Ms}`],
      ...extraThresholds,
    },
  };
}

// 登录 helper：返回 {ok, token, status}
export function login(email, password, base) {
  const res = http.post(
    `${base}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  let token = '';
  if (res.status === 200) {
    try {
      token = res.json('token') || res.json('data.token') || '';
    } catch (_e) {
      token = '';
    }
  }
  const pass = check(res, {
    'login 200 且返回 token': (r) => r.status === 200 && !!token,
  });
  return { ok: pass, token, status: res.status };
}
