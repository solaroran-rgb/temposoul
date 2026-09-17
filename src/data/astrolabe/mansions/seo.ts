import { MANSION_ENTRIES } from './index';

export const MANSION_LIST_SEO = {
  title: '二十八宿宿度详解',
  description: '二十八宿距星黄经（J2000）与宿度文化解读，天文层与民俗层分离呈现。',
  ogTitle: '二十八宿宿度详解',
  ogDescription: '角亢氐房心尾箕……二十八宿真实距星黄经与民俗意象。',
};

export function getMansionSeo(id: string) {
  return MANSION_ENTRIES.find((m) => m.id === id)?.seo ?? MANSION_LIST_SEO;
}
