#!/usr/bin/env node
/**
 * probe-ip-geo.mjs —— TempoSoul 首页「IP 定位 → 内容生成」T1 档生产只读探针
 *
 * 用途：量化 /api/locate 与 /api/geo 的真实表现，产出 KV 命中率矩阵。
 * 设计约束（务必保留）：
 *   ① 零依赖（Node 18+ 内置 fetch）· 零写入 · 不碰任何 KV
 *   ② 串行执行 —— 未命中路径会真实回源 Overpass（外部免费服务），并发会触发限流
 *   ③ 每个坐标只打一次 —— geo.ts:94 在回源全失败后写 geo:fail:{ck}（TTL 600s），
 *      同一坐标 10 分钟内重测会直接返回 fail-cooldown，测到的是缓存标记不是真实状态
 *
 * 用法：
 *   node scripts/probe-ip-geo.mjs --base https://www.temposoul.com
 *   node scripts/probe-ip-geo.mjs --base https://www.temposoul.com --fast
 *   node scripts/probe-ip-geo.mjs --base https://www.temposoul.com --csv docs/sky/ip-probe.csv
 *   node scripts/probe-ip-geo.mjs --base https://www.temposoul.com --timeout 12000
 *
 * 判读要点：A 类命中率 vs B 类命中率。修复前应为 100% / 0%。
 */
import { writeFileSync } from "node:fs";

/* ---------------- args ---------------- */
const argv = process.argv.slice(2);
const arg = (k, d) => {
  const hit = argv.find((a) => a.startsWith(`--${k}=`));
  if (hit) return hit.split("=").slice(1).join("=");
  const i = argv.indexOf(`--${k}`);
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--")) return argv[i + 1];
  return argv.includes(`--${k}`) ? true : d;
};
const BASE = String(arg("base", "https://www.temposoul.com")).replace(/\/$/, "");
const FAST = !!arg("fast", false);
const TIMEOUT = Number(arg("timeout", 12000));
const CSV = arg("csv", "");

/* ---------------- 用例矩阵 ----------------
 * A 城市库坐标   —— KV 主路径健康度
 * B IP 定位坐标  —— 与 A 同城对照，验证坐标漂移是否导致 miss（核心用例）
 * C 预热失败城   —— 预热缺口
 * D 未预热坐标   —— 回源降级表现
 * E 海外城市     —— 跨境可用性
 * F 极端坐标     —— 鲁棒性
 */
const CASES = [
  { cls: "A", label: "北京·城市库", lat: 39.9,    lon: 116.41,   exp: "hit" },
  { cls: "A", label: "上海·城市库", lat: 31.23,   lon: 121.47,   exp: "hit" },
  { cls: "A", label: "济南·城市库", lat: 36.65,   lon: 117.12,   exp: "hit" },
  { cls: "B", label: "上海·IP坐标", lat: 31.22222, lon: 121.45806, exp: "距 A2 仅 0.01°" },
  { cls: "B", label: "济南·IP坐标", lat: 36.6683,  lon: 117.021,  exp: "距 A3 仅 0.02°" },
  { cls: "C", label: "天津·预热失败", lat: 39.13,  lon: 117.2,    exp: "fallback(已记录)" },
  { cls: "C", label: "太原·预热失败", lat: 37.87,  lon: 112.55,   exp: "fallback(已记录)" },
  { cls: "D", label: "阿勒泰·未预热", lat: 47.85,  lon: 88.14,    exp: "回源" },
  { cls: "E", label: "东京·海外",   lat: 35.68,   lon: 139.77,   exp: "未预热" },
  { cls: "E", label: "纽约·海外",   lat: 40.71,   lon: -74.01,   exp: "未预热" },
  { cls: "F", label: "悉尼·南半球", lat: -33.87,  lon: 151.21,   exp: "未预热" },
  { cls: "F", label: "深海·极端",   lat: -45.12,  lon: -170.57,  exp: "无地标" },
];
const RUN = FAST ? CASES.filter((c) => c.cls === "A") : CASES;

/* ---------------- fetch with timeout ---------------- */
async function probe(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "TempoSoul-IP-Probe/1.0" },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    const ms = Date.now() - t0;
    const text = await res.text();
    return { status: res.status, ms, cache: res.headers.get("x-geo-cache") ?? "-", text };
  } catch (e) {
    return { status: null, ms: Date.now() - t0, cache: "-", err: e?.name ?? String(e) };
  }
}

const pad = (s, n) => String(s ?? "").padEnd(n);
const padL = (s, n) => String(s ?? "").padStart(n);

