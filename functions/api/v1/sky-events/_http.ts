/** 星空纪念事件 · HTTP 公共助手（JSON 响应 / CORS / 输入校验）。 */

type Json = Record<string, unknown> | unknown[];

export function json(data: Json, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

/** 预检响应（仅回显请求 Origin，禁 `*`）。 */
export function options(request: Request): Response {
  const origin = request.headers.get('Origin') ?? '';
  return new Response(null, {
    status: 204,
    headers: {
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Max-Age': '600',
    },
  });
}

export interface ParsedEvent {
  title: string;
  note: string;
  eventTime: string;
  lat: number;
  lng: number;
  locationName: string;
  skySnapshot?: Record<string, unknown>;
}

/**
 * 校验并归一化创建/更新载荷。
 * 返回 { value } 或 { error, status }。
 */
export function parseEventInput(body: Record<string, unknown>):
  | { value: ParsedEvent }
  | { error: string; status: number } {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const note = typeof body.note === 'string' ? body.note : '';
  const eventTime = typeof body.eventTime === 'string' ? body.eventTime : '';
  const latRaw = Number(body.lat);
  const lngRaw = Number(body.lng);
  const locationName =
    typeof body.locationName === 'string' ? body.locationName.trim() : '';
  const skySnapshot =
    body.skySnapshot && typeof body.skySnapshot === 'object'
      ? (body.skySnapshot as Record<string, unknown>)
      : undefined;

  if (!title || title.length > 120) return { error: 'invalid_title', status: 400 };
  if (note.length > 2000) return { error: 'invalid_note', status: 400 };
  if (!eventTime || Number.isNaN(Date.parse(eventTime)))
    return { error: 'invalid_event_time', status: 400 };
  if (!Number.isFinite(latRaw) || latRaw < -90 || latRaw > 90)
    return { error: 'invalid_lat', status: 400 };
  if (!Number.isFinite(lngRaw) || lngRaw < -180 || lngRaw > 180)
    return { error: 'invalid_lng', status: 400 };
  if (locationName.length > 120) return { error: 'invalid_location', status: 400 };

  return {
    value: {
      title,
      note,
      eventTime,
      lat: latRaw,
      lng: lngRaw,
      locationName,
      skySnapshot,
    },
  };
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}
