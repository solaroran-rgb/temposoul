import type { FsOutcome, FsOutcomeDimension, Grade } from './types';
import { mapAnswersToTraces } from './mapping';
import { floorToWuxing, wuxingLabel } from './floor-wuxing';

const RULESET_VERSION = 'fengshui-test/v1.0.0';
const DISCLAIMER = '风水为传统民俗参考，不构成建筑、工程、安全、医疗建议。';

const DIM_MAP: Record<string, FsOutcomeDimension['dimension']> = {
  'zhai-gua': 'zhai_gua', 'ming-gua': 'ming_gua', 'floor-wuxing': 'floor_wuxing',
  bedroom: 'room_orientation', door: 'room_orientation',
  kitchen: 'room_orientation', bathroom: 'room_orientation', layout: 'room_orientation',
};

export function buildOutcome(answers: Record<string, string>): FsOutcome {
  const traces = mapAnswersToTraces(answers);
  const dims: FsOutcomeDimension[] = traces.map((t) => {
    const caution = t.hitPath === 'bathroom' || t.hitPath === 'layout';
    return {
      dimension: DIM_MAP[t.hitPath] ?? 'room_orientation',
      grade: caution ? 'caution' : 'neutral',
      note: `依据${t.module}规则（${t.hitPath}）给出参考。`,
      ruleTrace: t,
    };
  });
  const good = dims.filter((d) => d.grade === 'good').length;
  const caution = dims.filter((d) => d.grade === 'caution').length;
  const overallGrade: Grade = caution > good ? 'caution' : good > caution ? 'good' : 'neutral';

  const suggestions = [
    '可参考传统方位布置，但请以居住舒适与安全为先。',
    answers.q3 ? `楼层五行参考：${wuxingLabel(floorToWuxing(Number(answers.q3)))}。` : '',
  ].filter(Boolean);

  return {
    overallGrade, dimensions: dims, suggestions, disclaimer: DISCLAIMER,
    confidence: 'probable', rulesetVersion: RULESET_VERSION, computedAt: new Date().toISOString(),
  };
}
