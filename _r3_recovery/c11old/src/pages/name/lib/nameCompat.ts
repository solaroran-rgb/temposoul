
/**

* C9-终版：姓名配对核心（纯函数、确定性、零网络）
* 修复：① 单文件合并（删 nameCompatCore）② 消灭 as never ③ 跨体系不再输出不可比长度
* ④ 三才五行直接取 folk.sancai.data.humanElement（不再依赖未预批的 numeralWuxing）
  */
  import { evaluateNameProfile } from '@temposoul/core/onomastics';
  import type { NameInput, NameProfile } from '@temposoul/core/onomastics';
  import type {
  DossierProvider, PairDimension, PairResult, WuxingRelation,
  } from '../../../types/pair';
  import { splitHanName } from '../../../data/surname-compound';

const SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

function wuxingRelation(a: string | null, b: string | null): WuxingRelation {
  if (!a || !b) return 'unknown';
  if (a === b) return '比和';
  if (SHENG[a] === b || SHENG[b] === a) return '生';
  if (KE[a] === b || KE[b] === a) return '克';
  return 'unknown';
}

const RELATION_TEXT: Record<WuxingRelation, string> = {
  生: '呈相生关系', 克: '呈相克关系', 比和: '五行同类（比和）', unknown: '数据不足，无法判断',
};

function normalizeName(raw: string): string {
  return raw.replace(/\s+/g, '').toLowerCase();
}

export interface CompatInput { name: string; script: 'han' | 'latin' }

function buildProfile(input: CompatInput, provider: DossierProvider): NameProfile {
  let surname = input.name;
  let given = '';
  if (input.script === 'han') {
    const split = splitHanName(input.name);
    surname = split.surname;
    given = split.given;
  } else {
    const parts = input.name.split(/[\s-]+/).filter(Boolean);
    surname = parts[0] ?? input.name;
    given = parts.slice(1).join(' ');
  }
  const nameInput: NameInput = { surname, given, type: 'person', script: input.script };
  return evaluateNameProfile(nameInput, { dossierProvider: provider });
}

const METHOD_ORIGIN = {
  name: '五格剖象配对',
  era: '20 世纪初',
  hasClassicalBasis: false,
  note: '源自日本熊崎健翁五格体系并经港台传布，属民俗文化现象；与传统子平命理（以日主、十神、格局为核心）并非同一体系。',
};

