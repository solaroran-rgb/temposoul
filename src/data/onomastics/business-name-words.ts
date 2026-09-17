// src/data/onomastics/business-name-words.ts
export interface BusinessNameWord {
  char: string;
  wuxing: '金' | '木' | '水' | '火' | '土';
  meaning: string;
  /** 真实康熙字典笔画（按繁体/姓名学口径标注，非字符 length） */
  strokes: number;
}

export const BUSINESS_NAME_WORDS: BusinessNameWord[] = [
  { char: '鑫', wuxing: '金', meaning: '财富兴盛', strokes: 24 },
  { char: '源', wuxing: '水', meaning: '源远流长', strokes: 14 },
  { char: '盛', wuxing: '金', meaning: '兴盛繁荣', strokes: 12 },
  { char: '达', wuxing: '火', meaning: '通达顺利', strokes: 16 },
  { char: '恒', wuxing: '水', meaning: '恒久持久', strokes: 10 },
  { char: '昌', wuxing: '金', meaning: '昌盛兴旺', strokes: 8 },
  { char: '泰', wuxing: '水', meaning: '安泰平和', strokes: 9 },
  { char: '丰', wuxing: '火', meaning: '丰收丰盈', strokes: 18 },
  { char: '德', wuxing: '火', meaning: '品德高尚', strokes: 15 },
  { char: '信', wuxing: '金', meaning: '诚信守信', strokes: 9 },
  { char: '和', wuxing: '水', meaning: '和谐和睦', strokes: 8 },
  { char: '润', wuxing: '水', meaning: '润泽滋养', strokes: 16 },
  { char: '锦', wuxing: '金', meaning: '锦绣前程', strokes: 16 },
  { char: '程', wuxing: '火', meaning: '前程远大', strokes: 12 },
  { char: '创', wuxing: '金', meaning: '创新开创', strokes: 12 },
  { char: '智', wuxing: '火', meaning: '智慧明智', strokes: 12 },
  { char: '博', wuxing: '水', meaning: '博大精深', strokes: 12 },
  { char: '广', wuxing: '木', meaning: '广阔宽广', strokes: 15 },
  { char: '聚', wuxing: '金', meaning: '汇聚聚集', strokes: 14 },
  { char: '兴', wuxing: '水', meaning: '兴旺发达', strokes: 16 },
];
