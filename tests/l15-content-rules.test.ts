/**
 * L-15 内容导入流水线 · 规则内核单测
 *
 * 覆盖五类断言：成功 / 参数非法 / 越界（字数不足）/ 合规缺句（C-TRAD）/ 死链（C-LINK）
 * 另覆盖：解析报错到行、TDK 重复检出、防空壳、slug/TDK 兜底生成。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTermBlocks,
  validateRecord,
  deriveSlug,
  deriveTdk,
  countChars,
  splitMulti,
  C_TRAD_SENTENCE,
} from '../scripts/lib/content-rules.mjs';

/** 构造一条合规基线记录（十段齐全，字数达标） */
function goodRecord(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    id: 'shishen-zheng-guan',
    category: 'shishen',
    slug: 'zheng-guan',
    'title.zh': '正官',
    'title.en': 'Direct Officer',
    'tdk.title.zh': '正官是什么意思｜八字十神释义',
    'tdk.desc.zh': '正官为八字十神之一，象征规则、名分与自我约束，属于传统命理的象征性解释。',
    s0_summary: '正官是八字十神之一，象征约束、规范与社会责任感，在命局中的位置与强弱被用来观察一个人面对规则、职务与外界期待时的反应方式，属于传统命理视角下的象征性描述，不作为现实判断依据。',
    s1_meaning: '在十神体系中，正官由克制日主且与日主阴阳异性的五行构成，象征取向偏向秩序、名分、公信与自我约束，常被类比为社会规则、上级与制度性角色。传统上把正官得位且不过重解读为行事有分寸、重视承诺；正官过旺或被严重冲克，则解读为压力大、拘谨或易受外部规范牵制。这些都属于象征语言，不是对性格或能力的判定，也不指向具体结果。',
    s2_method: '取用方法：先定日主天干，再按五行生克与阴阳异同找出正官；随后看正官落在哪一柱、是否透干、有无根气、是否被合或被冲，一般按透干优先、得令次之、通根再次的顺序观察强弱，再结合全局制化综合取舍，而不单看某一项。',
    s3_combination: '常见组合：正官配印被解读为规则意识与学习力相互支撑；正官见伤官被解读为规范与表达之间容易拉扯；正官逢财生被解读为资源与责任一同加重。观察时还要留意正官是否被合走、是否有根支撑，以及日主本身能不能承担这份约束，这几项共同决定解读的重心，也决定了同一组名在不同命局中的侧重并不相同，需要结合旺衰与制化再看。',
    s4_traditional: `传统命理把正官视为贵气与名分的象征，认为它能把人的精力导向秩序、责任与社会认可的路径。以官星论贵的说法在《渊海子平》一类典籍中有系统论述，但历代流派对官星轻重与喜忌的判断并不一致：有的重官星清纯，有的重官星有制，也有流派主张官星宜轻不宜重。后世注家还提醒，官星需与财、印配合观察，单凭一星定贵贱并不可靠，需回归全局结构再作取舍。${C_TRAD_SENTENCE}，属于历史文化语境中的象征解释体系，不构成对个人命运的断言，也不用于任何现实决策。`,
    s5_misconception: '误解：正官多就一定担任职务。澄清：正官是象征符号，不代表具体职位。 ;; 误解：正官被克就一定是坏事。澄清：传统取用讲究制化得宜。',
    s6_source: '出处待考 ;; 无 ;; 无',
    s7_selfcheck: '第一步：确认日主天干与月令。 ;; 第二步：按五行相克找出正官。 ;; 第三步：看透干、得令、通根后综合判断。',
    s8_related: 'zheng-cai,qi-sha,zheng-yin,shang-guan,shi-shen,ri-zhu',
    s9_tool: '/bazi/shensha?term=zheng-guan',
    s10_disclaimer: '口径版本 v1.0 · 2026-10-04',
    ...overrides,
  };
}

const CTX = {
  knownSlugs: new Set(['zheng-cai', 'qi-sha', 'zheng-yin', 'shang-guan', 'shi-shen', 'ri-zhu']),
  plannedSlugs: new Set(['yong-shen']),
  existingTdkTitles: new Map<string, string>(),
};

test('成功：合规记录零错误', () => {
  const { errors, totalChars } = validateRecord(goodRecord(), CTX);
  assert.deepEqual(errors, []);
  assert.ok(totalChars >= 800, `总字数应 ≥800，实际 ${totalChars}`);
});

test('参数非法：缺十段字段 → C-FIELD', () => {
  const rec = goodRecord();
  delete rec.s3_combination;
  const { errors } = validateRecord(rec, CTX);
  assert.ok(errors.some(e => e.includes('C-FIELD') && e.includes('s3_combination')));
});

test('参数非法：category 不在枚举 → C-FIELD', () => {
  const { errors } = validateRecord(goodRecord({ category: 'unknown-cat' }), CTX);
  assert.ok(errors.some(e => e.includes('category') && e.includes('不在枚举')));
});

