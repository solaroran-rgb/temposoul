// 积分赚取 API
//   POST /api/v1/points/earn  body { action }  → 签到/任务加积分并写流水
// 存储：内存骨架（见 _store.ts），TODO(待绑 KV)；TODO(待绑鉴权) 当前为固定单用户。

import { ACTIONS, ME, todayStr, genLedgerId } from './_store';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const method = context.request.method.toUpperCase();
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const body = await readJson(context.request);
  const action = typeof body.action === 'string' ? body.action.trim() : '';
  const rule = ACTIONS[action];
  if (!rule) {
    return json({ error: 'unknown_action', balance: ME.balance }, 400);
  }

  // 每日任务去重
  if (rule.period === 'daily' && ME.lastDaily[action] === todayStr()) {
    return json({ error: 'already_claimed', reason: 'daily', balance: ME.balance }, 409);
  }
  // 一次性任务去重
  if (rule.period === 'once' && ME.claimedOnce[action]) {
    return json({ error: 'already_claimed', reason: 'once', balance: ME.balance }, 409);
  }

  ME.balance += rule.credits;
  if (rule.period === 'daily') ME.lastDaily[action] = todayStr();
  if (rule.period === 'once') ME.claimedOnce[action] = true;

  const entry = {
    id: genLedgerId(),
    action,
    label: rule.label,
    credits: rule.credits,
    createdAt: new Date().toISOString(),
  };
  ME.ledger.push(entry);

  return json({ ok: true, action, credits: rule.credits, balance: ME.balance, entry });
}
