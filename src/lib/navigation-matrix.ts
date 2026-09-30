/**
 * H01 · 功能跳转矩阵（navigation-matrix）
 *
 * 全站页面跳转关系的唯一数据源。
 * - 每个页面（NavPage）声明：标题 / 路由模板 / 所属分组 / 自然跳转目标（related）。
 * - related 支持引用式（只给 key，label 与 to 自动取自目标页）与显式覆盖
 *   （{ key, label, to }，用于指向带参数的详情页，如 /bazi/topics/wealth）。
 * - 校验：validateNavigationMatrix(registeredRoutes) 会检查
 *   ① 矩阵路径全部已注册；② 每个 related.to 均命中已注册路由（无死链）；
 *   ③ key/path 无重复；④ related.to 不允许残留 :param 模板（必须是可点击的具体路径）。
 *   tests/navigation-matrix.test.ts 已接入全量路由清单做 CI 校验。
 *
 * 核心链路示例：八字排盘(/) → 大运(/bazi/dayun) → 流年(/bazi/liunian) → 择日(/almanac/select)。
 */

export type NavKey = string;
export type NavGroupId =
  | 'paipan'
  | 'advanced'
  | 'yunshi'
  | 'zhanbu'
  | 'quwei'
  | 'xingming'
  | 'huangli'
  | 'platform'
  | 'knowledge'
  | 'community'
  | 'learn';

export interface NavGroup {
  id: NavGroupId;
  label: string;
}

export interface NavRef {
  key: NavKey;
  /** 缺省时取目标页 title */
  label?: string;
  /** 缺省时取目标页 path；指向带参数页面时必须显式给具体路径 */
  to?: string;
}

export interface NavPage {
  key: NavKey;
  title: string;
  /** 路由模板（与路由表一致，可含 :param） */
  path: string;
  group: NavGroupId;
  desc?: string;
  related: readonly (NavKey | NavRef)[];
}

export interface NavLink {
  key: NavKey;
  label: string;
  to: string;
}

export const NAVIGATION_GROUPS: readonly NavGroup[] = [
  { id: 'paipan', label: '排盘' },
  { id: 'advanced', label: '进阶排盘' },
  { id: 'yunshi', label: '运势' },
  { id: 'zhanbu', label: '占卜' },
  { id: 'quwei', label: '趣味测' },
  { id: 'xingming', label: '姓名' },
  { id: 'huangli', label: '黄历·星座' },
  { id: 'platform', label: '平台' },
  { id: 'knowledge', label: '知识·内容' },
  { id: 'community', label: '社区·商业' },
  { id: 'learn', label: '学习中心' },
] as const;

