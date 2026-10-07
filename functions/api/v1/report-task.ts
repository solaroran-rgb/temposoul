import { readIdentityWithSession } from '../../../src/lib/server/auth';
import {
  createReportTask,
  getReportTask,
  processReportInBackground,
} from '../../../src/lib/server/report/state-machine';
import { getReportResult } from '../../../src/lib/server/report/store';
import type { TenDimReport } from '../../../src/lib/server/report/generator';

// Shape aligned with Expert A frontend
export interface DimensionData {
  key: string;
  title: string;
  summary: string;
  evidence: string[];
  advice: string;
}

export interface ReportTaskResponse {
  id: string;
  status:
    | 'pending'
    | 'generating'
    | 'compliance_check'
    | 'delivering'
    | 'fulfilled'
    | 'fulfilled_with_template'
    | 'refunded'
    | 'failed';
  tier: 'free' | 'premium';
  dimensions?: DimensionData[];
  share?: { title: string; summary: string; url: string };
  error?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get('Authorization')?.replace('Bearer ', '');
  const identity = token
    ? await readIdentityWithSession(token, context.env.AUTH_SECRET, context.env.AUTH_KV).catch(() => null)
    : null;
  if (!identity) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  try {
    const body = await context.request.json();
    const { chartId, productId } = body;
    if (!chartId || !productId) {
      return new Response(JSON.stringify({ error: 'missing_params' }), { status: 400 });
    }

    const task = await createReportTask(context.env, identity.sub, chartId, productId);

    // Trigger background processing using waitUntil to avoid 503 timeouts
    context.waitUntil(processReportInBackground(context.env, task));

    return new Response(JSON.stringify({ id: task.id, status: 'pending' }), { status: 202 });
  } catch (_e) {
    console.error('[report-task] POST error:', _e);
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = context.request.headers.get('Authorization')?.replace('Bearer ', '');
  const identity = token
    ? await readIdentityWithSession(token, context.env.AUTH_SECRET, context.env.AUTH_KV).catch(() => null)
    : null;
  if (!identity) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });

  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'missing_id' }), { status: 400 });

  const task = await getReportTask(context.env, identity.sub, id);
  if (!task) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });

  // Fetch tier
  const subRaw = await context.env.AUTH_KV.get(`sub:${identity.sub}`);
  const subData = subRaw ? JSON.parse(subRaw) : { tier: 'free' };
  const tier = subData.tier === 'premium' ? 'premium' : 'free';

  const response: ReportTaskResponse = {
    id: task.id,
    status: task.status,
    tier,
    error: task.errorMsg,
  };

  // Map dimensions and share data if fulfilled
  if (
    (task.status === 'fulfilled' || task.status === 'fulfilled_with_template') &&
    task.resultKey
  ) {
    const result = (await getReportResult(context.env, task.resultKey)) as TenDimReport | null;
    if (result && result.structured) {
      response.dimensions = Object.entries(result.structured).map(([key, val]) => {
        const d = (val ?? {}) as {
          title?: string;
          summary?: string;
          evidence?: string[];
          advice?: string;
        };
        return {
          key,
          title: d.title || key,
          summary: d.summary || '',
          evidence: d.evidence || [],
          advice: d.advice || '',
        };
      });

      // Share data (minimal implementation)
      const characterDim = result.structured.character as { summary?: string } | undefined;
      response.share = {
        title: '我的命律十维深度洞察',
        summary: characterDim?.summary || '探索你的生命规律，而不是预测命运。',
        url: `${url.origin}/reports/ten-dim?id=${task.id}`,
      };
    }
  }

  return new Response(JSON.stringify(response));
};
