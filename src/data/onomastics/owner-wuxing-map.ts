// src/data/onomastics/owner-wuxing-map.ts
export interface OwnerWuxingPreference {
  ownerBirthYear: number;
  ownerZodiac: string;
  ownerMingGua: string;
  preferredWuxing: string[];
}

export const OWNER_WUXING_MAP: Record<number, OwnerWuxingPreference> = {
  1980: {
    ownerBirthYear: 1980,
    ownerZodiac: '猴',
    ownerMingGua: '坎',
    preferredWuxing: ['水', '金'],
  },
  1981: {
    ownerBirthYear: 1981,
    ownerZodiac: '鸡',
    ownerMingGua: '艮',
    preferredWuxing: ['土', '金'],
  },
  1982: {
    ownerBirthYear: 1982,
    ownerZodiac: '狗',
    ownerMingGua: '震',
    preferredWuxing: ['木', '水'],
  },
  1983: {
    ownerBirthYear: 1983,
    ownerZodiac: '猪',
    ownerMingGua: '巽',
    preferredWuxing: ['木', '火'],
  },
  1984: {
    ownerBirthYear: 1984,
    ownerZodiac: '鼠',
    ownerMingGua: '坎',
    preferredWuxing: ['水', '金'],
  },
  1985: {
    ownerBirthYear: 1985,
    ownerZodiac: '牛',
    ownerMingGua: '艮',
    preferredWuxing: ['土', '金'],
  },
  1986: {
    ownerBirthYear: 1986,
    ownerZodiac: '虎',
    ownerMingGua: '震',
    preferredWuxing: ['木', '水'],
  },
  1987: {
    ownerBirthYear: 1987,
    ownerZodiac: '兔',
    ownerMingGua: '巽',
    preferredWuxing: ['木', '火'],
  },
  1988: {
    ownerBirthYear: 1988,
    ownerZodiac: '龙',
    ownerMingGua: '坎',
    preferredWuxing: ['水', '金'],
  },
  1989: {
    ownerBirthYear: 1989,
    ownerZodiac: '蛇',
    ownerMingGua: '艮',
    preferredWuxing: ['土', '金'],
  },
  1990: {
    ownerBirthYear: 1990,
    ownerZodiac: '马',
    ownerMingGua: '震',
    preferredWuxing: ['木', '水'],
  },
  1991: {
    ownerBirthYear: 1991,
    ownerZodiac: '羊',
    ownerMingGua: '巽',
    preferredWuxing: ['木', '火'],
  },
};

export function getOwnerWuxingPreference(year: number): OwnerWuxingPreference | null {
  return OWNER_WUXING_MAP[year] ?? null;
}
