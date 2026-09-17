// B23-1 src/data/astrology/celebrity-charts.ts
/**
 * 名人星盘 SEO 专栏首期数据（20 人：科学5 / 艺术5 / 体育5 / 文化5）
 *
 * 边界：
 * - 仅收录已故或公众人物的公开生日与出生地，不做隐私评价；
 * - 出生地 lat/lng 为预置公开地理坐标（本地无地理编码 API）；
 * - 古代人物无精确出生钟点，日期取公开传记记载日，时间统一记为当日 T00:00Z，
 *   confidence 相应降级；解读为静态文化文本，同 ID 永远同结果；
 * - 不含医疗 / 法律 / 婚育类断言。
 */
import type { Confidence } from '@/data/knowledge/schema';

export type CelebrityField = 'science' | 'arts' | 'sports' | 'culture';

export interface CelebrityChart {
  id: string;
  name: string;
  field: CelebrityField;
  status: 'active' | 'archived';
  metaDescription: string;
  h1: string;
  birthData: {
    date: string; // ISO8601 UTC（无精确钟点者记当日 T00:00Z）
    locationName: string;
    lat: number;
    lng: number;
    source: string;
    confidence: Confidence;
  };
  interpretation: {
    summary: string;
    keyAspects: string[];
    disclaimer: string;
  };
  relatedSlugs: string[];
}

const DISC = '以下为星座文化视角的公开资料整理，仅供娱乐与文化参考，不构成对个人能力、健康或命运的判断。';

export const CELEBRITY_FIELDS: { key: CelebrityField; label: string }[] = [
  { key: 'science', label: '科学' },
  { key: 'arts', label: '艺术' },
  { key: 'sports', label: '体育' },
  { key: 'culture', label: '文化' },
];

