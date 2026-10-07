/**
 * starmark · 星刻 StarMark P0 单测
 * 覆盖：sky_id 规范化与哈希确定性 / 同参数复现逐星一致 / 称谓过滤 /
 *       模板渲染冒烟 / 篡改参数校验失败 / 场景指纹确定性。
 * 运行：tsx --tsconfig tsconfig.app.json --test tests/starmark.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { projectSky, type SkyParams } from '../src/lib/starmark/astro-view';
import {
  computeSkyId,
  normalizeSkyParams,
  canonicalString,
  BASE32_ALPHABET,
} from '../src/lib/starmark/skyId';
import { sanitizeName, STAR_MARK_TEMPLATES, DISCLAIMER_TEXT } from '../src/lib/starmark/templates';
import { verifyReproduction } from '../src/lib/starmark/verify';
import { getSceneFingerprint } from '../src/lib/starmark/fingerprint';
import { renderL1 } from '../src/lib/starmark/renderer-l1';
import { previewGate } from '../src/lib/starmark/gating';
import { STAR_MARK_EVENTS } from '../src/lib/starmark/analytics';
import { generateCard, reproduceBySkyId, _resetCertStore } from '../src/lib/starmark/reproduce';
import {
  buildPresetObservation,
  STAR_MARK_PRESETS,
  NAME_TEMPLATES,
  applyNameTemplate,
  DEFAULT_LOCATION,
} from '../src/lib/starmark/presets';
import {
  formatCompactUtc,
  parseCompactUtc,
  encodeObservationToParamPath,
  parseParamPath,
  buildPublicShareUrl,
} from '../src/lib/starmark/share-url';
import {
  blurToCityLevel,
  resolveShareableCoords,
  CITY_LEVEL_EPS_DEG,
} from '../src/lib/starmark/privacy';
import { buildCertReport } from '../src/lib/starmark/cert-summary';
import { buildCertificateContent } from '../src/lib/starmark/version';
import { getExperimentFlags, STARMARK_EXPERIMENTS } from '../src/lib/starmark/experiments';
import { detectWechatIn } from '../src/lib/starmark/wechat';

const base: SkyParams = {
  unixMs: Date.UTC(2024, 5, 1, 13, 47, 0),
  latDeg: 36.6512,
  lngDeg: 117.1201,
  dirDeg: 0,
  magLimit: 6.0,
  width: 1080,
  height: 1620,
  fovDeg: 60,
};

test('sky_id：Base32 8 位且同参数逐次一致', () => {
  const id1 = computeSkyId(base);
  const id2 = computeSkyId(base);
  assert.equal(id1.length, 8, 'sky_id 必须 8 位');
  assert.equal(id1, id2, '同参数 sky_id 必须一致');
  for (const ch of id1) assert.ok(BASE32_ALPHABET.includes(ch), `非法 base32 字符 ${ch}`);
});

test('sky_id：规范化——经纬度 6 位小数、方向取整、经度 wrap', () => {
  const a = normalizeSkyParams({ unixMs: base.unixMs, latDeg: 36.65120009, lngDeg: 117.1201, dirDeg: 0.4 });
  const b = normalizeSkyParams({ unixMs: base.unixMs, latDeg: 36.6512, lngDeg: 117.1201, dirDeg: 0.6 });
  assert.equal(a.lat, '36.651200', '纬度应 6 位小数四舍五入');
  assert.equal(a.dir, 0, '0.4 方向取整为 0');
  assert.equal(b.dir, 1, '0.6 方向取整为 1');
  // 方向取整不同 → canonical 串不同（复现参数被正确区分）
  assert.notEqual(canonicalString(a), canonicalString(b));
  // 经度 wrap：181 -> -179
  const w = normalizeSkyParams({ unixMs: 0, latDeg: 0, lngDeg: 181, dirDeg: 0 });
  assert.equal(w.lng, '-179.000000');
});

test('sky_id：不同复现参数 → 不同 sky_id', () => {
  const idTime = computeSkyId({ ...base, unixMs: base.unixMs + 3600_000 });
  const idLat = computeSkyId({ ...base, latDeg: 36.66 });
  const idDir = computeSkyId({ ...base, dirDeg: 90 });
  assert.notEqual(idTime, computeSkyId(base), '时间变 id 应变');
  assert.notEqual(idLat, computeSkyId(base), '纬度变 id 应变');
  assert.notEqual(idDir, computeSkyId(base), '方向变 id 应变');
});

test('同参数复现：projectSky 多次逐星一致（快照逐字节相同）', () => {
  const snaps: string[] = [];
  let starCount = 0;
  for (let i = 0; i < 10; i++) {
    const p = projectSky(base);
    snaps.push(p.snapshot);
    starCount = p.stars.length;
  }
  assert.ok(starCount > 50, `应渲染足够多星，实际 ${starCount}`);
  for (let i = 1; i < snaps.length; i++) {
    assert.equal(snaps[i], snaps[0], `第 ${i} 次快照与首次不一致`);
  }
});

test('篡改参数 → 快照变化且 verify 判「参数已被修改」', () => {
  const ref = projectSky(base);
  const tampered = projectSky({ ...base, lngDeg: 117.1211 });
  assert.notEqual(tampered.snapshot, ref.snapshot, '改经度快照必须变');
  // 用被篡改的参数去对原快照 → 应判失败
  const r = verifyReproduction({ ...base, lngDeg: 117.1211 }, ref.snapshot);
  assert.equal(r.pass, false);
  assert.equal(r.reason, '参数已被修改');
  // 原参数对原快照 → 通过
  const ok = verifyReproduction(base, ref.snapshot);
  assert.equal(ok.pass, true);
});

test('称谓过滤：敏感词拦截 + 超长截断，正常名放行', () => {
  assert.equal(sanitizeName('傻逼去死').blocked, true, '辱骂词必须拦截');
  assert.equal(sanitizeName('这是一段非常非常非常非常长的称谓名字超过十二个字了').truncated, true);
  assert.ok(sanitizeName('小满').name === '小满' && !sanitizeName('小满').blocked);
  assert.equal(DISCLAIMER_TEXT.length > 0, true);
});

test('模板体系：≥3 套且命名含 StarMark', () => {
  assert.ok(STAR_MARK_TEMPLATES.length >= 3);
  for (const t of STAR_MARK_TEMPLATES) {
    assert.ok(t.displayName.includes('StarMark'), `${t.id} 命名应含 StarMark`);
  }
});

test('L1 渲染冒烟：同参数两次输出逐字节一致（软件后端）', async () => {
  const a = await renderL1({ params: base, templateId: 'starmark-night', name: '小满' });
  const b = await renderL1({ params: base, templateId: 'starmark-night', name: '小满' });
  assert.equal(a.width, 1080);
  assert.equal(a.height, 1620);
  assert.ok(a.starCount > 50, `应渲染星，实际 ${a.starCount}`);
  assert.equal(a.png.length, b.png.length, '同参数字节长度应一致');
  assert.ok(a.png.equals(b.png), '同参数两次 PNG 应逐字节一致');
});

test('场景指纹：确定性；参数变 → 指纹变', () => {
  const url = canonicalString(normalizeSkyParams(base));
  const f1 = getSceneFingerprint({ urlParams: url });
  const f2 = getSceneFingerprint({ urlParams: url });
  assert.equal(f1, f2);
  const f3 = getSceneFingerprint({ urlParams: url + 'x' });
  assert.notEqual(f1, f3);
});

test('preview 门控 MVP：未付费放行环视/缩放，锁穿行/信息卡', () => {
  const free = previewGate(false);
  assert.equal(free.orbit && free.zoom, true);
  assert.equal(free.walkthrough || free.infoCard, false);
  const paid = previewGate(true);
  assert.equal(paid.walkthrough && paid.infoCard, true);
});

test('埋点事件表：关键事件名齐全（对齐 trackEvent 通道）', () => {
  for (const k of ['pageLand','generateStart','generateDone','l1RenderDone','shareClick','payDone','l3Start']) {
    assert.ok(STAR_MARK_EVENTS[k as keyof typeof STAR_MARK_EVENTS], `缺事件 ${k}`);
  }
});

test('⑤ 输入 sky_id → 取回同参数重渲染，逐星一致', async () => {
  _resetCertStore();
  const card = await generateCard(base, 'starmark-night', '小满');
  assert.equal(card.skyId.length, 8);
  const again = await reproduceBySkyId(card.skyId);
  assert.equal(again.found, true);
  assert.equal(again.matchesOriginal, true, '按 sky_id 复现应与原快照逐星一致');
  // 不存在的 sky_id
  const miss = await reproduceBySkyId('ZZZZZZZZ');
  assert.equal(miss.found, false);
});

/* ============ B3 升级叠加（T-07）：纯函数新增用例，不改动上方 12 项 ============ */

