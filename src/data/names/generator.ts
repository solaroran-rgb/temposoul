// src/data/names/generator.ts
import { djb2 } from '@/lib/hash';
import { seedToIndex } from '@/lib/deterministic';
import { NameCatalogEntry } from './types';
// 自查：onomastics 模块导出名待确认，若存在则接入真实笔画/五行计算
// 自查：import { calculateStrokes, getWuxing } from '@/lib/onomastics';

// 用字库（高频吉字，按五行分类，五行来源标注）
const MALE_CHARS: Record<
  string,
  Array<{ char: string; strokes: number | null; meaning: string }>
> = {
  金: [
    { char: '铭', strokes: 14, meaning: '铭记、铭刻' },
    { char: '瑞', strokes: 13, meaning: '祥瑞、吉兆' },
    { char: '钧', strokes: 12, meaning: '钧天、宏大' },
    { char: '锋', strokes: 12, meaning: '锋芒、锐利' },
    { char: '锐', strokes: 12, meaning: '锐意、进取' },
    { char: '鑫', strokes: 24, meaning: '财富、兴盛' },
    { char: '锦', strokes: 16, meaning: '锦绣、美好' },
    { char: '铮', strokes: 16, meaning: '铮铮、刚正' },
    { char: '铠', strokes: 18, meaning: '铠甲、坚毅' },
    { char: '铭', strokes: 14, meaning: '铭刻、铭记' },
  ],
  木: [
    { char: '梓', strokes: 11, meaning: '梓树、成才' },
    { char: '楷', strokes: 13, meaning: '楷模、典范' },
    { char: '桓', strokes: 10, meaning: '桓武、威武' },
    { char: '杰', strokes: 12, meaning: '杰出、卓越' },
    { char: '楠', strokes: 13, meaning: '楠木、珍贵' },
    { char: '森', strokes: 12, meaning: '森林、繁茂' },
    { char: '柏', strokes: 9, meaning: '松柏、常青' },
    { char: '柯', strokes: 9, meaning: '枝柯、依托' },
    { char: '杭', strokes: 8, meaning: '杭木、坚实' },
    { char: '栩', strokes: 10, meaning: '栩栩、生动' },
  ],
  水: [
    { char: '泽', strokes: 17, meaning: '恩泽、润泽' },
    { char: '涵', strokes: 12, meaning: '涵养、包容' },
    { char: '泓', strokes: 9, meaning: '水深、清澈' },
    { char: '浩', strokes: 11, meaning: '浩大、广阔' },
    { char: '瀚', strokes: 19, meaning: '瀚海、无垠' },
    { char: '润', strokes: 16, meaning: '润泽、温润' },
    { char: '沐', strokes: 8, meaning: '沐浴、清新' },
    { char: '洋', strokes: 10, meaning: '海洋、广阔' },
    { char: '浚', strokes: 11, meaning: '浚河、深远' },
    { char: '泽', strokes: 17, meaning: '恩泽、润泽' },
  ],
  火: [
    { char: '煜', strokes: 13, meaning: '光耀、明亮' },
    { char: '炎', strokes: 8, meaning: '炎热、热烈' },
    { char: '烨', strokes: 16, meaning: '光辉、灿烂' },
    { char: '炜', strokes: 13, meaning: '光明、辉煌' },
    { char: '灿', strokes: 17, meaning: '灿烂、耀眼' },
    { char: '焕', strokes: 11, meaning: '焕发、光彩' },
    { char: '烁', strokes: 19, meaning: '闪烁、明亮' },
    { char: '光', strokes: 6, meaning: '光明、光辉' },
    { char: '辉', strokes: 15, meaning: '光辉、辉煌' },
    { char: '煌', strokes: 13, meaning: '辉煌、光明' },
  ],
  土: [
    { char: '坤', strokes: 8, meaning: '坤元、大地' },
    { char: '培', strokes: 11, meaning: '培育、成长' },
    { char: '基', strokes: 11, meaning: '基础、根基' },
    { char: '坚', strokes: 7, meaning: '坚定、坚强' },
    { char: '城', strokes: 9, meaning: '城池、坚固' },
    { char: '垣', strokes: 9, meaning: '城墙、稳固' },
    { char: '磊', strokes: 15, meaning: '磊落、光明' },
    { char: '硕', strokes: 14, meaning: '硕果、丰收' },
    { char: '岳', strokes: 8, meaning: '山岳、崇高' },
    { char: '岩', strokes: 8, meaning: '岩石、坚毅' },
  ],
};

const FEMALE_CHARS: Record<
  string,
  Array<{ char: string; strokes: number | null; meaning: string }>
