import type { MansionFolkLayer } from './types';

const FOLK_SOURCE = '《史记·天官书》《晋书·天文志》通行本';

function mk(auspiciousness: MansionFolkLayer['auspiciousness'], animal: string, imagery: string, verse: string): MansionFolkLayer {
  return { auspiciousness, animal, imagery, verse, folkSourceRef: FOLK_SOURCE };
}

export const FOLK_TABLE: Record<string, MansionFolkLayer> = {
  jiao: mk('auspicious', '蛟', '角宿主天门，民俗视为吉宿。', '角宿造作主荣昌。'),
  kang: mk('inauspicious', '龙', '亢宿主疾疫，民俗视为凶宿。', '亢宿不利主灾殃。'),
  di: mk('inauspicious', '貉', '氐宿主官非，民俗视为平中带凶。', '氐宿婚姻不可当。'),
  fang: mk('auspicious', '兔', '房宿主吉庆，民俗视为吉宿。', '房宿造作进田庄。'),
  xin: mk('neutral', '狐', '心宿主吉凶参半。', '心宿造作有灾殃。'),
  wei: mk('auspicious', '虎', '尾宿主婚姻，民俗视为吉宿。', '尾宿婚姻大吉昌。'),
  ji: mk('auspicious', '豹', '箕宿主进财，民俗视为吉宿。', '箕宿造作主荣华。'),
  dou: mk('auspicious', '獬', '斗宿主功名，民俗视为吉宿。', '斗宿造作主荣昌。'),
  niu: mk('inauspicious', '牛', '牛宿主灾殃，民俗视为凶宿。', '牛宿造作主灾殃。'),
  nv: mk('inauspicious', '蝠', '女宿主口舌，民俗视为平中带凶。', '女宿造作主口舌。'),
  xu: mk('inauspicious', '鼠', '虚宿主虚耗，民俗视为凶宿。', '虚宿造作主灾殃。'),
  wei2: mk('inauspicious', '燕', '危宿主危险，民俗视为凶宿。', '危宿造作主灾殃。'),
  shi: mk('auspicious', '猪', '室宿主婚姻，民俗视为吉宿。', '室宿造作主荣昌。'),
  bi: mk('auspicious', '貐', '壁宿主文书，民俗视为吉宿。', '壁宿造作主荣华。'),
  kui: mk('inauspicious', '狼', '奎宿主文章，民俗视为平中带凶。', '奎宿造作主灾殃。'),
  lou: mk('auspicious', '狗', '娄宿主婚姻，民俗视为吉宿。', '娄宿造作主荣昌。'),
  wei3: mk('auspicious', '雉', '胃宿主进财，民俗视为吉宿。', '胃宿造作主荣华。'),
  mao: mk('inauspicious', '鸡', '昴宿主灾殃，民俗视为凶宿。', '昴宿造作主灾殃。'),
  bi2: mk('auspicious', '乌', '毕宿主雨，民俗视为吉宿。', '毕宿造作主荣昌。'),
  zi: mk('inauspicious', '猴', '觜宿主口舌，民俗视为凶宿。', '觜宿造作主口舌。'),
  shen: mk('auspicious', '猿', '参宿主婚姻，民俗视为吉宿。', '参宿造作主荣昌。'),
  jing: mk('auspicious', '犴', '井宿主进财，民俗视为吉宿。', '井宿造作主荣华。'),
  gui: mk('inauspicious', '羊', '鬼宿主灾殃，民俗视为凶宿。', '鬼宿造作主灾殃。'),
  liu: mk('inauspicious', '獐', '柳宿主口舌，民俗视为凶宿。', '柳宿造作主口舌。'),
  xing: mk('inauspicious', '马', '星宿主灾殃，民俗视为凶宿。', '星宿造作主灾殃。'),
  zhang: mk('auspicious', '鹿', '张宿主婚姻，民俗视为吉宿。', '张宿造作主荣昌。'),
  yi: mk('auspicious', '蛇', '翼宿主进财，民俗视为吉宿。', '翼宿造作主荣华。'),
  zhen: mk('inauspicious', '蚓', '轸宿主灾殃，民俗视为凶宿。', '轸宿造作主灾殃。'),
};

/** 合规免责声明：二十八宿吉凶辞为传统民俗口歌，不构成任何决策依据 */
export const mansion_folk_disclaimer =
  '二十八宿吉凶配属与口歌为传统民俗文化内容，仅供文化与历史参考，不构成择日、婚嫁、营造或任何现实决策的依据。';
