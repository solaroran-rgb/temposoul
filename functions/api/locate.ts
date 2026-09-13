/**
 * CF Pages Function: GET /api/locate
 * 返回 CF 自带的 IP 地理坐标（城市/经纬度）
 */
export const onRequestGet: PagesFunction = async ({ request }) => {
  const cf = (request as any).cf || {};
  const lat = typeof cf.latitude === 'string' ? parseFloat(cf.latitude) : null;
  const lon = typeof cf.longitude === 'string' ? parseFloat(cf.longitude) : null;
  const city = cf.city || '';
  const region = cf.region || '';
  const country = cf.country || '';
  return new Response(JSON.stringify({
    lat, lon, city, region, country,
    source: lat ? 'ip' : 'fallback',
  }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' },
  });
};