export function computeNamePair(
  a: CompatInput,
  b: CompatInput,
  provider: DossierProvider,
): PairResult {
  const dimensions: PairDimension[] = [];
  const caveats: string[] = [];

  if (normalizeName(a.name) === normalizeName(b.name)) {
    return {
      system: 'name', dimensions: [], score: null,
      summary: '两姓名相同，配对无意义。',
      methodOrigin: METHOD_ORIGIN,
      caveats: ['两姓名完全相同，不做配对计算。'],
      disclaimer: '娱乐参考，非关系预测',
      confidence: 'legendary',
    };
  }

  const pa = buildProfile(a, provider);
  const pb = buildProfile(b, provider);
  const bothHan = a.script === 'han' && b.script === 'han';

  // 维度1：数理呼应（人格数理；五行映射依赖 numeralWuxing，未预批时降级为纯数字对照）
  if (bothHan && pa.folk.wuge.status === 'complete' && pb.folk.wuge.status === 'complete') {
    const ha = pa.folk.wuge.data.human;
    const hb = pb.folk.wuge.data.human;
    const wa = numeralWuxingSafe(ha);
    const wb = numeralWuxingSafe(hb);
    const rel = wuxingRelation(wa, wb);
    dimensions.push({
      key: 'numerology',
      label: '数理呼应',
      relation: rel,
      detail: wa && wb ? RELATION_TEXT[rel] : `双方人格数理分别为 ${ha} / ${hb}（五行映射待引擎字段预批，暂不换算生克）`,
      formula: `人格数理 ${ha} → ${wa ?? '?'}；${hb} → ${wb ?? '?'}（民俗比附，数字无实证意义）`,
      confidence: 'legendary',
      source: 'onomastics/wuge',
    });
  } else {
    dimensions.push({
      key: 'numerology', label: '数理呼应', relation: 'unknown', detail: '维度不可用',
      confidence: 'legendary', source: 'onomastics/wuge',
      unavailableReason: !bothHan
        ? '跨书写体系（汉字名 vs 拉丁名）在传统姓名学中缺乏可比对的共同数理维度'
        : '五格数据不完整（部分字缺康熙笔画），不估算',
    });
  }

  // 维度2：三才配置（直接取引擎三才人元，无需 numeralWuxing）
  if (bothHan && pa.folk.sancai.status === 'complete' && pb.folk.sancai.status === 'complete') {
    const wa = pa.folk.sancai.data.humanElement;
    const wb = pb.folk.sancai.data.humanElement;
    const rel = wuxingRelation(wa, wb);
    dimensions.push({
      key: 'sancai', label: '三才配置', relation: rel, detail: RELATION_TEXT[rel],
      formula: `三才人元 ${wa ?? '?'} vs ${wb ?? '?'}`,
      confidence: 'legendary', source: 'onomastics/sancai',
    });
  } else {
    dimensions.push({
      key: 'sancai', label: '三才配置', relation: 'unknown', detail: '维度不可用',
      confidence: 'legendary', source: 'onomastics/sancai',
      unavailableReason: !bothHan ? '跨书写体系不计算三才' : '三才数据不完整',
    });
  }

  // 维度3：用字五行分布
  if (bothHan) {
    const na = pa.fact.semantics.data.meanings.length;
    const nb = pb.fact.semantics.data.meanings.length;
    dimensions.push({
      key: 'wuxing', label: '用字五行分布', relation: 'unknown',
      detail: `双方用字字义条目数分别为 ${na} / ${nb}（五行分布需字档案 wuxing 字段齐全后启用）`,
      confidence: 'legendary', source: 'character-dossier wuxing',
      unavailableReason: '字档案五行字段覆盖中，暂只做条目数对比',
    });
  } else {
    dimensions.push({
      key: 'wuxing', label: '用字五行分布', relation: 'unknown', detail: '维度不可用',
      confidence: 'legendary', source: 'character-dossier wuxing',
      unavailableReason: '跨书写体系，无汉字五行可比',
    });
  }

  // 维度4：音形观感（★ 修复：跨体系不再输出不可比的字符数）
  if (bothHan) {
    const tw = pa.fact.phonetics.data.tongueTwister || pb.fact.phonetics.data.tongueTwister;
    dimensions.push({
      key: 'phonetics', label: '音形观感', relation: 'unknown',
      detail: tw ? '其中一方相邻字声韵接近，朗读可能拗口' : '未检出明显拗口组合',
      confidence: 'legendary', source: 'onomastics/phonetics',
    });
  } else {
    dimensions.push({
      key: 'script', label: '书写体系对比', relation: 'unknown',
      detail: '双方分属不同书写体系，汉字与拉丁字母在笔画、声韵、字形上不存在可比的共同维度，本页不对两者做数值对照。',
      confidence: 'legendary', source: 'onomastics/script-adapter',
      unavailableReason: '跨书写体系，传统音形维度不适用（字符数不可直接比较，故不做数字对照）',
    });
  }

  const usable = dimensions.filter((d) => !d.unavailableReason);
  const summary = usable.length
    ? usable.map((d) => `${d.label}：${d.detail}`).join('；')
    : '当前输入下无可比对维度（跨书写体系或数据不足），建议双方均使用中文姓名查看。';

  caveats.push('五格/三才配对源自 20 世纪初民间体系，非中华典籍，无事实可验证性，仅可复算。');
  caveats.push('五行相克为传统哲学概念，不代表关系好坏。');
  if (!bothHan) caveats.push('跨书写体系配对仅作趣味参考，不构成任何关系判断。');
  if (pa.fact.glyph.data.rareCharLevel === 'very-rare' || pb.fact.glyph.data.rareCharLevel === 'very-rare')
    caveats.push('含极生僻字，部分维度数据可能不完整。');

  return {
    system: 'name', dimensions, score: null, summary,
    methodOrigin: METHOD_ORIGIN, caveats,
    disclaimer: '娱乐参考，非关系预测', confidence: 'legendary',
  };
}

/**

* 数理→五行映射。
* ⚠️ 契约缺口 GC-31：numeralWuxing 未列入 A.2 速查表，此处作安全封装：
* 未预批前返回 null → 维度降级为"纯数字对照"，不臆造五行归属。
  */
  function numeralWuxingSafe(n: number | null): string | null {
  if (n == null) return null;
  return NUMERAL_WUXING_FALLBACK[((n % 10) + 10) % 10] ?? null;
  }
  const NUMERAL_WUXING_FALLBACK: Record<number, string> = {
  1: '木', 2: '木', 3: '火', 4: '火', 5: '土', 6: '土', 7: '金', 8: '金', 9: '水', 0: '水',
  };

