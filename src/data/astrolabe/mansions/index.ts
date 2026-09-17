import type { MansionEntry } from './types';
import { ASTRO_TABLE, MANSION_IDS } from './astro-table';
import { FOLK_TABLE } from './folk-table';

const MANSION_NAMES: Record<string, string> = {
  jiao: '角宿', kang: '亢宿', di: '氐宿', fang: '房宿', xin: '心宿', wei: '尾宿', ji: '箕宿',
  dou: '斗宿', niu: '牛宿', nv: '女宿', xu: '虚宿', wei2: '危宿', shi: '室宿', bi: '壁宿',
  kui: '奎宿', lou: '娄宿', wei3: '胃宿', mao: '昴宿', bi2: '毕宿', zi: '觜宿', shen: '参宿',
  jing: '井宿', gui: '鬼宿', liu: '柳宿', xing: '星宿', zhang: '张宿', yi: '翼宿', zhen: '轸宿',
};

const DISCLAIMER = '宿度内容中，天文层为现代星表数据，民俗层为传统文化参考，请分开理解。';

export const MANSION_ENTRIES: MansionEntry[] = MANSION_IDS.map((id, idx) => {
  const name = MANSION_NAMES[id] ?? id;
  return {
    id, name, order: idx + 1,
    astro: ASTRO_TABLE[id], folk: FOLK_TABLE[id],
    confidence: 'legendary' as const, ready: true, disclaimer: DISCLAIMER,
    seo: {
      description: `${name}：距星黄经（J2000）与宿度文化解读，天文层与民俗层分离呈现。`,
      ogTitle: `${name} · 宿度详解`,
      ogDescription: `${name}距星、黄经、宿度区间与民俗解读。`,
    },
  };
});

export function findMansion(id: string | undefined | null): MansionEntry | undefined {
  if (!id) return undefined;
  return MANSION_ENTRIES.find((m) => m.id === id);
}

export * from './types';
