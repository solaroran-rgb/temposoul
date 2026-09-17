export const STRONG_ASSERTIONS = [
  '大吉',
  '大凶',
  '吉凶',
  '注定',
  '必然',
  '百分百',
  '成功率',
  '必',
  '旺夫',
  '改运',
  '事业必成',
];
export const WEAK_ASSERTIONS = ['旺', '克', '一定', '吉', '凶'];
export const ALLOW_LIST = ['克服', '克己', '吉利', '吉时', '旺盛'];

const MARK = '［断言已过滤］';
const BOUNDARY = '(?=[，。！？；、\\s]|$)';

export function guardText(t: string): string {
  if (!t) return '';
  let o = t;
  for (const w of STRONG_ASSERTIONS) {
    if (ALLOW_LIST.some((a) => o.includes(a))) continue;
    o = o.split(w).join(MARK);
  }
  for (const w of WEAK_ASSERTIONS) {
    if (ALLOW_LIST.some((a) => o.includes(a))) continue;
    o = o.replace(new RegExp(`${w}${BOUNDARY}`, 'g'), MARK);
  }
  return o;
}

/** P1 兼容：判断文本是否会被 guardText 改写（与 guardText 结果一致） */
export function hasAssertion(t: string): boolean {
  if (!t) return false;
  return guardText(t) !== t;
}

export const NAME_SYSTEM_PROMPT = `
你是 TempoSoul 姓名文化解释器。
只允许：字义来源 / 方言谐音 / 文化联想 / 历史用例 / 使用场景。
禁止：吉凶总分 / 成功率 / 注定 / 必然 / 旺夫 / 改运 / 事业必成。
民俗内容必须附“文化习俗，非可验证结论”。
`;
