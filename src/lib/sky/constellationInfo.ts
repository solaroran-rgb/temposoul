/**
 * @file 14 个主要星座的说明文案数据（与 SkyScene.CONS 一一对应）
 * 中文名/主星/季节/一句话说明；raH/decD 与 SkyScene 标签一致，用于可见性计算
 */
export interface ConstellationInfo {
  key: string;      // 英文名（SkyScene 标签同款）
  zh: string;       // 中文名
  raH: number;      // 赤经（时）
  decD: number;     // 赤纬（度）
  brightest: string; // 主星
  season: string;   // 最佳观测季
  note: string;     // 一句话说明
}

export const CONSTELLATION_INFO: ConstellationInfo[] = [
  { key: 'Ursa Major', zh: '大熊座', raH: 11.0, decD: 50, brightest: '北斗七星（Dubhe）', season: '春季', note: '北天最醒目的星座，北斗七星指向北极星，古人谓之“帝车”。' },
  { key: 'Ursa Minor', zh: '小熊座', raH: 15.0, decD: 75, brightest: '北极星（Polaris）', season: '全年（北半球）', note: '尾巴末端即北极星，位于几乎不动的地轴方向，是夜航的天然罗盘。' },
  { key: 'Cassiopeia', zh: '仙后座', raH: 1.0, decD: 60, brightest: '王良四（Schedar）', season: '秋季', note: '呈醒目的 W/M 形，与北斗七星隔着北极星遥遥相对。' },
  { key: 'Orion', zh: '猎户座', raH: 5.5, decD: 0, brightest: '参宿四 / 参宿七', season: '冬季', note: '全天最壮丽的星座，“腰带三星”横贯夜空，猎人手持弓矢巡猎天宇。' },
  { key: 'Taurus', zh: '金牛座', raH: 4.5, decD: 18, brightest: '毕宿五（Aldebaran）', season: '冬季', note: '黄道星座，V 形毕宿星团如牛首，牛角尖指向猎户座。' },
  { key: 'Gemini', zh: '双子座', raH: 7.0, decD: 25, brightest: '北河二 / 北河三', season: '冬春季', note: '黄道星座，双星并立如孪生兄弟，传说为卡斯托尔与波吕丢刻斯。' },
  { key: 'Leo', zh: '狮子座', raH: 10.5, decD: 15, brightest: '轩辕十四（Regulus）', season: '春季', note: '黄道星座，“狮心”轩辕十四为王者之星，春季星空的主宰。' },
  { key: 'Virgo', zh: '室女座', raH: 13.3, decD: 0, brightest: '角宿一（Spica）', season: '春季', note: '黄道星座，麦穗之星角宿一明亮清冷，谷神之名源于此。' },
  { key: 'Scorpius', zh: '天蝎座', raH: 16.8, decD: -30, brightest: '心宿二（Antares）', season: '夏季', note: '黄道星座，火红的心宿二与猎户座参宿四分守夏冬两季天空。' },
  { key: 'Sagittarius', zh: '人马座', raH: 19.0, decD: -25, brightest: '箕宿三（Kaus Australis）', season: '夏季', note: '黄道星座，正对银河系中心方向，射手弯弓遥指银心。' },
  { key: 'Lyra', zh: '天琴座', raH: 18.7, decD: 38.8, brightest: '织女一（Vega）', season: '夏季', note: '小小琴身却藏织女星——夏季大三角之首，牵牛织女传说之源。' },
  { key: 'Aquila', zh: '天鹰座', raH: 19.7, decD: 8.7, brightest: '牛郎星（Altair）', season: '夏季', note: '夏季大三角之一，牛郎星与织女星隔银河相望。' },
  { key: 'Pegasus', zh: '飞马座', raH: 23.0, decD: 20, brightest: '室宿一（Markab）', season: '秋季', note: '秋季四边形的主体，神话中载着英雄珀尔修斯斩妖的神驹。' },
  { key: 'Andromeda', zh: '仙女座', raH: 0.8, decD: 35, brightest: '奎宿九（Mirach）', season: '秋季', note: '肉眼可见的 M31 仙女座星系即在此，银河系的邻居。' },
];

export const constInfoOf = (key: string): ConstellationInfo | undefined =>
  CONSTELLATION_INFO.find(c => c.key === key);
