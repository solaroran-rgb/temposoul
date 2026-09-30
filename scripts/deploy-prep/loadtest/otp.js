// otp.js — 热点路径②：OTP 校验（预留场景）
//
// ⚠️ 当前仓库未实现 OTP 端点（认证为邮箱+密码，见 functions/api/auth/[[path]].ts）。
//    本场景默认禁用：loadtest.sh 在未传 --otp-enabled 时直接跳过。
//    上线 OTP 后：--otp-url 指定端点、--otp-enabled 启用，并按实际请求体调整本文件。
//
// 请求体（按需修改）: {email, code} — 默认演示格式
import http from 'k6/http';
import { check } from 'k6';
import { baseUrl, makeOptions, p95Ms, errRate } from './common.js';

const email = __ENV.LOADTEST_EMAIL || 'loadtest@example.com';
const otpUrl = __ENV.LOADTEST_OTP_URL || '/api/auth/otp';
const code = __ENV.LOADTEST_OTP_CODE || '000000';

export const options = makeOptions({
  'http_req_duration': [`p(95)<${p95Ms}`],
  'http_req_failed': [`rate<${errRate}`],
});

export default function () {
  const res = http.post(
    `${baseUrl}${otpUrl}`,
    JSON.stringify({ email, code }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  const pass = check(res, {
    'OTP 请求返回 2xx': (r) => r.status >= 200 && r.status < 300,
  });
  if (!pass) {
    console.error(`otp 失败: status=${res.status} body=${res.body.slice(0, 200)}`);
  }
}