export const NAVIGATION_MATRIX: readonly NavPage[] = [
  // ── 排盘 ──────────────────────────────────────────────────────────
  { key: 'home', title: '八字排盘', path: '/', group: 'paipan', desc: '四柱/十神/大运流年', related: ['dayun', 'liunian', 'hehun', 'almanac-select', 'name-test', 'ziwei-palaces'] },
  { key: 'result', title: '命理报告', path: '/result', group: 'paipan', desc: '排盘结果总览', related: ['dayun', 'liunian', 'hehun', 'almanac-select', { key: 'topics', to: '/bazi/topics/career', label: '八字主题解读' }, 'name-test'] },
  { key: 'dayun', title: '大运详批', path: '/bazi/dayun', group: 'paipan', desc: '十年一步大运', related: ['liunian', 'home', 'shishen', 'ziwei-limits', { key: 'topics', to: '/bazi/topics/career', label: '八字主题解读' }] },
  { key: 'liunian', title: '流年详批', path: '/bazi/liunian', group: 'paipan', desc: '逐年逐月引动', related: ['dayun', 'bazi-daily', 'astro-events', 'home', 'almanac-select', { key: 'topics', to: '/bazi/topics/career', label: '八字主题解读' }] },
  { key: 'hehun', title: '八字合婚', path: '/bazi/compatibility', group: 'paipan', desc: '双盘合参', related: ['bazi-marriage', 'name-compat', 'birthday-pair', 'home'] },
  { key: 'topics', title: '八字主题解读', path: '/bazi/topics/:topic', group: 'paipan', desc: '事业/财运/婚姻/健康', related: ['dayun', 'liunian', 'five-elements', 'home', { key: 'topics', to: '/bazi/topics/career', label: '事业专题' }] },
  { key: 'five-elements', title: '五行缺失查询', path: '/bazi/five-elements', group: 'paipan', desc: '四柱五行分布', related: ['home', 'shishen', 'names'] },
  { key: 'bazi-daily', title: '八字日运', path: '/bazi/daily', group: 'paipan', desc: '每日干支主题', related: ['liunian', 'dayun', 'almanac'] },
  { key: 'bazi-marriage', title: '婚姻配对', path: '/bazi/marriage', group: 'paipan', desc: '配偶宫/桃花/合婚', related: ['hehun', 'name-compat', 'home'] },
  { key: 'ziwei-palaces', title: '紫微十二宫', path: '/ziwei/palaces', group: 'paipan', desc: '逐宫详解', related: ['ziwei-stars', 'sihua', 'ziwei-patterns', 'home'] },
  { key: 'ziwei-stars', title: '紫微星曜详解', path: '/ziwei/stars', group: 'paipan', desc: '十四主星', related: ['ziwei-palaces', 'ziwei-patterns', 'knowledge-ziwei-stars'] },

  // ── 进阶排盘 ──────────────────────────────────────────────────────
  { key: 'shishen', title: '十神详解', path: '/bazi/shishen', group: 'advanced', desc: '十神百科', related: ['home', 'shensha', 'five-elements', 'lexicon'] },
  { key: 'shensha', title: '神煞专题', path: '/bazi/shensha', group: 'advanced', desc: '神煞起法查询', related: ['home', 'shishen', 'lexicon'] },
  { key: 'sihua', title: '紫微四化', path: '/ziwei/sihua', group: 'advanced', desc: '禄权科忌', related: ['ziwei-palaces', 'ziwei-stars', 'ziwei-patterns'] },
  { key: 'ziwei-patterns', title: '紫微格局', path: '/ziwei/patterns', group: 'advanced', desc: '杀破狼等格局', related: ['ziwei-palaces', 'sihua', { key: 'knowledge-ziwei-patterns', to: '/knowledge/ziwei/pattern-extended', label: '格局详解库' }] },
  { key: 'ziwei-limits', title: '紫微限运', path: '/ziwei/limits', group: 'advanced', desc: '大限小限解析', related: ['dayun', 'liunian', 'ziwei-palaces'] },
  { key: 'palace-star', title: '宫星组合', path: '/ziwei/palace-star', group: 'advanced', desc: '宫位×星曜', related: ['ziwei-palaces', 'ziwei-stars'] },
  { key: 'natal', title: '西占本命盘', path: '/astrolabe/natal', group: 'advanced', desc: '行星/相位/宫位', related: ['transits', 'retrograde', 'moon-phase', 'astro-events'] },
  { key: 'transits', title: '西占行运盘', path: '/astrolabe/transits', group: 'advanced', desc: '行运/返照', related: ['natal', 'retrograde', 'astro-events'] },
  { key: 'ephemeris', title: '西占星历', path: '/astrolabe/ephemeris', group: 'advanced', desc: '星历表', related: ['natal', 'transits', 'astro-events'] },
  { key: 'retrograde', title: '西占逆行', path: '/astrolabe/retrograde', group: 'advanced', desc: '水逆/土星回归', related: ['natal', 'transits', 'saturn-return', 'astro-events'] },
  { key: 'moon-phase', title: '月相盘', path: '/astrolabe/moon-phase', group: 'advanced', desc: '新月/满月能量', related: ['natal', 'astro-events', 'zodiac-fortune'] },
  { key: 'saturn-return', title: '土星回归', path: '/astrolabe/saturn-return', group: 'advanced', desc: '29 年周期节点', related: ['natal', 'transits', 'retrograde'] },
  { key: 'mansions', title: '二十八宿星区', path: '/astrolabe/mansions', group: 'advanced', desc: '星宿分区解读', related: ['xiu-degree', 'natal', 'moon-phase'] },

  // ── 运势 ──────────────────────────────────────────────────────────
  { key: 'daily-fortune', title: '每日一签', path: '/daily-fortune', group: 'yunshi', desc: '日更灵签', related: [{ key: 'lingsign', to: '/lingsign/guanyin', label: '灵签五套' }, 'mazu', 'zodiac-fortune', 'fortune-daily'] },
  { key: 'lingsign', title: '灵签五套', path: '/lingsign/:code', group: 'yunshi', desc: '观音/关帝/黄大仙/月老/吕祖', related: ['daily-fortune', 'mazu', 'zhuge'] },
  { key: 'mazu', title: '妈祖灵签', path: '/lingsign/mazu', group: 'yunshi', desc: '六十甲子签', related: [{ key: 'lingsign', to: '/lingsign/guanyin', label: '灵签五套' }, 'daily-fortune'] },
  { key: 'zodiac-fortune', title: '生肖运势', path: '/zodiac/fortune', group: 'yunshi', desc: '今日/本周/本月/年运', related: ['tai-sui', 'zodiac-compat', 'buddha', 'daily-fortune'] },
  { key: 'zodiac-compat', title: '星座配对', path: '/zodiac/compatibility', group: 'yunshi', desc: '多维契合度', related: ['birthday-pair', 'fortune-daily', 'zodiac-profile'] },
  { key: 'birthday-pair', title: '生日配对', path: '/compatibility/birthday', group: 'yunshi', desc: '生日三缘分配对', related: ['zodiac-compat', 'hehun', 'name-compat'] },
  { key: 'rhythm', title: '每日节律', path: '/fortune/rhythm', group: 'yunshi', desc: '身体节律提醒', related: ['energy', 'reminders', 'calendar-pick'] },
  { key: 'astro-events', title: '星象日历', path: '/astro/events', group: 'yunshi', desc: '新月/满月/水逆', related: ['natal', 'moon-phase', 'retrograde', 'ephemeris'] },
  { key: 'zodiac-profile', title: '星座命盘', path: '/fortune/zodiac-profile', group: 'yunshi', desc: '性格/爱情/事业', related: ['fortune-daily', 'zodiac-compat', 'natal'] },
  { key: 'buddha', title: '生肖本命佛', path: '/zodiac/buddha', group: 'yunshi', desc: '八大守护神', related: ['zodiac-fortune', 'tai-sui'] },
  { key: 'tai-sui', title: '太岁查询', path: '/zodiac/tai-sui', group: 'yunshi', desc: '本命年/犯太岁', related: ['zodiac-fortune', 'buddha'] },
  { key: 'crystals', title: '水晶开运', path: '/fortune/crystals', group: 'yunshi', desc: '宝石开运', related: ['gems', 'zodiac-fortune'] },
  { key: 'gems', title: '水晶宝石图鉴', path: '/gems', group: 'yunshi', desc: '12 种晶石文化寓意', related: ['crystals', 'zodiac-fortune', 'shop'] },
  { key: 'fortune-daily', title: '星座日运', path: '/fortune/daily', group: 'yunshi', desc: '12 星座每日运势', related: ['daily-fortune', 'zodiac-compat', 'astro-events'] },

  // ── 占卜 ──────────────────────────────────────────────────────────
  { key: 'zhuge', title: '诸葛神数', path: '/divination/zhuge', group: 'zhanbu', desc: '384 签文库', related: [{ key: 'lingsign', to: '/lingsign/guanyin', label: '灵签五套' }, 'daily-fortune', 'chenggu'] },
  { key: 'spreads', title: '塔罗牌阵', path: '/tarot/spreads', group: 'zhanbu', desc: '16 种牌阵', related: ['tarot-daily', 'tarot-lexicon', 'tarot-learn'] },
  { key: 'tarot-daily', title: '塔罗日运', path: '/tarot/daily', group: 'zhanbu', desc: '每日抽牌', related: ['spreads', 'tarot-lexicon', 'daily-fortune'] },
  { key: 'tarot-lexicon', title: '塔罗辞典', path: '/tarot/lexicon', group: 'zhanbu', desc: '78 张牌义', related: ['spreads', 'tarot-learn'] },
  { key: 'tarot-learn', title: '塔罗学习', path: '/tarot/learn', group: 'zhanbu', desc: '互动课程', related: ['tarot-lexicon', 'spreads', 'learn-tarot'] },
  { key: 'runes', title: '卢恩符文', path: '/runes', group: 'zhanbu', desc: '如尼符文占卜', related: ['hexagrams', 'cezi', 'zhuge'] },
  { key: 'palmistry', title: '手相', path: '/tools/palmistry', group: 'zhanbu', desc: '三大主线文化辞典', related: ['cezi', 'fingerprint', 'numerology'] },
  { key: 'gufa', title: '古法论命', path: '/divination/gufa', group: 'zhanbu', desc: '三流派语料', related: ['home', 'shishen', 'shensha'] },
  { key: 'fengshui-test', title: '阳宅风水测试', path: '/divination/fengshui-test', group: 'zhanbu', desc: '8 题自测', related: ['almanac', 'directions', 'qinggong', 'knowledge-fengshui'] },
  { key: 'superstition', title: '眼跳喷嚏', path: '/divination/superstition', group: 'zhanbu', desc: '测吉凶民俗', related: ['lightfun', 'almanac', 'eye-twitch'] },
  { key: 'hexagrams', title: '易经六十四卦', path: '/yijing/hexagrams', group: 'zhanbu', desc: '卦辞爻辞详解', related: ['runes', 'zhuge', 'lexicon'] },
  { key: 'chenggu', title: '称骨算命', path: '/divination/chenggu', group: 'zhanbu', desc: '出生年月日时称骨', related: ['zhuge', 'number-fortune', 'birthday-code'] },
  { key: 'number-fortune', title: '数字吉凶', path: '/divination/number', group: 'zhanbu', desc: '数字能量解读', related: ['life-number', 'chenggu', 'numerology'] },
  { key: 'dream', title: '解梦', path: '/divination/dream', group: 'zhanbu', desc: '梦境寓意解析', related: ['lightfun', 'superstition'] },
  { key: 'love-divination', title: '爱情占卜', path: '/divination/love', group: 'zhanbu', desc: '缘分/复合/桃花', related: ['hehun', 'name-compat', 'tarot-daily'] },
  { key: 'qinggong', title: '清宫生男生女', path: '/divination/qinggong', group: 'zhanbu', desc: '民俗推算', related: ['fengshui-test', 'lightfun'] },
  { key: 'numerology', title: '数字命理', path: '/divination/numerology', group: 'zhanbu', desc: '灵数命理分析', related: ['life-number', 'number-fortune', 'birth-code'] },
  { key: 'birth-code', title: '生日密码', path: '/divination/birth-code', group: 'zhanbu', desc: '日期性格解读', related: ['birth-flower', 'birthday-code', 'life-number'] },
  { key: 'birth-flower', title: '生日花语', path: '/divination/birth-flower', group: 'zhanbu', desc: '生辰花语', related: ['birth-code', 'life-number'] },
  { key: 'cezi', title: '测字', path: '/tools/cezi', group: 'zhanbu', desc: '单字文化拆解', related: ['kangxi', 'palmistry', 'zhuge'] },
  { key: 'fingerprint', title: '指纹趣味', path: '/tools/fingerprint-fun', group: 'zhanbu', desc: '九种指纹形态', related: ['palmistry', 'cezi', 'lightfun'] },
  { key: 'life-number', title: '生命灵数', path: '/tools/life-number', group: 'zhanbu', desc: '1-9 主命数', related: ['numerology', 'number-fortune', 'birth-code'] },
  { key: 'birthday-code', title: '生日密码趣味', path: '/tools/birthday-code', group: 'zhanbu', desc: '366 档日期解读', related: ['birth-flower', 'life-number', 'chenggu'] },

  // ── 趣味测 ────────────────────────────────────────────────────────
  { key: 'lightfun', title: '轻娱乐大全', path: '/lightfun', group: 'quwei', desc: '十二款趣味工具总览', related: ['cezi', 'fingerprint', 'life-number', 'birthday-code', 'blood-type-fun', 'psych'] },
  { key: 'psych', title: '心理趣味小测', path: '/tools/fun-psych-tests', group: 'quwei', desc: '三套自我觉察', related: ['blood-type-fun', 'lightfun', 'tests'] },
  { key: 'blood-type-fun', title: '血型趣味说', path: '/tools/blood-type-fun', group: 'quwei', desc: 'ABO 文化印象', related: ['psych', 'knowledge-blood-type', 'lightfun'] },
  { key: 'eye-twitch', title: '眼跳喷嚏趣味', path: '/tools/eye-twitch-sneeze-fun', group: 'quwei', desc: '十二时辰民俗', related: ['superstition', 'lightfun'] },
  { key: 'celebrity-astro', title: '名人星盘', path: '/topics/celebrity-astrology', group: 'quwei', desc: '历史人物侧写', related: ['celebrities', 'zodiac-profile'] },
  { key: 'xiu-degree', title: '二十八宿', path: '/knowledge/xiu-degree', group: 'quwei', desc: '星宿象征参考', related: ['mansions', 'ganzhi', 'almanac'] },
  { key: 'yangzhai', title: '阳宅趣味测', path: '/tools/yangzhai-fengshui-test', group: 'quwei', desc: '整理倾向自测', related: ['fengshui-test', 'lightfun'] },
  { key: 'solar-return', title: '太阳返照', path: '/tools/solar-return', group: 'quwei', desc: '年度返照盘', related: ['natal', 'transits', 'retrograde'] },
  { key: 'limit-year', title: '限年工具', path: '/tools/limit-year', group: 'quwei', desc: '大限流年速查', related: ['ziwei-limits', 'dayun', 'liunian'] },
  { key: 'love-divination-tool', title: '爱情占卜结果', path: '/tools/love-divination/result', group: 'quwei', desc: '缘分速测结果', related: ['love-divination', 'hehun', 'name-compat'] },

  // ── 姓名 ──────────────────────────────────────────────────────────
  { key: 'name-test', title: '姓名测试', path: '/name-test', group: 'xingming', desc: '三才五格打分', related: ['names', 'name-report', 'kangxi'] },
  { key: 'name-compat', title: '姓名配对', path: '/name/compatibility', group: 'xingming', desc: '双名契合分析', related: ['hehun', 'birthday-pair', 'name-test'] },
  { key: 'names', title: '智能起名', path: '/names', group: 'xingming', desc: '八字补益起名', related: ['name-test', 'name-report', 'name-dictionary', 'name-ranking'] },
  { key: 'name-report', title: '名字报告', path: '/name-report', group: 'xingming', desc: '深度测名报告', related: ['name-test', 'names', 'name-expert'] },
  { key: 'kangxi', title: '康熙字典', path: '/kangxi', group: 'xingming', desc: '3500 字笔画五行', related: ['name-test', 'name-dictionary', 'names'] },
  { key: 'share', title: '生辰卡分享', path: '/share/birth-chart', group: 'xingming', desc: '生成可分享卡片', related: ['home', 'name-report', 'records'] },
  { key: 'english-name', title: '英文名测试', path: '/name/english', group: 'xingming', desc: '英文名/网名', related: ['name-test', 'english-persona', 'names'] },
  { key: 'brand-naming', title: '公司起名引擎', path: '/tools/brand-naming-engine', group: 'xingming', desc: '品牌定位方法论', related: ['business-name', 'artisanal', 'name-test'] },
  { key: 'artisanal', title: '手工起名', path: '/tools/artisanal-naming', group: 'xingming', desc: '50 汉字心理意象', related: ['brand-naming', 'business-name', 'manual-naming'] },
  { key: 'senior-consult', title: '顾问测名', path: '/services/senior-name-consultant', group: 'xingming', desc: '多维度解读', related: ['name-test', 'name-expert', 'manual-naming'] },
  { key: 'name-dictionary', title: '起名百科', path: '/names/dictionary', group: 'xingming', desc: '五行用字库', related: ['kangxi', 'name-test', 'names'] },
  { key: 'name-catalog', title: '名字大全', path: '/names/catalog', group: 'xingming', desc: '海量名字', related: ['name-ranking', 'name-dictionary', 'names'] },
  { key: 'name-ranking', title: '名字热度榜', path: '/names/ranking', group: 'xingming', desc: '名字排行', related: ['name-catalog', 'names'] },
  { key: 'manual-naming', title: '手工起名服务', path: '/names/manual', group: 'xingming', desc: '大师手工起名', related: ['name-expert', 'business-name', 'name-test'] },
  { key: 'name-expert', title: '大师测名', path: '/names/expert', group: 'xingming', desc: '专家点评', related: ['name-test', 'manual-naming', 'name-report'] },
  { key: 'business-name', title: '公司起名', path: '/names/business', group: 'xingming', desc: '店铺/商名', related: ['brand-naming', 'name-test', 'manual-naming'] },
  { key: 'english-persona', title: '英文名人格测试', path: '/tools/english-name-persona', group: 'xingming', desc: '社交面具与内在驱动', related: ['english-name', 'name-test'] },
  { key: 'life-rhythm-calendar', title: '节律月历', path: '/tools/life-rhythm-calendar', group: 'xingming', desc: '2026 节气能量', related: ['rhythm', 'energy', 'almanac'] },

  // ── 黄历·星座 ─────────────────────────────────────────────────────
  { key: 'almanac', title: '今日黄历', path: '/almanac', group: 'huangli', desc: '每日宜忌/冲煞', related: ['almanac-select', 'almanac-calendar', 'is-lucky', 'directions'] },
  { key: 'almanac-select', title: '择日工具', path: '/almanac/select', group: 'huangli', desc: '搬家/结婚/开业吉日', related: ['almanac', 'almanac-calendar', 'is-lucky', 'calendar-pick'] },
  { key: 'almanac-calendar', title: '万年历', path: '/almanac/calendar', group: 'huangli', desc: '农历公历对照', related: ['almanac', 'almanac-select'] },
  { key: 'is-lucky', title: '婚嫁吉日', path: '/almanac/is-lucky/marriage', group: 'huangli', desc: '今日吉凶判定', related: ['almanac', 'almanac-select', 'hehun'] },
  { key: 'directions', title: '吉位煞向', path: '/almanac/directions', group: 'huangli', desc: '每日吉时方位', related: ['almanac', 'almanac-select', 'energy'] },
  { key: 'zodiac-wiki', title: '星座百科', path: '/astrology/zodiac', group: 'huangli', desc: '四元素×三特质', related: ['zodiac-profile', 'fortune-daily', 'zodiac-compat'] },
  { key: 'celebrities', title: '星座名人', path: '/astrology/celebrities', group: 'huangli', desc: '名人星盘资料', related: ['celebrity-astro', 'zodiac-wiki'] },
  { key: 'parenting', title: '育儿占星', path: '/astrology/parenting', group: 'huangli', desc: '亲子关系参考', related: ['zodiac-wiki', 'knowledge-parenting'] },
  { key: 'astrology-wiki', title: '占星 Wiki', path: '/wiki/astrology', group: 'huangli', desc: '行星/宫位/相位', related: ['natal', 'transits', 'zodiac-wiki'] },
  { key: 'calendar-pick', title: '择时工具', path: '/calendar/pick', group: 'huangli', desc: '选日子/选时辰', related: ['almanac-select', 'energy', 'almanac'] },

  // ── 平台 ──────────────────────────────────────────────────────────
  { key: 'search', title: '站内搜索', path: '/search', group: 'platform', desc: '全站功能/文章', related: ['lexicon', 'knowledge', 'records'] },
  { key: 'knowledge', title: '知识库', path: '/knowledge', group: 'platform', desc: '干支/五行/神煞/文章', related: ['ganzhi', 'lexicon', 'search'] },
  { key: 'faq', title: '常见问题', path: '/faq', group: 'platform', desc: 'FAQ', related: ['compliance', 'refund', 'pricing'] },
  { key: 'favorites', title: '我的收藏', path: '/favorites', group: 'platform', desc: '收藏功能', related: ['profile', 'records'] },
  { key: 'profile', title: '个人中心', path: '/profile', group: 'platform', desc: '资料与偏好', related: ['records', 'favorites', 'membership'] },
  { key: 'pricing', title: '订阅定价', path: '/pricing', group: 'platform', desc: '会员与报告', related: ['membership', 'vip', 'ten-dim'] },
  { key: 'membership', title: '会员中心', path: '/membership', group: 'platform', desc: '订阅与会员权益', related: ['pricing', 'vip', 'points'] },
  { key: 'ten-dim', title: 'AI 十维报告', path: '/reports/ten-dim', group: 'platform', desc: '付费深度报告', related: ['pricing', 'membership', 'summary'] },
  { key: 'refund', title: '退款申诉', path: '/refund', group: 'platform', desc: '一键取消/退款', related: ['faq', 'compliance', 'membership'] },
  { key: 'reminders', title: '提醒', path: '/reminders', group: 'platform', desc: '每日节律提醒', related: ['rhythm', 'energy', 'profile'] },
  { key: 'records', title: '历史记录', path: '/records', group: 'platform', desc: '排盘占卜历史', related: ['profile', 'favorites', 'home'] },
  { key: 'lexicon', title: '词库', path: '/lexicon', group: 'platform', desc: '1180+ 命理术语', related: ['knowledge', 'search', 'shishen'] },
  { key: 'compliance', title: '合规中心', path: '/compliance', group: 'platform', desc: '条款/隐私/投诉', related: ['faq', 'privacy'] },
  { key: 'privacy', title: '隐私政策', path: '/privacy', group: 'platform', desc: '隐私条款', related: ['compliance', 'faq'] },
  { key: 'tutorial', title: '新手教程', path: '/tutorial', group: 'platform', desc: '平台使用指南', related: ['home', 'faq', 'knowledge'] },
  { key: 'vip', title: 'VIP 会员', path: '/vip', group: 'platform', desc: 'VIP 会员权益', related: ['pricing', 'membership', 'ten-dim'] },
  { key: 'points', title: '积分中心', path: '/account/points', group: 'platform', desc: '积分展示与任务', related: ['rewards', 'credits', 'membership'] },
  { key: 'rewards', title: '奖励中心', path: '/account/rewards', group: 'platform', desc: '任务/流水', related: ['points', 'credits'] },
  { key: 'credits', title: '积分充值', path: '/account/credits', group: 'platform', desc: '充值档位', related: ['points', 'rewards', 'pricing'] },

  // ── 知识·内容 ─────────────────────────────────────────────────────
  { key: 'ganzhi', title: '干支知识', path: '/knowledge/ganzhi', group: 'knowledge', desc: '天干地支专题', related: ['xiu-degree', 'almanac', 'lexicon'] },
  { key: 'knowledge-fengshui', title: '风水知识', path: '/knowledge/fengshui', group: 'knowledge', desc: '阳宅风水文章', related: ['fengshui-test', 'directions'] },
  { key: 'knowledge-blood-type', title: '血型知识', path: '/knowledge/blood-type', group: 'knowledge', desc: '血型性格', related: ['blood-type-fun', 'knowledge'] },
  { key: 'planets', title: '行星百科', path: '/knowledge/planets', group: 'knowledge', desc: '行星/星座词条', related: ['natal', 'astrology-wiki', 'transits'] },
  { key: 'classics', title: '经典典籍', path: '/knowledge/classics', group: 'knowledge', desc: '国学原典选读', related: ['lexicon', 'hexagrams', 'ganzhi'] },
  { key: 'knowledge-ziwei-stars', title: '紫微星曜库', path: '/knowledge/ziwei-stars', group: 'knowledge', desc: '十四主星百科', related: ['ziwei-stars', 'knowledge-ziwei-palaces'] },
  { key: 'knowledge-ziwei-palaces', title: '紫微宫位库', path: '/knowledge/ziwei-palaces', group: 'knowledge', desc: '十二宫百科', related: ['ziwei-palaces', 'knowledge-ziwei-stars'] },
  { key: 'knowledge-ziwei-patterns', title: '格局详解库', path: '/knowledge/ziwei/pattern-extended', group: 'knowledge', desc: '紫微 10 大主格局', related: ['ziwei-patterns', 'sihua', 'ziwei-palaces'] },
  { key: 'knowledge-parenting', title: '育儿占星指南', path: '/knowledge/parenting', group: 'knowledge', desc: '12 星座养育参考', related: ['parenting', 'zodiac-wiki'] },
  { key: 'video', title: '视频频道', path: '/video', group: 'knowledge', desc: '命理视频', related: ['news', 'podcast', 'knowledge'] },
  { key: 'news', title: '新闻资讯', path: '/news', group: 'knowledge', desc: '运势文化资讯', related: ['video', 'insights', 'podcast'] },
  { key: 'insights', title: '运势资讯', path: '/insights', group: 'knowledge', desc: '节气/水逆/食相文章', related: ['news', 'video', 'almanac'] },
  { key: 'podcast', title: '民俗轻谈播客', path: '/podcast', group: 'knowledge', desc: '30 集播客节目', related: ['video', 'news', 'insights'] },
  { key: 'newsletter', title: '订阅邮件', path: '/newsletter', group: 'knowledge', desc: '邮件订阅', related: ['news', 'insights', 'video'] },
  { key: 'seo-content', title: '内容文章', path: '/seo', group: 'knowledge', desc: 'SEO 内容页', related: ['knowledge', 'news', 'insights'] },

  // ── 社区·商业 ─────────────────────────────────────────────────────
  { key: 'community', title: '社区论坛', path: '/community', group: 'community', desc: '版块/帖子/互动', related: ['bounty', 'wall', 'profile'] },
  { key: 'bounty', title: '悬赏任务', path: '/community/bounty', group: 'community', desc: '征集与打赏', related: ['community', 'wall', 'points'] },
  { key: 'wall', title: '分享墙', path: '/community/wall', group: 'community', desc: '用户成果墙', related: ['community', 'bounty', 'share'] },
  { key: 'consult', title: '在线咨询', path: '/consult', group: 'community', desc: '咨询师列表/匹配', related: ['experts', 'free-trial', 'match'] },
  { key: 'experts', title: '专家团队', path: '/experts', group: 'community', desc: '专家展示', related: ['consult', 'name-expert'] },
  { key: 'free-trial', title: '免费咨询', path: '/consult/free', group: 'community', desc: '首次免费体验', related: ['consult', 'experts', 'match'] },
  { key: 'match', title: '咨询匹配', path: '/consult/match', group: 'community', desc: '智能匹配咨询师', related: ['consult', 'free-trial', 'experts'] },
  { key: 'shop', title: '商城', path: '/shop', group: 'community', desc: '民俗文创商品', related: ['gems', 'crystals', 'rewards'] },
  { key: 'affiliate', title: '联盟营销', path: '/affiliate', group: 'community', desc: '分佣层级', related: ['pricing', 'vip', 'partners'] },
  { key: 'partners', title: '创作者联盟', path: '/partners/creator-syndicate', group: 'community', desc: '分佣与合规', related: ['affiliate', 'community'] },
  { key: 'summary', title: '综合摘要', path: '/summary', group: 'community', desc: '多维度汇总', related: ['ten-dim', 'home', 'records'] },
  { key: 'energy', title: '每日能量', path: '/daily/energy', group: 'community', desc: '财神方位/幸运色/避忌', related: ['rhythm', 'almanac', 'directions'] },
  { key: 'daily-today', title: '今日日运', path: '/daily/today', group: 'community', desc: '每日综合日运', related: ['energy', 'rhythm', 'daily-fortune'] },
  { key: 'daily-engine', title: '日运引擎', path: '/daily/engine', group: 'community', desc: '日运生成引擎', related: ['daily-today', 'energy', 'zodiac-fortune'] },
  { key: 'night-review', title: '睡前回顾', path: '/daily/night', group: 'community', desc: '晚间能量回顾', related: ['daily-today', 'energy'] },
  { key: 'tests', title: '自测中心', path: '/tests', group: 'community', desc: '趣味/专业自测', related: ['quiz-western', 'psych', 'lightfun'] },
  { key: 'quiz-western', title: '西占测验', path: '/quiz/western', group: 'community', desc: '占星风格测试', related: ['natal', 'tests', 'zodiac-profile'] },
  { key: 'reports-hehun', title: '合婚报告', path: '/reports/hehun', group: 'community', desc: '深度合婚报告', related: ['hehun', 'ten-dim', 'summary'] },

  // ── 学习中心 ──────────────────────────────────────────────────────
  { key: 'learn-div', title: '占卜学习', path: '/learn/divination', group: 'learn', desc: '占卜系统课程', related: ['tarot-learn', 'spreads', 'learn-tarot'] },
  { key: 'learn-tarot', title: '塔罗三阶学习', path: '/learn/tarot/curriculum', group: 'learn', desc: '19 课从愚者到世界', related: ['tarot-learn', 'tarot-lexicon', 'spreads'] },
  { key: 'learn-ziwei', title: '紫微学习', path: '/learn/ziwei', group: 'learn', desc: '紫微系统课程', related: ['ziwei-palaces', 'ziwei-stars', 'sihua'] },
] as const;

