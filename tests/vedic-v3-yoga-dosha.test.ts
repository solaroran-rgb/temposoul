/**
 * V3 · 吠陀 Yoga / Dosha 判定测试（红线 1.2-102 / 1.2-103）
 *
 * 覆盖：
 *   1. 判定结果结构完整性（Yoga 11 条 / Dosha 5 条，含未命中项）
 *   2. 五大瑜伽（Pancha Mahapurusha）判定逻辑：本座或擢升 + 角宫
 *   3. Gajakesari / Budha-Aditya / Chandra-Mangala 同宫与角宫规则
 *   4. Mangal Dosha 宫位集合（1/2/4/7/8/12）
 *   5. Kaal Sarp Dosha 半侧判定
 *   6. Kemadruma 邻宫无星判定
 *   7. 待终审条目显式暴露（不得为空、不得臆造为已实现）
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  generateVedicChart,
  type VedicData,
} from '../packages/core/src/vedic/index.ts';
import {
  computeYogaDosha,
  RASHI_LORDS,
  EXALTATION_RASHI,
  type VedicPoint,
} from '../packages/core/src/vedic/yoga-dosha.ts';

const baseInput = {
  name: 'V3测试',
  gender: '男' as const,
  year: '1990',
  month: '5',
  day: '11',
  hour: '10',
  minute: '0',
  latitude: '28.61',
  longitude: '77.21',
  timezone: '5.5',
} as const;

function chart(): VedicData {
  return generateVedicChart({ ...baseInput });
}

// ---- 1. 结构完整性 ---------------------------------------------------------

test('Yoga/Dosha 判定：结构完整且含未命中条目', () => {
  const data = chart();
  assert.ok(Array.isArray(data.yogas), 'yogas 必须是数组');
  assert.ok(Array.isArray(data.doshas), 'doshas 必须是数组');
  assert.equal(data.yogas!.length, 11, 'Yoga 条目应为 11 条');
  assert.equal(data.doshas!.length, 5, 'Dosha 条目应为 5 条');
  for (const y of data.yogas as any[]) {
    assert.equal(typeof y.active, 'boolean');
    assert.ok(y.condition.length > 0, '每条 Yoga 必须给出判定条件事实');
    assert.ok(Array.isArray(y.limitations) && y.limitations.length > 0, '每条 Yoga 必须声明局限');
  }
  for (const d of data.doshas as any[]) {
    assert.equal(typeof d.active, 'boolean');
    assert.ok(['无', '轻', '中', '重'].includes(d.severity));
    assert.ok(Array.isArray(d.limitations) && d.limitations.length > 0, '每条 Dosha 必须声明局限');
  }
});

test('Yoga/Dosha：summary 与 pendingExpertReview 一致且非空', () => {
  const data = chart();
  const activeY = (data.yogas as any[]).filter((y) => y.active).length;
  const activeD = (data.doshas as any[]).filter((d) => d.active).length;
  const summary = data.yogaDoshaSummary!;
  assert.equal(summary.activeYogas.length, activeY);
  assert.equal(summary.activeDoshas.length, activeD);
  assert.equal(summary.detectedCount, activeY + activeD);
  assert.equal(summary.totalYogas, 11);
  assert.equal(summary.totalDoshas, 5);
  const pending = data.yogaDoshaPendingReview!;
  assert.ok(pending.length >= 4, '待终审条目不得为空（须显式列出未实现项）');
  for (const p of pending) {
    assert.ok(p.item && p.reason && p.plannedApproach, '待终审条目须含 条目/原因/计划');
  }
});

// ---- 2. 五大瑜伽判定逻辑（构造盘面直测） ------------------------------------

function makePoint(name: string, rashiIndex: number, bhava: number): VedicPoint {
  return {
    name,
    label: name,
    sanskrit: name,
    tropicalLongitude: rashiIndex * 30,
    siderealLongitude: rashiIndex * 30,
    rashi: `R${rashiIndex}`,
    rashiIndex,
    degreeInRashi: 10,
    nakshatra: 'test',
    nakshatraIndex: 0,
    pada: 1 as const,
    bhava,
    retrograde: false,
    formatted: `R${rashiIndex} 10°`,
  };
}

test('Pancha Mahapurusha：本座 + 角宫才命中；非角宫不命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  // 土星落摩羯（本座）第 7 宫（角宫）→ Shasha 命中
  const grahas: VedicPoint[] = [
    makePoint('Sun', 4, 5),
    makePoint('Moon', 3, 4),
    makePoint('Mars', 0, 1),
    makePoint('Mercury', 5, 6),
    makePoint('Jupiter', 8, 9),
    makePoint('Venus', 1, 2),
    makePoint('Saturn', 9, 7),
    makePoint('Rahu', 10, 8),
    makePoint('Ketu', 4, 2),
  ];
  const r = computeYogaDosha(lagna, grahas);
  const shasha = r.yogas.find((y) => y.key === 'shasha')!;
  assert.equal(shasha.active, true, '土星本座落角宫应命中 Shasha');
  // 木星落射手（本座）第 9 宫（非角宫）→ Hamsa 不命中
  const hamsa = r.yogas.find((y) => y.key === 'hamsa')!;
  assert.equal(hamsa.active, false, '木星本座但非角宫不应命中 Hamsa');
});

test('Pancha Mahapurusha：擢升座同样计入', () => {
  const lagna = makePoint('Lagna', 0, 1);
  // 太阳擢升在白羊（rashi 0），落第 10 宫（角宫）—— 但五大瑜伽不含太阳，改用土星：
  // 土星擢升在天秤（rashi 6），落第 10 宫（角宫）
  const grahas: VedicPoint[] = [
    makePoint('Sun', 4, 5),
    makePoint('Moon', 3, 4),
    makePoint('Mars', 0, 1),
    makePoint('Mercury', 5, 6),
    makePoint('Jupiter', 8, 9),
    makePoint('Venus', 1, 2),
    makePoint('Saturn', EXALTATION_RASHI.Saturn, 10),
    makePoint('Rahu', 10, 8),
    makePoint('Ketu', 4, 2),
  ];
  const r = computeYogaDosha(lagna, grahas);
  assert.equal(EXALTATION_RASHI.Saturn, 6);
  assert.equal(r.yogas.find((y) => y.key === 'shasha')!.active, true, '土星擢升落角宫应命中');
});

// ---- 3. 同宫 / 角宫类 Yoga -------------------------------------------------

test('Budha-Aditya：水日同宫命中，异宫不命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  const same: VedicPoint[] = [
    makePoint('Sun', 0, 1),
    makePoint('Moon', 3, 4),
    makePoint('Mars', 7, 8),
    makePoint('Mercury', 0, 1),
    makePoint('Jupiter', 8, 9),
    makePoint('Venus', 1, 2),
    makePoint('Saturn', 9, 10),
    makePoint('Rahu', 10, 11),
    makePoint('Ketu', 4, 5),
  ];
  assert.equal(computeYogaDosha(lagna, same).yogas.find((y) => y.key === 'budha-aditya')!.active, true);

  const diff = same.map((p) => (p.name === 'Mercury' ? makePoint('Mercury', 1, 2) : p));
  assert.equal(computeYogaDosha(lagna, diff).yogas.find((y) => y.key === 'budha-aditya')!.active, false);
});

test('Chandra-Mangala：月火同宫命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  const grahas: VedicPoint[] = [
    makePoint('Sun', 4, 5),
    makePoint('Moon', 2, 3),
    makePoint('Mars', 2, 3),
    makePoint('Mercury', 5, 6),
    makePoint('Jupiter', 8, 9),
    makePoint('Venus', 1, 2),
    makePoint('Saturn', 9, 10),
    makePoint('Rahu', 10, 11),
    makePoint('Ketu', 4, 5),
  ];
  assert.equal(computeYogaDosha(lagna, grahas).yogas.find((y) => y.key === 'chandra-mangala')!.active, true);
});

test('Gajakesari：月木互处角宫命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  // 月亮第 1 宫、木星第 4 宫 → 相对第 4 宫（角宫）
  const grahas: VedicPoint[] = [
    makePoint('Sun', 4, 5),
    makePoint('Moon', 0, 1),
    makePoint('Mars', 7, 8),
    makePoint('Mercury', 5, 6),
    makePoint('Jupiter', 3, 4),
    makePoint('Venus', 1, 2),
    makePoint('Saturn', 9, 10),
    makePoint('Rahu', 10, 11),
    makePoint('Ketu', 4, 5),
  ];
  assert.equal(computeYogaDosha(lagna, grahas).yogas.find((y) => y.key === 'gajakesari')!.active, true);
});

// ---- 4. Mangal Dosha -------------------------------------------------------

test('Mangal Dosha：火星居 1/2/4/7/8/12 命中，居 3/5/6/9/10/11 不命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  for (const house of [1, 2, 4, 7, 8, 12]) {
    const grahas: VedicPoint[] = [
      makePoint('Sun', 4, 5),
      makePoint('Moon', 3, 4),
      makePoint('Mars', (house - 1) as number, house),
      makePoint('Mercury', 5, 6),
      makePoint('Jupiter', 8, 9),
      makePoint('Venus', 1, 2),
      makePoint('Saturn', 9, 10),
      makePoint('Rahu', 10, 11),
      makePoint('Ketu', 4, 5),
    ];
    const d = computeYogaDosha(lagna, grahas).doshas.find((x) => x.key === 'mangal')!;
    assert.equal(d.active, true, `火星第 ${house} 宫应命中 Mangal Dosha`);
  }
  for (const house of [3, 5, 6, 9, 10, 11]) {
    const grahas: VedicPoint[] = [
      makePoint('Sun', 4, 5),
      makePoint('Moon', 3, 4),
      makePoint('Mars', (house - 1) as number, house),
      makePoint('Mercury', 5, 6),
      makePoint('Jupiter', 8, 9),
      makePoint('Venus', 1, 2),
      makePoint('Saturn', 9, 10),
      makePoint('Rahu', 10, 11),
      makePoint('Ketu', 4, 5),
    ];
    const d = computeYogaDosha(lagna, grahas).doshas.find((x) => x.key === 'mangal')!;
    assert.equal(d.active, false, `火星第 ${house} 宫不应命中 Mangal Dosha`);
  }
});

// ---- 5. Kaal Sarp ----------------------------------------------------------

test('Kaal Sarp：七曜全在同侧命中，分列两侧不命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  // 罗睺恒星黄经 0°，计都 180°；七曜全部 <180° → 同侧命中
  const rahu = { ...makePoint('Rahu', 0, 1), siderealLongitude: 0 };
  const ketu = { ...makePoint('Ketu', 6, 7), siderealLongitude: 180 };
  const sameSide: VedicPoint[] = [
    { ...makePoint('Sun', 0, 1), siderealLongitude: 10 },
    { ...makePoint('Moon', 1, 2), siderealLongitude: 40 },
    { ...makePoint('Mars', 2, 3), siderealLongitude: 70 },
    { ...makePoint('Mercury', 3, 4), siderealLongitude: 100 },
    { ...makePoint('Jupiter', 4, 5), siderealLongitude: 130 },
    { ...makePoint('Venus', 5, 6), siderealLongitude: 160 },
    { ...makePoint('Saturn', 5, 6), siderealLongitude: 175 },
    rahu,
    ketu,
  ];
  assert.equal(computeYogaDosha(lagna, sameSide).doshas.find((x) => x.key === 'kaal-sarp')!.active, true);

  const bothSides = sameSide.map((p) =>
    p.name === 'Saturn' ? { ...p, siderealLongitude: 200 } : p,
  );
  assert.equal(computeYogaDosha(lagna, bothSides).doshas.find((x) => x.key === 'kaal-sarp')!.active, false);
});

// ---- 6. Kemadruma ----------------------------------------------------------

test('Kemadruma：月亮 2/12 宫无星命中；有星不命中', () => {
  const lagna = makePoint('Lagna', 0, 1);
  // 月亮在第 1 宫，2/12 宫即第 2、12 宫
  const noNeighbour: VedicPoint[] = [
    makePoint('Sun', 4, 5),
    makePoint('Moon', 0, 1),
    makePoint('Mars', 7, 8),
    makePoint('Mercury', 5, 6),
    makePoint('Jupiter', 8, 9),
    makePoint('Venus', 1, 3),
    makePoint('Saturn', 9, 10),
    makePoint('Rahu', 10, 11),
    makePoint('Ketu', 4, 5),
  ];
  assert.equal(computeYogaDosha(lagna, noNeighbour).doshas.find((x) => x.key === 'kemadruma')!.active, true);

  const withNeighbour = noNeighbour.map((p) =>
    p.name === 'Venus' ? makePoint('Venus', 1, 2) : p,
  );
  assert.equal(computeYogaDosha(lagna, withNeighbour).doshas.find((x) => x.key === 'kemadruma')!.active, false);
});

// ---- 7. Rashi 守护星表自洽 --------------------------------------------------

test('RASHI_LORDS：12 星座守护星覆盖七曜且符合传统', () => {
  assert.equal(RASHI_LORDS.length, 12);
  const expected = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  assert.deepEqual([...RASHI_LORDS], expected);
  for (const lord of RASHI_LORDS) {
    assert.ok(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Jupiter', 'Saturn'].includes(lord));
  }
});
