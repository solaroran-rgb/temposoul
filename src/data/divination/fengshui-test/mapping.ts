import { floorToWuxing } from './floor-wuxing';
import type { RuleTrace } from './types';

// 自查：@temposoul/core ba_zhai/ 导出名；residential_fengshui/ 导出名
function trace(module: string, inputs: Record<string, string | number>, hitPath: string): RuleTrace {
  return { module, exportName: '// 自查', inputs, hitPath };
}

export function mapAnswersToTraces(answers: Record<string, string>): RuleTrace[] {
  const out: RuleTrace[] = [];
  if (answers.q1) out.push(trace('ba_zhai', { direction: answers.q1 }, 'zhai-gua'));
  if (answers.q2) out.push(trace('ba_zhai', { branch: answers.q2 }, 'ming-gua'));
  if (answers.q3) out.push(trace('residential_fengshui', { floor: answers.q3, wuxing: floorToWuxing(Number(answers.q3)) }, 'floor-wuxing'));
  if (answers.q4) out.push(trace('residential_fengshui', { direction: answers.q4 }, 'bedroom'));
  if (answers.q5) out.push(trace('residential_fengshui', { direction: answers.q5 }, 'door'));
  if (answers.q6) out.push(trace('residential_fengshui', { direction: answers.q6 }, 'kitchen'));
  if (answers.q7) out.push(trace('residential_fengshui', { direction: answers.q7 }, 'bathroom'));
  if (answers.q8) out.push(trace('residential_fengshui', { layout: answers.q8 }, 'layout'));
  return out;
}
