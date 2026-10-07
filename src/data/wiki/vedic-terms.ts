import type { AstroWikiEntry } from './zodiac';

/**
 * 吠陀占星（Jyotish）基础术语卡（V3 环节 1 内容补全）
 *
 * 覆盖：Ayanamsa 岁差 / Nakshatra 二十七宿 / Vimshottari Dasha 大运 / Yoga·Dosha。
 * 每条为「跨体系对照」结构：同时给出吠陀、西洋、中国七政四余三体系的对应概念，
 * 服务于本站「跨体系互证」定位；所有天文学数值可复算，象征部分一律标注为文化传统。
 */
export const vedicTermEntries: AstroWikiEntry[] = [
  {
    id: 'vedic-ayanamsa',
    title: '岁差（Ayanamsa）',
    aliases: ['Ayanamsa', '恒星岁差', 'Lahiri', 'Chitrapaksha'],
    pinyin: 'suicha',
    category: 'concept',
    summary: '回归黄经与恒星黄经之间的差值，是吠陀占星恒星坐标系的换算基准。',
    content:
      '地球自转轴存在约 25,772 年的周期进动（岁差），使春分点相对恒星背景缓慢西移，约每年 50.29″。' +
      '因此同一天体在「回归黄道（以春分点为 0°）」与「恒星黄道（以固定恒星为基准）」下的黄经并不相同，其差值即 Ayanamsa。' +
      '吠陀占星采用恒星黄经，主流体系为 Lahiri（Chitrapaksha），另有 Raman、Krishnamurti、Yukteshwar、Fagan-Bradley 等，彼此可差 1° 以上。' +
      '本站吠陀盘当前仅实现 Lahiri，J2000.0 锚点取 23°51′11.5″（23.8532°），1990 年实测约 23.71°。' +
      '对照：西洋星盘通常沿用回归黄道（Ayanamsa = 0）；中国七政四余传统亦以回归/宿度体系为主，与吠陀的恒星口径不同。' +
      '换算口径：恒星黄经 = 回归黄经 − Ayanamsa（模 360）。',
    sources: [
      { text: 'IAU 岁差理论（IAU 2006 / P03）', confidence: 'verified' },
      { text: 'Lahiri Ayanamsa（印度历法改革委员会口径）', confidence: 'verified' },
      { text: '站点实测：lahiriAyanamsa(1990.36) ≈ 23.7185°', confidence: 'verified' },
    ],
    confidence: 'verified',
    disclaimer: '岁差是已验证的天文现象；不同 Ayanamsa 体系的选择属流派差异，会导致星体落座结果不同，本站仅提供 Lahiri，不作吉凶判断。',
    ready: true,
    updatedAt: '2026-10-07',
  },
  {
    id: 'vedic-nakshatra',
    title: '二十七宿（Nakshatra）',
    aliases: ['Nakshatra', '月宿', '星宿', '二十七宿', 'Janma Nakshatra'],
    pinyin: 'ershiqixiu',
    category: 'concept',
    summary: '把黄道均分为 27 份（每份 13°20′）的月宿体系，是吠陀大运起算的锚点。',
    content:
      'Nakshatra（月宿）将 360° 黄道等分为 27 段，每段 13°20′（13.3333°）；每段再分 4 拍（Pada），每拍 3°20′，全盘共 108 拍。' +
      '出生时月亮所在月宿称 Janma Nakshatra，其守护星决定 Vimshottari 大运的起始主星，月亮在该宿内已走过的比例决定首运的剩余比例（balance）。' +
      '27 宿各有守护星，按 Ketu→Shukra（金星）→Surya（太阳）→Chandra（月亮）→Mangala（火星）→Rahu→Guru（木星）→Shani（土星）→Budha（水星）的九曜循环排列。' +
      '对照：中国二十八宿不等分（各宿跨度不同，按距星实测划定），与吠陀 27 等分宿是两套不同体系，不可直接互换。' +
      '本站吠陀盘按严格等分实现，七政四余盘则按 SIMBAD 距星 J2000 坐标换算的真实宿界实现，两者在结果中分别标注。',
    sources: [
      { text: 'Brihat Parashara Hora Shastra（Nakshatra 与 Dasha）', confidence: 'legendary' },
      { text: '站点实测：longitudeToNakshatra 全周扫描 27 宿覆盖完整、序号单调', confidence: 'verified' },
    ],
    confidence: 'verified',
    disclaimer: '月宿划分是文化传统的坐标约定；其守护星与解读属象征体系，仅供娱乐与参考。',
    ready: true,
    updatedAt: '2026-10-07',
  },
  {
    id: 'vedic-dasha',
    title: '大运（Vimshottari Dasha）',
    aliases: ['Dasha', 'Vimshottari', '九曜大运', 'Mahadasha', 'Antardasha'],
    pinyin: 'dayun',
    category: 'concept',
    summary: '以出生月宿守护星起算、按九曜固定年限循环的时间周期系统，总周期 120 年。',
    content:
      'Vimshottari Dasha 以出生月宿（Janma Nakshatra）的守护星为首运主星，按固定顺序 Ketu→Venus→Sun→Moon→Mars→Rahu→Jupiter→Saturn→Mercury 循环排布九个大运（Mahadasha）。' +
      '九曜年限分别为 Ketu 7、Venus 20、Sun 6、Moon 10、Mars 7、Rahu 18、Jupiter 16、Saturn 19、Mercury 17 年，合计 120 年。' +
      '每个大运内部再按同样顺序分为九个小运（Antardasha / Bhukti），段长 = 大运年限 × 该小运主星年限 ÷ 120。' +
      '首运的实际起点早于出生时刻，提前量 = balance × 首运主星年限。' +
      '对照：中国八字以「大运」按月柱阴阳顺逆起运、每运十年；七政四余以星曜行度与宫位论限。三者均为时间周期模型，算法互不通用。' +
      '本站实现：九运首尾严格相接（前一运结束时刻 = 后一运开始时刻），并输出每一运的起止日期与年限。',
    sources: [
      { text: 'Brihat Parashara Hora Shastra（Vimshottari Dasha）', confidence: 'legendary' },
      { text: '站点实测：九运年限合计 120、时间序列连续无断档', confidence: 'verified' },
    ],
    confidence: 'verified',
    disclaimer: 'Dasha 是传统时间周期模型，其「某运主吉/主凶」的叙述属文化传统，本站不据此作任何预测、建议或判断。',
    ready: true,
    updatedAt: '2026-10-07',
  },
  {
    id: 'vedic-yoga-dosha',
    title: '瑜伽与煞（Yoga / Dosha）',
    aliases: ['Yoga', 'Dosha', '瑜伽', '煞', 'Mangal Dosha', 'Kaal Sarp'],
    pinyin: 'yujia-yu-sha',
    category: 'concept',
    summary: '吠陀盘中由星体组合触发的结构化判定：Yoga 为组合，Dosha 为传统认为需留意的配置。',
    content:
      'Yoga 指由特定星体位置关系构成的组合，如 Pancha Mahapurusha（五大瑜伽，要求该星居本座或擢升座且落角宫）、Gajakesari（月木互处角宫）、Budha-Aditya（水日同宫）等。' +
      'Dosha 指传统认为需要留意的配置，如 Mangal / Kuja Dosha（火星居命宫起 1/2/4/7/8/12 宫）、Kaal Sarp（七曜全在罗睺—计都轴同一侧）、Guru-Chandal（木星与罗睺同宫）、Kemadruma（月亮两侧无星）。' +
      '重要说明：各流派对同一 Yoga / Dosha 的判定条件与豁免规则分歧较大，不存在唯一标准。' +
      '本站实现口径：仅自动化「可由 D1 盘面确定性推导」的条目（11 条 Yoga + 5 条 Dosha），每条都输出触发条件、传统依据与局限说明；' +
      'Neecha-Bhanga、D60 分盘、Nadi 合盘煞、行运 Sade Sati 等尚未自动化，已在结果中显式列出为「待命理顾问终审」，不做臆造。',
    sources: [
      { text: 'Brihat Parashara Hora Shastra（Yoga 定义）', confidence: 'legendary' },
      { text: '站点实现清单：vedic/yoga-dosha.ts（11 Yoga / 5 Dosha + 4 项待终审）', confidence: 'verified' },
    ],
    confidence: 'verified',
    disclaimer: 'Yoga / Dosha 判定属文化传统，不同流派结论可能不同；本站结果仅供娱乐与参考，不构成对婚姻、健康、财务或人生的判断与建议。',
    ready: true,
    updatedAt: '2026-10-07',
  },
];