test('P0-1 参数预设：三预设齐全 + 注入 now 确定性 + 默认观测点', () => {
  assert.equal(STAR_MARK_PRESETS.length, 3);
  for (const id of ['birthday', 'anniversary', 'now']) {
    assert.ok(STAR_MARK_PRESETS.some((p) => p.id === id), `缺预设 ${id}`);
  }
  const NOW = Date.UTC(2024, 5, 1, 13, 47, 0);
  // now 预设直接取注入时刻（确定性）
  const nowObs = buildPresetObservation('now', { now: NOW });
  assert.equal(nowObs.unixMs, NOW);
  // birthday 给真实时刻用真实时刻，默认落济南
  const bday = buildPresetObservation('birthday', { now: NOW, unixMs: Date.UTC(2000, 0, 1, 1, 30, 0) });
  assert.equal(bday.unixMs, Date.UTC(2000, 0, 1, 1, 30, 0));
  assert.equal(bday.latDeg, DEFAULT_LOCATION.latDeg);
  assert.equal(bday.lngDeg, DEFAULT_LOCATION.lngDeg);
});

test('P12 称谓模板：≥3 套且套用结果正确', () => {
  assert.ok(NAME_TEMPLATES.length >= 3);
  assert.equal(applyNameTemplate('for', '小满'), '给小满');
  assert.equal(applyNameTemplate('to', '小满'), '致小满');
  assert.equal(applyNameTemplate('exclusive', '小满'), '小满的专属星空');
  assert.equal(applyNameTemplate('不存在的模板', '小满'), '给小满', '未知模板回落第一个');
});

