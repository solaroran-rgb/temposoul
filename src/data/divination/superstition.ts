import { EntertainmentEntry } from './types';

export interface SuperstitionEntry extends EntertainmentEntry {
  kind: 'eye-twitch' | 'sneeze';
  period: string;
}

const KIND: ('eye-twitch' | 'sneeze')[] = ['eye-twitch', 'sneeze'];
const PERIODS = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];

export const SUPERSTITION_ENTRIES: SuperstitionEntry[] = KIND.flatMap((kind) =>
  PERIODS.map((period, idx) => ({
    id: `${kind}-${idx}`,
    title: `${kind === 'eye-twitch' ? '眼跳' : '喷嚏'}·${period}`,
    body: kind === 'eye-twitch' ? `${period}眼跳，民间有不同说法，仅供娱乐。` : `${period}喷嚏，民间有不同说法，仅供娱乐。`,
    kind,
    period,
    source: { text: '民间俗信', confidence: 'legendary' },
    confidence: 'legendary',
    ready: true,
    disclaimer: '眼跳喷嚏俗信仅供娱乐，不构成预兆或决策依据。',
  }))
);
