// D9-3
// src/types/profile.ts
export interface UserProfile {
  id: string;
  name: string;
  relation: 'self' | 'family' | 'friend' | 'child';
  isDefault: boolean;
  gender: 'male' | 'female' | '';
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
  location?: { 
    cityName: string; 
    latitude: number; 
    longitude: number; 
    timeZoneId: string; 
  };
}
