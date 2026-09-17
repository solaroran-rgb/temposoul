/**
 * 生成冒烟期望清单（build-smoke-expectations）
 * 收口确认卡修复②：算式 14 + 101 + 165 = 280（101 = 十神10+神煞12+四化56+格局15+限年3+TRANSITS2+宫星手写3）
 * 连带：sitemap 278→280；全站 A280+B50+C384+D24=738
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outFile = path.join(repoRoot, 'build', 'smoke-expectations.json');

/** 静态 14：与 src/data/content/bazi-ziwei/static-seo.ts 一致 */
const STATIC_TITLES: Record<string, string> = {
  '/wiki/ten-gods': '十神详解：八字十神含义与白话解读',
  '/wiki/shen-sha': '八字神煞专题：12 大核心神煞详解',
  '/wiki/four-transform': '紫微四化详解：化禄化权化科化忌×十四主星',
  '/wiki/ziwei-patterns': '紫微斗数格局大全：15 大主格局白话解读',
  '/wiki/palace-star': '紫微十二宫×主星解读模板与示例',
  '/wiki/limit-year-guide': '紫微限年工具：大限小限流年怎么看',
  '/wiki/transits': '西占行运：概念与解读框架',
  '/wiki/solar-return': '太阳返照：概念与解读框架',
  '/tools/limit-year': '紫微限年工具：大限小限流年查询',
  '/tools/solar-return': '太阳返照查询工具',
  '/wiki/limit-year-guide/faq': '限年工具常见问题',
  '/wiki/four-transform/pairs': '十干四化配对表',
  '/wiki/palace-star/overview': '紫微十二宫与主星总览',
  '/wiki/four-transform/overview': '四化体系总览',
};

/** 动态显式数据源 101（十神10+神煞12+四化56+格局15+限年3+TRANSITS2+宫星手写3） */
function buildDynamic101(): Array<{ slug: string; title: string }> {
  const out: Array<{ slug: string; title: string }> = [];
  const tenGods = ['bijian', 'jiecai', 'shishen', 'shangguan', 'piancai', 'zhengcai', 'qisha', 'zhengguan', 'pianyin', 'zhengyin'];
  const tenGodNames: Record<string, string> = {
    bijian: '比肩', jiecai: '劫财', shishen: '食神', shangguan: '伤官',
    piancai: '偏财', zhengcai: '正财', qisha: '七杀', zhengguan: '正官', pianyin: '偏印', zhengyin: '正印',
  };
  for (const id of tenGods) out.push({ slug: `/wiki/ten-gods/${id}`, title: `${tenGodNames[id]}详解` });

  const shenSha: Record<string, string> = {
    tianyi: '天乙贵人', wenchang: '文昌贵人', taohua: '桃花', yima: '驿马', huagai: '华盖',
    kongwang: '空亡', hongluan: '红鸾', tianxi: '天喜', yangren: '羊刃', lushen: '禄神', jiangxing: '将星', jinyu: '金舆',
  };
  for (const [id, name] of Object.entries(shenSha)) out.push({ slug: `/wiki/shen-sha/${id}`, title: `${name}详解` });

  const stars = ['ziwei', 'tianji', 'taiyang', 'wuqu', 'tiantong', 'lianzhen', 'tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun'];
  const starNames: Record<string, string> = {
    ziwei: '紫微', tianji: '天机', taiyang: '太阳', wuqu: '武曲', tiantong: '天同', lianzhen: '廉贞',
    tianfu: '天府', taiyin: '太阴', tanlang: '贪狼', jumen: '巨门', tianxiang: '天相', tianliang: '天梁', qisha: '七杀', pojun: '破军',
  };
  for (const s of stars) for (const t of ['lu', 'quan', 'ke', 'ji']) {
    const tz = { lu: '化禄', quan: '化权', ke: '化科', ji: '化忌' } as const;
    out.push({ slug: `/wiki/four-transform/${s}-${t}`, title: `${starNames[s]}${tz[t]}详解` });
  }

  const patterns: Record<string, string> = {
    zisha: '紫微朝垣格', fuyin: '府相朝垣格', riyue: '日月同宫格', rifu: '日月并明格', yuetu: '月朗天门格',
    wugu: '武曲守垣格', qisha: '七杀朝斗格', pojun: '破军暗曜格', tanlang: '贪狼会昌曲格', tianfu: '天府守垣格',
    tianliang: '天梁荫福格', jiuming: '君臣庆会格', chanrong: '三奇嘉会格', luoquan: '禄权科会格', jiaxing: '夹贵格',
  };
  for (const [id, name] of Object.entries(patterns)) out.push({ slug: `/wiki/ziwei-patterns/${id}`, title: `${name}详解` });

  const limitYear: Record<string, string> = { da_xian: '大限', xiao_xian: '小限', liu_nian: '流年' };
  for (const [id, name] of Object.entries(limitYear)) out.push({ slug: `/wiki/limit-year/${id}`, title: `${name}详解` });

  // TRANSITS 2 条（修复①：补 TRANSITS 进路由与期望）
  out.push({ slug: '/wiki/transits/detail', title: '行运详解：行星相位与时间尺度' });
  out.push({ slug: '/wiki/solar-return/detail', title: '太阳返照详解：四轴与宫位框架' });

  // 宫星手写 3 条
  out.push({ slug: '/wiki/palace-star/ming-ziwei', title: '命宫紫微详解' });
  out.push({ slug: '/wiki/palace-star/fuqi-tanlang', title: '夫妻宫贪狼详解' });
  out.push({ slug: '/wiki/palace-star/caibo-wuqu', title: '财帛宫武曲详解' });

  return out;
}

