export interface ApplicationForm {
  id: string;
  name: string;
  specialty: 'bazi' | 'ziwei' | 'tarot' | 'astrology' | 'other';
  qualification: string;
  rate: number;
  status: 'pending' | 'approved' | 'rejected';
  ready: boolean;
}
