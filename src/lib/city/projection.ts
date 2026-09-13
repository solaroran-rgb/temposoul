/**
 * 本地 ENU 平面坐标系（v4 §0.4 契约：+X 东、+Y 天顶、+Z 北；地面 y=0）
 * 城市尺度 ≤4km，平面近似误差可忽略。
 * 本文件禁止 import three —— functions/api/geo.ts 需复用，保持零依赖。
 */

export const METERS_PER_UNIT = 10;   // 1 scene unit = 10 m
export const COVERAGE = 200;         // 覆盖半径 2000m = 200 units
export const CELL = 20;              // 量化网格 200m，占位/真实共用
export const SECTOR_COUNT = 6;

const R_LAT = 110540;
const R_LON = 111320;
const DEG = Math.PI / 180;

export interface Origin { lat: number; lon: number }
export interface XZ { x: number; z: number }

export function latlonToENU(lat: number, lon: number, origin: Origin): XZ {
  const x = ((lon - origin.lon) * R_LON * Math.cos(origin.lat * DEG)) / METERS_PER_UNIT;
  const z = ((lat - origin.lat) * R_LAT) / METERS_PER_UNIT;   // 北 = +Z
  return { x, z };
}

export const quantize = (v: number): number => Math.round(v / CELL) * CELL;

/** 吸附到 CELL 中心（占位与真实建筑同网格，防跳变的几何基础） */
export function snapToCell(p: XZ): XZ {
  return { x: quantize(p.x) + CELL / 2, z: quantize(p.z) + CELL / 2 };
}

/** 6 扇区编号（0~5），供 GPU 波纹生长 stagger */
export function sectorOf(x: number, z: number): number {
  const a = Math.atan2(z, x) + Math.PI;   // [0, 2π)
  return Math.min(SECTOR_COUNT - 1, Math.floor((a / (2 * Math.PI)) * SECTOR_COUNT));
}