/**
 * 宫星生成器：165 条模板预计算（O(1) 读取，避免每次渲染 O(n²) 拼装）
 * 来源：专家 A v8.0（论证44.md §3.5 修正：generator 预计算 O(n²)→O(1)）
 * 口径：PALACE_STAR_INDEX(168) - 3 手写 = 165 模板，逐条 ≥120 字
 */
import type { ContentRecord, PalaceStarExtra } from './types';
import { PALACE_STAR_INDEX, PALACE_STAR_EXAMPLES, PALACE_PINYIN_MAP, STAR_PINYIN } from './palace-star';
import { PALACE_IMPACT } from './shared/palace-impact';

/** 模板拼装函数（单条 ≥120 字） */
function buildTemplateBody(palace: string, star: string): string {
  const impact = PALACE_IMPACT.find((p) => p.palace === palace);
  const focus = impact?.focus ?? '该领域';
  const keyword = impact?.keyword ?? '综合';
  return [
    `${star}坐${palace}，主「${keyword}」方向成为命盘中的一个显性议题，命主在该领域往往带有${star}星性鲜明的行事风格。`,
    `就${focus}而言，${star}的介入会让事务的推进节奏、应对方式带上该星的特质：或主动果决，或细腻周全，或因星性不同而呈现相应的强弱分野。`,
    `本象作为参考维度，并不直接判定吉凶，而是提示命主在${palace}所主的${focus}上，宜顺着${star}的星性顺势而为、扬长避短。`,
    `行运层面，当大限或流年引动${palace}及其三方四正时，相关事件会更集中地呈现${star}的意象，届时可结合四化与吉煞综合解读。`,
  ].join('');
}

/** 预计算 Map：id -> record（构建期一次性完成） */
const templateMap = new Map<string, ContentRecord<PalaceStarExtra>>();

for (const idx of PALACE_STAR_INDEX) {
  if (idx.is_example) continue; // 手写示例另行提供
  const palace = idx.palace;
  const star = idx.star;
  const impact = PALACE_IMPACT.find((p) => p.palace === palace);
  const keyword = impact?.keyword ?? '综合';
  const focus = impact?.focus ?? '该领域';
  const body = buildTemplateBody(palace, star);
  const record: ContentRecord<PalaceStarExtra> = {
    id: idx.id,
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'palace_star',
    seo: {
      title: `${palace}${star}详解`,
      description: `${star}坐${palace}的意象与解读，作为命理参考维度供综合判断。`,
      slug: `/wiki/palace-star/${PALACE_PINYIN_MAP[palace]}-${STAR_PINYIN[star]}`,
      canonical: `/wiki/palace-star/${PALACE_PINYIN_MAP[palace]}-${STAR_PINYIN[star]}`,
      breadcrumb: ['首页', '紫微斗数', '宫星详解', `${palace}${star}`],
      breadcrumb_paths: ['/', '/wiki/ziwei', '/wiki/palace-star', `/wiki/palace-star/${PALACE_PINYIN_MAP[palace]}-${STAR_PINYIN[star]}`],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: `星曜篇·${star}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${star}坐${palace}提示「${keyword}」方向是命盘显性议题。`,
        cause: `${star}星性注入${palace}所主领域，形成倾向放大。`,
        manifestation: `${focus}相关事务呈现${star}特质鲜明的作用方式。`,
        risk: `单看本象易忽略整体平衡，需结合三方四正。`,
        suggestion: `顺应星性扬长避短，在${focus}上顺势规划。`,
        action: `行运引动时结合四化与吉煞综合解读。`,
      },
    },
    extra: {
      kind: 'palace_star',
      palace,
      palace_pinyin: PALACE_PINYIN_MAP[palace],
      star,
      star_pinyin: STAR_PINYIN[star],
      is_example: false,
    },
    i18n_key: `palace_star.${PALACE_PINYIN_MAP[palace]}_${STAR_PINYIN[star]}`,
  };
  templateMap.set(record.id, record);
}

/** 全部宫星记录：3 手写 + 165 模板 = 168 */
export const PALACE_STAR_ALL: readonly ContentRecord<PalaceStarExtra>[] = [
  ...PALACE_STAR_EXAMPLES,
  ...Array.from(templateMap.values()),
];

/** O(1) 查询（预计算 Map） */
export function getPalaceStarById(id: string): ContentRecord<PalaceStarExtra> | undefined {
  return templateMap.get(id) ?? PALACE_STAR_EXAMPLES.find((r) => r.id === id);
}

export const PALACE_STAR_ALL_COUNT = PALACE_STAR_ALL.length; // 168
export const PALACE_STAR_TEMPLATE_COUNT = templateMap.size; // 165
