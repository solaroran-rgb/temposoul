// 修正：删除 /* @vite-ignore */；模块 promise 缓存

export interface AstrolabeInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone?: number;
  timeZoneId?: string;
}

export interface PlanetRow {
  name: string;
  sign: string;
  degree: number;
  longitude?: number;
  retrograde?: boolean;
}
export interface HouseRow {
  index: number;
  sign: string;
  cuspDegree?: number;
}
export interface AspectRow {
  body1: string;
  body2: string;
  type: string;
  orb: number;
}
export interface AstrolabeChart {
  planets: PlanetRow[];
  houses: HouseRow[];
  aspects: AspectRow[];
  raw?: unknown;
}

const ASPECT_TIGHT_ORB = 8;

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined;
}
function asNumber(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function normalizePlanets(v: unknown): PlanetRow[] {
  const out: PlanetRow[] = [];
  for (const it of asArray(v)) {
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    const name = asString(o.name) ?? asString(o.body);
    const sign = asString(o.sign) ?? asString(o.zodiac);
    const degree = asNumber(o.degree) ?? asNumber(o.deg);
    if (!name || !sign || degree === undefined) continue;
    out.push({
      name,
      sign,
      degree,
      longitude: asNumber(o.longitude),
      retrograde: o.retrograde === true,
    });
  }
  return out;
}

function normalizeHouses(v: unknown): HouseRow[] {
  const out: HouseRow[] = [];
  for (const it of asArray(v)) {
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    const index = asNumber(o.index) ?? out.length + 1;
    const sign = asString(o.sign);
    if (!sign) continue;
    out.push({ index, sign, cuspDegree: asNumber(o.cuspDegree) ?? asNumber(o.degree) });
  }
  return out;
}

const ASPECT_NAMES = new Set(['conjunction', 'opposition', 'trine', 'square', 'sextile']);

function normalizeAspects(v: unknown): AspectRow[] {
  const out: AspectRow[] = [];
  for (const it of asArray(v)) {
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    const b1 = asString(o.body1) ?? asString(o.from);
    const b2 = asString(o.body2) ?? asString(o.to);
    const type = asString(o.type);
    const orb = asNumber(o.orb);
    if (!b1 || !b2 || !type || orb === undefined) continue;
    if (!ASPECT_NAMES.has(type)) continue;
    if (Math.abs(orb) > ASPECT_TIGHT_ORB) continue;
    out.push({ body1: b1, body2: b2, type, orb });
  }
  return out;
}

let celestineModulePromise: Promise<Record<string, unknown>> | null = null;
async function loadCelestineModule(): Promise<Record<string, unknown>> {
  if (!celestineModulePromise) {
    celestineModulePromise = import('celestine')
      .then((m) => m as unknown as Record<string, unknown>)
      .catch((err) => {
        celestineModulePromise = null;
        throw err;
      });
  }
  return celestineModulePromise;
}

type ComputeFn = (i: AstrolabeInput) => unknown;
const COMPUTE_CANDIDATES = ['computeChart', 'computeNatalChart', 'compute', 'default'];

export async function computeAstrolabeLocal(input: AstrolabeInput): Promise<AstrolabeChart> {
  let mod: Record<string, unknown>;
  try {
    mod = await loadCelestineModule();
  } catch {
    throw new Error('本地西占引擎不可用');
  }

  let fn: ComputeFn | null = null;
  for (const name of COMPUTE_CANDIDATES) {
    const c = mod[name];
    if (typeof c === 'function') {
      fn = c as ComputeFn;
      break;
    }
  }
  if (!fn) throw new Error('本地西占引擎缺少计算入口');

  const raw = fn(input);
  const rawObj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    planets: normalizePlanets(rawObj.planets ?? rawObj.bodies),
    houses: normalizeHouses(rawObj.houses),
    aspects: normalizeAspects(rawObj.aspects),
    raw,
  };
}

const ASPECT_LABEL: Record<string, string> = {
  conjunction: '合',
  opposition: '冲',
  trine: '拱',
  square: '刑',
  sextile: '六合',
};

export function buildAstrolabePrompt(
  chart: AstrolabeChart,
  input: AstrolabeInput,
  question: string,
): string {
  const lines: string[] = [];
  lines.push('【西占本命结构化证据】');
  lines.push(
    `出生时间：${input.year}-${input.month}-${input.day} ${input.hour}:${String(input.minute).padStart(2, '0')}`,
  );
  lines.push(
    `地点：纬度 ${input.latitude}，经度 ${input.longitude}，时区 ${input.timeZoneId ?? input.timezone ?? '—'}`,
  );
  lines.push(`行星（${chart.planets.length}）：`);
  for (const p of chart.planets) {
    lines.push(`- ${p.name}：${p.sign} ${p.degree.toFixed(2)}°${p.retrograde ? ' 逆行' : ''}`);
  }
  if (chart.houses.length) {
    lines.push(`宫位（${chart.houses.length}）：`);
    for (const h of chart.houses) lines.push(`- 第 ${h.index} 宫：${h.sign}`);
  }
  if (chart.aspects.length) {
    lines.push(`主要相位（≤${ASPECT_TIGHT_ORB}°）：`);
    for (const a of chart.aspects) {
      lines.push(
        `- ${a.body1} ${ASPECT_LABEL[a.type] ?? a.type} ${a.body2}（容许度 ${a.orb.toFixed(2)}°）`,
      );
    }
  }
  lines.push('');
  lines.push(`【用户问题】${question}`);
  lines.push('【解释边界】基于传统文化模型给出解释性描述，不做绝对化断言。');
  return lines.join('\n');
}
