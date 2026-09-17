// B'11-5 src/pages/fortune/lib/rhythm-engine.ts
/**
 * 节律生成引擎
 * @module B'11-5
 */
import { djb2 } from '@/lib/hash';

export interface RhythmInput { dayPillar: string; zodiac: string; signId?: string; }
export interface RhythmOutput { focus: string; advice: string; reminder: string; }

const FOCUS = ['专注当下要务', '梳理优先事项', '保持节奏稳定', '适当放慢脚步', '主动推进关键项'];
const ADVICE = ['午间小憩有助恢复', '饮水不忘润养身心', '与人交流宜温和', '记录灵感碎片', '适度运动舒展筋骨'];
const REMINDER = ['今日宜保持平常心', '遇事不急三思后行', '善待自己与他人', '顺势而为不勉强', '注意天气变化添衣'];

export function generateRhythm(input: RhythmInput, dateStr: string): RhythmOutput {
  const seed = djb2(`${dateStr}|${input.dayPillar}|${input.zodiac}|${input.signId ?? ''}`);
  return {
    focus: FOCUS[Math.abs(seed) % FOCUS.length],
    advice: ADVICE[Math.abs(seed >> 8) % ADVICE.length],
    reminder: REMINDER[Math.abs(seed >> 16) % REMINDER.length],
  };
}