/* ---------------- ① /api/locate ---------------- */
console.log("\n" + "=".repeat(78));
console.log(`① /api/locate —— CF 按【请求来源 IP】解析    base=${BASE}`);
console.log("=".repeat(78));
const loc = await probe(`${BASE}/api/locate`);
let locCity = "";
if (loc.status === 200) {
  try {
    const j = JSON.parse(loc.text);
    locCity = j.city ?? "";
    console.log(`  HTTP 200  ${loc.ms}ms   source=${j.source}`);
    console.log(`  → ${j.city} (${j.region}, ${j.country})   lat=${j.lat}  lon=${j.lon}`);
    console.log(`  注：此处城市取决于【CF 边缘看到的出口 IP】，不等于本机物理位置。`);
  } catch {
    console.log(`  HTTP ${loc.status}  ${loc.ms}ms  非 JSON: ${loc.text.slice(0, 100)}`);
  }
} else {
  console.log(`  ✗ ${loc.err ?? loc.status}  ${loc.ms}ms  ${loc.text?.slice(0, 100) ?? ""}`);
}

/* ---------------- ② /api/geo 矩阵 ---------------- */
console.log("\n" + "=".repeat(78));
console.log(`② /api/geo —— KV 命中率矩阵（串行 · 每坐标 1 次 · timeout=${TIMEOUT}ms）`);
console.log("=".repeat(78));
console.log(
  "  " + pad("类", 4) + pad("样本", 16) + pad("lat,lon", 24) +
  pad("HTTP", 6) + padL("耗时", 8) + "  " + pad("cache", 14) + pad("bld", 6) + "判定"
);
console.log("  " + "-".repeat(74));

const rows = [];
for (const c of RUN) {
  const url = `${BASE}/api/geo?lat=${c.lat}&lon=${c.lon}`;
  const r = await probe(url);
  let bld = "-", note = "";
  if (r.status === 200) {
    try {
      const j = JSON.parse(r.text);
      if (j.fallback) { note = "fallback:true"; bld = "0"; }
      else { bld = String((j.buildings ?? []).length); note = `raw_count=${j.raw_count}`; }
    } catch { note = "非 JSON"; }
  } else {
    note = r.err === "TimeoutError" ? `TIMEOUT(>${TIMEOUT}ms)` : (r.err ?? "ERR");
  }
  const verdict =
    r.status === 200 && !note.startsWith("fallback") && bld !== "0" ? "✅ OK"
    : r.status === 200 ? "◇ 降级"
    : "❌ 挂死";
  console.log(
    "  " + pad(c.cls, 4) + pad(c.label, 16) +
    pad(`${c.lat},${c.lon}`, 24) + pad(r.status ?? "-", 6) +
    padL(`${r.ms}ms`, 8) + "  " + pad(r.cache, 14) + pad(bld, 6) + verdict + (note ? `  ${note}` : "")
  );
  rows.push({ ts: Date.now(), cls: c.cls, label: c.label, lat: c.lat, lon: c.lon,
              status: r.status ?? 0, ms: r.ms, cache: r.cache, buildings: bld, note, verdict });
}

/* ---------------- ③ 汇总 ---------------- */
const stat = (cls) => {
  const g = rows.filter((r) => r.cls === cls);
  const ok = g.filter((r) => r.verdict === "✅ OK").length;
  return `${cls} 类 ${ok}/${g.length}`;
};
console.log("\n" + "=".repeat(78));
console.log("③ 汇总");
console.log("=".repeat(78));
console.log(`  A 城市库坐标  ${stat("A")}   ← KV 主路径健康度`);
const aOk = rows.filter((r) => r.cls === "A" && r.verdict === "✅ OK").length;
const aSum = rows.filter((r) => r.cls === "A").length;
const bOk = rows.filter((r) => r.cls === "B" && r.verdict === "✅ OK").length;
const bSum = rows.filter((r) => r.cls === "B").length;
if (aSum && bSum) {
  console.log(`  B IP 定位坐标 ${stat("B")}   ← 【核心】与 A 类同城对照`);
  console.log("");
  console.log(`  ▸ 坐标漂移导致的命中率落差 : ${aSum ? Math.round((aOk / aSum) * 100) : 0}%  →  ${bSum ? Math.round((bOk / bSum) * 100) : 0}%`);
  if (aOk > 0 && bOk === 0) {
    console.log("  ▸ 判定：❌ B1 未修复 —— 城市库坐标命中，IP 定位坐标全部 miss（正是预期中的断链）");
  } else if (bOk > 0) {
    console.log("  ▸ 判定：✅ B1 已修复或部分生效 —— IP 坐标已能命中 KV");
  }
}
if (!FAST) console.log(`  C/D/E/F       ${["C","D","E","F"].map(stat).join("  |  ")}`);
console.log(`\n  提示：未命中路径每条约 ${TIMEOUT}ms；CF 视角出口城市 = ${locCity || "?"}`);

/* ---------------- ④ CSV ---------------- */
if (CSV) {
  const head = "ts,cls,label,lat,lon,status,ms,x_geo_cache,buildings,note,verdict";
  const body = rows.map((r) =>
    [r.ts, r.cls, r.label, r.lat, r.lon, r.status, r.ms, r.cache, r.buildings,
     `"${r.note}"`, `"${r.verdict}"`].join(",")
  ).join("\n");
  writeFileSync(CSV, head + "\n" + body + "\n", "utf8");
  console.log(`\n  CSV 已写入：${CSV}`);
}
console.log("");