export const CELEBRITY_CHARTS: CelebrityChart[] = [
  // ============ 科学 5 ============
  {
    id: 'albert-einstein',
    name: '阿尔伯特·爱因斯坦',
    field: 'science',
    status: 'active',
    metaDescription: '爱因斯坦的公开生日与出生地资料整理，星座文化视角的通俗解读。',
    h1: '爱因斯坦星盘资料（星座文化参考）',
    birthData: {
      date: '1879-03-14T00:00:00Z',
      locationName: '德国乌尔姆',
      lat: 48.4,
      lng: 9.99,
      source: '公开传记资料（出生日 1879-03-14）；钟点无可靠公开记录，按当日记。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '双鱼座（3月14日）常被描述为想象力丰富、善于抽象思考。这里仅作星座文化的大众化联想，不据此评价其科学贡献。',
      keyAspects: ['太阳双鱼座（星座文化归类）', '出生日月份与节气区间的大众描述', '出生地欧洲中部（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['marie-curie', 'isaac-newton'],
  },
  {
    id: 'marie-curie',
    name: '玛丽·居里',
    field: 'science',
    status: 'active',
    metaDescription: '居里夫人的公开生日与出生地资料整理，星座文化视角的通俗解读。',
    h1: '居里夫人生日资料（星座文化参考）',
    birthData: {
      date: '1867-11-07T00:00:00Z',
      locationName: '波兰华沙',
      lat: 52.23,
      lng: 21.01,
      source: '公开传记资料（出生日 1867-11-07）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '天蝎座（11月7日）在大众星座文化中常与专注、韧性相关联。此处仅作文化标签的说明，不评价其科研成就。',
      keyAspects: ['太阳天蝎座（星座文化归类）', '冬至前出生日的大众描述', '出生地华沙（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['albert-einstein', 'charles-darwin'],
  },
  {
    id: 'isaac-newton',
    name: '艾萨克·牛顿',
    field: 'science',
    status: 'active',
    metaDescription: '牛顿的公开生日（公历换算后）与出生地资料整理，星座文化参考。',
    h1: '牛顿生日资料（星座文化参考）',
    birthData: {
      date: '1643-01-04T00:00:00Z',
      locationName: '英国伍尔索普',
      lat: 52.81,
      lng: -0.63,
      source: '旧历 1642-12-25，按公历换算为 1643-01-04（公开传记资料）；钟点无可靠记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '摩羯座（1月4日）在大众文化中常与系统、严谨相关联。这只是星座流行语的标签，不构成对其学术工作的评价。',
      keyAspects: ['太阳摩羯座（星座文化归类）', '公历/旧历换算说明', '出生地伍尔索普（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['albert-einstein', 'nikola-tesla'],
  },
  {
    id: 'charles-darwin',
    name: '查尔斯·达尔文',
    field: 'science',
    status: 'active',
    metaDescription: '达尔文的公开生日与出生地资料整理，星座文化视角的通俗解读。',
    h1: '达尔文生日资料（星座文化参考）',
    birthData: {
      date: '1809-02-12T00:00:00Z',
      locationName: '英国什鲁斯伯里',
      lat: 52.71,
      lng: -2.75,
      source: '公开传记资料（出生日 1809-02-12）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '水瓶座（2月12日）在大众文化中常与观察、独立思考相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳水瓶座（星座文化归类）', '冬季出生日的大众描述', '出生地什鲁斯伯里（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['marie-curie', 'isaac-newton'],
  },
  {
    id: 'nikola-tesla',
    name: '尼古拉·特斯拉',
    field: 'science',
    status: 'active',
    metaDescription: '特斯拉的公开生日与出生地资料整理，星座文化视角的通俗解读。',
    h1: '特斯拉生日资料（星座文化参考）',
    birthData: {
      date: '1856-07-10T00:00:00Z',
      locationName: '克罗地亚斯米连',
      lat: 44.55,
      lng: 15.3,
      source: '公开传记资料（出生日 1856-07-10）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '巨蟹座（7月10日）在大众文化中常与想象、专注相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳巨蟹座（星座文化归类）', '夏季出生日的大众描述', '出生地斯米连（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['albert-einstein', 'isaac-newton'],
  },

  // ============ 艺术 5 ============
  {
    id: 'leonardo-da-vinci',
    name: '列奥纳多·达·芬奇',
    field: 'arts',
    status: 'active',
    metaDescription: '达·芬奇的公开生日与出生地资料整理，星座文化参考。',
    h1: '达·芬奇生日资料（星座文化参考）',
    birthData: {
      date: '1452-04-15T00:00:00Z',
      locationName: '意大利芬奇镇',
      lat: 43.79,
      lng: 10.92,
      source: '公开传记资料（出生日约 1452-04-15）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '白羊座（4月15日）在大众文化中常与行动力、好奇心相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳白羊座（星座文化归类）', '文艺复兴时期的出生记录特点', '出生地芬奇镇（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['wolfgang-mozart', 'vincent-van-gogh'],
  },
  {
    id: 'ludwig-beethoven',
    name: '路德维希·范·贝多芬',
    field: 'arts',
    status: 'active',
    metaDescription: '贝多芬的公开生日与出生地资料整理，星座文化参考。',
    h1: '贝多芬生日资料（星座文化参考）',
    birthData: {
      date: '1770-12-16T00:00:00Z',
      locationName: '德国波恩',
      lat: 50.74,
      lng: 7.09,
      source: '公开传记资料（受洗 1770-12-17，传统记生日 12-16）；钟点无可靠记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '射手座（12月16日）在大众文化中常与直率、热情相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳射手座（星座文化归类）', '受洗记录与传统生日的说明', '出生地波恩（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['wolfgang-mozart', 'leonardo-da-vinci'],
  },
  {
    id: 'wolfgang-mozart',
    name: '沃尔夫冈·阿马德乌斯·莫扎特',
    field: 'arts',
    status: 'active',
    metaDescription: '莫扎特的公开生日与出生地资料整理，星座文化参考。',
    h1: '莫扎特生日资料（星座文化参考）',
    birthData: {
      date: '1756-01-27T00:00:00Z',
      locationName: '奥地利萨尔茨堡',
      lat: 47.81,
      lng: 13.05,
      source: '公开传记资料（出生日 1756-01-27）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '水瓶座（1月27日）在大众文化中常与灵动、创意相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳水瓶座（星座文化归类）', '冬季出生日的大众描述', '出生地萨尔茨堡（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['ludwig-beethoven', 'leonardo-da-vinci'],
  },
  {
    id: 'vincent-van-gogh',
    name: '文森特·梵高',
    field: 'arts',
    status: 'active',
    metaDescription: '梵高的公开生日与出生地资料整理，星座文化参考。',
    h1: '梵高生日资料（星座文化参考）',
    birthData: {
      date: '1853-03-30T00:00:00Z',
      locationName: '荷兰津德尔特',
      lat: 51.46,
      lng: 4.02,
      source: '公开传记资料（出生日 1853-03-30）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '白羊座（3月30日）在大众文化中常与强烈表达相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳白羊座（星座文化归类）', '早春出生日的大众描述', '出生地津德尔特（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['leonardo-da-vinci', 'ludwig-beethoven'],
  },
  {
    id: 'william-shakespeare',
    name: '威廉·莎士比亚',
    field: 'arts',
    status: 'active',
    metaDescription: '莎士比亚的传统生日与出生地资料整理，星座文化参考。',
    h1: '莎士比亚生日资料（星座文化参考）',
    birthData: {
      date: '1564-04-23T00:00:00Z',
      locationName: '英国埃文河畔斯特拉特福',
      lat: 52.19,
      lng: -1.71,
      source: '受洗记录 1564-04-26，传统记生日 4月23日（公开传记资料）；钟点无可靠记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '金牛座（4月23日）在大众文化中常与细腻观察相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳金牛座（星座文化归类）', '受洗记录与传统生日的说明', '出生地斯特拉特福（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['johann-goethe', 'franz-kafka'],
  },

  // ============ 体育 5 ============
  {
    id: 'pele',
    name: '贝利',
    field: 'sports',
    status: 'active',
    metaDescription: '贝利的公开生日与出生地资料整理，星座文化参考。',
    h1: '贝利生日资料（星座文化参考）',
    birthData: {
      date: '1940-10-23T00:00:00Z',
      locationName: '巴西特雷斯科拉索斯',
      lat: -21.83,
      lng: -45.25,
      source: '公开传记资料（出生日 1940-10-23）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '天秤座（10月23日）在大众文化中常与平衡感相关联。此处仅作星座流行语标签说明，不评价其运动成就。',
      keyAspects: ['太阳天秤座（星座文化归类）', '南半球出生地的季节说明', '出生地特雷斯科拉索斯（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['lionel-messi', 'muhammad-ali'],
  },
  {
    id: 'michael-jordan',
    name: '迈克尔·乔丹',
    field: 'sports',
    status: 'active',
    metaDescription: '乔丹的公开生日与出生地资料整理，星座文化参考。',
    h1: '乔丹生日资料（星座文化参考）',
    birthData: {
      date: '1963-02-17T00:00:00Z',
      locationName: '美国纽约布鲁克林',
      lat: 40.68,
      lng: -73.94,
      source: '公开传记资料（出生日 1963-02-17）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '水瓶座（2月17日）在大众文化中常与个人风格相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳水瓶座（星座文化归类）', '冬季出生日的大众描述', '出生地布鲁克林（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['pele', 'serena-williams'],
  },
  {
    id: 'muhammad-ali',
    name: '穆罕默德·阿里',
    field: 'sports',
    status: 'active',
    metaDescription: '阿里的公开生日与出生地资料整理，星座文化参考。',
    h1: '阿里生日资料（星座文化参考）',
    birthData: {
      date: '1942-01-17T00:00:00Z',
      locationName: '美国路易斯维尔',
      lat: 38.25,
      lng: -85.76,
      source: '公开传记资料（出生日 1942-01-17）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '摩羯座（1月17日）在大众文化中常与坚定相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳摩羯座（星座文化归类）', '冬季出生日的大众描述', '出生地路易斯维尔（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['pele', 'michael-jordan'],
  },
  {
    id: 'lionel-messi',
    name: '利昂内尔·梅西',
    field: 'sports',
    status: 'active',
    metaDescription: '梅西的公开生日与出生地资料整理，星座文化参考。',
    h1: '梅西生日资料（星座文化参考）',
    birthData: {
      date: '1987-06-24T00:00:00Z',
      locationName: '阿根廷罗萨里奥',
      lat: -32.95,
      lng: -60.64,
      source: '公开传记资料（出生日 1987-06-24）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '巨蟹座（6月24日）在大众文化中常与专注相关联。此处仅作星座流行语说明，不评价其竞技表现。',
      keyAspects: ['太阳巨蟹座（星座文化归类）', '南半球出生地的季节说明', '出生地罗萨里奥（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['pele', 'serena-williams'],
  },
  {
    id: 'serena-williams',
    name: '塞雷娜·威廉姆斯',
    field: 'sports',
    status: 'active',
    metaDescription: '小威廉姆斯的公开生日与出生地资料整理，星座文化参考。',
    h1: '小威廉姆斯生日资料（星座文化参考）',
    birthData: {
      date: '1981-09-26T00:00:00Z',
      locationName: '美国萨吉诺',
      lat: 43.42,
      lng: -83.94,
      source: '公开传记资料（出生日 1981-09-26）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '天秤座（9月26日）在大众文化中常与节奏、平衡相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳天秤座（星座文化归类）', '秋分前后出生的大众描述', '出生地萨吉诺（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['michael-jordan', 'lionel-messi'],
  },

  // ============ 文化 5 ============
  {
    id: 'johann-goethe',
    name: '约翰·沃尔夫冈·冯·歌德',
    field: 'culture',
    status: 'active',
    metaDescription: '歌德的公开生日与出生地资料整理，星座文化参考。',
    h1: '歌德生日资料（星座文化参考）',
    birthData: {
      date: '1749-08-28T00:00:00Z',
      locationName: '德国法兰克福',
      lat: 50.11,
      lng: 8.68,
      source: '公开传记资料（出生日 1749-08-28）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '处女座（8月28日）在大众文化中常与观察、细致相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳处女座（星座文化归类）', '夏末出生日的大众描述', '出生地法兰克福（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['william-shakespeare', 'rabindranath-tagore'],
  },
  {
    id: 'rabindranath-tagore',
    name: '拉宾德拉纳特·泰戈尔',
    field: 'culture',
    status: 'active',
    metaDescription: '泰戈尔的公开生日与出生地资料整理，星座文化参考。',
    h1: '泰戈尔生日资料（星座文化参考）',
    birthData: {
      date: '1861-05-07T00:00:00Z',
      locationName: '印度加尔各答',
      lat: 22.57,
      lng: 88.36,
      source: '公开传记资料（出生日 1861-05-07）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '金牛座（5月7日）在大众文化中常与感官、韵律相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳金牛座（星座文化归类）', '亚热带出生地的季节说明', '出生地加尔各答（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['johann-goethe', 'lu-xun'],
  },
  {
    id: 'federica-lorca',
    name: '费德里科·加西亚·洛尔迦',
    field: 'culture',
    status: 'active',
    metaDescription: '洛尔迦的公开生日与出生地资料整理，星座文化参考。',
    h1: '洛尔迦生日资料（星座文化参考）',
    birthData: {
      date: '1898-06-05T00:00:00Z',
      locationName: '西班牙格拉纳达',
      lat: 37.18,
      lng: -3.6,
      source: '公开传记资料（出生日 1898-06-05）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '双子座（6月5日）在大众文化中常与语言、敏感相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳双子座（星座文化归类）', '初夏出生日的大众描述', '出生地格拉纳达（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['johann-goethe', 'franz-kafka'],
  },
  {
    id: 'franz-kafka',
    name: '弗朗茨·卡夫卡',
    field: 'culture',
    status: 'active',
    metaDescription: '卡夫卡的公开生日与出生地资料整理，星座文化参考。',
    h1: '卡夫卡生日资料（星座文化参考）',
    birthData: {
      date: '1883-07-03T00:00:00Z',
      locationName: '捷克布拉格',
      lat: 50.08,
      lng: 14.44,
      source: '公开传记资料（出生日 1883-07-03）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '巨蟹座（7月3日）在大众文化中常与内省、想象相关联。此处仅作星座流行语标签说明。',
      keyAspects: ['太阳巨蟹座（星座文化归类）', '夏季出生日的大众描述', '出生地布拉格（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['william-shakespeare', 'lu-xun'],
  },
  {
    id: 'lu-xun',
    name: '鲁迅',
    field: 'culture',
    status: 'active',
    metaDescription: '鲁迅的公开生日与出生地资料整理，星座文化参考。',
    h1: '鲁迅生日资料（星座文化参考）',
    birthData: {
      date: '1881-09-25T00:00:00Z',
      locationName: '中国绍兴',
      lat: 30.0,
      lng: 120.58,
      source: '公开传记资料（出生日 1881-09-25）；钟点无可靠公开记录。',
      confidence: 'probable',
    },
    interpretation: {
      summary: '天秤座（9月25日）在大众文化中常与思辨、观察相关联。此处仅作星座流行语说明。',
      keyAspects: ['太阳天秤座（星座文化归类）', '秋分前后出生的大众描述', '出生地绍兴（预置坐标）'],
      disclaimer: DISC,
    },
    relatedSlugs: ['rabindranath-tagore', 'franz-kafka'],
  },
];

export function getCelebrityById(id: string): CelebrityChart | undefined {
  return CELEBRITY_CHARTS.find((c) => c.id === id);
}
