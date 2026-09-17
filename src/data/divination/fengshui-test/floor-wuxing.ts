export type Wuxing = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export function floorToWuxing(floor: number): Wuxing {
  const mod = ((floor - 1) % 10) + 1;
  if (mod === 1 || mod === 6) return 'water';
  if (mod === 2 || mod === 7) return 'fire';
  if (mod === 3 || mod === 8) return 'wood';
  if (mod === 4 || mod === 9) return 'metal';
  return 'earth';
}

export function wuxingLabel(w: Wuxing): string {
  return { water: '水', fire: '火', wood: '木', metal: '金', earth: '土' }[w];
}
