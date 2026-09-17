export interface ExpertShowcase {
  id: string;
  name: string;
  specialty: string;
  title: string;
  bio: string;
  expertise: string[];
  bookingUrl?: string;
  ready: boolean;
}

export const EXPERTS_SEED: ExpertShowcase[] = [
  {
    id: 'e1',
    name: '张三',
    specialty: '紫微',
    title: '资深研究员',
    bio: '...',
    expertise: ['命宫'],
    ready: false,
  },
];
