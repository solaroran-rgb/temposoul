/**
 * @file A8 白话映射库 wave1 载体（T-17 子项 B）
 * @description 数据源（唯一权威，逐字一致，禁止改写/编造）：
 *   E:\\KnowledgeOS\\AI地图\\11_命律网站建设\\21板块深度审计\\下一批派工_20261007\\任务卡\\A8_输出\\mapping库_v1\\{bazi,ziwei,almanac}.json
 *   - bazi 21 条 / ziwei 18 条 / almanac 18 条 = 57 条
 *   - term_refs 绑定 term:<域>:<slug> -> lexicon key（<namespace>:<term>，T-14 冻结）；
 *     绑不上者登记 A8_ORPHAN_REFS（=Critical，须补词库，禁 LLM 直译关键术语）。
 *   - 多义 sense_id 见 ./a8-polysemy.ts；附录 A 双轨表见 ./a8-appendix-a.ts。
 */

export type A8MappingLevel = 'C1' | 'C2' | 'C3';
export type A8Domain = 'bazi' | 'ziwei' | 'almanac';
export type A8VernacularLocale = 'zhCN' | 'zhTW' | 'en';

export interface A8Source {
  name: string;
  location: string;
}

export interface A8Vernacular {
  zhCN: string;
  zhTW: string;
  en: string;
}

export interface A8MappingEntry {
  mappingKey: string;
  domain: A8Domain;
  level: A8MappingLevel;
  layer: string;
  /** 古籍原文（L1，逐字） */
  classicalText: string;
  source: A8Source;
  /** 白话三语（zh-CN / zh-TW / en-US，与 A8 JSON 逐字一致） */
  vernacular: A8Vernacular;
  /** 引擎轨术语引用，原样保留 term:<域>:<slug> */
  termRefs: string[];
  /** 与 termRefs 同序：绑定到的 lexicon key；null = 孤儿（见 A8_ORPHAN_REFS） */
  termRefBindings: (string | null)[];
  /** termRefs 中绑定成功的 lexicon key 去重集合（可多条） */
  boundLexiconKey: string[];
  personalFlag: boolean;
  redlineTags: string[];
  i18nKey: string;
}

/** 孤儿 term_refs（T-17B 已全部补词库并回填绑定，归零；保留空数组占位契约） */
export const A8_ORPHAN_REFS: readonly string[] = [];