const BY_KEY = new Map<NavKey, NavPage>(NAVIGATION_MATRIX.map((p) => [p.key, p]));

export function getNavPage(key: NavKey): NavPage | undefined {
  return BY_KEY.get(key);
}

export function getNavGroup(groupId: NavGroupId): NavPage[] {
  return NAVIGATION_MATRIX.filter((p) => p.group === groupId);
}

function normalizePath(p: string): string {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p || '/';
}

function templateToRegExp(tpl: string): RegExp {
  const escaped = tpl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:[\w]+/g, '[^/]+');
  return new RegExp(`^${escaped}$`);
}

/** 将引用解析为可点击链接；引用目标缺失时返回安全占位（key/label 保留、to 为 '#'）。 */
function resolveRef(ref: NavKey | NavRef): NavLink {
  const key = typeof ref === 'string' ? ref : ref.key;
  const page = BY_KEY.get(key);
  if (!page) {
    return { key, label: typeof ref === 'string' ? ref : (ref.label ?? ref.key), to: '#' };
  }
  return {
    key,
    label: typeof ref === 'string' ? page.title : (ref.label ?? page.title),
    to: typeof ref === 'string' ? page.path : (ref.to ?? page.path),
  };
}

/** 按 pathname 匹配矩阵页（模板感知，最长匹配优先）。 */
export function matchNavPage(pathname: string): NavPage | undefined {
  const path = normalizePath(pathname);
  let best: NavPage | undefined;
  for (const page of NAVIGATION_MATRIX) {
    const tpl = normalizePath(page.path);
    if (templateToRegExp(tpl).test(path) && (!best || tpl.length > normalizePath(best.path).length)) {
      best = page;
    }
  }
  return best;
}

