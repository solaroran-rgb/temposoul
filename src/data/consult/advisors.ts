export interface Advisor {
  id: string;
  name: string;
  specialty: 'bazi' | 'ziwei' | 'tarot' | 'astrology' | 'other';
  rating: number;
  isOnline: boolean;
  intro: string;
  price: number;
  ready: boolean;
}

export const ADVISORS_SEED: Advisor[] = [
  {
    id: 'adv-001',
    name: '李大师',
    specialty: 'bazi',
    rating: 4.8,
    isOnline: true,
    intro: '精通子平八字',
    price: 29900,
    ready: false,
  },
  {
    id: 'adv-002',
    name: '王导师',
    specialty: 'tarot',
    rating: 4.5,
    isOnline: false,
    intro: '韦特塔罗认证',
    price: 19900,
    ready: false,
  },
];
