import { LIGHTFUN_REGISTRY, type LightFunSlug } from './lightfun.registry';
import type { RouteMeta } from './lightfun.types';

// 扁平化：每个实际路由路径一条记录（用于与 884 基线比对）
export interface FlatRoute {
  readonly slug: LightFunSlug;
  readonly item_id: string;
  readonly path: string;
  readonly params: readonly string[];
}

// 每项的完整子路由清单（含基路径 + 参数路由）
const SUBROUTES: Record<LightFunSlug, readonly string[]> = {
  cezi: ['/tools/cezi', '/tools/cezi/[char]'],
  'fingerprint-fun': ['/tools/fingerprint-fun', '/tools/fingerprint-fun/[type]'],
  'life-number': ['/tools/life-number', '/tools/life-number/[n]'],
  'birthday-code': ['/tools/birthday-code', '/tools/birthday-code/[mm-dd]'],
  'birth-flower': ['/tools/birth-flower', '/tools/birth-flower/[month]'],
  'fun-psych-tests': [
    '/tools/fun-psych-tests',
    '/tools/fun-psych-tests/[test_id]',
    '/tools/fun-psych-tests/[test_id]/result/[type]',
  ],
  'blood-type-fun': ['/tools/blood-type-fun', '/tools/blood-type-fun/[A|B|AB|O]'],
  'qinggong-fun': ['/tools/qinggong-fun'],
  'eye-twitch-sneeze-fun': [
    '/tools/eye-twitch-sneeze-fun',
    '/tools/eye-twitch-sneeze-fun/[shichen]',
  ],
  'celebrity-astrology': ['/topics/celebrity-astrology', '/topics/celebrity-astrology/[slug]'],
  'xiu-degree': ['/knowledge/xiu-degree', '/knowledge/xiu-degree/[xiu]'],
  'yangzhai-fengshui-test': [
    '/tools/yangzhai-fengshui-test',
    '/tools/yangzhai-fengshui-test/result/[type]',
  ],
};

export const LIGHTFUN_ITEMS: readonly { slug: LightFunSlug; route: RouteMeta }[] = (
  Object.keys(LIGHTFUN_REGISTRY) as LightFunSlug[]
).map((slug) => ({
  slug,
  route: LIGHTFUN_REGISTRY[slug].route,
}));

export const LIGHTFUN_FLAT_ROUTES: readonly FlatRoute[] = LIGHTFUN_ITEMS.flatMap(
  ({ slug, route }) =>
    (SUBROUTES[slug] ?? [route.path]).map((path) => ({
      slug,
      item_id: LIGHTFUN_REGISTRY[slug].item_id,
      path,
      params: route.params,
    })),
);

// ========== 模块级断言 ==========
const EXPECTED_ITEMS = 12;
const EXPECTED_ROUTES = 24;

if (LIGHTFUN_ITEMS.length !== EXPECTED_ITEMS) {
  throw new Error(`[lightfun] expect ${EXPECTED_ITEMS} items, got ${LIGHTFUN_ITEMS.length}`);
}
if (LIGHTFUN_FLAT_ROUTES.length !== EXPECTED_ROUTES) {
  throw new Error(
    `[lightfun] expect ${EXPECTED_ROUTES} routes, got ${LIGHTFUN_FLAT_ROUTES.length}`,
  );
}
for (const { slug, route } of LIGHTFUN_ITEMS) {
  if (route.conflicts_with_884) {
    throw new Error(`[lightfun] route conflict: ${slug} -> ${route.path}`);
  }
}
// 路由唯一性
const seen = new Set<string>();
for (const r of LIGHTFUN_FLAT_ROUTES) {
  if (seen.has(r.path)) throw new Error(`[lightfun] duplicate route: ${r.path}`);
  seen.add(r.path);
}
