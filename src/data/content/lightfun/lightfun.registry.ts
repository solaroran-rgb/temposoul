import { CEZI_DATA } from './cezi.data';
import { FINGERPRINT_DATA } from './fingerprint-fun.data';
import { LIFE_NUMBER_DATA } from './life-number.data';
import { BIRTHDAY_CODE_DATA } from './birthday-code.data';
import { BIRTH_FLOWER_DATA } from './birth-flower.data';
import { FUN_PSYCH_DATA } from './fun-psych-tests.data';
import { BLOOD_TYPE_DATA } from './blood-type-fun.data';
import { QINGGONG_DATA } from './qinggong-fun.data';
import { EYE_SNEEZE_DATA } from './eye-twitch-sneeze-fun.data';
import { CELEBRITY_DATA } from './celebrity-astrology.data';
import { XIU_DEGREE_DATA } from './xiu-degree.data';
import { YANGZHAI_DATA } from './yangzhai-fengshui-test.data';

export const LIGHTFUN_REGISTRY = {
  cezi: CEZI_DATA,
  'fingerprint-fun': FINGERPRINT_DATA,
  'life-number': LIFE_NUMBER_DATA,
  'birthday-code': BIRTHDAY_CODE_DATA,
  'birth-flower': BIRTH_FLOWER_DATA,
  'fun-psych-tests': FUN_PSYCH_DATA,
  'blood-type-fun': BLOOD_TYPE_DATA,
  'qinggong-fun': QINGGONG_DATA,
  'eye-twitch-sneeze-fun': EYE_SNEEZE_DATA,
  'celebrity-astrology': CELEBRITY_DATA,
  'xiu-degree': XIU_DEGREE_DATA,
  'yangzhai-fengshui-test': YANGZHAI_DATA,
} as const;

export type LightFunSlug = keyof typeof LIGHTFUN_REGISTRY;

export function getLightFun(slug: string) {
  return LIGHTFUN_REGISTRY[slug as LightFunSlug];
}