/** 模板 165（宫星 is_example=false 全部） */
function buildTemplate165(): Array<{ slug: string; title: string }> {
  const out: Array<{ slug: string; title: string }> = [];
  const palaces = ['ming', 'xiongdi', 'fuqi', 'zinv', 'caibo', 'jie', 'qianyi', 'jiaoyou', 'guanlu', 'tianzhai', 'fude', 'fumu'];
  const palaceZh: Record<string, string> = {
    ming: '命宫', xiongdi: '兄弟', fuqi: '夫妻', zinv: '子女', caibo: '财帛', jie: '疾厄',
    qianyi: '迁移', jiaoyou: '交友', guanlu: '官禄', tianzhai: '田宅', fude: '福德', fumu: '父母',
  };
  const stars = ['ziwei', 'tianji', 'taiyang', 'wuqu', 'tiantong', 'lianzhen', 'tianfu', 'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun'];
  const starZh: Record<string, string> = {
    ziwei: '紫微', tianji: '天机', taiyang: '太阳', wuqu: '武曲', tiantong: '天同', lianzhen: '廉贞',
    tianfu: '天府', taiyin: '太阴', tanlang: '贪狼', jumen: '巨门', tianxiang: '天相', tianliang: '天梁', qisha: '七杀', pojun: '破军',
  };
  const examples = new Set(['ming-ziwei', 'fuqi-tanlang', 'caibo-wuqu']);
  for (const p of palaces) for (const s of stars) {
    const slug = `/wiki/palace-star/${p}-${s}`;
    if (examples.has(`${p}-${s}`)) continue; // 3 手写在动态 101
    out.push({ slug, title: `${palaceZh[p]}${starZh[s]}详解` });
  }
  return out;
}

const expectations = {
  static: Object.entries(STATIC_TITLES).map(([slug, title]) => ({ slug, title })),
  dynamic: buildDynamic101(),
  template: buildTemplate165(),
};

const total = expectations.static.length + expectations.dynamic.length + expectations.template.length;
// 修复②：算式 14 + 101 + 165 = 280
const EXPECTED = 14 + 101 + 165;
if (total !== EXPECTED) {
  throw new Error(`[smoke-exp] expected ${EXPECTED}, got ${total} (static=${expectations.static.length}, dynamic=${expectations.dynamic.length}, template=${expectations.template.length})`);
}

const bySlug = new Map<string, string>();
for (const g of [expectations.static, expectations.dynamic, expectations.template]) {
  for (const e of g) bySlug.set(e.slug, e.title);
}
if (bySlug.size !== 280) {
  throw new Error(`[smoke-exp] unique expected 280, got ${bySlug.size}`);
}

const payload = {
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  total: 280,
  staticCount: expectations.static.length,
  dynamicCount: expectations.dynamic.length,
  templateCount: expectations.template.length,
  expectations: [...expectations.static, ...expectations.dynamic, ...expectations.template],
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');
console.log(`[smoke-exp] wrote ${outFile} with ${total} expectations (14+101+165=280)`);
