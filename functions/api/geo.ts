/**
 * CF Pages Function: GET /api/geo?lat=..&lon=..   —— v2（裁定 D7 / 共识 B3）
 * 主路径：纯 KV 读（geo:v6:*，warmup-geo-v2 离线产出），CPU ≈1ms，永不触 10ms 限额。
 * 回源路径：仅预热外城市，qt 800 + roadsFull:false 轻量查询，成功后 waitUntil 写 KV。
 * 纪律：永远 200；失败 { fallback:true }；fail-cooldown 10min；F4 修复：缓存分级。
 */
import { SERVER_CFG, buildQuery, simplifyOsm } from "../../src/lib/city/osmCore.js";

interface KVLite {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
interface Env { GEO_CACHE: KVLite }

const MIRRORS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const PER_MIRROR_TIMEOUT = 8000;
const KV_TTL = 2592000;       // 30d
const FAIL_TTL = 600;         // 10min
const MAX_KV_BYTES = 500_000; // F5：按 UTF-8 字节计，非字符串长度

// F4：缓存分级 —— 成功长缓存，失败短缓存（不架空 fail-cooldown）
const CC = {
  hit: "public, max-age=86400",
  miss: "public, max-age=3600",
  fail: "public, max-age=120",
};

const json = (data: unknown, cc: string, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json", "cache-control": cc, ...extra },
  });

export async function onRequestGet({
  request, env, waitUntil,
}: { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void }): Promise<Response> {
  const u = new URL(request.url);
  const lat = parseFloat(u.searchParams.get("lat") ?? "");
  const lon = parseFloat(u.searchParams.get("lon") ?? "");
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return json({ fallback: true }, CC.fail, { "x-geo-cache": "param-error" });
  }

  const ck = `${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const key = `geo:v6:${ck}`;
  const failKey = `geo:fail:${ck}`;

  // ① 主路径：纯 KV 读
  try {
    const hit = await env.GEO_CACHE.get(key);
    if (hit) {
      try {
        const parsed = JSON.parse(hit);
        if (parsed?.v === 2) return json(parsed, CC.hit, { "x-geo-cache": "hit" });
      } catch { /* 脏数据 → 走回源覆盖 */ }
    }
    if (await env.GEO_CACHE.get(failKey)) {
      return json({ fallback: true }, CC.fail, { "x-geo-cache": "fail-cooldown" });
    }
  } catch { /* KV 故障不阻塞，继续回源 */ }

  // ② 回源路径（仅预热外城市）
  const ql = buildQuery(lat, lon, {
    maxWays: SERVER_CFG.FALLBACK_MAX_WAYS, roadsFull: false,
  });
  for (const mirror of MIRRORS) {
    try {
      const res = await fetch(mirror, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "TempoSoul-Sky/2.0 (https://www.temposoul.com)",
        },
        body: "data=" + encodeURIComponent(ql),
        signal: AbortSignal.timeout(PER_MIRROR_TIMEOUT),
      });
      if (!res.ok) continue;
      let geo;
      try {
        geo = simplifyOsm(await res.json(), { lat, lon });   // CPU 密集段独立捕获（超限→下一镜像）
      } catch { continue; }
      const payload = JSON.stringify(geo);
      // F5：UTF-8 字节数校验（仅 miss 路径，CPU 可忽略）
      if (new TextEncoder().encode(payload).length < MAX_KV_BYTES) {
        waitUntil(env.GEO_CACHE.put(key, payload, { expirationTtl: KV_TTL }).catch(() => {}));
      }
      return json(geo, CC.miss, { "x-geo-cache": "miss" });
    } catch { continue; }
  }

  waitUntil(env.GEO_CACHE.put(failKey, "1", { expirationTtl: FAIL_TTL }).catch(() => {}));
  return json({ fallback: true }, CC.fail, { "x-geo-cache": "fallback" });
}