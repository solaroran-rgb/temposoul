/**
 * H01 · 跳转矩阵完整性校验
 *
 * 以 App.tsx + src/router/* + src/routes/* 中实际注册的路由模板为基准，
 * 校验 NAVIGATION_MATRIX：
 * ① 矩阵每个页面 path 均已注册；
 * ② 每条 related 跳转目标命中已注册路由（无死链）；
 * ③ key / path 无重复；④ 跳转目标无残留 :param 模板；
 * ⑤ 核心链路（八字→大运→流年→择日）存在。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NAVIGATION_MATRIX,
  matchNavPage,
  resolveNavigationLinks,
  validateNavigationMatrix,
} from '../src/lib/navigation-matrix';

/**
 * 全站已注册路由模板（2026-09-19 从 App.tsx 与 src/router、src/routes 提取）。
 * 新增路由时必须同步登记，否则矩阵新跳转会被本测试拦截。
 */
const REGISTERED_ROUTE_TEMPLATES: readonly string[] = [
  '*', '/',
  '/account/credits', '/account/points', '/account/rewards',
  '/affiliate',
  '/almanac', '/almanac/calendar', '/almanac/directions', '/almanac/is-lucky/marriage', '/almanac/select',
  '/astro/events',
  '/astrolabe/ephemeris', '/astrolabe/mansions', '/astrolabe/mansions/:id', '/astrolabe/moon-phase',
  '/astrolabe/natal', '/astrolabe/retrograde', '/astrolabe/saturn-return', '/astrolabe/transits',
  '/astrology/celebrities', '/astrology/celebrities/:id', '/astrology/parenting',
  '/astrology/zodiac', '/astrology/zodiac/:signId',
  '/bazi/compatibility', '/bazi/daily', '/bazi/dayun', '/bazi/five-elements', '/bazi/liunian',
  '/bazi/marriage', '/bazi/shensha', '/bazi/shishen', '/bazi/shishen/:key', '/bazi/topics/:topic',
  '/calendar/pick',
  '/community', '/community/board/:boardId', '/community/bounty', '/community/post/:postId', '/community/wall',
  '/compatibility/birthday',
  '/compliance', '/consult', '/consult/advisors/:id', '/consult/apply', '/consult/chat',
  '/consult/free', '/consult/match',
  '/daily/energy', '/daily/engine', '/daily/night', '/daily/today', '/daily-fortune',
  '/divination/birth-code', '/divination/birth-flower', '/divination/cezi', '/divination/chenggu',
  '/divination/dream', '/divination/fengshui-test', '/divination/fingerprint', '/divination/gufa',
  '/divination/gufa/:school', '/divination/gufa/:school/:category', '/divination/love', '/divination/number',
  '/divination/numerology', '/divination/palm', '/divination/qinggong', '/divination/superstition',
  '/divination/zhuge',
  '/experts',
  '/faq', '/favorites',
  '/female/meditation', '/female/moon-cycle',
  '/fengshui/bazhai',
  '/fortune/crystals', '/fortune/daily', '/fortune/rhythm', '/fortune/zodiac-profile',
  '/gems', '/gems/:gem_id',
  '/insights', '/insights/:article_id', '/insights/name-popularity-trends',
  '/kangxi', '/kangxi/:char',
  '/knowledge', '/knowledge/:slug', '/knowledge/astrology/terms', '/knowledge/astrology/terms/:id',
  '/knowledge/astrology-terms', '/knowledge/astrology-terms/:term_id',
  '/knowledge/blood-type', '/knowledge/blood-type/:type',
  '/knowledge/classics', '/knowledge/classics/:slug', '/knowledge/classics-guide', '/knowledge/classics-guide/:id',
  '/knowledge/fengshui', '/knowledge/fengshui/:slug',
  '/knowledge/ganzhi', '/knowledge/parenting', '/knowledge/parenting/:id',
  '/knowledge/planets', '/knowledge/planets/:slug',
  '/knowledge/xiu-degree', '/knowledge/xiu-degree/:xiu',
  '/knowledge/ziwei/pattern-extended', '/knowledge/ziwei/pattern-extended/:id',
  '/knowledge/ziwei-palaces', '/knowledge/ziwei-palaces/:palaceId',
  '/knowledge/ziwei-stars', '/knowledge/ziwei-stars/:starId',
  '/learn/divination', '/learn/divination/:chapter', '/learn/tarot/curriculum', '/learn/tarot/curriculum/:id',
  '/learn/ziwei', '/learn/ziwei/:chapter',
  '/lexicon', '/lightfun', '/lingsign/:code', '/lingsign/mazu', '/login',
  '/membership',
  '/name/compatibility', '/name/english', '/name-report',
  '/names', '/names/business', '/names/catalog', '/names/dictionary', '/names/dictionary/:char',
  '/names/expert', '/names/expert/:id', '/names/manual', '/names/ranking', '/name-test',
  '/news', '/news/:slug', '/newsletter',
  '/partners/creator-syndicate', '/podcast', '/podcast/:channel_id/:ep_id', '/podcasts',
  '/pricing', '/privacy', '/profile',
  '/quiz/western',
  '/qizheng',
  '/records', '/refund', '/register', '/reminders',
  '/reports/hehun', '/reports/hehun/:id', '/reports/ten-dim',
  '/result', '/runes',
  '/search', '/seo', '/seo/:slug', '/services/senior-name-consultant', '/share/birth-chart',
  '/shop', '/sky', '/solution/test', '/summary',
  '/sitemap',
  '/tarot/daily', '/tarot/learn', '/tarot/learn/:group', '/tarot/learn/daily',
  '/tarot/lexicon', '/tarot/lexicon/:slug', '/tarot/spreads', '/tarot/spreads/:spreadId',
  '/tests', '/tools/artisanal-naming', '/tools/birthday-code', '/tools/birthday-code/:mmdd',
  '/tools/birth-flower', '/tools/birth-flower/:month', '/tools/blood-type-fun', '/tools/blood-type-fun/:bt',
  '/tools/brand-naming-engine', '/tools/cezi', '/tools/cezi/:char', '/tools/english-name-persona',
  '/tools/ephemeris', '/tools/eye-twitch-sneeze-fun', '/tools/eye-twitch-sneeze-fun/:shichen',
  '/tools/fingerprint-fun', '/tools/fingerprint-fun/:type',
  '/tools/fun-psych-tests', '/tools/fun-psych-tests/:testId', '/tools/fun-psych-tests/:testId/result/:type',
  '/tools/life-number', '/tools/life-number/:n', '/tools/life-rhythm-calendar', '/tools/limit-year',
  '/tools/love-divination/result', '/tools/love-divination/result/:id',
  '/tools/palmistry', '/tools/qinggong-fun', '/tools/solar-return',
  '/tools/yangzhai-fengshui-test', '/tools/yangzhai-fengshui-test/result/:type',
  '/topics/celebrity-astrology', '/topics/celebrity-astrology/:slug',
  '/tutorial',
  '/video', '/vip',
  '/wiki/astrology', '/wiki/astrology/:id', '/wiki/bone_weight', '/wiki/bone_weight/:id',
  '/wiki/dream', '/wiki/dream/:id', '/wiki/experts', '/wiki/experts/:expert_id',
  '/wiki/four-transform', '/wiki/four-transform/:id', '/wiki/four-transform/overview', '/wiki/four-transform/pairs',
  '/wiki/iching', '/wiki/iching/:id',
  '/wiki/limit-year/:id', '/wiki/limit-year-guide', '/wiki/limit-year-guide/faq',
  '/wiki/number-divination', '/wiki/number-divination/:id',
  '/wiki/palaces', '/wiki/palaces/:id', '/wiki/palace-star', '/wiki/palace-star/:id', '/wiki/palace-star/overview',
  '/wiki/shen-sha', '/wiki/shen-sha/:id', '/wiki/solar-return', '/wiki/solar-return/detail',
  '/wiki/solar-terms', '/wiki/solar-terms/:id', '/wiki/tarot/cards', '/wiki/tarot/cards/:id',
  '/wiki/ten-gods', '/wiki/ten-gods/:id', '/wiki/transits', '/wiki/transits/detail',
  '/wiki/ziwei-patterns', '/wiki/ziwei-patterns/:id', '/wiki/ziwei-stars', '/wiki/ziwei-stars/:id',
  '/wiki/zodiac/encyclopedia', '/wiki/zodiac/encyclopedia/:id', '/wiki/zodiac/personality', '/wiki/zodiac/personality/:id',
  '/yijing/hexagrams', '/yijing/hexagrams/:index',
  '/ziwei/limits', '/ziwei/palaces', '/ziwei/palace-star', '/ziwei/patterns', '/ziwei/patterns/:key',
  '/ziwei/sihua', '/ziwei/stars', '/ziwei/stars/:starId',
  '/zodiac/buddha', '/zodiac/compatibility', '/zodiac/fortune', '/zodiac/tai-sui',
];

