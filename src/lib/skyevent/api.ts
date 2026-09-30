/**
 * 星空纪念事件 · 前端 API 客户端
 * 鉴权请求自动附带 Bearer token（来自 @/lib/auth/token）；
 * 公开分享读无需 token。
 */
import { getAuthToken } from '@/lib/auth/token';

const BASE = '/api/v1/sky-events';

export interface SkyEventInput {
  title: string;
  note: string;
  eventTime: string;
  lat: number;
  lng: number;
  locationName: string;
  skySnapshot?: Record<string, unknown>;
}

export type SkyEvent = SkyEventInput & {
  id: string;
  userId: string;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicSkyEvent = Omit<SkyEvent, 'userId'>;

function authHeaders(): Record<string, string> {
  const t = getAuthToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function parseError(res: Response): Promise<string> {
  try {
    const d = (await res.json()) as { error?: string };
    return d.error ?? 'request_failed';
  } catch {
    return 'request_failed';
  }
}

export async function createSkyEvent(input: SkyEventInput): Promise<SkyEvent> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(input),
  });
  if (res.status !== 201) throw new Error(await parseError(res));
  const d = (await res.json()) as { event: SkyEvent };
  return d.event;
}

export async function listSkyEvents(): Promise<SkyEvent[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  const d = (await res.json()) as { events: SkyEvent[] };
  return d.events ?? [];
}

export async function getSkyEvent(id: string): Promise<SkyEvent> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  const d = (await res.json()) as { event: SkyEvent };
  return d.event;
}

export async function updateSkyEvent(
  id: string,
  patch: Partial<SkyEventInput>,
): Promise<SkyEvent> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const d = (await res.json()) as { event: SkyEvent };
  return d.event;
}

export async function deleteSkyEvent(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export async function getPublicSkyEvent(token: string): Promise<PublicSkyEvent> {
  const res = await fetch(`${BASE}/share/${token}`);
  if (!res.ok) throw new Error(await parseError(res));
  const d = (await res.json()) as { event: PublicSkyEvent };
  return d.event;
}

/** 生成可分享的绝对 URL（名片）。 */
export function buildShareUrl(token: string): string {
  return `${window.location.origin}/sky-event/${token}`;
}
