// src/data/community/wall.ts
export type ShareCardType = "birth" | "bazi" | "tarot" | "numerology" | "name";

export interface ShareCard {
  id: string;
  cardType: ShareCardType;
  sourceRecordId: string;      // 关联的原始记录 ID（生辰卡产物 ID）
  authorId: string;            // 匿名时 "anonymous"
  title: string;
  coverUrl?: string;
  createdAt: string;           // ISO
  likeCount: number;
  isPublic: boolean;
  reportable: boolean;
  payload: ShareCardPayload;
  ready: boolean;
}

export type ShareCardPayload = BirthPayload | BaziPayload | TarotPayload | NumerologyPayload | NamePayload;

export interface BirthPayload {
  cardType: "birth";
  birthDate: string;
  birthTime?: string;
  solarTerm?: string;
  zodiac?: string;
  westernSign?: string;
  summary: string;
}

export interface BaziPayload {
  cardType: "bazi";
  fourPillars: { year: string; month: string; day: string; hour: string };
  dayMaster: string;
  fiveElements: { wood: number; fire: number; earth: number; metal: number; water: number };
  summary: string;
}

export interface TarotPayload {
  cardType: "tarot";
  cards: Array<{
    name: string;
    arcana: "major" | "minor";
    orientation: "upright" | "reversed";
    meaning: string;
  }>;
  spreadName: string;
  summary: string;
}

export interface NumerologyPayload {
  cardType: "numerology";
  lifePathNumber: number;
  expressionNumber?: number;
  summary: string;
}

export interface NamePayload {
  cardType: "name";
  fullName: string;
  strokes?: number;
  fiveElements?: string;
  summary: string;
}

export const SHARE_CARDS_SEED: ShareCard[] = [
  {
    id: "wall-birth-001",
    cardType: "birth",
    sourceRecordId: "birth-record-001",
    authorId: "anon-001",
    title: "我的生辰卡：冬至出生的摩羯",
    createdAt: "2026-09-16T08:30:00+08:00",
    likeCount: 12,
    isPublic: true,
    reportable: true,
    payload: {
      cardType: "birth",
      birthDate: "1990-12-22",
      birthTime: "10:30",
      solarTerm: "冬至",
      zodiac: "马",
      westernSign: "摩羯座",
      summary: "冬至日马年摩羯，民俗视角的冬日出生印记。",
    },
    ready: false,
  },
  {
    id: "wall-bazi-001",
    cardType: "bazi",
    sourceRecordId: "bazi-record-001",
    authorId: "anon-002",
    title: "我的八字卡：四柱五行展示",
    createdAt: "2026-09-15T14:20:00+08:00",
    likeCount: 8,
    isPublic: true,
    reportable: true,
    payload: {
      cardType: "bazi",
      fourPillars: {
        year: "丙午",
        month: "庚子",
        day: "甲申",
        hour: "丁卯",
      },
      dayMaster: "甲木",
      fiveElements: {
        wood: 2,
        fire: 2,
        earth: 0,
        metal: 2,
        water: 1,
      },
      summary: "日主甲木，五行分布仅供参考，不构成断言。",
    },
    ready: false,
  },
  {
    id: "wall-tarot-001",
    cardType: "tarot",
    sourceRecordId: "tarot-record-001",
    authorId: "anon-003",
    title: "三牌阵：近期状态探索",
    createdAt: "2026-09-14T09:10:00+08:00",
    likeCount: 21,
    isPublic: true,
    reportable: true,
    payload: {
      cardType: "tarot",
      cards: [
        {
          name: "太阳",
          arcana: "major",
          orientation: "upright",
          meaning: "积极与清晰的象征。",
        },
        {
          name: "隐士",
          arcana: "major",
          orientation: "reversed",
          meaning: "需要重新审视孤独与内省。",
        },
        {
          name: "星星",
          arcana: "major",
          orientation: "upright",
          meaning: "希望与恢复的提示。",
        },
      ],
      spreadName: "三牌阵",
      summary: "文化娱乐向塔罗抽牌，请勿作为现实决策依据。",
    },
    ready: false,
  },
];
