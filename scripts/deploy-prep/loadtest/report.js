// report.js — 热点路径③：报告生成 POST /api/v1/report-task
// 先登录拿 token（setup 阶段一次），再 POST {chartId, productId}，期望 202 异步受理。
// 也可通过 LOADTEST_TOKEN 直传 JWT 跳过登录。
import http from 'k6/http';
import { check } from 'k6';
import { baseUrl, makeOptions, p95Ms, errRate, login } from './common.js';

const email = __ENV.LOADTEST_EMAIL || 'loadtest@example.com';
const password = __ENV.LOADTEST_PASSWORD || 'change-me';
const chartId = __ENV.LOADTEST_CHART_ID || 'demo-chart-001';
const productId = __ENV.LOADTEST_PRODUCT_ID || 'report_39_9';

export const options = makeOptions({
  'http_req_duration': [`p(95)<${p95Ms}`],
  'http_req_failed': [`rate<${errRate}`],
});

export function setup() {
  const directToken = __ENV.LOADTEST_TOKEN || '';
  if (directToken) return { token: directToken };
  const r = login(email, password, baseUrl);
  if (!r.ok) throw new Error(`setup 登录失败: status=${r.status}`);
  return { token: r.token };
}

export default function (data) {
  const res = http.post(
    `${baseUrl}/api/v1/report-task`,
    JSON.stringify({ chartId, productId }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      },
    },
  );
  const pass = check(res, {
    'report-task 202 受理': (r) => r.status === 202,
    '返回任务 id': (r) => {
      try { return !!r.json('id'); } catch (_e) { return false; }
    },
  });
  if (!pass) {
    console.error(`report-task 失败: status=${res.status} body=${res.body.slice(0, 200)}`);
  }
}
