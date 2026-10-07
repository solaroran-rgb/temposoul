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
