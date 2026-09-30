/**
 * 解盘引擎（runSolution）前端接入层 · 任务包 2.1/2.2/2.3
 *
 * 职责：把各体系的排盘结果适配成引擎 SolutionInput.context，
 * 并以「解读来源」列表形式交给 SolutionPanel 渲染。
 *
 * 说明：
 * - 八字系（合婚/专题）：BaziChartResult 字段名与引擎触发器（tenGods/
 *   pillarRelations/wuxingStrength/luckInfo/liunian 等）一致，直接透传。
 * - 紫微系（十二宫）：星曜术语（XY 组）触发器读取 StarFact.brightness /
 *   mutagen_map / palaces，逐主星构造单术语来源，使庙旺/四化结论按星定位。
 */
import { STAR_REGISTRY } from '@core/solution/semantic';
import type { SolutionSource } from '../../components/solution/SolutionPanel';

/** 八字排盘结果（BaziChartResult 或接口返回的等价 JSON）→ 单一来源。 */
export function baziSolutionSources(chart: unknown, label = '命盘'): SolutionSource[] {
  if (!chart || typeof chart !== 'object') return [];
  return [{ label, context: chart as Record<string, unknown> }];
}

// ——————————————————————————————————————————
// 紫微适配
// ——————————————————————————————————————————

/** iztro 亮度 7 级 → 引擎只区分庙旺与落陷；口径与 core pattern-detection 的 TEMPLE_OR_PROSPEROUS_BRIGHTNESS 一致 */
const TEMPLE_PROSPEROUS = new Set(['庙', '旺']);
const SIHUA_KIND_MAP: Record<string, string> = { lu: '禄', quan: '权', ke: '科', ji: '忌' };

interface StarFactLike {
  name: string;
  brightness?: string;
  mutagens: string[];
  palaceName: string;
}

/** 页面侧紫微命盘的最小结构（与 localZiwei.ZiweiChart 对齐，不直接引页面模块避免环）。 */
interface ZiweiChartLike {
  palaces: Array<{
    name: string;
    majorStars?: string[];
    sihua?: Array<{ star: string; kind: string }>;
  }>;
  raw?: unknown;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
}

function collectFromRaw(raw: unknown): Map<string, StarFactLike> {
  const facts = new Map<string, StarFactLike>();
  const rawObj = asRecord(raw);
  const palaces = Array.isArray(rawObj?.palaces) ? rawObj!.palaces : [];
  for (const p of palaces) {
    const po = asRecord(p);
    if (!po) continue;
    const palaceName = typeof po.name === 'string' ? po.name : '';
    const starLists = [po.majorStars, po.minorStars];
    for (const list of starLists) {
      if (!Array.isArray(list)) continue;
      for (const s of list) {
        const so = asRecord(s);
        if (!so || typeof so.name !== 'string' || !so.name.trim()) continue;
        const fact: StarFactLike =
          facts.get(so.name) ?? { name: so.name, mutagens: [], palaceName };
        if (typeof so.brightness === 'string' && so.brightness) {
          fact.brightness = TEMPLE_PROSPEROUS.has(so.brightness) ? '庙' : so.brightness;
        }
        if (typeof so.mutagen === 'string' && so.mutagen && !fact.mutagens.includes(so.mutagen)) {
          fact.mutagens.push(so.mutagen);
        }
        facts.set(so.name, fact);
      }
    }
  }
  return facts;
}

/** 兜底：normalized palaces 只有星名与 sihua，无亮度。 */
function collectFromPalaces(chart: ZiweiChartLike, facts: Map<string, StarFactLike>): void {
  for (const row of chart.palaces ?? []) {
    for (const starName of row.majorStars ?? []) {
      if (!facts.has(starName)) {
        facts.set(starName, { name: starName, mutagens: [], palaceName: row.name });
      }
    }
    for (const sh of row.sihua ?? []) {
      const kind = SIHUA_KIND_MAP[sh.kind];
      if (!kind) continue;
      const fact = facts.get(sh.star);
      if (fact && !fact.mutagens.includes(kind)) fact.mutagens.push(kind);
    }
  }
}

/**
 * 紫微命盘 → 逐主星的单术语解读来源。
 * 每个来源 context 仅携带该星自己的亮度/四化，termIds 锁定一个星曜术语，
 * 使「庙旺得助 / 落陷无助 / 逢吉 / 逢煞」结论按星定位而非全局套用。
 */
export function ziweiSolutionSources(chart: ZiweiChartLike | null): SolutionSource[] {
  if (!chart) return [];
  const facts = collectFromRaw(chart.raw);
  collectFromPalaces(chart, facts);

  const sources: SolutionSource[] = [];
  for (const [termId, term] of Object.entries(STAR_REGISTRY)) {
    const fact = facts.get(term.name);
    if (!fact) continue;
    sources.push({
      label: fact.palaceName ? `${term.name}（${fact.palaceName}）` : term.name,
      termIds: [termId],
      context: {
        StarFact: { brightness: fact.brightness ?? '' },
        birth_mutagen: fact.mutagens,
        mutagen_map: fact.mutagens,
        palaces: [fact.palaceName],
      },
    });
  }
  return sources;
}

// ——————————————————————————————————————————
// 西占本命适配
// ——————————————————————————————————————————

/**
 * 西占本命盘（AstrolabeChart）→ 单一解读来源。
 * 仿照 baziSolutionSources 的单源透传写法：把整张本命盘（行星/宫位/相位等）
 * 作为 context 整体透传给解盘引擎。若引擎触发器暂不识别西占字段也无妨，
 * 本步只负责把接线跑通、不报错。
 */
export function natalSolutionSources(chart: unknown, label = '本命盘'): SolutionSource[] {
  if (!chart || typeof chart !== 'object') return [];
  return [{ label, context: chart as Record<string, unknown> }];
}