test('H01 矩阵：全部页面路径与跳转目标均已注册（无死链）', () => {
  const violations = validateNavigationMatrix(REGISTERED_ROUTE_TEMPLATES);
  assert.deepEqual(violations, [], `矩阵违规：\n${violations.join('\n')}`);
});

test('H01 矩阵：核心链路 八字→大运→流年→择日 存在', () => {
  const links = resolveNavigationLinks('/');
  const keys = links.map((l) => l.key);
  assert.ok(keys.includes('dayun'), '首页应可跳转大运');
  assert.ok(matchNavPage('/bazi/dayun'), '大运页应有矩阵条目');
  const dayunLinks = resolveNavigationLinks('/bazi/dayun');
  assert.ok(dayunLinks.map((l) => l.key).includes('liunian'), '大运页应可跳转流年');
  const liunianLinks = resolveNavigationLinks('/bazi/liunian');
  assert.ok(liunianLinks.map((l) => l.key).includes('almanac-select'), '流年页应可跳转择日');
});

test('H01 矩阵：模板路由可按具体路径解析（/bazi/topics/wealth → 主题页）', () => {
  const page = matchNavPage('/bazi/topics/wealth');
  assert.ok(page, '具体 topic 路径应命中主题页模板');
  assert.equal(page?.key, 'topics');
});

test('H01 矩阵：详情页前缀回退继承父页跳转', () => {
  const links = resolveNavigationLinks('/kangxi/爱');
  assert.ok(links.length > 0, '详情页应回退到父级页面的跳转');
});

test('H01 矩阵：key 唯一且可互相解析', () => {
  const keys = NAVIGATION_MATRIX.map((p) => p.key);
  assert.equal(new Set(keys).size, keys.length, '矩阵 key 不得重复');
  const paths = NAVIGATION_MATRIX.map((p) => p.path);
  assert.equal(new Set(paths).size, paths.length, '矩阵 path 不得重复');
  // 每条 related 引用的 key 必须存在（validateNavigationMatrix 已覆盖，这里再显式确认）
  for (const page of NAVIGATION_MATRIX) {
    for (const ref of page.related) {
      const key = typeof ref === 'string' ? ref : ref.key;
      assert.ok(keys.includes(key), `${page.key} 引用了未定义 key: ${key}`);
    }
  }
});
