/**
 * 积分 · 路由
 *   GET  /api/v1/shop/points            → 本人余额 + 流水
 *   POST /api/v1/shop/points            → 发放积分（需管理员）{ credits, refId, label? }
 *
 * 消耗侧由结算链路自动写流水（action='spend:checkout'），取消订单写冲正流水（action='refund:order'）。
 */

import { getAccount, grantPoints } from '../../../../src/lib/commerce/shop/index.ts';
import { adminGuard, authUser } from '../_auth.ts';
import { fail, handleError, json, options, readJson } from '../_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const method = request.method.toUpperCase();

  if (method === 'GET') {
    const user = await authUser(request, env.AUTH_SECRET);
    if (!user) return fail('unauthorized', 401, request);
    try {
      const account = await getAccount(env, user.userId);
      return json({ ...account, count: account.entries.length }, 200, request);
    } catch (err) {
      return handleError(err, request);
    }
  }

  if (method === 'POST') {
    const denied = await adminGuard(request, env.AUTH_SECRET);
    if (denied) return denied;

    const body = await readJson(request);
    if (!body) return fail('invalid_json', 400, request);

    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    if (!userId) return fail('invalid_user_id', 400, request);

    const credits = Number(body.credits);
    if (!Number.isInteger(credits) || credits === 0) return fail('invalid_credits', 400, request);

    const refId = typeof body.refId === 'string' ? body.refId.trim() : '';
    if (!refId) return fail('invalid_ref_id', 400, request);

    const action = typeof body.action === 'string' && body.action.trim() ? body.action.trim() : 'grant:admin';
    const label = typeof body.label === 'string' && body.label.trim() ? body.label.trim() : `管理员发放 ${credits} 积分`;

    try {
      const { entry, balance } = await grantPoints(env, userId, credits, action, refId, label);
      return json({ entry, balance }, 201, request);
    } catch (err) {
      return handleError(err, request);
    }
  }

  return fail('method_not_allowed', 405, request);
}
