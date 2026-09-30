// 积分查询 API
//   GET /api/v1/points/me  → { userId, balance, ledger }
// 存储：内存骨架（见 _store.ts），TODO(待绑 KV)；TODO(待绑鉴权) 当前为固定单用户。

import { ME } from './_store';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestGet(): Promise<Response> {
  const ledger = ME.ledger
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return json({
    userId: ME.userId,
    balance: ME.balance,
    ledger,
  });
}
