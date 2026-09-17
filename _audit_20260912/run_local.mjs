// 本地全量排盘：10 组生辰 × 所有生辰型板块
// 用法：node _audit_20260912/run_local.mjs
import {
  calculateBaziFromBirthProfile,
  calculateBirthChartBundle,
  normalizeBirthProfile,
} from '@temposoul/core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'local_results');
mkdirSync(OUT, { recursive: true });

// 安全序列化：iztro FunctionalAstrolabe 有循环引用
function safeStringify(v) {
  const seen = new WeakSet();
  return JSON.stringify(v, (k, val) => {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) return undefined;
      seen.add(val);
    }
    if (typeof val === 'bigint') return val.toString();
    return val;
  }, 2);
}

const CASES = [
  { id: '01_normal',    desc: '普通白天 1990-06-15 10:30 北京',
    profile: { gender: 'male', calendarType: 'solar',
      year: 1990, month: 6, day: 15, hour: 10, minute: 30,
      location: { longitude: 116.407, latitude: 39.904, name: '北京', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '02_early_zi',   desc: '早子时 1988-03-08 00:30 上海',
    profile: { gender: 'female', calendarType: 'solar',
      year: 1988, month: 3, day: 8, hour: 0, minute: 30,
      location: { longitude: 121.473, latitude: 31.230, name: '上海', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '03_late_zi',    desc: '晚子时 1995-11-22 23:45 广州',
    profile: { gender: 'male', calendarType: 'solar',
      year: 1995, month: 11, day: 22, hour: 23, minute: 45,
      location: { longitude: 113.264, latitude: 23.129, name: '广州', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '04_lichun',     desc: '立春交接 1992-02-04 21:30 成都',
    profile: { gender: 'female', calendarType: 'solar',
      year: 1992, month: 2, day: 4, hour: 21, minute: 30,
      location: { longitude: 104.066, latitude: 30.573, name: '成都', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '05_dongzhi',    desc: '冬至交接 2000-12-21 08:15 哈尔滨',
    profile: { gender: 'male', calendarType: 'solar',
      year: 2000, month: 12, day: 21, hour: 8, minute: 15,
      location: { longitude: 126.534, latitude: 45.803, name: '哈尔滨', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '06_dst',        desc: '夏令时 1987-06-15 14:20 西安',
    profile: { gender: 'female', calendarType: 'solar',
      year: 1987, month: 6, day: 15, hour: 14, minute: 20,
      location: { longitude: 108.940, latitude: 34.341, name: '西安', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '07_leap',       desc: '闰年 1984-02-29 16:40 武汉',
    profile: { gender: 'male', calendarType: 'solar',
      year: 1984, month: 2, day: 29, hour: 16, minute: 40,
      location: { longitude: 114.305, latitude: 30.593, name: '武汉', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '08_urumqi',     desc: '西疆 1993-08-08 12:00 乌鲁木齐',
    profile: { gender: 'female', calendarType: 'solar',
      year: 1993, month: 8, day: 8, hour: 12, minute: 0,
      location: { longitude: 87.617, latitude: 43.825, name: '乌鲁木齐', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
  { id: '09_newyork',    desc: '海外 1991-07-04 09:15 纽约',
    profile: { gender: 'male', calendarType: 'solar',
      year: 1991, month: 7, day: 4, hour: 9, minute: 15,
      location: { longitude: -74.006, latitude: 40.712, name: 'New York', timeZoneId: 'America/New_York' },
      useTrueSolarTime: true } },
  { id: '10_leap_month', desc: '闰六月 1987 闰六月初五 06:00 北京',
    profile: { gender: 'female', calendarType: 'lunar',
      year: 1987, month: 6, day: 5, hour: 6, minute: 0, isLeapMonth: true,
      location: { longitude: 116.407, latitude: 39.904, name: '北京', timeZoneId: 'Asia/Shanghai' },
      useTrueSolarTime: true } },
];

const summary = [];

for (const c of CASES) {
  console.log(`\n=== ${c.id} · ${c.desc} ===`);
  const caseDir = join(OUT, c.id);
  mkdirSync(caseDir, { recursive: true });
  try {
    const bundle = await calculateBirthChartBundle(c.profile, {
      systems: ['bazi', 'ziwei', 'astrolabe', 'qizheng'],
    });
    writeFileSync(join(caseDir, 'bundle.json'), safeStringify(bundle));
    const b = bundle.bazi;
    const p = b.pillars;
    console.log(`  bazi : ${p.year.ganZhi} ${p.month.ganZhi} ${p.day.ganZhi} ${p.hour.ganZhi}  time=${b.timeInfo?.name || b.timeInfo}`);
    console.log(`  ziwei: ${bundle.ziwei ? 'OK' : 'MISSING'}`);
    console.log(`  astro: ${bundle.astrolabe ? 'OK' : 'MISSING'}`);
    console.log(`  qizheng: ${bundle.qizheng ? 'OK' : 'MISSING'}`);
    summary.push({
      id: c.id, desc: c.desc,
      bazi: { y: p.year.ganZhi, m: p.month.ganZhi, d: p.day.ganZhi, h: p.hour.ganZhi },
      timeInfo: b.timeInfo,
      hasZiwei: !!bundle.ziwei,
      hasAstrolabe: !!bundle.astrolabe,
      hasQizheng: !!bundle.qizheng,
    });
  } catch (e) {
    console.log('  BUNDLE FAIL:', e.message.slice(0, 300));
    summary.push({ id: c.id, error: e.message.slice(0, 300) });
  }
}

writeFileSync(join(OUT, '_summary.json'), JSON.stringify(summary, null, 2));
console.log(`\nSummary -> ${join(OUT, '_summary.json')}`);
