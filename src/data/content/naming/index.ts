/**
 * D 域（起名与商业变现内容）聚合出口
 * 7 项内容：英文名测试 / 公司起名 / 手工起名 / 顾问测名 / 名字热度 / 节律月历 / 联盟营销
 */
export type {
  LightFunContentEnvelope,
  LightFunCommercialEnvelope,
  LightFunEnvelope,
  BaseSEO,
  BaseMetadata,
  DdKind,
} from './types';

export { englishNameData } from './english-name.data';
export type {
  EnglishNamePayload,
  EnQuestion,
  EnRecommendation,
  EnPersona,
} from './english-name.data';

export { brandNamingData } from './brand-naming.data';
export type { BrandNamingPayload, BrandCase, NamingAsset } from './brand-naming.data';

export {
  artisanalNamingData,
  ARTISANAL_CHARS,
  mapCompactToFull,
  mapAllCompactToFull,
} from './artisanal-naming.data';
export type {
  ArtisanalNamingPayload,
  ArtisanalCharacter,
  CompactCharacter,
  ArtisanalCat,
  VisualStructure,
} from './artisanal-naming.data';

export { nameConsultantData } from './name-consultant.data';
export type {
  NameConsultantPayload,
  ConsultantReport,
  ConsultStateMachine,
} from './name-consultant.data';

export {
  namePopularityData,
  convertFrequencyToHeatZone,
  OFFICIAL_TOP50_MALE,
  OFFICIAL_TOP50_FEMALE,
} from './name-popularity.data';
export type {
  NamePopularityPayload,
  HeatZone,
  PopularityTrack,
  PopularityRank,
} from './name-popularity.data';

export { rhythmCalendarData, SOLAR_TERMS_2026, buildRhythmCalendar } from './rhythm-calendar.data';
export type {
  RhythmCalendarPayload,
  RhythmCalendarDay,
  SolarTermEntry,
  NormalDay,
  TransitionDay,
} from './rhythm-calendar.data';

export { creatorSyndicateData, ANTI_FRAUD_RULES } from './creator-syndicate.data';
export type {
  SyndicatePayload,
  AttributionParams,
  ConversionEvent,
  CompliantAsset,
} from './creator-syndicate.data';

/** D 域 7 项内容信封清单（供注册表消费） */
import { englishNameData } from './english-name.data';
import { brandNamingData } from './brand-naming.data';
import { artisanalNamingData } from './artisanal-naming.data';
import { nameConsultantData } from './name-consultant.data';
import { namePopularityData } from './name-popularity.data';
import { rhythmCalendarData } from './rhythm-calendar.data';
import { creatorSyndicateData } from './creator-syndicate.data';

export const D_ENVELOPES = [
  englishNameData,
  brandNamingData,
  artisanalNamingData,
  nameConsultantData,
  namePopularityData,
  rhythmCalendarData,
  creatorSyndicateData,
] as const;

export const D_DOMAIN_COUNT = D_ENVELOPES.length; // 7