/** 详情页回退：未精确命中时逐级向上取父级页面（如 /wiki/ten-gods/xx → /wiki/astrology 未命中则继续上溯）。 */
function matchNavPageByPrefix(pathname: string): NavPage | undefined {
  const segments = pathname.split('/').filter(Boolean);
  for (let depth = segments.length - 1; depth >= 1; depth -= 1) {
    const parent = `/${segments.slice(0, depth).join('/')}`;
    const page = matchNavPage(parent);
    if (page) return page;
  }
  return undefined;
}

/**
 * 解析当前页面的自然跳转目标。
 * 精确命中矩阵 → 返回其 related；未命中 → 前缀回退；仍无 → 空数组（消费方可静默隐藏）。
 */
export function resolveNavigationLinks(pathname: string): NavLink[] {
  const page = matchNavPage(pathname) ?? matchNavPageByPrefix(pathname);
  if (!page) return [];
  return page.related.map(resolveRef);
}

/**
 * 矩阵完整性校验（CI/测试调用）。
 * registeredRoutes：路由表中全部 path 模板（含 :param）。
 * 返回违规列表；空数组即通过。
 */
export function validateNavigationMatrix(registeredRoutes: readonly string[]): string[] {
  const violations: string[] = [];
  const keys = new Set<string>();
  const paths = new Set<string>();
  const registered = registeredRoutes.map(normalizePath);

  for (const page of NAVIGATION_MATRIX) {
    if (keys.has(page.key)) violations.push(`[matrix] 重复 key: ${page.key}`);
    keys.add(page.key);
    if (paths.has(page.path)) violations.push(`[matrix] 重复 path: ${page.path}`);
    paths.add(page.path);
    if (!registered.includes(normalizePath(page.path))) {
      violations.push(`[matrix] 页面路径未注册: ${page.path}`);
    }
    for (const ref of page.related) {
      const link = resolveRef(ref);
      if (link.to === '#') {
        violations.push(`[matrix] ${page.key} 引用了未定义的 key: ${ref}`);
        continue;
      }
      if (link.to.includes(':')) {
        violations.push(`[matrix] ${page.key} → ${link.key} 的 to 仍是模板(含 :param)，需给具体路径`);
        continue;
      }
      if (!registered.some((r) => templateToRegExp(r).test(link.to))) {
        violations.push(`[matrix] ${page.key} → ${link.key} 死链: ${link.to}`);
      }
    }
  }
  return violations;
}
