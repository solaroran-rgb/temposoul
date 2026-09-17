// F1 离线验证：IP 漂移坐标 → cities.json 最近邻吸附 → KV key 对齐
// 运行: node verify_f1_snap.mjs（项目根目录）
import { readFileSync } from 'fs';
const cities = JSON.parse(readFileSync('public/data/cities.json', 'utf8'));

// 模拟 IP 定位库漂移坐标（城市中心 + 几米误差，toFixed(2) 后 KV key 与原 key 不同）
const ipCases = [
  { name: '上海', ip: [31.2, 121.46] },
  { name: '北京', ip: [39.9, 116.35] },
  { name: '济南', ip: [36.6, 117.08] },
  { name: '台北', ip: [25.04, 121.51] },
  { name: '深圳', ip: [22.55, 113.95] },
  { name: '广州', ip: [23.13, 113.34] },
];

const nearestCity = (lat, lon, maxDeg = 3) => {
  let b = null,
    bd = 1e18;
  for (const c of cities) {
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2;
    if (d < bd) {
      bd = d;
      b = c;
    }
  }
  if (b && bd < maxDeg * maxDeg) return b;
  return null;
};

const kvOf = (lat, lon) => `geo:v6:${lat.toFixed(2)}:${lon.toFixed(2)}`;

console.log('城市库总量:', cities.length);
console.log('—— F1 吸附验证（IP 漂移坐标 → 城市中心 KV key 对齐）——');
let hit = 0;
for (const t of ipCases) {
  const [ipLat, ipLon] = t.ip;
  const keyBefore = kvOf(ipLat, ipLon);
  const c = nearestCity(ipLat, ipLon);
  const keyAfter = c ? kvOf(c.lat, c.lon) : 'NULL(未吸附)';
  const aligned = c ? t.name.slice(0, 2) === c.n.slice(0, 2) : false;
  if (aligned) hit++;
  console.log(
    `${t.name} IP(${ipLat.toFixed(2)},${ipLon.toFixed(2)}) key=${keyBefore} | 吸附→${c ? c.n : '?'}(${c ? `${c.lat.toFixed(2)},${c.lon.toFixed(2)}` : '?'}) key=${keyAfter} | ${aligned ? 'ALIGNED' : 'MISS'}`,
  );
}
console.log(`\n命中率: ${hit}/${ipCases.length} (${Math.round((hit / ipCases.length) * 100)}%)`);
