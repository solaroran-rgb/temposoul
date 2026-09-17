import type { MansionAstroLayer } from './types';

// 自查：@temposoul/core qi_zheng/ 导出名；黄经为 J2000 历元近似值（accuracyGrade:'approx'）
const ASTRON_SOURCE = 'IAU / Hipparcos 星表（J2000）';
const PRECESSION_NOTE = '黄经以 J2000 历元为准；按当日历元查询需做岁差换算。';
const ACCURACY_NOTE = '近似值，正式星表落盘后更新。';

function mk(name: string, west: string, lon: number, endLon: number): MansionAstroLayer {
  return {
    distanceStarName: name, distanceStarWestern: west,
    eclipticLongitudeDeg: lon, eclipticEpoch: 'J2000',
    precessionNote: PRECESSION_NOTE, accuracyGrade: 'approx',
    raRange: [lon, endLon], astroSourceRef: ASTRON_SOURCE, accuracyNote: ACCURACY_NOTE,
  };
}

export const ASTRO_TABLE: Record<string, MansionAstroLayer> = {
  jiao: mk('角宿一', 'Spica', 203.8, 216.0),
  kang: mk('亢宿一', 'Kappa Vir', 216.0, 224.0),
  di: mk('氐宿一', 'Alpha Lib', 224.0, 233.0),
  fang: mk('房宿一', 'Pi Sco', 233.0, 239.0),
  xin: mk('心宿二', 'Antares', 239.0, 245.0),
  wei: mk('尾宿一', 'Mu Sco', 245.0, 258.0),
  ji: mk('箕宿一', 'Gamma Sgr', 258.0, 266.0),
  dou: mk('斗宿一', 'Phi Sgr', 266.0, 279.0),
  niu: mk('牛宿一', 'Beta Cap', 279.0, 290.0),
  nv: mk('女宿一', 'Epsilon Aqr', 290.0, 300.0),
  xu: mk('虚宿一', 'Beta Aqr', 300.0, 309.0),
  wei2: mk('危宿一', 'Alpha Aqr', 309.0, 320.0),
  shi: mk('室宿一', 'Alpha Peg', 320.0, 331.0),
  bi: mk('壁宿一', 'Gamma Peg', 331.0, 340.0),
  kui: mk('奎宿一', 'Eta And', 340.0, 350.0),
  lou: mk('娄宿一', 'Beta Ari', 350.0, 359.0),
  wei3: mk('胃宿一', '35 Ari', 359.0, 9.0),
  mao: mk('昴宿一', '17 Tau', 9.0, 20.0),
  bi2: mk('毕宿一', 'Epsilon Tau', 20.0, 33.0),
  zi: mk('觜宿一', 'Meissa', 33.0, 36.0),
  shen: mk('参宿一', 'Alnitak', 36.0, 47.0),
  jing: mk('井宿一', 'Mu Gem', 47.0, 64.0),
  gui: mk('鬼宿一', 'Theta Cnc', 64.0, 70.0),
  liu: mk('柳宿一', 'Delta Hya', 70.0, 81.0),
  xing: mk('星宿一', 'Alpha Hya', 81.0, 92.0),
  zhang: mk('张宿一', 'Upsilon1 Hya', 92.0, 105.0),
  yi: mk('翼宿一', 'Alpha Crt', 105.0, 125.0),
  zhen: mk('轸宿一', 'Gamma Crv', 125.0, 143.0),
};

export const MANSION_IDS = Object.keys(ASTRO_TABLE);