test('参数非法：slug 非 kebab-case → C-FIELD', () => {
  const { errors } = validateRecord(goodRecord({ slug: 'Zheng_Guan' }), CTX);
  assert.ok(errors.some(e => e.includes('slug') && e.includes('kebab-case')));
});

test('越界：字数不足 → C-LEN', () => {
  const { errors } = validateRecord(goodRecord({ s0_summary: '太短了' }), CTX);
  assert.ok(errors.some(e => e.startsWith('C-LEN') && e.includes('s0_summary')));
});

test('越界：title.zh 超 10 字 → C-LEN', () => {
  const { errors } = validateRecord(goodRecord({ 'title.zh': '这是一个超过十个字的超长标题测试' }), CTX);
  assert.ok(errors.some(e => e.includes('title.zh') && e.includes('超 10 字')));
});

test('合规缺句：s4 无传统命理观点声明 → C-TRAD 拒收', () => {
  const { errors } = validateRecord(
    goodRecord({ s4_traditional: '传统命理把正官视为贵气的象征，认为它能把人的精力导向秩序与责任，历代流派对官星轻重的判断并不一致。' }),
    CTX
  );
  assert.ok(errors.some(e => e.startsWith('C-TRAD')));
});

test('死链：s8_related 指向未入库且不在待建清单 → C-LINK', () => {
  const { errors } = validateRecord(
    goodRecord({ s8_related: 'zheng-cai,totally-unknown-slug' }),
    CTX
  );
  assert.ok(errors.some(e => e.startsWith('C-LINK') && e.includes('totally-unknown-slug')));
});

test('待建清单内的 slug 不算死链', () => {
  const { errors } = validateRecord(goodRecord({ s8_related: 'zheng-cai,yong-shen' }), CTX);
  assert.ok(!errors.some(e => e.startsWith('C-LINK')));
});

test('古籍零编造：无《书名》且未标出处待考 → C-SOURCE', () => {
  const { errors } = validateRecord(goodRecord({ s6_source: '渊海子平 ;; 无 ;; 无' }), CTX);
  assert.ok(errors.some(e => e.startsWith('C-SOURCE')));
});

test('TDK 重复：与已入库条目冲突 → C-TDK', () => {
  const { errors } = validateRecord(goodRecord(), {
    ...CTX,
    existingTdkTitles: new Map([['正官是什么意思｜八字十神释义', 'other-slug']]),
  });
  assert.ok(errors.some(e => e.startsWith('C-TDK')));
});

test('防空壳：总字数 <800 → C-SHELL', () => {
  const rec = goodRecord();
  for (const k of ['s0_summary', 's1_meaning', 's2_method', 's3_combination', 's4_traditional']) {
    rec[k] = rec[k].slice(0, 10);
  }
  const { errors } = validateRecord(rec, CTX);
  assert.ok(errors.some(e => e.startsWith('C-SHELL')));
});

test('禁词：命中宿命断言词 → C-WORDING', () => {
  const { errors } = validateRecord(
    goodRecord({ s1_meaning: '命中正官的人注定会获得社会地位与名分，这是无法改变的结果，属于传统命理的解释。' + 'x'.repeat(160) }),
    CTX
  );
  assert.ok(errors.some(e => e.startsWith('C-WORDING')));
});

test('否定语境豁免：不构成/并非 前缀的禁词不误报', () => {
  const { errors } = validateRecord(
    goodRecord({ s1_meaning: '本条目不构成诊断，也并非注定之说，仅作文化讨论。' + 'x'.repeat(160) }),
    CTX
  );
  assert.ok(!errors.some(e => e.startsWith('C-WORDING')));
});

test('解析：报错精确到行', () => {
  const text = ['###TERM_BEGIN', 'slug: a', '###TERM_END', '', '###TERM_BEGIN', 'slug: b', '###TERM_END'].join('\n');
  const blocks = parseTermBlocks(text);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].startLine, 1);
  assert.equal(blocks[1].startLine, 5);
});

test('解析：未闭合块标记 unclosed', () => {
  const blocks = parseTermBlocks('###TERM_BEGIN\nslug: a\n');
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].unclosed, true);
});

test('slug 兜底：非法 slug 由 id 推导 kebab-case', () => {
  assert.equal(deriveSlug({ id: 'bazi_Zheng Guan' }), 'bazi-zheng-guan');
  assert.equal(deriveSlug({ slug: 'already-ok' }), 'already-ok');
  assert.equal(deriveSlug({}), null);
});

test('TDK 兜底：缺失时按公式补齐且不超长', () => {
  const tdk = deriveTdk({ 'title.zh': '正官', s0_summary: '正官是八字十神之一。' });
  assert.ok(tdk.title.length > 0 && countChars(tdk.title) <= 30);
  assert.ok(tdk.desc.length > 0 && countChars(tdk.desc) <= 80);
});

test('工具函数：countChars 剔除空白 / splitMulti 按 ;; 切分', () => {
  assert.equal(countChars(' a b\n c '), 3);
  assert.deepEqual(splitMulti('a ;; b ;; c'), ['a', 'b', 'c']);
});
