/**
 * 同源 GET JSON 通用基建（学习中心 / 词库页共用）。
 *
 * - 一律相对路径 /api/v1/...，与现有页面消费方式一致（同源部署）；
 * - AbortController 超时（默认 8s），超时 / 网络异常均转为结构化失败，不抛裸错；
 * - 返回 discriminated union，调用方按 ok 分支做「服务端优先 + 静态降级」。
 */

export type FetchResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; status: number | null; error: string };

export interface FetchJsonOptions {
  timeoutMs?: number;
  /** 调用方自带的取消信号（如组件卸载外的外部中断）。 */
  signal?: AbortSignal;
}

export async function fetchJson<T>(
  path: string,
  options: FetchJsonOptions = {},
): Promise<FetchResult<T>> {
  const { timeoutMs = 8000, signal } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(path, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    const status = res.status;
    const data = (await res.json().catch(() => null)) as T | null;
    if (!res.ok || data == null) {
      return { ok: false, status, error: `http_${status}` };
    }
    return { ok: true, data, status };
  } catch (err) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    return { ok: false, status: null, error: aborted ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