/** wave1 57 条映射载体 */
export const A8_WAVE1_MAPPINGS: A8MappingEntry[] = [
  {
    "mappingKey": "bazi.C1.day_master_strong",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "得时俱为旺论",
    "source": {
      "name": "子平真诠",
      "location": "卷一·论阴阳生克"
    },
    "vernacular": {
      "zhCN": "传统命理认为，日主能量偏强：做事倾向主动进取、扛得住压力，适合发挥主导与开拓作用；也提醒此时更宜留出收敛与协作的空间。仅供传统文化参考。",
      "zhTW": "傳統命理認為，日主能量偏強：做事傾向主動進取、扛得住壓力，適合發揮主導與開拓作用；也提醒此時更宜留出收斂與協作的空間。僅供傳統文化參考。",
      "en": "In traditional Bazi reading, a strong Day Master suggests a tendency toward initiative and resilience — often suited to leading and pioneering — while leaving room for restraint and collaboration. For cultural reference only."
    },
    "termRefs": [
      "term:bazi:ri-zhu",
      "term:wuxing:wang-shuai"
    ],
    "termRefBindings": [
      "common:日主",
      "common:旺衰"
    ],
    "boundLexiconKey": [
      "common:日主",
      "common:旺衰"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.day_master_strong"
  },
  {
    "mappingKey": "bazi.C1.day_master_weak",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "失时便作衰看",
    "source": {
      "name": "子平真诠",
      "location": "卷一·论阴阳生克"
    },
    "vernacular": {
      "zhCN": "传统命理认为，日主能量偏弱：倾向借助团队与外部资源成事，擅长协作与借力；传统文化提醒此时量力而行更为稳妥。仅供传统文化参考。",
      "zhTW": "傳統命理認為，日主能量偏弱：傾向借助團隊與外部資源成事，擅長協作與借力；傳統文化提醒此時量力而行更為穩妥。僅供傳統文化參考。",
      "en": "In traditional Bazi reading, a weaker Day Master suggests achieving through teamwork and external support; a measured pace is traditionally advised. For cultural reference only."
    },
    "termRefs": [
      "term:bazi:ri-zhu",
      "term:wuxing:wang-shuai"
    ],
    "termRefBindings": [
      "common:日主",
      "common:旺衰"
    ],
    "boundLexiconKey": [
      "common:日主",
      "common:旺衰"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.day_master_weak"
  },
  {
    "mappingKey": "bazi.C1.day_master_balanced",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "中和之气，福寿之基",
    "source": {
      "name": "滴天髓",
      "location": "何知章"
    },
    "vernacular": {
      "zhCN": "传统命理认为，日主趋于中和：适应力与稳定性较好，多数流年起伏相对平缓，传统文化视之为从容的底子。仅供传统文化参考。",
      "zhTW": "傳統命理認為，日主趨於中和：適應力與穩定性較好，多數流年起伏相對平緩，傳統文化視之為從容的底子。僅供傳統文化參考。",
      "en": "In traditional Bazi reading, a balanced Day Master suggests adaptability and steadiness — traditionally seen as a composed foundation. For cultural reference only."
    },
    "termRefs": [
      "term:bazi:ri-zhu"
    ],
    "termRefBindings": [
      "common:日主"
    ],
    "boundLexiconKey": [
      "common:日主"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.day_master_balanced"
  },
  {
    "mappingKey": "bazi.C1.shishen_bijian",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "比肩",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「比肩」：倾向式理解为一种性格与处事底色——自立、重同侪，合作中宜留意固执。仅供传统文化参考。",
      "zhTW": "傳統命理中的「比肩」：傾向式理解為一種性格與處事底色——自立、重同儕，合作中宜留意固執。僅供傳統文化參考。",
      "en": "The traditional concept of 比肩 (bijian): Traditionally read as independence with peer support; cooperation benefits from flexibility. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:bijian"
    ],
    "termRefBindings": [
      "bazi:比肩"
    ],
    "boundLexiconKey": [
      "bazi:比肩"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_bijian"
  },
  {
    "mappingKey": "bazi.C1.shishen_jiecai",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "劫财",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「劫财」：倾向式理解为一种性格与处事底色——豪爽果决，钱财边界宜分明。仅供传统文化参考。",
      "zhTW": "傳統命理中的「劫財」：傾向式理解為一種性格與處事底色——豪爽果決，錢財邊界宜分明。僅供傳統文化參考。",
      "en": "The traditional concept of 劫财 (jiecai): Traditionally read as bold and sociable; clarity on money boundaries is advised. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:jiecai"
    ],
    "termRefBindings": [
      "bazi:劫财"
    ],
    "boundLexiconKey": [
      "bazi:劫财"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_jiecai"
  },
  {
    "mappingKey": "bazi.C1.shishen_shishen",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "食神",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「食神」：倾向式理解为一种性格与处事底色——善于从容表达与钻研，创造力放松而持续。仅供传统文化参考。",
      "zhTW": "傳統命理中的「食神」：傾向式理解為一種性格與處事底色——善於從容表達與鑽研，創造力放鬆而持續。僅供傳統文化參考。",
      "en": "The traditional concept of 食神 (shishen): Traditionally read as easy-going creativity and steady craftsmanship. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:shishen"
    ],
    "termRefBindings": [
      "bazi:食神"
    ],
    "boundLexiconKey": [
      "bazi:食神"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_shishen"
  },
  {
    "mappingKey": "bazi.C1.shishen_shangguan",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "伤官",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「伤官」：倾向式理解为一种性格与处事底色——才思锐利、直言敢言，表达方式宜打磨。仅供传统文化参考。",
      "zhTW": "傳統命理中的「傷官」：傾向式理解為一種性格與處事底色——才思銳利、直言敢言，表達方式宜打磨。僅供傳統文化參考。",
      "en": "The traditional concept of 伤官 (shangguan): Traditionally read as sharp, outspoken originality; delivery benefits from polish. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:shangguan"
    ],
    "termRefBindings": [
      "bazi:伤官"
    ],
    "boundLexiconKey": [
      "bazi:伤官"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_shangguan"
  },
  {
    "mappingKey": "bazi.C1.shishen_piancai",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "偏财",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「偏财」：倾向式理解为一种性格与处事底色——机敏灵活、善抓机会，行动讲究时机。仅供传统文化参考。",
      "zhTW": "傳統命理中的「偏財」：傾向式理解為一種性格與處事底色——機敏靈活、善抓機會，行動講究時機。僅供傳統文化參考。",
      "en": "The traditional concept of 偏财 (piancai): Traditionally read as opportunistic versatility; timing favors the move. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:piancai"
    ],
    "termRefBindings": [
      "bazi:偏财"
    ],
    "boundLexiconKey": [
      "bazi:偏财"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_piancai"
  },
  {
    "mappingKey": "bazi.C1.shishen_zhengcai",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "正财",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「正财」：倾向式理解为一种性格与处事底色——稳健踏实、细水长流，财帛观偏保守务实。仅供传统文化参考。",
      "zhTW": "傳統命理中的「正財」：傾向式理解為一種性格與處事底色——穩健踏實、細水長流，財帛觀偏保守務實。僅供傳統文化參考。",
      "en": "The traditional concept of 正财 (zhengcai): Traditionally read as steady, diligent accumulation and pragmatic money habits. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:zhengcai"
    ],
    "termRefBindings": [
      "bazi:正财"
    ],
    "boundLexiconKey": [
      "bazi:正财"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_zhengcai"
  },
  {
    "mappingKey": "bazi.C1.shishen_qisha",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "七杀",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「七杀」：倾向式理解为一种性格与处事底色——抗压强、执行力猛，宜给冲劲设定清晰目标。仅供传统文化参考。",
      "zhTW": "傳統命理中的「七殺」：傾向式理解為一種性格與處事底色——抗壓強、執行力猛，宜給衝勁設定清晰目標。僅供傳統文化參考。",
      "en": "The traditional concept of 七杀 (qisha): Traditionally read as strong drive under pressure; clear goals channel the intensity. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:qisha"
    ],
    "termRefBindings": [
      "bazi:七杀"
    ],
    "boundLexiconKey": [
      "bazi:七杀"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_qisha"
  },
  {
    "mappingKey": "bazi.C1.shishen_zhengguan",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "正官",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「正官」：倾向式理解为一种性格与处事底色——守规矩、重责任，传统视之与信誉声望相关。仅供传统文化参考。",
      "zhTW": "傳統命理中的「正官」：傾向式理解為一種性格與處事底色——守規矩、重責任，傳統視之與信譽聲望相關。僅供傳統文化參考。",
      "en": "The traditional concept of 正官 (zhengguan): Traditionally read as respect for rules and duty; linked to reputation. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:zhengguan"
    ],
    "termRefBindings": [
      "bazi:正官"
    ],
    "boundLexiconKey": [
      "bazi:正官"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_zhengguan"
  },
  {
    "mappingKey": "bazi.C1.shishen_pianyin",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "偏印",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「偏印」：倾向式理解为一种性格与处事底色——思路不走寻常路，宜把灵感落到实务。仅供传统文化参考。",
      "zhTW": "傳統命理中的「偏印」：傾向式理解為一種性格與處事底色——思路不走尋常路，宜把靈感落到實務。僅供傳統文化參考。",
      "en": "The traditional concept of 偏印 (pianyin): Traditionally read as unconventional learning; grounding ideas in practice is advised. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:pianyin"
    ],
    "termRefBindings": [
      "bazi:偏印"
    ],
    "boundLexiconKey": [
      "bazi:偏印"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_pianyin"
  },
  {
    "mappingKey": "bazi.C1.shishen_zhengyin",
    "domain": "bazi",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "正印",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论十干配合性情"
    },
    "vernacular": {
      "zhCN": "传统命理中的「正印」：倾向式理解为一种性格与处事底色——好学稳重、易得师长照拂，传统视之与学识名声相关。仅供传统文化参考。",
      "zhTW": "傳統命理中的「正印」：傾向式理解為一種性格與處事底色——好學穩重、易得師長照拂，傳統視之與學識名聲相關。僅供傳統文化參考。",
      "en": "The traditional concept of 正印 (zhengyin): Traditionally read as steady learning and trusted mentorship; linked to study and name. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:zhengyin"
    ],
    "termRefBindings": [
      "bazi:正印"
    ],
    "boundLexiconKey": [
      "bazi:正印"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C1.shishen_zhengyin"
  },
  {
    "mappingKey": "bazi.C2.c008cba5",
    "domain": "bazi",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "官印相生，贵格也",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论官杀"
    },
    "vernacular": {
      "zhCN": "传统命理中「官印相生」的组合：倾向理解为责任与学识互相成就——既有担当也易得提携，传统文化视之为利于声誉与稳步上行的搭配。仅供传统文化参考。",
      "zhTW": "傳統命理中「官印相生」的組合：傾向理解為責任與學識互相成就——既有擔當也易得提攜，傳統文化視之為利於聲譽與穩步上行的搭配。僅供傳統文化參考。",
      "en": "The traditional pairing of Direct Officer with Direct Resource is read as duty and learning reinforcing each other — steady support for reputation and gradual advancement. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:zheng-guan",
      "term:shishen:zheng-yin"
    ],
    "termRefBindings": [
      "bazi:正官",
      "bazi:正印"
    ],
    "boundLexiconKey": [
      "bazi:正官",
      "bazi:正印"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C2.c008cba5"
  },
  {
    "mappingKey": "bazi.C2.a065a92e",
    "domain": "bazi",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "伤官见官，为祸百端",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论伤官"
    },
    "vernacular": {
      "zhCN": "传统命理中「伤官见官」的组合：倾向理解为锐气与规矩容易相撞——想法多、直言快，与传统规范相遇时易起摩擦；传统文化提醒此时把话说软、把事做稳。仅供传统文化参考。",
      "zhTW": "傳統命理中「傷官見官」的組合：傾向理解為銳氣與規矩容易相撞——想法多、直言快，與傳統規範相遇時易起摩擦；傳統文化提醒此時把話說軟、把事做穩。僅供傳統文化參考。",
      "en": "The traditional pairing of Hurting Officer with Direct Officer is read as talent meeting friction with convention; tradition advises softer delivery and steadier execution. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:shang-guan",
      "term:shishen:zheng-guan"
    ],
    "termRefBindings": [
      "bazi:伤官",
      "bazi:正官"
    ],
    "boundLexiconKey": [
      "bazi:伤官",
      "bazi:正官"
    ],
    "personalFlag": false,
    "redlineTags": [
      "friction-hedge"
    ],
    "i18nKey": "mapping.bazi.C2.a065a92e"
  },
  {
    "mappingKey": "bazi.C2.3557e129",
    "domain": "bazi",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "食神制杀，英雄独压万人",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论食神"
    },
    "vernacular": {
      "zhCN": "传统命理中「食神制杀」的组合：倾向理解为以从容的才华化解压力——压力越大越能沉住气，传统文化视之为化挑战为成绩的搭配。仅供传统文化参考。",
      "zhTW": "傳統命理中「食神制殺」的組合：傾向理解為以從容的才華化解壓力——壓力越大越能沉住氣，傳統文化視之為化挑戰為成績的搭配。僅供傳統文化參考。",
      "en": "The traditional pairing of Eating God tempering Seven Killings is read as composure turning pressure into achievement. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:shi-shen",
      "term:shishen:qi-sha"
    ],
    "termRefBindings": [
      "bazi:食神",
      "bazi:七杀"
    ],
    "boundLexiconKey": [
      "bazi:食神",
      "bazi:七杀"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C2.3557e129"
  },
  {
    "mappingKey": "bazi.C2.2314dcf9",
    "domain": "bazi",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "比劫夺财",
    "source": {
      "name": "三命通会",
      "location": "论比劫"
    },
    "vernacular": {
      "zhCN": "传统命理中「比劫夺财」的组合：倾向理解为合作与钱财需要提前立好规矩——亲兄弟明算账，传统文化提醒合伙、借贷先小人后君子。仅供传统文化参考。",
      "zhTW": "傳統命理中「比劫奪財」的組合：傾向理解為合作與錢財需要提前立好規矩——親兄弟明算帳，傳統文化提醒合夥、借貸先小人後君子。僅供傳統文化參考。",
      "en": "The traditional pairing of peers competing for wealth is read as a reminder to set clear terms before partnerships or lending. For cultural reference only."
    },
    "termRefs": [
      "term:shishen:bi-jian",
      "term:shishen:zheng-cai"
    ],
    "termRefBindings": [
      "bazi:比肩",
      "bazi:正财"
    ],
    "boundLexiconKey": [
      "bazi:比肩",
      "bazi:正财"
    ],
    "personalFlag": false,
    "redlineTags": [
      "money-hedge"
    ],
    "i18nKey": "mapping.bazi.C2.2314dcf9"
  },
  {
    "mappingKey": "bazi.C3.career",
    "domain": "bazi",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "审官星之向背，察用神之喜忌",
    "source": {
      "name": "子平真诠",
      "location": "卷三"
    },
    "vernacular": {
      "zhCN": "【事业场景骨架】以下事实按序组织：日主强弱 → 主要十神倾向 → 勾稽提示。叙述口径：以「倾向/易/传统文化认为」措辞，不输出确定性断言，不构成职业建议。",
      "zhTW": "【事業場景骨架】以下事實按序組織：日主強弱 → 主要十神傾向 → 勾稽提示。敘述口徑：以「傾向/易/傳統文化認為」措辭，不輸出確定性斷言，不構成職業建議。",
      "en": "[Career scene skeleton] Facts in order: day-master strength, dominant Shishen tendencies, relation notes. Hedged wording; no deterministic claims; not career advice."
    },
    "termRefs": [
      "term:bazi:ri-zhu"
    ],
    "termRefBindings": [
      "common:日主"
    ],
    "boundLexiconKey": [
      "common:日主"
    ],
    "personalFlag": true,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C3.career"
  },
  {
    "mappingKey": "bazi.C3.relationship",
    "domain": "bazi",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "察夫妻宫之喜忌",
    "source": {
      "name": "三命通会",
      "location": "论妻子"
    },
    "vernacular": {
      "zhCN": "【感情场景骨架】事实顺序：日主 → 配偶星倾向 → 勾稽提示。口径同上：倾向式措辞、娱乐参考、不构成情感决策依据。",
      "zhTW": "【感情場景骨架】事實順序：日主 → 配偶星傾向 → 勾稽提示。口徑同上：傾向式措辭、娛樂參考、不構成情感決策依據。",
      "en": "[Relationship scene skeleton] Facts in order: day master, spouse-star tendency, relation notes. Hedged wording; entertainment reference; not relationship advice."
    },
    "termRefs": [
      "term:bazi:ri-zhu"
    ],
    "termRefBindings": [
      "common:日主"
    ],
    "boundLexiconKey": [
      "common:日主"
    ],
    "personalFlag": true,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C3.relationship"
  },
  {
    "mappingKey": "bazi.C3.study",
    "domain": "bazi",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "印绶主学业",
    "source": {
      "name": "三命通会",
      "location": "论印绶"
    },
    "vernacular": {
      "zhCN": "【学业场景骨架】事实顺序：印星倾向 → 学习风格提示。倾向式措辞，不构成教育决策依据。",
      "zhTW": "【學業場景骨架】事實順序：印星傾向 → 學習風格提示。傾向式措辭，不構成教育決策依據。",
      "en": "[Study scene skeleton] Facts in order: resource-star tendency, learning-style notes. Hedged wording; not educational advice."
    },
    "termRefs": [
      "term:shishen:zheng-yin"
    ],
    "termRefBindings": [
      "bazi:正印"
    ],
    "boundLexiconKey": [
      "bazi:正印"
    ],
    "personalFlag": true,
    "redlineTags": [],
    "i18nKey": "mapping.bazi.C3.study"
  },
  {
    "mappingKey": "bazi.C3.wealth_style",
    "domain": "bazi",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "财为养命之源",
    "source": {
      "name": "子平真诠",
      "location": "卷二·论财"
    },
    "vernacular": {
      "zhCN": "【财富观场景骨架】事实顺序：财星倾向 → 理财风格提示。只描述传统文化中的性格倾向，不构成任何投资建议，不预测收益。",
      "zhTW": "【財富觀場景骨架】事實順序：財星傾向 → 理財風格提示。只描述傳統文化中的性格傾向，不構成任何投資建議，不預測收益。",
      "en": "[Wealth-style scene skeleton] Facts in order: wealth-star tendency, money-style notes. Traditional temperament only; not investment advice; no return predictions."
    },
    "termRefs": [
      "term:shishen:zheng-cai"
    ],
    "termRefBindings": [
      "bazi:正财"
    ],
    "boundLexiconKey": [
      "bazi:正财"
    ],
    "personalFlag": true,
    "redlineTags": [
      "finance-hedge"
    ],
    "i18nKey": "mapping.bazi.C3.wealth_style"
  },
  {
    "mappingKey": "ziwei.C1.major_star_zi_wei",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "紫微，帝座",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「紫微」（帝座）：传统星情：如帝王坐殿，倾向有主见与统筹欲，宜配得力的团队。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「紫微」（帝座）：傳統星情：如帝王坐殿，傾向有主見與統籌欲，宜配得力的團隊。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 紫微 (帝座): Traditionally the Emperor star: a tendency toward leadership vision and coordination; thrives with a capable team. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:zi-wei"
    ],
    "termRefBindings": [
      "ziwei:紫微"
    ],
    "boundLexiconKey": [
      "ziwei:紫微"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_zi_wei"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tian_ji",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "天机，智星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「天机」（智星）：传统星情：心思灵活、善谋略与规划，倾向以巧取胜。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「天机」（智星）：傳統星情：心思靈活、善謀略與規劃，傾向以巧取勝。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 天机 (智星): Traditionally the Strategist star: agile thinking and planning; tends to win by wit. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tian-ji"
    ],
    "termRefBindings": [
      "ziwei:天机"
    ],
    "boundLexiconKey": [
      "ziwei:天机"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tian_ji"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tai_yang",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "太阳，博济之星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「太阳」（博济之星）：传统星情：如太阳普照，倾向热心付出、光明磊落，也提醒注意劳逸。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「太阳」（博济之星）：傳統星情：如太陽普照，傾向熱心付出、光明磊落，也提醒注意勞逸。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 太阳 (博济之星): Traditionally the Sun star: generous and open-hearted; tradition advises pacing oneself. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tai-yang"
    ],
    "termRefBindings": [
      "ziwei:太阳"
    ],
    "boundLexiconKey": [
      "ziwei:太阳"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tai_yang"
  },
  {
    "mappingKey": "ziwei.C1.major_star_wu_qu",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "武曲，财星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「武曲」（财星）：传统星情：刚毅果决、重执行，传统视之为财星，倾向实干兴财。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「武曲」（财星）：傳統星情：剛毅果決、重執行，傳統視之為財星，傾向實幹興財。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 武曲 (财星): Traditionally the Wealth star: firm and decisive; linked to prosperity through solid work. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:wu-qu"
    ],
    "termRefBindings": [
      "ziwei:武曲"
    ],
    "boundLexiconKey": [
      "ziwei:武曲"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_wu_qu"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tian_tong",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "天同，福星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「天同」（福星）：传统星情：性情温和、知足随和，倾向以和为贵。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「天同」（福星）：傳統星情：性情溫和、知足隨和，傾向以和為貴。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 天同 (福星): Traditionally the Blessing star: gentle and content, inclined to harmony and ease. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tian-tong"
    ],
    "termRefBindings": [
      "ziwei:天同"
    ],
    "boundLexiconKey": [
      "ziwei:天同"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tian_tong"
  },
  {
    "mappingKey": "ziwei.C1.major_star_lian_zhen",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "廉贞，囚星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「廉贞」（囚星）：传统星情：精明强干、重感情也讲原则，倾向在规则与情义间找平衡。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「廉贞」（囚星）：傳統星情：精明強幹、重感情也講原則，傾向在規則與情義間找平衡。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 廉贞 (囚星): Traditionally the Prison star: sharp and principled; balances rules with personal bonds. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:lian-zhen"
    ],
    "termRefBindings": [
      "ziwei:廉贞"
    ],
    "boundLexiconKey": [
      "ziwei:廉贞"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_lian_zhen"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tian_fu",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "天府，库星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「天府」（库星）：传统星情：稳重大气、善守成积累，倾向谋定而后动。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「天府」（库星）：傳統星情：穩重大氣、善守成積累，傾向謀定而後動。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 天府 (库星): Traditionally the Treasury star: steady and magnanimous; moves after deliberation. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tian-fu"
    ],
    "termRefBindings": [
      "ziwei:天府"
    ],
    "boundLexiconKey": [
      "ziwei:天府"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tian_fu"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tai_yin",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "太阴，静蓄之星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「太阴」（静蓄之星）：传统星情：细腻沉静、善蓄势，倾向以柔与耐性成事。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「太阴」（静蓄之星）：傳統星情：細膩沉靜、善蓄勢，傾向以柔與耐性成事。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 太阴 (静蓄之星): Traditionally the Moon star: quiet and detail-minded; builds patiently. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tai-yin"
    ],
    "termRefBindings": [
      "ziwei:太阴"
    ],
    "boundLexiconKey": [
      "ziwei:太阴"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tai_yin"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tan_lang",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "贪狼，欲望之星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「贪狼」（欲望之星）：传统星情：多才多艺、欲望与好奇心强，倾向人生场景丰富。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「贪狼」（欲望之星）：傳統星情：多才多藝、欲望與好奇心強，傾向人生場景豐富。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 贪狼 (欲望之星): Traditionally the Desire star: multi-talented and curious; life rich in experiences. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tan-lang"
    ],
    "termRefBindings": [
      "ziwei:贪狼"
    ],
    "boundLexiconKey": [
      "ziwei:贪狼"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tan_lang"
  },
  {
    "mappingKey": "ziwei.C1.major_star_ju_men",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "巨门，暗星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「巨门」（暗星）：传统星情：口才与质疑精神俱佳，倾向以分析取胜，也提醒言语留余地。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「巨门」（暗星）：傳統星情：口才與質疑精神俱佳，傾向以分析取勝，也提醒言語留餘地。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 巨门 (暗星): Traditionally the Dark star: gifted with words and scrutiny; tradition advises tact. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:ju-men"
    ],
    "termRefBindings": [
      "ziwei:巨门"
    ],
    "boundLexiconKey": [
      "ziwei:巨门"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_ju_men"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tian_xiang",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "天相，印星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「天相」（印星）：传统星情：忠诚辅佐、办事周全，倾向是可靠的执行与协调者。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「天相」（印星）：傳統星情：忠誠輔佐、辦事周全，傾向是可靠的執行與協調者。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 天相 (印星): Traditionally the Seal star: loyal and thorough; the reliable coordinator. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tian-xiang"
    ],
    "termRefBindings": [
      "ziwei:天相"
    ],
    "boundLexiconKey": [
      "ziwei:天相"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tian_xiang"
  },
  {
    "mappingKey": "ziwei.C1.major_star_tian_liang",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "天梁，荫星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「天梁」（荫星）：传统星情：老成持重、乐于庇护他人，传统视之为长辈缘与照拂之星。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「天梁」（荫星）：傳統星情：老成持重、樂於庇護他人，傳統視之為長輩緣與照拂之星。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 天梁 (荫星): Traditionally the Canopy star: mature and protective; linked to mentorship. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:tian-liang"
    ],
    "termRefBindings": [
      "ziwei:天梁"
    ],
    "boundLexiconKey": [
      "ziwei:天梁"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_tian_liang"
  },
  {
    "mappingKey": "ziwei.C1.major_star_qi_sha",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "七杀，肃杀之星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「七杀」（肃杀之星）：传统星情：果决刚强、敢于断舍离，倾向在变革中开路。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「七杀」（肃杀之星）：傳統星情：果決剛強、敢於斷捨離，傾向在變革中開路。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 七杀 (肃杀之星): Traditionally the Quelling star: resolute and bold; pioneers change. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:qi-sha"
    ],
    "termRefBindings": [
      "ziwei:七杀"
    ],
    "boundLexiconKey": [
      "ziwei:七杀"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_qi_sha"
  },
  {
    "mappingKey": "ziwei.C1.major_star_po_jun",
    "domain": "ziwei",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "破军，耗星",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中的「破军」（耗星）：传统星情：破旧立新、行动力强，倾向先破后立的节奏。命盘文化解读仅供参考。",
      "zhTW": "傳統斗數中的「破军」（耗星）：傳統星情：破舊立新、行動力強，傾向先破後立的節奏。命盤文化解讀僅供參考。",
      "en": "The traditional Ziwei star 破军 (耗星): Traditionally the Disruptor star: breaks before it builds; strong action and reinvention. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:po-jun"
    ],
    "termRefBindings": [
      "ziwei:破军"
    ],
    "boundLexiconKey": [
      "ziwei:破军"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C1.major_star_po_jun"
  },
  {
    "mappingKey": "ziwei.C2.58e9e715",
    "domain": "ziwei",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "杀破狼，变动之局",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中「杀破狼」格局（七杀、破军、贪狼会照）：倾向理解为人生节奏偏爱变革——不怕推倒重来，宜在变动中建立自己的秩序。仅供传统文化参考。",
      "zhTW": "傳統斗數中「殺破狼」格局（七殺、破軍、貪狼會照）：傾向理解為人生節奏偏愛變革——不怕推倒重來，宜在變動中建立自己的秩序。僅供傳統文化參考。",
      "en": "The traditional Sha-Po-Lang pattern (Seven Killings, Disruptor, Desire converging) is read as a life rhythm favoring change — rebuilding order out of flux. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:qi-sha",
      "term:ziwei:star:po-jun",
      "term:ziwei:star:tan-lang"
    ],
    "termRefBindings": [
      "ziwei:七杀",
      "ziwei:破军",
      "ziwei:贪狼"
    ],
    "boundLexiconKey": [
      "ziwei:七杀",
      "ziwei:破军",
      "ziwei:贪狼"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C2.58e9e715"
  },
  {
    "mappingKey": "ziwei.C2.ae066b40",
    "domain": "ziwei",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "紫府同宫，终身福厚",
    "source": {
      "name": "紫微斗数全书",
      "location": "诸星论"
    },
    "vernacular": {
      "zhCN": "传统斗数中「紫府同宫」格局（紫微与天府同宫）：倾向理解为稳中有贵的底子——既有格局又能守成，传统文化视之为厚积之象。仅供传统文化参考。",
      "zhTW": "傳統斗數中「紫府同宮」格局（紫微與天府同宮）：傾向理解為穩中有貴的底子——既有格局又能守成，傳統文化視之為厚積之象。僅供傳統文化參考。",
      "en": "The traditional Ziwei-Tianfu cohabitation pattern is read as nobility with steadiness — traditionally an image of accumulated strength. For cultural reference only."
    },
    "termRefs": [
      "term:ziwei:star:zi-wei",
      "term:ziwei:star:tian-fu"
    ],
    "termRefBindings": [
      "ziwei:紫微",
      "ziwei:天府"
    ],
    "boundLexiconKey": [
      "ziwei:紫微",
      "ziwei:天府"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C2.ae066b40"
  },
  {
    "mappingKey": "ziwei.C3.career_palace",
    "domain": "ziwei",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "观官禄宫之星，察事业之向",
    "source": {
      "name": "紫微斗数全书",
      "location": "命宫论"
    },
    "vernacular": {
      "zhCN": "【事业宫场景骨架】事实顺序：官禄宫主星 → 格局提示。倾向式措辞，仅供传统文化参考，不构成职业建议。",
      "zhTW": "【事業宮場景骨架】事實順序：官祿宮主星 → 格局提示。傾向式措辭，僅供傳統文化參考，不構成職業建議。",
      "en": "[Career-palace scene skeleton] Facts in order: career-palace star, pattern notes. Hedged wording; cultural reference; not career advice."
    },
    "termRefs": [
      "term:ziwei:palace:guan-lu"
    ],
    "termRefBindings": [
      "ziwei:官禄宫"
    ],
    "boundLexiconKey": [
      "ziwei:官禄宫"
    ],
    "personalFlag": true,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C3.career_palace"
  },
  {
    "mappingKey": "ziwei.C3.social_palace",
    "domain": "ziwei",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "观迁移与交友，察人际之应",
    "source": {
      "name": "紫微斗数全书",
      "location": "命宫论"
    },
    "vernacular": {
      "zhCN": "【人际场景骨架】事实顺序：交友宫主星 → 迁移宫提示。倾向式措辞，仅供传统文化参考。",
      "zhTW": "【人際場景骨架】事實順序：交友宮主星 → 遷移宮提示。傾向式措辭，僅供傳統文化參考。",
      "en": "[Social scene skeleton] Facts in order: friends-palace star, travel-palace notes. Hedged wording; cultural reference."
    },
    "termRefs": [
      "term:ziwei:palace:jiao-you"
    ],
    "termRefBindings": [
      "ziwei:交友宫"
    ],
    "boundLexiconKey": [
      "ziwei:交友宫"
    ],
    "personalFlag": true,
    "redlineTags": [],
    "i18nKey": "mapping.ziwei.C3.social_palace"
  },
  {
    "mappingKey": "almanac.C1.yi_jia_qu",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜嫁娶",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜嫁娶之日气机亲和，民俗中利于婚嫁仪式的开展。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜嫁娶之日氣機親和，民俗中利於婚嫁儀式的開展。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists wedding ceremonies as favorable today; folk custom reads the day as harmonious. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:jia-qu"
    ],
    "termRefBindings": [
      "zeiri:嫁娶"
    ],
    "boundLexiconKey": [
      "zeiri:嫁娶"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_jia_qu"
  },
  {
    "mappingKey": "almanac.C1.yi_chu_xing",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜出行",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜出行之日道路通达，民俗中利于远行与迁移。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜出行之日道路通達，民俗中利於遠行與遷移。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists travel as favorable today; folk custom reads the day as smooth for journeys. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:chu-xing"
    ],
    "termRefBindings": [
      "zeiri:出行"
    ],
    "boundLexiconKey": [
      "zeiri:出行"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_chu_xing"
  },
  {
    "mappingKey": "almanac.C1.yi_kai_shi",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜开市",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜开市之日生气渐旺，民俗中利于开业与启程新事业。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜開市之日生氣漸旺，民俗中利於開業與啟程新事業。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists business openings as favorable today; folk custom reads the day as brisk with fresh energy. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:kai-shi"
    ],
    "termRefBindings": [
      "zeiri:开市"
    ],
    "boundLexiconKey": [
      "zeiri:开市"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_kai_shi"
  },
  {
    "mappingKey": "almanac.C1.yi_dong_tu",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜动土",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜动土之地气相宜，民俗中利于营造开工。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜動土之地氣相宜，民俗中利於營造開工。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists ground-breaking as favorable today; folk custom reads the land as agreeable. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:dong-tu"
    ],
    "termRefBindings": [
      "zeiri:动土"
    ],
    "boundLexiconKey": [
      "zeiri:动土"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_dong_tu"
  },
  {
    "mappingKey": "almanac.C1.yi_ji_si",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜祭祀",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜祭祀之日清净庄严，民俗中利于追思与祈福仪式。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜祭祀之日清淨莊嚴，民俗中利於追思與祈福儀式。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists rites and remembrance as favorable today; folk custom reads the day as solemn and clear. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:ji-si"
    ],
    "termRefBindings": [
      "zeiri:祭祀"
    ],
    "boundLexiconKey": [
      "zeiri:祭祀"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_ji_si"
  },
  {
    "mappingKey": "almanac.C1.yi_an_chuang",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜安床",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜安床之日气场安稳，民俗中利于安顿起居。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜安床之日氣場安穩，民俗中利於安頓起居。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists bed-setting as favorable today; folk custom reads the day as settled and calm. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:an-chuang"
    ],
    "termRefBindings": [
      "zeiri:安床"
    ],
    "boundLexiconKey": [
      "zeiri:安床"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_an_chuang"
  },
  {
    "mappingKey": "almanac.C1.yi_zai_zhong",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜栽种",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜栽种之日生机应时，民俗中利于种植培育。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜栽種之日生機應時，民俗中利於種植培育。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists planting as favorable today; folk custom reads the day as alive with growth. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:zai-zhong"
    ],
    "termRefBindings": [
      "zeiri:栽种"
    ],
    "boundLexiconKey": [
      "zeiri:栽种"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_zai_zhong"
  },
  {
    "mappingKey": "almanac.C1.yi_ru_xue",
    "domain": "almanac",
    "level": "C1",
    "layer": "PATTERN",
    "classicalText": "宜入学",
    "source": {
      "name": "协纪辨方书",
      "location": "卷十·用事宜忌"
    },
    "vernacular": {
      "zhCN": "传统历法认为，宜入学之日文气相合，民俗中利于开启学业。此为传统民俗口径，仅供参考。",
      "zhTW": "傳統曆法認為，宜入學之日文氣相合，民俗中利於開啟學業。此為傳統民俗口徑，僅供參考。",
      "en": "The traditional almanac lists beginning studies as favorable today; folk custom reads the day as aligned with learning. Folk reference only."
    },
    "termRefs": [
      "term:almanac:yi-ji:ru-xue"
    ],
    "termRefBindings": [
      "zeiri:入学"
    ],
    "boundLexiconKey": [
      "zeiri:入学"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.yi_ru_xue"
  },
  {
    "mappingKey": "almanac.C1.jianchu_jian",
    "domain": "almanac",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "建除十二神·建",
    "source": {
      "name": "协纪辨方书",
      "location": "卷六·建除十二神"
    },
    "vernacular": {
      "zhCN": "建日旺气初生，传统视为开启新事的日子，民俗中宜谋划启动。民俗口径仅供参考。",
      "zhTW": "建日旺氣初生，傳統視為開啟新事的日子，民俗中宜謀劃啟動。民俗口徑僅供參考。",
      "en": "The Jian (Establish) day: folk custom reads it as suited to starting and planning new undertakings. Folk reference only."
    },
    "termRefs": [
      "term:almanac:jian-chu:jian"
    ],
    "termRefBindings": [
      "zeiri:建"
    ],
    "boundLexiconKey": [
      "zeiri:建"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.jianchu_jian"
  },
  {
    "mappingKey": "almanac.C1.jianchu_chu",
    "domain": "almanac",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "建除十二神·除",
    "source": {
      "name": "协纪辨方书",
      "location": "卷六·建除十二神"
    },
    "vernacular": {
      "zhCN": "除日有除旧之意，传统视为清理整顿的日子，民俗中宜扫除与了结旧事。民俗口径仅供参考。",
      "zhTW": "除日有除舊之意，傳統視為清理整頓的日子，民俗中宜掃除與了結舊事。民俗口徑僅供參考。",
      "en": "The Chu (Remove) day: folk custom reads it as suited to clearing out and wrapping up old matters. Folk reference only."
    },
    "termRefs": [
      "term:almanac:jian-chu:chu"
    ],
    "termRefBindings": [
      "zeiri:除"
    ],
    "boundLexiconKey": [
      "zeiri:除"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.jianchu_chu"
  },
  {
    "mappingKey": "almanac.C1.jianchu_man",
    "domain": "almanac",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "建除十二神·满",
    "source": {
      "name": "协纪辨方书",
      "location": "卷六·建除十二神"
    },
    "vernacular": {
      "zhCN": "满日气机充盈，传统视为丰收圆满之日，民俗中宜庆贺与感恩。民俗口径仅供参考。",
      "zhTW": "滿日氣機充盈，傳統視為豐收圓滿之日，民俗中宜慶賀與感恩。民俗口徑僅供參考。",
      "en": "The Man (Full) day: folk custom reads it as a day of fullness for celebration and gratitude. Folk reference only."
    },
    "termRefs": [
      "term:almanac:jian-chu:man"
    ],
    "termRefBindings": [
      "zeiri:满"
    ],
    "boundLexiconKey": [
      "zeiri:满"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.jianchu_man"
  },
  {
    "mappingKey": "almanac.C1.jianchu_ping",
    "domain": "almanac",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "建除十二神·平",
    "source": {
      "name": "协纪辨方书",
      "location": "卷六·建除十二神"
    },
    "vernacular": {
      "zhCN": "平日气机平稳，传统视为平常持守之日，民俗中宜按部就班、不宜大动。民俗口径仅供参考。",
      "zhTW": "平日氣機平穩，傳統視為平常持守之日，民俗中宜按部就班、不宜大動。民俗口徑僅供參考。",
      "en": "The Ping (Level) day: folk custom reads it as steady and routine — fine for steady work, quiet for big moves. Folk reference only."
    },
    "termRefs": [
      "term:almanac:jian-chu:ping"
    ],
    "termRefBindings": [
      "zeiri:平"
    ],
    "boundLexiconKey": [
      "zeiri:平"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.jianchu_ping"
  },
  {
    "mappingKey": "almanac.C1.jianchu_zhi",
    "domain": "almanac",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "建除十二神·执",
    "source": {
      "name": "协纪辨方书",
      "location": "卷六·建除十二神"
    },
    "vernacular": {
      "zhCN": "执日有执守之意，传统视为宜坚持执行的日子，民俗中宜守诺践约。民俗口径仅供参考。",
      "zhTW": "執日有執守之意，傳統視為宜堅持執行的日子，民俗中宜守諾踐約。民俗口徑僅供參考。",
      "en": "The Zhi (Hold) day: folk custom reads it as suited to perseverance and keeping commitments. Folk reference only."
    },
    "termRefs": [
      "term:almanac:jian-chu:zhi"
    ],
    "termRefBindings": [
      "zeiri:执"
    ],
    "boundLexiconKey": [
      "zeiri:执"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.jianchu_zhi"
  },
  {
    "mappingKey": "almanac.C1.jianchu_po",
    "domain": "almanac",
    "level": "C1",
    "layer": "BLOCK",
    "classicalText": "建除十二神·破",
    "source": {
      "name": "协纪辨方书",
      "location": "卷六·建除十二神"
    },
    "vernacular": {
      "zhCN": "破日气机冲破，传统视为不宜开启新事的日子，民俗中多避开重大启动。民俗口径仅供参考。",
      "zhTW": "破日氣機沖破，傳統視為不宜開啟新事的日子，民俗中多避開重大啟動。民俗口徑僅供參考。",
      "en": "The Po (Break) day: folk custom traditionally avoids major launches, reading it as disruptive. Folk reference only."
    },
    "termRefs": [
      "term:almanac:jian-chu:po"
    ],
    "termRefBindings": [
      "zeiri:破"
    ],
    "boundLexiconKey": [
      "zeiri:破"
    ],
    "personalFlag": false,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C1.jianchu_po"
  },
  {
    "mappingKey": "almanac.C2.9922aac7",
    "domain": "almanac",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "日冲生肖",
    "source": {
      "name": "协纪辨方书",
      "location": "卷七·冲煞"
    },
    "vernacular": {
      "zhCN": "传统历法中，当日地支与某生肖相冲：民俗习惯提醒该生肖当日行事多一分留意，重大安排可另择日。民俗口径仅供参考，不构成任何决策依据。",
      "zhTW": "傳統曆法中，當日地支與某生肖相沖：民俗習慣提醒該生肖當日行事多一分留意，重大安排可另擇日。民俗口徑僅供參考，不構成任何決策依據。",
      "en": "When the day’s branch clashes with a zodiac sign, folk custom suggests extra care for that sign. Folk reference only; not decision advice."
    },
    "termRefs": [
      "term:almanac:chong-sha"
    ],
    "termRefBindings": [
      "zeiri:冲煞"
    ],
    "boundLexiconKey": [
      "zeiri:冲煞"
    ],
    "personalFlag": false,
    "redlineTags": [
      "decision-hedge"
    ],
    "i18nKey": "mapping.almanac.C2.9922aac7"
  },
  {
    "mappingKey": "almanac.C2.fd8d92f8",
    "domain": "almanac",
    "level": "C2",
    "layer": "BLOCK",
    "classicalText": "岁破之日，诸事不宜",
    "source": {
      "name": "协纪辨方书",
      "location": "卷七·岁破"
    },
    "vernacular": {
      "zhCN": "传统历法中「岁破」之日（与当年太岁相冲）：民俗习惯视之为宜静不宜动的日子，重大事项传统上多避开。民俗口径仅供参考。",
      "zhTW": "傳統曆法中「歲破」之日（與當年太歲相沖）：民俗習慣視之為宜靜不宜動的日子，重大事項傳統上多避開。民俗口徑僅供參考。",
      "en": "The Sui Po (year-breaker) day is folk-read as a day for quiet rather than launches. Folk reference only."
    },
    "termRefs": [
      "term:almanac:sui-po"
    ],
    "termRefBindings": [
      "shasha:岁破"
    ],
    "boundLexiconKey": [
      "shasha:岁破"
    ],
    "personalFlag": false,
    "redlineTags": [
      "decision-hedge"
    ],
    "i18nKey": "mapping.almanac.C2.fd8d92f8"
  },
  {
    "mappingKey": "almanac.C3.daily_yi_ji",
    "domain": "almanac",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "择吉而行，顺天应时",
    "source": {
      "name": "协纪辨方书",
      "location": "卷一·义例"
    },
    "vernacular": {
      "zhCN": "【今日宜忌场景骨架】事实顺序：建除神 → 宜类 → 忌类 → 冲煞提示。全部使用民俗口径与倾向式措辞，不构成日程决策依据。",
      "zhTW": "【今日宜忌場景骨架】事實順序：建除神 → 宜類 → 忌類 → 沖煞提示。全部使用民俗口徑與傾向式措辭，不構成日程決策依據。",
      "en": "[Daily almanac scene skeleton] Facts in order: day officer, favorable list, avoid list, clash note. Folk wording, hedged; not schedule advice."
    },
    "termRefs": [
      "term:almanac:jian-chu:jian"
    ],
    "termRefBindings": [
      "zeiri:建"
    ],
    "boundLexiconKey": [
      "zeiri:建"
    ],
    "personalFlag": true,
    "redlineTags": [
      "decision-hedge"
    ],
    "i18nKey": "mapping.almanac.C3.daily_yi_ji"
  },
  {
    "mappingKey": "almanac.C3.festival_note",
    "domain": "almanac",
    "level": "C3",
    "layer": "BLOCK",
    "classicalText": "应节而行",
    "source": {
      "name": "协纪辨方书",
      "location": "卷九·节日"
    },
    "vernacular": {
      "zhCN": "【节庆场景骨架】事实顺序：节气/节日 → 民俗活动提示。倾向式措辞，弘扬传统文化视角。",
      "zhTW": "【節慶場景骨架】事實順序：節氣/節日 → 民俗活動提示。傾向式措辭，弘揚傳統文化視角。",
      "en": "[Festival scene skeleton] Facts in order: solar term/festival, folk activity notes. Hedged wording; traditional-culture perspective."
    },
    "termRefs": [
      "term:almanac:jie-qi"
    ],
    "termRefBindings": [
      "common:节气"
    ],
    "boundLexiconKey": [
      "common:节气"
    ],
    "personalFlag": true,
    "redlineTags": [],
    "i18nKey": "mapping.almanac.C3.festival_note"
  }
];

const byKey = new Map(A8_WAVE1_MAPPINGS.map((m) => [m.mappingKey, m]));

/** 按 mappingKey 查白话；locale=zhCN/zhTW/en；查不到返回 null（=缺词条信号） */
export function getMappingVernacular(mappingKey: string, locale: A8VernacularLocale): string | null {
  const m = byKey.get(mappingKey);
  if (!m) return null;
  return m.vernacular[locale] || null;
}

/**
 * 按 lexicon key（termRefBindings 命中者）查引用该术语的全部映射白话；
 * 多义体系由调用方按 senseId 选定 lexicon key 后再传入。查不到返回空数组。
 */
export function getTermVernacular(lexiconKey: string, locale: A8VernacularLocale): string[] {
  return A8_WAVE1_MAPPINGS.filter((m) => m.termRefBindings.includes(lexiconKey)).map(
    (m) => m.vernacular[locale],
  );
}
