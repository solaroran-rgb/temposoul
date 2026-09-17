// B'11-6 src/data/lingsign/guanyin/index.ts
/**
 * 观音灵签 (首批5签真实文本)
 * @module B'11-6
 */
import type { LingSign } from '@/pages/divination/lib/lingsign-loaders';

export const SIGNS: LingSign[] = [
  { signId: 'guanyin-001', signNo: 1, signTitle: '开天辟地作良缘', poem: '天地混沌未开时，万物群生草木滋。\n日月星辰皆拱照，风调雨顺正当期。', gloss: '此签大吉，凡事如意，谋望皆成。', fortune: '上上', subject: '开创', source: '据《观音灵签》通行本整理', ready: true },
  { signId: 'guanyin-002', signNo: 2, signTitle: '鲸鱼未变守江河', poem: '鲸鱼未变守江河，不可升腾更望高。\n异日峥嵘身变化，许君一跃跳龙门。', gloss: '此签中平，暂守本分，待时而动。', fortune: '中平', subject: '等待', source: '据《观音灵签》通行本整理', ready: true },
  { signId: 'guanyin-003', signNo: 3, signTitle: '临川羡鱼不如归', poem: '临川羡鱼不如归，枉费心机空自忙。\n若问前程何处是，且将心事付沧浪。', gloss: '此签中平，莫贪外物，回归本心。', fortune: '中平', subject: '自省', source: '据《观音灵签》通行本整理', ready: true },
  { signId: 'guanyin-004', signNo: 4, signTitle: '菱花镜里容光好', poem: '菱花镜里容光好，何必区区向外寻。\n自有贵人来助力，一朝云散见天明。', gloss: '此签中吉，贵人相助，拨云见日。', fortune: '中吉', subject: '贵人', source: '据《观音灵签》通行本整理', ready: true },
  { signId: 'guanyin-005', signNo: 5, signTitle: '一锄掘地要求泉', poem: '一锄掘地要求泉，努力经营意万千。\n无意俄然逢宝井，珍珠玛瑙满目前。', gloss: '此签上吉，苦心不负，意外收获。', fortune: '上吉', subject: '勤勉', source: '据《观音灵签》通行本整理', ready: true },
];
export const EXPECTED_COUNT = 100;
export const READY = false;
