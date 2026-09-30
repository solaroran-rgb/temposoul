// webhook.js — 热点路径④：支付回调 POST /api/v1/ls-webhook（LemonSqueezy）
//
// 签名：X-Signature 头（LOADTEST_WEBHOOK_SIGNATURE）。
// 判定语义：
//   - 200/202 = 有效回调被接受（真实端到端，需真实签名 + 真实事件样例 body）
//   - 401     = 签名校验被正确执行（链路可达、处理器在线）—— 视为 PASS
//   - 其他    = FAIL
// 默认（未提供签名）以空签名压测，验证的是「回调链路可达 + 签名校验生效」。
import http from 'k6/http';
import { check } from 'k6';
import { baseUrl, makeOptions, p95Ms, errRate } from './common.js';

const signature = __ENV.LOADTEST_WEBHOOK_SIGNATURE || '';
const bodyPath = __ENV.LOADTEST_WEBHOOK_BODY || '';

export const options = makeOptions({
  'http_req_duration': [`p(95)<${p95Ms}`],
  'http_req_failed': [`rate<${errRate}`],
});

function sampleBody() {
  // 最小 order_created 样例（非真实事件；仅用于链路/性能验证）
  return JSON.stringify({
    meta: { event_name: 'order_created', custom_data: { user_id: 'demo' } },
    data: {
      id: 'demo-order',
      type: 'orders',
      attributes: { status: 'paid', total: 100 },
    },
  });
}

export default function () {
  let payload;
  try {
    payload = bodyPath ? open(bodyPath) : sampleBody();
  } catch (e) {
    console.error(`无法读取 webhook body 文件: ${bodyPath} (${e})`);
    return;
  }
  const headers = { 'Content-Type': 'application/json' };
  if (signature) headers['X-Signature'] = signature;

  const res = http.post(`${baseUrl}/api/v1/ls-webhook`, payload, { headers });
  const pass = check(res, {
    '回调被接受(200/202) 或签名校验链路可达(401)': (r) =>
      r.status === 200 || r.status === 202 || r.status === 401,
  });
  if (!pass) {
    console.error(`webhook 失败: status=${res.status} body=${res.body.slice(0, 200)}`);
  }
}