> = {
  金: [
    { char: '诗', strokes: 13, meaning: '诗意、文雅' },
    { char: '书', strokes: 10, meaning: '书香、学识' },
    { char: '钰', strokes: 13, meaning: '珍宝、宝贵' },
    { char: '铃', strokes: 13, meaning: '铃声、清脆' },
    { char: '锦', strokes: 16, meaning: '锦绣、美好' },
    { char: '钗', strokes: 11, meaning: '钗环、雅致' },
    { char: '银', strokes: 14, meaning: '银白、纯洁' },
    { char: '镜', strokes: 19, meaning: '明镜、清晰' },
    { char: '铃', strokes: 13, meaning: '铃铛、清脆' },
    { char: '铮', strokes: 16, meaning: '铮铮、清越' },
  ],
  木: [
    { char: '梓', strokes: 11, meaning: '梓树、成才' },
    { char: '萱', strokes: 15, meaning: '萱草、忘忧' },
    { char: '芷', strokes: 10, meaning: '芷草、芬芳' },
    { char: '若', strokes: 11, meaning: '若水、柔美' },
    { char: '芯', strokes: 10, meaning: '花芯、精致' },
    { char: '茉', strokes: 11, meaning: '茉莉、清香' },
    { char: '莉', strokes: 13, meaning: '茉莉、芬芳' },
    { char: '蓉', strokes: 16, meaning: '芙蓉、美丽' },
    { char: '芊', strokes: 9, meaning: '芊芊、秀美' },
    { char: '芸', strokes: 10, meaning: '芸香、书香' },
  ],
  水: [
    { char: '涵', strokes: 12, meaning: '涵养、包容' },
    { char: '汐', strokes: 7, meaning: '潮汐、灵动' },
    { char: '沁', strokes: 8, meaning: '沁心、清新' },
    { char: '沐', strokes: 8, meaning: '沐浴、清新' },
    { char: '澜', strokes: 20, meaning: '波澜、壮阔' },
    { char: '涓', strokes: 11, meaning: '涓流、细腻' },
    { char: '洁', strokes: 16, meaning: '纯洁、洁净' },
    { char: '溪', strokes: 14, meaning: '溪流、清澈' },
    { char: '滢', strokes: 18, meaning: '清澈、明亮' },
    { char: '清', strokes: 12, meaning: '清雅、纯净' },
  ],
  火: [
    { char: '彤', strokes: 7, meaning: '彤红、热烈' },
    { char: '灵', strokes: 24, meaning: '灵动、聪慧' },
    { char: '炎', strokes: 8, meaning: '热烈、温暖' },
    { char: '煜', strokes: 13, meaning: '光耀、明亮' },
    { char: '暖', strokes: 13, meaning: '温暖、和煦' },
    { char: '昕', strokes: 8, meaning: '昕晨、光明' },
    { char: '曦', strokes: 20, meaning: '晨曦、希望' },
    { char: '晴', strokes: 12, meaning: '晴朗、明媚' },
    { char: '晶', strokes: 12, meaning: '晶莹、剔透' },
    { char: '晓', strokes: 16, meaning: '拂晓、新生' },
  ],
  土: [
    { char: '婉', strokes: 11, meaning: '婉约、温柔' },
    { char: '婷', strokes: 12, meaning: '婷婷、美好' },
    { char: '岚', strokes: 12, meaning: '山岚、清新' },
    { char: '媛', strokes: 12, meaning: '媛媛、美好' },
    { char: '瑶', strokes: 15, meaning: '瑶池、美好' },
    { char: '佩', strokes: 8, meaning: '玉佩、珍贵' },
    { char: '珊', strokes: 10, meaning: '珊瑚、美丽' },
    { char: '珂', strokes: 10, meaning: '珂玉、珍贵' },
    { char: '婉', strokes: 11, meaning: '婉转、柔美' },
    { char: '婷', strokes: 12, meaning: '婷婷、玉立' },
  ],
};

const WUXING_LIST = ['金', '木', '水', '火', '土'] as const;

export function generateNameCatalog(): NameCatalogEntry[] {
  const entries: NameCatalogEntry[] = [];
  let maleCount = 0;
  let femaleCount = 0;

  // 男名 300 条
  for (let i = 0; i < 300; i++) {
    const seed = parseInt(djb2(`male-${i}`), 36) >>> 0;
    const firstWuxing = WUXING_LIST[seedToIndex(seed, 5)];
    const secondWuxing = WUXING_LIST[seedToIndex(seed + 1, 5)];

    const firstPool = MALE_CHARS[firstWuxing];
    const secondPool = MALE_CHARS[secondWuxing];

    const first = firstPool[seedToIndex(seed + 2, firstPool.length)];
    const second = secondPool[seedToIndex(seed + 3, secondPool.length)];
    if (!first || !second) continue;

    const name = first.char + second.char;
    const pinyin = `${first.char} ${second.char}`;
    const strokes =
      first.strokes !== null && second.strokes !== null ? first.strokes + second.strokes : null;
    const wuxing = `${firstWuxing}${secondWuxing}`;
    const meaning = `${first.meaning} · ${second.meaning}`;

    maleCount++;
    entries.push({
      id: `m${String(maleCount).padStart(3, '0')}`,
      name,
      gender: 'male',
      pinyin,
      strokes,
      wuxing,
      meaning,
      popularity: 100 - Math.floor(i / 3),
      strokesReady: strokes !== null,
    });
  }

  // 女名 300 条
  for (let i = 0; i < 300; i++) {
    const seed = parseInt(djb2(`female-${i}`), 36) >>> 0;
    const firstWuxing = WUXING_LIST[seedToIndex(seed, 5)];
    const secondWuxing = WUXING_LIST[seedToIndex(seed + 1, 5)];

    const firstPool = FEMALE_CHARS[firstWuxing];
    const secondPool = FEMALE_CHARS[secondWuxing];

    const first = firstPool[seedToIndex(seed + 2, firstPool.length)];
    const second = secondPool[seedToIndex(seed + 3, secondPool.length)];
    if (!first || !second) continue;

    const name = first.char + second.char;
    const pinyin = `${first.char} ${second.char}`;
    const strokes =
      first.strokes !== null && second.strokes !== null ? first.strokes + second.strokes : null;
    const wuxing = `${firstWuxing}${secondWuxing}`;
    const meaning = `${first.meaning} · ${second.meaning}`;

    femaleCount++;
    entries.push({
      id: `f${String(femaleCount).padStart(3, '0')}`,
      name,
      gender: 'female',
      pinyin,
      strokes,
      wuxing,
      meaning,
      popularity: 100 - Math.floor(i / 3),
      strokesReady: strokes !== null,
    });
  }

  return entries;
}
