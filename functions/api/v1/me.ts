import { readIdentityWithSession } from '../../../src/lib/server/auth';
import { listUserTasks, deleteUserData } from '../../../src/lib/server/report/store';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get('Authorization')?.replace('Bearer ', '');
  const identity = token
    ? await readIdentityWithSession(token, context.env.AUTH_SECRET, context.env.AUTH_KV).catch(() => null)
    : null;
  if (!identity) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const userId = identity.sub;

  // Fetch subscription status
  const subRaw = await context.env.AUTH_KV.get(`sub:${userId}`);
  const subscription = subRaw ? JSON.parse(subRaw) : { tier: 'free' };

  // Fetch report tasks via KV list (No race conditions, strong consistency)
  const { tasks: reports } = await listUserTasks(context.env, userId, 20);

  return new Response(
    JSON.stringify({
      userId,
      subscription,
      reports,
      canExport: true,
      canDelete: true,
    }),
  );
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get('Authorization')?.replace('Bearer ', '');
  const identity = token
    ? await readIdentityWithSession(token, context.env.AUTH_SECRET, context.env.AUTH_KV).catch(() => null)
    : null;
  if (!identity) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const userId = identity.sub;

  // Cascade delete: Tasks, Results, Subscription, Assets Index
  const result = await deleteUserData(context.env, userId);

  return new Response(
    JSON.stringify({
      success: true,
      message: 'User data purged successfully',
      stats: result,
    }),
  );
};
