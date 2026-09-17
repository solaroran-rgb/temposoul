export interface FreeTrialSession {
  id: string;
  advisorId: string;
  startedAt: number;
  freeSeconds: 180;
  state: 'idle' | 'active' | 'expired' | 'upgraded';
}
