// F02 冒烟：L0 结论卡派生逻辑（白话结论 + 建议 + 时间窗）
import { buildPersonFromInput, calculateFullBaziChart } from '../src/lib/full-chart-engine/bazi';
import { runSolutionForBazi } from '../src/lib/full-chart-engine/solution-context';
import { deriveAdvice, deriveTimeWindows } from '../src/components/fortune/L0SummaryCard';

const cases = [
  { name: '1990-05-15 男', gender: 'male' as const, year: '1990', month: '5', day: '15', timeIndex: 1 },
  { name: '2000-11-02 女', gender: 'female' as const, year: '2000', month: '11', day: '2', timeIndex: 5 },
  { name: '1985-03-08 男', gender: 'male' as const, year: '1985', month: '3', day: '8', timeIndex: 3 },
];

for (const c of cases) {
  const person = buildPersonFromInput({
    gender: c.gender,
    dateType: 'solar',
    year: c.year,
    month: c.month,
    day: c.day,
    timeIndex: c.timeIndex,
    isLeapMonth: false,
    useTrueSolarTime: false,
    birthHour: '',
    birthMinute: '',
    birthPlace: '',
    birthLongitude: '',
  });
  const chart = calculateFullBaziChart(person);
  const out = runSolutionForBazi(chart);
  const s = out.pro.sentences.length;
  const advice = deriveAdvice(out);
  const wins = deriveTimeWindows(out);

  console.log(`\n== ${c.name} ==`);
  console.log(
    `  结论句 ${s} 条 / 整体极性 ${out.pro.overallPolarity} / 置信度 ${out.pro.overallConfidence.toFixed(2)} / 巴纳姆 ${out.pro.barnumRatio.toFixed(2)} / atoms ${out.meta.atoms.length}`,
  );
  console.log(`  首句: ${out.pro.sentences[0]?.text ?? '(无)'}`);
  console.log(`  建议 ${advice.length} 条:`);
  for (const a of advice) console.log(`    [${a.tone}] ${a.text}`);
  console.log(`  时间窗 ${wins.length} 个:`);
  for (const w of wins) console.log(`    ${w.label}（${(w.share * 100).toFixed(0)}%）- ${w.detail}`);

  if (s === 0) throw new Error(`${c.name} 无结论句`);
  if (advice.length === 0) throw new Error(`${c.name} 无建议`);
  if (wins.length === 0) throw new Error(`${c.name} 无时间窗`);
}

console.log('\nSMOKE OK');
