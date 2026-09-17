// 修正：IT-5.7 依据；删除 /* @vite-ignore */；模块 promise 缓存

export interface ZiweiInput {
  gender: 'male' | 'female';
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
}

export interface ZiweiRuntime {
  algorithm: 'default' | 'zhongzhou';
  school: 'sanhe' | 'feixing' | 'sihua';
}

export interface PalaceRow {
  index: number;
  name: string;
  ganZhi?: string;
  majorStars?: string[];
  minorStars?: string[];
  sihua?: Array<{ star: string; kind: 'lu' | 'quan' | 'ke' | 'ji' }>;
  decadalRange?: string;
}

export interface ZiweiChart {
  palaces: PalaceRow[];
  raw?: unknown;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined;
}
function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const a = v.filter((x) => typeof x === 'string') as string[];
  return a.length ? a : undefined;
}

const SIHUA_KINDS = new Set(['lu', 'quan', 'ke', 'ji']);

function normalizeSihua(v: unknown): PalaceRow['sihua'] {
  if (!Array.isArray(v)) return undefined;
  const out: NonNullable<PalaceRow['sihua']> = [];
  for (const it of v) {
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    const star = asString(o.star);
    const kindRaw = asString(o.kind) ?? asString(o.type);
    if (star && kindRaw && SIHUA_KINDS.has(kindRaw)) {
      out.push({ star, kind: kindRaw as 'lu' | 'quan' | 'ke' | 'ji' });
    }
  }
  return out.length ? out : undefined;
}

function normalizePalaces(v: unknown): PalaceRow[] {
  const arr = asArray(v);
  const out: PalaceRow[] = [];
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    out.push({
      index: typeof o.index === 'number' ? o.index : i,
      name: asString(o.name) ?? asString(o.palaceName) ?? `宫位 ${i + 1}`,
      ganZhi: asString(o.ganZhi) ?? asString(o.ganzhi),
      majorStars: asStringArray(o.majorStars) ?? asStringArray(o.mainStars),
      minorStars: asStringArray(o.minorStars) ?? asStringArray(o.auxStars),
      sihua: normalizeSihua(o.sihua),
      decadalRange: asString(o.decadalRange) ?? asString(o.daXian),
    });
  }
  return out;
}

// 模块级 promise 缓存，避免并发重复 import
let iztroModulePromise: Promise<Record<string, unknown>> | null = null;
async function loadIztroModule(): Promise<Record<string, unknown>> {
  if (!iztroModulePromise) {
    iztroModulePromise = import('@temposoul/core/ziwei/iztro')
      .then((m) => m as unknown as Record<string, unknown>)
      .catch((err) => {
        iztroModulePromise = null;
        throw err;
      });
  }
  return iztroModulePromise;
}

// P0-1 修正：@temposoul/core/ziwei/iztro 真实导出为 buildAstrolabeFromInput(input) → FunctionalAstrolabe；
// 候选名对齐真实导出，按签名调用（输入=出生信息对象，palaces 从返回值取）。
type ComputeFn = (i: ZiweiInput, r: ZiweiRuntime) => unknown;
const COMPUTE_CANDIDATES = ['buildAstrolabeFromInput', 'buildHoroscopeFromInput', 'buildHoroscope'];

export async function computeZiweiLocal(
  input: ZiweiInput,
  runtime: ZiweiRuntime,
): Promise<ZiweiChart> {
  let mod: Record<string, unknown>;
  try {
    mod = await loadIztroModule();
  } catch {
    throw new Error('本地紫微引擎不可用');
  }

  let fn: ComputeFn | null = null;
  for (const name of COMPUTE_CANDIDATES) {
    const c = mod[name];
    if (typeof c === 'function') {
      fn = c as ComputeFn;
      break;
    }
  }
  if (!fn) throw new Error('本地紫微引擎缺少计算入口');

  const raw = await fn(input, runtime);
  const rawObj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const palaces = normalizePalaces(rawObj.palaces ?? rawObj.gongs ?? raw);
  return { palaces, raw };
}

export function buildZiweiPrompt(
  chart: ZiweiChart,
  input: ZiweiInput,
  runtime: ZiweiRuntime,
  scope: 'decadal' | 'yearly',
  question: string,
): string {
  const lines: string[] = [];
  lines.push('【紫微命盘结构化证据】');
  lines.push(
    `性别：${input.gender}；历法：${input.dateType}；${input.year}-${input.month}-${input.day}；时辰索引：${input.timeIndex}`,
  );
  lines.push(`算法：${runtime.algorithm}；流派：${runtime.school}；分析范围：${scope}`);
  lines.push(`十二宫：共 ${chart.palaces.length} 宫`);
  for (const p of chart.palaces) {
    const parts: string[] = [`${p.index}. ${p.name}`];
    if (p.ganZhi) parts.push(`干支：${p.ganZhi}`);
    if (p.majorStars?.length) parts.push(`主星：${p.majorStars.join('、')}`);
    if (p.minorStars?.length) parts.push(`辅星：${p.minorStars.join('、')}`);
    if (p.sihua?.length) parts.push(`四化：${p.sihua.map((s) => `${s.star}${s.kind}`).join('、')}`);
    if (p.decadalRange) parts.push(`大限：${p.decadalRange}`);
    lines.push(parts.join('｜'));
  }
  lines.push('');
  lines.push(`【用户问题】${question}`);
  lines.push('【解释边界】请基于传统文化模型给出解释性描述，不做绝对化断言，不预测必然事件。');
  return lines.join('\n');
}
