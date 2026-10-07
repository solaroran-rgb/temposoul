/**
 * star_card · 每日星图模块单测（A5 卡 P0 验收）
 * 覆盖：幂等/敏感拦截/熔断/双层缓存无个人信息/六爻确定性/100 条库完整性/合规替换/五区块齐全。
 * 运行：tsx --tsconfig tsconfig.app.json --test tests/star-card.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { generateStarCard, starCardLiuyao, getDayGanzhi, buildCacheKeys, classifyQuestion } from '../packages/core/src/star_card/index';
import { TOP20_HEXAGRAMS, lookupReading, assembleSections } from '../packages/core/src/star_card/lexicon';
import { sanitizeForbidden, isSensitiveHit, isExtremeWeather } from '../packages/core/src/star_card/compliance';
import { evaluateLiuyaoQuestion } from '../packages/core/src/star_card/liuyao';
import { dayGanzhi, solarTermOf, buildWeather, buildDirections, buildDeepLinks } from '../packages/core/src/star_card/rules';

const RULE_VERSION = '20261007-1';
const CATEGORIES = ['party', 'direction', 'lost', 'career', 'love', 'general'];

test('五区块输出齐全且每段含免责句（L0）', () => {
  const out = generateStarCard({
    dateKey: '2026-10-07',
    ruleVersion: RULE_VERSION,
    climateZone: 'temperate',
  });
  assert.equal(out.fallbackLevel, 0, '正常输入应为 L0');
  assert.ok(out.blocks.length >= 5, `应有 ≥5 区块，实际 ${out.blocks.length}`);
  const ids = out.blocks.map((b) => b.id);
  assert.ok(ids.includes('summary') && ids.includes('fortune') && ids.includes('dress') && ids.includes('diet') && ids.includes('avoid'));
  for (const b of out.blocks) {
    assert.ok(b.content.includes('娱乐参考'), `区块 ${b.id} 缺免责句`);
    assert.ok(!b.content.includes('算命') && !b.content.includes('占卜'), `区块 ${b.id} 含禁用词`);
  }
  assert.equal(out.personalized, false, '无 uidHash 时应为纯全局层');
});

test('双层缓存：全局层不含个人信息（uid 明文/八字/城市）', () => {
  const keys = buildCacheKeys('2026-10-07', RULE_VERSION, 'Asia/Shanghai', 'u1234567890abcdef');
  assert.ok(keys.global.includes('star_card_2026-10-07'));
  assert.ok(keys.global.includes(RULE_VERSION));
  assert.ok(!keys.global.includes('u1234567890abcdef'), '全局层 key 不得含 uid 明文');
  assert.ok(keys.personal!.includes('u1234567890abcdef'), '个人层 key 含 uid 哈希（物理隔离）');
  assert.ok(keys.seen!.includes('u1234567890abcdef'));
  // 匿名：个人层/已看为 null
  const anon = buildCacheKeys('2026-10-07', RULE_VERSION, 'Asia/Shanghai');
  assert.equal(anon.personal, null);
  assert.equal(anon.seen, null);
});

test('六爻幂等：同 uid+日期+类别 → 恒同卦象与解读', () => {
  const input = { uidHash: 'uabc123', dateKey: '2026-10-07', category: 'party' as const, question: '今天我有个聚会该不该去？' };
  const a = starCardLiuyao(input);
  const b = starCardLiuyao(input);
  assert.equal(a.hexagramName, b.hexagramName, '同参数应得同卦');
  assert.equal(a.seed, b.seed);
  assert.deepEqual(a.sections, b.sections);
  assert.equal(a.blocked, false);
});

test('六爻确定性：不同类别 → 独立卦象（同 uid 同日）', () => {
  const a = evaluateLiuyaoQuestion({ uidHash: 'uabc123', dateKey: '2026-10-07', category: 'lost', question: '钥匙在哪？' });
  const b = evaluateLiuyaoQuestion({ uidHash: 'uabc123', dateKey: '2026-10-07', category: 'career', question: '工作如何？' });
  assert.notEqual(a.seed, b.seed, '不同类别种子必须不同');
});

test('敏感拦截：医/法/金问题不起卦不出解', () => {
  const r = starCardLiuyao({ uidHash: 'uabc123', dateKey: '2026-10-07', category: 'general', question: '我这病要不要去医院做手术？' });
  assert.equal(r.blocked, true);
  assert.equal(r.hexagramName, '', '拦截时不起卦');
  assert.ok(r.sections[0].text.includes('不提供参考解读'), '拦截话术固定');
  assert.ok(!isSensitiveHit('今天聚会吃什么好'), '普通问题不误伤');
});

test('100 条解读库完整性：20 卦 × 5 类全部有值', () => {
  assert.equal(TOP20_HEXAGRAMS.length, 20);
  for (const name of TOP20_HEXAGRAMS) {
    for (const cat of ['party', 'direction', 'lost', 'career', 'love'] as const) {
      const reading = lookupReading(name, cat);
      assert.ok(reading.length > 5, `${name}/${cat} 解读为空`);
    }
  }
  // 组合兜底：未入库卦仍出确定性话术
  const fallback = assembleSections('泽水困', 'general');
  assert.equal(fallback.length, 4);
  assert.ok(fallback[0].text.includes('泽水困'));
});

test('合规替换：禁用词被替换为中性表述', () => {
  const { text, hit } = sanitizeForbidden('算命先生说的，必然如此');
  assert.equal(hit, true);
  assert.ok(!text.includes('算命') && !text.includes('必然'));
  assert.ok(text.includes('传统参考'));
});

test('极端天气保守分支', () => {
  assert.equal(isExtremeWeather('今日有暴雨橙色预警'), true);
  const out = generateStarCard({ dateKey: '2026-10-07', ruleVersion: RULE_VERSION, weatherWarning: '暴雨预警' });
  const avoid = out.blocks.find((b) => b.id === 'avoid')!;
  assert.ok(avoid.content.includes('减少外出'), '极端天气应触发保守分支');
});

test('熔断：非法日期 → L3 静态兜底', () => {
  const out = generateStarCard({ dateKey: 'bad-date', ruleVersion: RULE_VERSION });
  assert.equal(out.fallbackLevel, 3);
  assert.ok(out.blocks.length >= 2);
  assert.ok(out.blocks.every((b) => b.content.length > 0), 'L3 兜底不得为空');
});

test('日干支标准算法（2026-10-07 定值）', () => {
  const gz = dayGanzhi('2026-10-07');
  assert.equal(gz.ganzhi.length, 2);
  const viaApi = getDayGanzhi('2026-10-07');
  assert.equal(viaApi.ganzhi, gz.ganzhi, '入口与规则层口径一致');
});

/* ============ B2 升级用例（T-06） ============ */