test('URL 复现：紧凑 UTC 往返 + 参数路径编码解析一致 + 隐私链接只含 certId', () => {
  assert.equal(formatCompactUtc(Date.UTC(2024, 5, 1, 13, 47, 0)), '20240601T134700Z');
  assert.equal(parseCompactUtc('20240601T134700Z'), Date.UTC(2024, 5, 1, 13, 47, 0));
  const obs = { unixMs: Date.UTC(2024, 5, 1, 13, 47, 0), latDeg: 36.6512, lngDeg: 117.1201, dirDeg: 0 };
  const path = encodeObservationToParamPath(obs);
  const back = parseParamPath(path);
  assert.ok(back, '参数路径应能解析');
  assert.equal(back!.unixMs, obs.unixMs);
  assert.equal(back!.latDeg, obs.latDeg);
  // 再编码必须与原路径逐字节一致（URL 复现确定性）
  assert.equal(encodeObservationToParamPath(back!), path);
  // 隐私分享链接只放 certId，不含经纬度/称谓
  assert.equal(buildPublicShareUrl('QUCBSKFD'), '/starmark/sky/QUCBSKFD');
  assert.ok(!buildPublicShareUrl('QUCBSKFD').includes('36.65'), '隐私链接不得暴露经纬度');
  // 只带 certId 的隐私路径不是参数路径
  assert.equal(parseParamPath('/starmark/sky/QUCBSKFD'), null);
});

test('P13 隐私：坐标默认模糊到城市级 0.1°，授权才出精确级', () => {
  assert.equal(CITY_LEVEL_EPS_DEG, 0.1);
  const b = blurToCityLevel(36.6512, 117.1201);
  assert.equal(b.lat, Math.round(36.6512 / 0.1) * 0.1); // 36.7
  assert.equal(b.lng, Math.round(117.1201 / 0.1) * 0.1); // 117.1
  const city = resolveShareableCoords(36.6512, 117.1201);
  assert.equal(city.precision, 'city');
  const exact = resolveShareableCoords(36.6512, 117.1201, { precisionAuthorized: true });
  assert.equal(exact.precision, 'exact');
  assert.equal(exact.lat, 36.6512);
});

test('证书校验报告：buildCertReport 结构可截图（通过/篡改两态）', () => {
  const cert = buildCertificateContent(6.0, 0);
  const ok = buildCertReport({
    certId: 'QUCBSKFD',
    verify: { pass: true, reason: '复现一致', comparedStars: 278, driftStars: 0, maxDriftPx: 0 },
    fingerprint: 'abc12345',
    cert,
  });
  assert.equal(ok.passed, true);
  assert.equal(ok.headline, '复现一致 ✓');
  assert.equal(ok.screenshotReady, true);
  assert.ok(ok.detailLines.length >= 8);
  assert.ok(ok.detailLines.some((l) => l.includes('QUCBSKFD')));
  assert.ok(ok.disclaimer.length > 0);

  const bad = buildCertReport({
    certId: 'QUCBSKFD',
    verify: { pass: false, reason: '参数已被修改', comparedStars: 278, driftStars: 278, maxDriftPx: Number.POSITIVE_INFINITY },
    fingerprint: 'abc12345',
    cert,
  });
  assert.equal(bad.passed, false);
  assert.equal(bad.headline, '参数已被修改 ✗');
});

test('P0-2 实验开关：冻结变体 + 返回副本不污染常量', () => {
  const f = getExperimentFlags();
  assert.equal(f.e1_formFriction, 'preset');
  assert.equal(f.e2_paywallPosition, 'preview30s');
  assert.equal(f.e4_l3Position, 'douyin_clip');
  f.e1_formFriction = 'form';
  assert.equal(STARMARK_EXPERIMENTS.e1_formFriction, 'preset', '改副本不得污染冻结值');
});

test('wechat_in 必埋：UA 纯函数判定', () => {
  assert.equal(detectWechatIn('Mozilla/5.0 (iPhone) MicroMessenger/8.0.20'), true);
  assert.equal(detectWechatIn('Mozilla/5.0 (Windows NT 10.0) Chrome/120.0'), false);
});
