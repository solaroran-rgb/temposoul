#!/usr/bin/env node
/**
 * promote-gate.mjs —— G1-G6 半自动门禁 · 终版（B7：多视口聚合；B8：双通道压测）
 * 用法：node scripts/promote-gate.mjs --base http://localhost:5173 --version v8 --sw 8
 *       node scripts/promote-gate.mjs --base https://<hash>.temposoul.pages.dev --version v8 --sw 8
 * 运行时长 ≈ 2 × --seconds + 90s（稳定性窗口）。--mobile 仅跑 390×844（真机抽检另行人工）。
 * G5 本脚本 headed（headless:false）= 「真实浏览器桌面宽视口终验」载体（innerWidth=0 事故根因防范）。
 * 依赖：pnpm add -D playwright（与 E4 capture-baseline 同源，devDependency，不违反禁新运行时依赖）
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { parseArgs } from "node:util";

const { values: A } = parseArgs({ options: {
  base: { type: "string", default: "http://localhost:5173" },
  version: { type: "string", default: "dev" },
  sw: { type: "string" },
  mobile: { type: "boolean", default: false },
  seconds: { type: "string", default: "35" },
}});
const FULL_P95 = { high: 16.9, mid: 33, low: 50 };
const VPS = A.mobile ? [{ name: "mobile-390", w: 390, h: 844 }]
  : [{ name: "desktop-1920", w: 1920, h: 1080 }, { name: "mobile-390", w: 390, h: 844 }];
const gates = {};
const md = ["# promote-gate · " + A.version, "- base: " + A.base, ""];
let red = false;
const set = (g, v) => { gates[g] = v; if (!String(v).startsWith("pass") && !String(v).startsWith("skip")) red = true; };

const browser = await chromium.launch({ headless: false });
const g1 = [], g5 = [];
let g4 = null;
for (const vp of VPS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 120)));
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 120)));
  await page.goto(A.base + "/sky?perf=1", { waitUntil: "load" });
  await page.waitForTimeout(Number(A.seconds) * 1000);

  const perf = await page.evaluate(() => window.__skyPerf?.report?.() ?? null);
  const tier = await page.evaluate(() => window.__skyPerf?.tier ?? "high");
  if (!perf) g1.push(vp.name + ":no-sampler");
  else {
    const bad = Object.entries(perf).filter(([st, s]) => (st === "ambient" ? s.spikes100 > 0 : s.p95 > FULL_P95[tier]));
    g1.push(bad.length ? vp.name + ":" + bad.map(([st, s]) => st + " p95=" + s.p95 + " spk=" + s.spikes100).join(",") : vp.name + ":ok");
    md.push(await page.evaluate((v) => window.__skyPerf.markdown(v, location.href), A.version), "");
  }
  g5.push(vp.name + ":" + errors.length + "err" + (errors.length ? "(" + errors[0] + ")" : ""));

  if (!g4) { // G4 仅首个视口执行（B7：聚合，不覆盖）
    g4 = await page.evaluate(async () => {
      const api = window.__skySceneApi;
      if (!api) return { note: "skip(no __skySceneApi)" };
      const mem = () => (performance.memory ? performance.memory.usedJSHeapSize : null);
      const h = [mem()];
      if (api.switchCityByName) { // 真实城市切换（集成层注册）
        for (const c of ["beijing", "shanghai", "chengdu", "xian", "shenyang", "jinan", "taiyuan", "shenzhen", "guangzhou", "hangzhou"]) {
          await api.switchCityByName(c);
        }
      } else await api.reapplyCity(10); // B8 降级通道：几何重建/处置压测
      h.push(mem());
      await api.reapplyCity(10);
      h.push(mem());
      const memOk = h.every((x) => x != null) ? (h[2] <= h[0] * 1.15 ? "pass" : "FAIL") : "skip(no performance.memory)";
      const f0 = api.getRenderInfo().frame;
      const ctx = await api.loseAndRestoreContext(); // B9 闭环
      await new Promise((r) => setTimeout(r, 800));
      const f1 = api.getRenderInfo().frame;
      return { memOk, ctx, resume: f1 > f0 ? "pass" : "FAIL" };
    });
  }
  await page.close();
}
await browser.close();

set("G1", g1.every((r) => r.endsWith(":ok")) ? "pass(" + g1.join(" ") + ")" : "FAIL(" + g1.join(" ") + ")");
set("G4", g4 && (g4.memOk === "FAIL" || g4.ctx === "FAIL" || g4.resume === "FAIL")
  ? "FAIL(" + JSON.stringify(g4).slice(0, 200) + ")"
  : "pass(" + (g4 ? "mem:" + g4.memOk + " ctx:" + g4.ctx + " resume:" + g4.resume : "skip") + ")");
set("G5", g5.every((r) => r.endsWith("0err")) ? "pass(" + g5.join(" ") + ")" : "FAIL(" + g5.join(" ") + ")");

set("G2", existsSync("docs/sky/audit/summary.json")
  ? (JSON.parse(readFileSync("docs/sky/audit/summary.json", "utf8")).pass === true ? "pass" : "FAIL(audit 未全绿)")
  : "skip(docs/sky/audit/summary.json 缺失)");
if (existsSync("docs/sky/visual-checklist.md")) {
  const unchecked = (readFileSync("docs/sky/visual-checklist.md", "utf8").match(/- \[ \]/g) || []).length;
  set("G3", unchecked === 0 ? "pass(人工确认项见清单)" : "FAIL(" + unchecked + " 项未勾选)");
} else set("G3", "skip(checklist 缺失)");
if (A.sw) {
  if (!existsSync("public/sw.js")) set("G6", "FAIL(public/sw.js 不存在)");
  else set("G6", new RegExp("v?" + A.sw + "\\b").test(readFileSync("public/sw.js", "utf8")) ? "pass(sw v" + A.sw + ")" : "FAIL(sw 版本未 bump)");
} else set("G6", "skip(未传 --sw)");

mkdirSync("docs/sky", { recursive: true });
md.push("## 门禁汇总", "", "| gate | 结果 |", "| --- | --- |");
for (const g in gates) md.push("| " + g + " | " + gates[g] + " |");
writeFileSync("docs/sky/perf-baseline-" + A.version + ".md", md.join("\n") + "\n");
console.table(gates);
console.log(red ? "门禁未全绿，阻塞 promote（skip 项需人工确认）" : "门禁全绿（skip 项需人工确认）");
process.exit(red ? 1 : 0);