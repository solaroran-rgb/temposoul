/**
 * C23-4 名字大全 · 女名 300 条
 * 文件路径：src/data/names/catalog-female.ts
 * 真实姓名用字（常见姓氏 + 高频女名用字）；笔画/五行以 onomastics 为准
 * 结构：15 常见姓氏 × 20 双字名 = 300 条
 */
import type { NameCatalogEntry } from './catalog-male';

interface SurnameMeta {
  char: string;
  strokes: number;
}

const SURNAMES: SurnameMeta[] = [
  { char: '王', strokes: 4 },
  { char: '李', strokes: 7 },
  { char: '张', strokes: 7 },
  { char: '刘', strokes: 6 },
  { char: '陈', strokes: 7 },
  { char: '杨', strokes: 7 },
  { char: '赵', strokes: 9 },
  { char: '黄', strokes: 11 },
  { char: '周', strokes: 8 },
  { char: '吴', strokes: 7 },
  { char: '徐', strokes: 10 },
  { char: '孙', strokes: 10 },
  { char: '马', strokes: 3 },
  { char: '朱', strokes: 6 },
  { char: '胡', strokes: 11 },
];

interface GivenMeta {
  given: string;
  pinyin: string;
  strokes: number;
  wuxing: string;
  meaning: string;
}

const FEMALE_GIVEN: GivenMeta[] = [
  { given: '诗涵', pinyin: 'shī hán', strokes: 25, wuxing: '金水', meaning: '诗情画意，涵养深厚' },
  { given: '欣怡', pinyin: 'xīn yí', strokes: 17, wuxing: '木土', meaning: '欣欣向荣，怡然自得' },
  { given: '子涵', pinyin: 'zǐ hán', strokes: 15, wuxing: '水水', meaning: '有涵养，内秀于心' },
  { given: '雨桐', pinyin: 'yǔ tóng', strokes: 18, wuxing: '水木', meaning: '雨润梧桐，高洁清雅' },
  { given: '欣妍', pinyin: 'xīn yán', strokes: 15, wuxing: '木水', meaning: '欣然美丽，明媚动人' },
  { given: '梦瑶', pinyin: 'mèng yáo', strokes: 27, wuxing: '木木', meaning: '如梦如幻，美好如瑶' },
  { given: '梓萱', pinyin: 'zǐ xuān', strokes: 24, wuxing: '木木', meaning: '梓木葱茏，萱草忘忧' },
  { given: '思琪', pinyin: 'sī qí', strokes: 17, wuxing: '金木', meaning: '思韵清雅，琪玉无瑕' },
  { given: '语嫣', pinyin: 'yǔ yān', strokes: 21, wuxing: '土木', meaning: '语笑嫣然，温柔美好' },
  { given: '芷若', pinyin: 'zhǐ ruò', strokes: 19, wuxing: '木木', meaning: '芷草若兰，幽香清雅' },
  { given: '若曦', pinyin: 'ruò xī', strokes: 23, wuxing: '木火', meaning: '如晨光曦，温暖明亮' },
  { given: '可欣', pinyin: 'kě xīn', strokes: 12, wuxing: '木木', meaning: '可喜可爱，欣然自得' },
  { given: '雨嘉', pinyin: 'yǔ jiā', strokes: 18, wuxing: '水木', meaning: '雨润嘉木，美好善良' },
  { given: '梦洁', pinyin: 'mèng jié', strokes: 21, wuxing: '木水', meaning: '梦幻纯洁，心地纯净' },
  { given: '雅静', pinyin: 'yǎ jìng', strokes: 26, wuxing: '木金', meaning: '优雅文静，娴静端庄' },
  { given: '雪丽', pinyin: 'xuě lì', strokes: 25, wuxing: '水火', meaning: '冰雪聪明，秀丽动人' },
  { given: '慧妍', pinyin: 'huì yán', strokes: 25, wuxing: '水土', meaning: '聪慧美丽，秀外慧中' },
  { given: '佳怡', pinyin: 'jiā yí', strokes: 16, wuxing: '土木', meaning: '佳人怡悦，美好和顺' },
  { given: '婉婷', pinyin: 'wǎn tíng', strokes: 22, wuxing: '土火', meaning: '温婉柔美，婷婷玉立' },
  { given: '曼柔', pinyin: 'màn róu', strokes: 21, wuxing: '水水', meaning: '曼妙温柔，柔情似水' },
];

function buildFemale(): NameCatalogEntry[] {
  const out: NameCatalogEntry[] = [];
  for (const s of SURNAMES) {
    for (const g of FEMALE_GIVEN) {
      out.push({
        id: `f-${s.char}${g.given}`,
        name: s.char + g.given,
        gender: 'female',
        surname: s.char,
        given: g.given,
        pinyin: `${s.char} ${g.pinyin}`,
        strokes: s.strokes + g.strokes,
        wuxing: g.wuxing,
        meaning: g.meaning,
      });
    }
  }
  return out;
}

export const FEMALE_NAMES: NameCatalogEntry[] = buildFemale();