test('零依赖天气：输出节气+气候带静态参考，不接第三方', () => {
  const w = buildWeather('2026-10-08', RULE_VERSION, 'subtropical', '');
  assert.ok(w.solarTerm.length >= 2, '应有节气名');
  assert.ok(w.climateNote.length > 0 || w.climateNote.length === 0, '气候带微调可空');
  assert.equal(w.extremeRisk, false);
  assert.ok(w.sourceKey.includes('weather'));
  // 极端天气触发保守分支
  const w2 = buildWeather('2026-01-15', RULE_VERSION, 'cold', '寒潮预警');
  assert.equal(w2.extremeRisk, true);
  // generateStarCard 输出携带 weather
  const out = generateStarCard({ dateKey: '2026-10-08', ruleVersion: RULE_VERSION, climateZone: 'temperate' });
  assert.ok(out.weather, '输出应含 weather 字段');
});

test('结构化三方位：财神/煞/贵人各一位+简注', () => {
  const d = buildDirections('2026-10-08', RULE_VERSION);
  for (const k of ['wealth', 'sha', 'noble'] as const) {
    assert.ok(d[k].direction.length >= 2, `${k} 方位缺失`);
    assert.ok(d[k].note.length > 4, `${k} 缺简注`);
    // 合规：不得出现投资收益承诺
    assert.ok(!d[k].note.includes('发财') && !d[k].note.includes('必然'));
  }
  assert.ok(d.sourceKey.includes('direction'));
});

test('卡底深链区：节气文章/宜忌/StarMark 出口三条', () => {
  const links = buildDeepLinks(RULE_VERSION);
  assert.equal(links.length, 3);
  const ids = links.map((l) => l.id);
  assert.ok(ids.includes('solar-term') && ids.includes('yi-ji') && ids.includes('starmark'));
  assert.ok(links.every((l) => l.href.startsWith('/') && l.label.length > 0));
});

test('双层卡片视图：全局层无 uid，个人层仅含 uid 哈希', () => {
  const anon = generateStarCard({ dateKey: '2026-10-08', ruleVersion: RULE_VERSION });
  assert.ok(anon.layers, '应含 layers');
  assert.equal(anon.layers!.personal, null, '匿名个人层为 null');
  assert.ok(!JSON.stringify(anon.layers!.global).includes('u123'), '全局层不含 uid');

  const personal = generateStarCard({ dateKey: '2026-10-08', ruleVersion: RULE_VERSION, uidHash: 'u1234567890abcdef' });
  assert.equal(personal.layers!.personal!.uidHash, 'u1234567890abcdef');
  assert.equal(personal.personalized, true);
});

test('六爻规则分类器：关键词命中归类，未命中落综合', () => {
  assert.equal(classifyQuestion('今晚有个聚会去不去'), 'party');
  assert.equal(classifyQuestion('我出差该走哪个方向'), 'direction');
  assert.equal(classifyQuestion('钥匙丢了在哪'), 'lost');
  assert.equal(classifyQuestion('下周面试准备'), 'career');
  assert.equal(classifyQuestion('和对象最近有点冷'), 'love');
  assert.equal(classifyQuestion('今天运气如何'), 'general');
  assert.equal(classifyQuestion(''), 'general');
});

test('节气静态表推算（定值）', () => {
  // 2026-10-08 ≈ 寒露；2026-06-21 ≈ 夏至；2026-01-10 ≈ 小寒
  assert.equal(solarTermOf('2026-10-08'), '寒露');
  assert.equal(solarTermOf('2026-06-21'), '夏至');
  assert.equal(solarTermOf('2026-01-10'), '小寒');
});
