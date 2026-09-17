// src/data/community/moderation.ts
export type SensitiveCategory =
  | "medical"        // 医疗断言
  | "legal"          // 法律断言
  | "investment"     // 投资断言
  | "fatalism"       // 宿命断言
  | "insult"         // 辱骂人身
  | "spam"           // 广告导流
  | "political"      // 涉政/暴恐
  | "privacy";       // 隐私信息

export interface SensitiveWord {
  word: string;
  category: SensitiveCategory;
  strict: boolean;   // 是否严格匹配（含部分匹配）
}

export const SENSITIVE_WORDS: SensitiveWord[] = [
  // ① 医疗/法律/投资/宿命断言
  { word: "治愈癌症", category: "medical", strict: false },
  { word: "包治百病", category: "medical", strict: false },
  { word: "保证康复", category: "medical", strict: false },
  { word: "稳赚不赔", category: "investment", strict: false },
  { word: "必涨股票", category: "investment", strict: false },
  { word: "绝对安全", category: "investment", strict: false },
  { word: "一定坐牢", category: "legal", strict: false },
  { word: "肯定败诉", category: "legal", strict: false },
  { word: "注定穷命", category: "fatalism", strict: false },
  { word: "必死无疑", category: "fatalism", strict: false },
  { word: "命该如此", category: "fatalism", strict: false },
  { word: "绝对准", category: "fatalism", strict: false },
  // ② 辱骂人身
  { word: "傻逼", category: "insult", strict: true },
  { word: "废物", category: "insult", strict: true },
  { word: "去死", category: "insult", strict: true },
  { word: "垃圾人", category: "insult", strict: false },
  // ③ 广告导流
  { word: "加微信", category: "spam", strict: false },
  { word: "扫码付费", category: "spam", strict: false },
  { word: "私聊下单", category: "spam", strict: false },
  { word: "免费领取红包", category: "spam", strict: false },
  // ④ 涉政/暴恐
  { word: "暴力革命", category: "political", strict: false },
  { word: "恐怖袭击", category: "political", strict: false },
  { word: "分裂国家", category: "political", strict: false },
  // ⑤ 隐私信息
  { word: "手机号", category: "privacy", strict: false },
  { word: "身份证号", category: "privacy", strict: false },
  { word: "家庭住址", category: "privacy", strict: false },
];

export function checkSensitive(text: string): SensitiveWord[] {
  const normalized = normalize(text);
  const hits = new Set<string>();
  for (const item of SENSITIVE_WORDS) {
    const needle = normalize(item.word);
    if (normalized.includes(needle)) hits.add(item.word);
  }
  return Array.from(hits)
    .map((w) => SENSITIVE_WORDS.find((s) => s.word === w)!)
    .filter(Boolean);
}

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, "");
}
