// login.js — 热点路径①：登录 POST /api/auth/login
// 请求体: {email, password}（LOAADTEST_EMAIL / LOADTEST_PASSWORD 注入）
// 期望: 200 + token 存在
import http from 'k6/http';
import { check } from 'k6';
import { baseUrl, makeOptions, p95Ms, errRate } from './common.js';

const email = __ENV.LOADTEST_EMAIL || 'loadtest@example.com';
const password = __ENV.LOADTEST_PASSWORD || 'change-me';

export const options = makeOptions({
  'http_req_duration': [`p(95)<${p95Ms}`],
  'http_req_failed': [`rate<${errRate}`],
});

export default function () {
  const res = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  const pass = check(res, {
    '登录 200 且返回 token': (r) => {
      if (r.status !== 200) return false;
      try {
        return !!(r.json('token') || r.json('data.token'));
      } catch (_e) {
        return false;
      }
    },
    '响应体为合法 JSON': (r) => {
      try { JSON.parse(r.body); return true; } catch (_e) { return false; }
    },
  });
  if (!pass) {
    console.error(`login 失败: status=${res.status} body=${res.body.slice(0, 200)}`);
  }
}
