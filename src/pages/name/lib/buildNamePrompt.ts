import type { NameProfile } from '@temposoul/core/onomastics';
import { NAME_SYSTEM_PROMPT } from '../../../lib/assertions-guard';

export function buildNamePrompt(p: NameProfile): string {
  const body = [
    `姓名：${p.input.surname}${p.input.given}`,
    `类型：${p.input.type}｜书写体系：${p.input.script}`,
    `读音：${p.fact.phonetics.data.pinyin.join(' ') || '数据准备中'}`,
    `字义：${p.fact.semantics.data.meanings.map((m) => m.meaning).join('；') || '待审'}`,
    `方言谐音：${p.fact.phonetics.data.homophoneRisks.map((r) => `${r.dialect}:${r.word}`).join('，') || '无'}`,
    `冲突：${p.conflicts.map((c) => c.dimension).join('，') || '无'}`,
    p.input.script === 'han'
      ? `该名在汉字姓名学中传统会看五格，但本平台仅作文化参考；民俗层限定：${p.folk.disclaimer}。`
      : '该名为拉丁书写体系，不计算康熙笔画与五格。',
    '要求：民俗内容必须标注为文化习俗、非可验证结论，不得作为事实性结论陈述。',
  ].join('\n');
  return `${NAME_SYSTEM_PROMPT}\n\n【姓名档案】\n${body}\n\n请做文化释义与使用场景分析，不要给出吉凶结论。`;
}
