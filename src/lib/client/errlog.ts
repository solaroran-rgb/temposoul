/**
 * 前端错误埋点（浏览器端）
 * - 仅生产环境生效（import.meta.env.PROD），本地 dev 不发，避免噪音/隐私。
 * - 采样率 10%，避免高流量下打爆 errlog。
 * - 隐私铁律：只上报 level/scope/message/stack，绝不携带请求 body、URL 查询参数或用户个人信息。
 *   stack 中的页面地址会被剥离 search/hash，仅保留 pathname。
 * - 端点需 ERRLOG_INGEST_TOKEN（公开、仅写）；未配置则静默跳过（fail-closed 服务端侧 503，
 *   客户端不报错）。
 */

const ENDPOINT = '/api/v1/errlog';
const SAMPLE_RATE = 0.1; // 生产采样 10%

type ErrLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface ReportInput {
  level?: ErrLevel;
  scope: string;
  message: string;
  stack?: string;
  ctx?: Record<string, unknown>;
}

function getIngestToken(): string {
  return (import.meta.env.VITE_ERRLOG_INGEST_TOKEN as string | undefined) ?? '';
}

/** 剥离 URL 中的查询/哈希，避免把Token或参数带进 stack */
function sanitizeStack(stack?: string): string | undefined {
  if (!stack) return undefined;
  try {
    return stack.replace(/https?:\/\/[^/\s]+(\/[^?\s#]*)[?#][^\s]*/g, (_m, p1) => {
      const origin = new URL(location.href).origin;
      return origin + p1;
    });
  } catch {
    return stack;
  }
}

let flushed = false;

export function reportClientError(input: ReportInput): void {
  if (!import.meta.env.PROD) return; // 仅生产
  const token = getIngestToken();
  if (!token) return; // 未配 token → 静默跳过
  if (Math.random() > SAMPLE_RATE) return; // 采样

  const payload = {
    level: input.level ?? 'error',
    scope: input.scope,
    message: String(input.message ?? '').slice(0, 2000),
    stack: sanitizeStack(input.stack)?.slice(0, 4000),
    // ctx 仅允许调用方显式传入的极少量非敏感标记（如当前路由名）；默认不采集
    ctx: input.ctx ? JSON.stringify(input.ctx).slice(0, 2000) : undefined,
  };

  void fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-errlog-token': token,
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}

/** 在 main.tsx 顶部调用一次：挂全局未捕获错误/未处理 Promise 拒绝 */
export function initErrorTracking(): void {
  if (flushed || typeof window === 'undefined') return;
  flushed = true;

  window.addEventListener('error', (e: ErrorEvent) => {
    reportClientError({
      level: 'error',
      scope: 'window.onerror',
      message: e.message || 'unknown error',
      stack: e.error?.stack,
    });
  });

  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    const reason = e.reason as Error | unknown;
    const message = reason instanceof Error ? reason.message : String(reason ?? 'unhandledrejection');
    const stack = reason instanceof Error ? reason.stack : undefined;
    reportClientError({
      level: 'error',
      scope: 'unhandledrejection',
      message,
      stack,
    });
  });
}
