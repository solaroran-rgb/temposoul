/**
 * D23-3 ｜ 批4 路由统筹合规配置
 *
 * 本表为平台级合规元数据唯一来源：
 * - ComplianceGuard 在运行时按 pathname 匹配本表，仅对命中表的路由做探针校验；
 *   未命中本表的现有 22 项路由一律放行（不阻断）。
 * - scripts/compliance-audit-batch4.mjs 在 CI 静态解析本表做交叉校验。
 *
 * 字段语义：
 * - isPersonalResult: 该路由是否承载「个人化结果/输入表单」。
 * - requiresNoindex:  该路由是否必须 noindex（个人结果页强制 true）。
 * - disclaimerKey:    免责文案 i18n key（页面据此渲染对应 disclaimer）。
 * - privacyHintRequired: 是否必须渲染 PrivacyHint。
 *
 * 口径说明：A23 任务卡标题写「12 条」，但 R2 方案明文枚举为 3(gufa)+2(mansions)+
 * 1(fengshui-test)+1(qinggong)+3(tarot-learn)=10 条；本表按 R2 已核实路径落 10 条，
 * 差额 2 条待 A23 路由清单最终确认后补登（不在此臆造路径）。
 */

export interface RouteComplianceMeta {
  path: string;
  isPersonalResult: boolean;
  requiresNoindex: boolean;
  disclaimerKey: string;
  privacyHintRequired: boolean;
}

export const BATCH4_ROUTES: readonly RouteComplianceMeta[] = [
  // ── A23（八字/术数深化）10 条，路径以 R2 为准 ──────────────────────
  { path: '/divination/gufa', isPersonalResult: false, requiresNoindex: true, disclaimerKey: 'gufa.boundary.callout', privacyHintRequired: true },
  { path: '/divination/gufa/:school', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'gufa.boundary.callout', privacyHintRequired: true },
  { path: '/divination/gufa/:school/:category', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'gufa.boundary.callout', privacyHintRequired: true },
  { path: '/astrolabe/mansions', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'mansion.boundary.callout', privacyHintRequired: false },
  { path: '/astrolabe/mansions/:id', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'mansion.boundary.callout', privacyHintRequired: true },
  { path: '/divination/fengshui-test', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'fs.boundary.callout', privacyHintRequired: true },
  { path: '/divination/qinggong', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'qinggong.boundary.callout', privacyHintRequired: true },
  { path: '/tarot/learn', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'tarot.boundary.callout', privacyHintRequired: false },
  { path: '/tarot/learn/:group', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'tarot.boundary.callout', privacyHintRequired: true },
  { path: '/tarot/learn/daily', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'tarot.boundary.callout', privacyHintRequired: true },

  // ── B23（星座/灵签/太岁等）6 条 ───────────────────────────────────
  { path: '/astrology/celebrities', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'astrology.celebrity.disclaimer', privacyHintRequired: false },
  { path: '/astrology/celebrities/:id', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'astrology.celebrity.disclaimer', privacyHintRequired: false },
  { path: '/compatibility/birthday', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'compatibility.birthday.disclaimer', privacyHintRequired: true },
  { path: '/lingsign/mazu', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'lingsign.folk.disclaimer', privacyHintRequired: false },
  { path: '/zodiac/buddha', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'zodiac.buddha.folk.disclaimer', privacyHintRequired: false },
  { path: '/zodiac/tai-sui', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'zodiac.taisui.folk.disclaimer', privacyHintRequired: false },

  // ── C23（姓名学/风水知识库）6 条 ──────────────────────────────────
  { path: '/knowledge/fengshui', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'knowledge.fengshui.disclaimer', privacyHintRequired: false },
  { path: '/knowledge/fengshui/:slug', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'knowledge.fengshui.disclaimer', privacyHintRequired: false },
  { path: '/name/english', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'name.english.disclaimer', privacyHintRequired: true },
  { path: '/names/business', isPersonalResult: true, requiresNoindex: true, disclaimerKey: 'names.business.disclaimer', privacyHintRequired: true },
  { path: '/names/catalog', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'names.catalog.disclaimer', privacyHintRequired: false },
  { path: '/names/ranking', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'names.ranking.disclaimer', privacyHintRequired: false },

  // ── D23（商业化/专家预约）3 条 ────────────────────────────────────
  { path: '/names/manual', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'names.manual.disclaimer', privacyHintRequired: true },
  { path: '/names/expert', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'names.expert.disclaimer', privacyHintRequired: true },
  { path: '/names/expert/:id', isPersonalResult: false, requiresNoindex: false, disclaimerKey: 'names.expert.disclaimer', privacyHintRequired: true },
] as const;

/**
 * 将路由模板（含 :param）编译为正则，用于按当前 pathname 命中 meta。
 * 精确匹配：/names/expert 不应命中 /names/expert/:id 的兄弟条目，按最长前缀优先。
 */
function compilePattern(path: string): RegExp {
  const escaped = path
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:[\w]+/g, '[^/]+');
  return new RegExp(`^${escaped}/?$`);
}

/** 按 pathname 查合规 meta；未命中返回 undefined（视为无需平台合规探针）。 */
export function matchRouteCompliance(pathname: string): RouteComplianceMeta | undefined {
  // 最长优先：把带参数的路由放前面匹配
  const sorted = [...BATCH4_ROUTES].sort((a, b) => b.path.length - a.path.length);
  for (const meta of sorted) {
    if (compilePattern(meta.path).test(pathname)) {
      return meta;
    }
  }
  return undefined;
}
