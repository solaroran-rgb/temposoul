import { Advisor } from './advisors';

export interface AdvisorProfile {
  id: string;
  base: Advisor;
  bio: string;
  rates: { text: string; price: number }[];
  onlineStatus: 'online' | 'busy' | 'offline';
  ready: boolean;
}

export interface Review {
  id: string;
  advisorId: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  createdAt: number;
  ready: boolean;
}
