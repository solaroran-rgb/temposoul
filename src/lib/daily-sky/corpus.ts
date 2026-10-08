// src/lib/daily-sky/corpus.ts
// 每日星象 · 文化引文库（规格 §4：≥24 条，真出处，禁编造出处）。
// 出处不确定者标「民俗典籍」。按 dateKey 种子确定性选取——同日不换条。

export interface CorpusQuote {
  quote: string;
  source: string;
}

/** 文化引文库：均为经典天文 / 星象文化名句，出处可考。 */
export const CORPUS: CorpusQuote[] = [
  { quote: '月者，阴之精也。', source: '《淮南子·天文训》' },
  { quote: '仰以观于天文，俯以察于地理。', source: '《周易·系辞上》' },
  { quote: '历象日月星辰，敬授人时。', source: '《尚书·尧典》' },
  { quote: '维天有汉，监亦有光。', source: '《诗经·小雅·大东》' },
  { quote: '譬如北辰，居其所而众星共之。', source: '《论语·为政》' },
  { quote: '天行有常，不为尧存，不为桀亡。', source: '《荀子·天论》' },
  { quote: '月光生于日之所照，魄生于日之所蔽。', source: '张衡《灵宪》' },
  { quote: '观乎天文，以察时变。', source: '《周易·贲卦·彖传》' },
  { quote: '迢迢牵牛星，皎皎河汉女。', source: '《古诗十九首》' },
  { quote: '明月几时有，把酒问青天。', source: '苏轼《水调歌头》' },
  { quote: '海上生明月，天涯共此时。', source: '张九龄《望月怀远》' },
  { quote: '春江潮水连海平，海上明月共潮生。', source: '张若虚《春江花月夜》' },
  { quote: '人生不相见，动如参与商。', source: '杜甫《赠卫八处士》' },
  { quote: '日往则月来，月往则日来，日月相推而明生焉。', source: '《周易·系辞下》' },
  { quote: '天道亏盈而益谦。', source: '《周易·谦卦·彖传》' },
  { quote: '天地所以能长且久者，以其不自生。', source: '《道德经》第七章' },
  { quote: '天之道，损有余而补不足。', source: '《道德经》第七十七章' },
  { quote: '悬象著明，莫大乎日月。', source: '《周易·系辞上》' },
  { quote: '天地盈虚，与时消息。', source: '《周易·丰卦·彖传》' },
  { quote: '绸缪束薪，三星在天。', source: '《诗经·唐风·绸缪》' },
  { quote: '北斗七星，所谓旋玑玉衡以齐七政。', source: '《史记·天官书》' },
  { quote: '星纪，斗、牵牛也。', source: '《尔雅·释天》' },
  { quote: '天地革而四时成。', source: '《周易·革卦·彖传》' },
  { quote: '星垂平野阔，月涌大江流。', source: '杜甫《旅夜书怀》' },
  { quote: '星汉灿烂，若出其里。', source: '曹操《观沧海》' },
  { quote: '危楼高百尺，手可摘星辰。', source: '李白《夜宿山寺》' },
];

/** 确定性字符串哈希（djb2 变种），仅用于按日取条。 */
function seedHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

/** 按 dateKey 种子取一条引文：同一 dailyKey 恒为同一条（24h 内不重复跳动）。 */
export function pickDailyQuote(dateKey: string): CorpusQuote {
  const idx = seedHash(`daily-sky|quote|${dateKey}`) % CORPUS.length;
  return CORPUS[idx];
}
