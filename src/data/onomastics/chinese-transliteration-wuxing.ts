// src/data/onomastics/chinese-transliteration-wuxing.ts
export interface ChineseTransliterationWuxing {
  syllable: string;
  wuxing: '金' | '木' | '水' | '火' | '土';
  basis: string;
}

export const CHINESE_TRANSLITERATION_WUXING: ChineseTransliterationWuxing[] = [
  { syllable: 'a', wuxing: '木', basis: '韵母五行通行归类（示例）' },
  { syllable: 'b', wuxing: '水', basis: '声母五行通行归类（示例）' },
  { syllable: 'c', wuxing: '金', basis: '声母五行通行归类（示例）' },
  { syllable: 'd', wuxing: '火', basis: '声母五行通行归类（示例）' },
  { syllable: 'e', wuxing: '土', basis: '韵母五行通行归类（示例）' },
  { syllable: 'f', wuxing: '木', basis: '声母五行通行归类（示例）' },
  { syllable: 'g', wuxing: '金', basis: '声母五行通行归类（示例）' },
  { syllable: 'h', wuxing: '水', basis: '声母五行通行归类（示例）' },
  { syllable: 'i', wuxing: '火', basis: '韵母五行通行归类（示例）' },
  { syllable: 'j', wuxing: '木', basis: '声母五行通行归类（示例）' },
  { syllable: 'k', wuxing: '木', basis: '声母五行通行归类（示例）' },
  { syllable: 'l', wuxing: '火', basis: '声母五行通行归类（示例）' },
  { syllable: 'm', wuxing: '水', basis: '声母五行通行归类（示例）' },
  { syllable: 'n', wuxing: '火', basis: '声母五行通行归类（示例）' },
  { syllable: 'o', wuxing: '金', basis: '韵母五行通行归类（示例）' },
  { syllable: 'p', wuxing: '木', basis: '声母五行通行归类（示例）' },
  { syllable: 'q', wuxing: '金', basis: '声母五行通行归类（示例）' },
  { syllable: 'r', wuxing: '火', basis: '声母五行通行归类（示例）' },
  { syllable: 's', wuxing: '金', basis: '声母五行通行归类（示例）' },
  { syllable: 't', wuxing: '火', basis: '声母五行通行归类（示例）' },
  { syllable: 'u', wuxing: '水', basis: '韵母五行通行归类（示例）' },
  { syllable: 'v', wuxing: '木', basis: '声母五行通行归类（示例）' },
  { syllable: 'w', wuxing: '水', basis: '声母五行通行归类（示例）' },
  { syllable: 'x', wuxing: '金', basis: '声母五行通行归类（示例）' },
  { syllable: 'y', wuxing: '土', basis: '声母五行通行归类（示例）' },
  { syllable: 'z', wuxing: '金', basis: '声母五行通行归类（示例）' },
];

export function getWuxingBySyllable(syllable: string): string {
  const key = syllable.toLowerCase();
  return CHINESE_TRANSLITERATION_WUXING.find((c) => c.syllable === key)?.wuxing ?? '木';
}
