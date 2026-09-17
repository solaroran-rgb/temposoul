import { GLOBAL_CITIES, GLOBAL_CITIES_META } from './global-cities-data.js';
import type { GlobalCity, GlobalCitiesMeta } from './global-cities-data.js';

/**
 * 全球主要城市经纬度与时区查找。
 *
 * 数据源：GeoNames cities1000（CC-BY 4.0），覆盖 7 语言目标市场 34 国 448 城。
 * 时区列：IANA tzdata 区域名，可直接传给 calendar 模块的 timeZoneId 参数。
 */

export type { GlobalCity, GlobalCitiesMeta } from './global-cities-data.js';

export interface GlobalCitySearchOptions {
  /** 最多返回多少项，默认 20，最大 100。 */
  limit?: number;
  /** 限定国家代码（ISO alpha-2）。 */
  countries?: readonly string[];
  /** 限定目标语言。 */
  languages?: readonly ('en' | 'es' | 'ja' | 'ko' | 'th' | 'vi')[];
}

export interface ResolvedGlobalCity {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  /** IANA 时区名，可直接传给排盘引擎的 timeZoneId。 */
  timeZoneId: string;
  isCapital: boolean;
}

function normalizeKey(value: string) {
  return value.trim().toLocaleLowerCase();
}

function normalizeSearchKey(value: string) {
  return normalizeKey(value).replace(/[\s·\-_,.''"()]+/g, '');
}

function toResolved(city: GlobalCity): ResolvedGlobalCity {
  return {
    id: city.id,
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
    timeZoneId: city.timeZoneId,
    isCapital: city.isCapital,
  };
}

/** 全部全球城市（按国家、人口降序排列）。 */
export function getGlobalCities(): readonly GlobalCity[] {
  return GLOBAL_CITIES;
}

/** 数据集元信息（版本、数据源 URL、国家/城市数）。 */
export function getGlobalCitiesMeta(): GlobalCitiesMeta {
  return GLOBAL_CITIES_META;
}

/** 按 ISO 国家代码筛选。 */
export function getGlobalCitiesByCountry(country: string): readonly GlobalCity[] {
  const cc = normalizeKey(country);
  return GLOBAL_CITIES.filter((city) => normalizeKey(city.country) === cc);
}

/** 按目标语言代码筛选。 */
export function getGlobalCitiesByLanguage(
  language: 'en' | 'es' | 'ja' | 'ko' | 'th' | 'vi',
): readonly GlobalCity[] {
  return GLOBAL_CITIES.filter((city) => city.language === language);
}

/** 按稳定 ID 精确查找。 */
export function findGlobalCityById(id: string): GlobalCity | null {
  const key = normalizeKey(id);
  return GLOBAL_CITIES.find((city) => normalizeKey(city.id) === key) ?? null;
}

function searchScore(city: GlobalCity, normalizedQuery: string): number | null {
  const cityId = normalizeSearchKey(city.id);
  const nameAscii = normalizeSearchKey(city.nameAscii);
  const name = normalizeSearchKey(city.name);
  if (cityId === normalizedQuery) return 0;
  if (nameAscii === normalizedQuery) return 1;
  if (name === normalizedQuery) return 2;
  if (nameAscii.startsWith(normalizedQuery)) return 3;
  if (name.startsWith(normalizedQuery)) return 4;
  if (nameAscii.includes(normalizedQuery)) return 5;
  if (name.includes(normalizedQuery)) return 6;
  return null;
}

/** 按本地名、ASCII 名或 ID 模糊搜索。 */
export function searchGlobalCities(
  query: string,
  options: GlobalCitySearchOptions = {},
): ResolvedGlobalCity[] {
  const normalizedQuery = normalizeSearchKey(query);
  if (!normalizedQuery) return [];
  const limit = Math.min(Math.max(Math.trunc(options.limit ?? 20), 1), 100);
  const countrySet = options.countries
    ? new Set(options.countries.map((cc) => normalizeKey(cc)))
    : null;
  const languageSet = options.languages ? new Set(options.languages) : null;

  return GLOBAL_CITIES.map((city) => ({ city, score: searchScore(city, normalizedQuery) }))
    .filter((item): item is { city: GlobalCity; score: number } => {
      if (item.score === null) return false;
      if (countrySet && !countrySet.has(normalizeKey(item.city.country))) return false;
      if (languageSet && !languageSet.has(item.city.language)) return false;
      return true;
    })
    .sort((left, right) => left.score - right.score || right.city.population - left.city.population)
    .slice(0, limit)
    .map(({ city }) => toResolved(city));
}

/**
 * 将城市名/ID 解析成排盘可用的坐标与时区。
 * 与 resolveBirthPlace 互补：中国境内走 chinaBirthPlaceTree，境外走这里。
 */
export function resolveGlobalCity(query: string): ResolvedGlobalCity | null {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const direct = findGlobalCityById(trimmed);
  if (direct) return toResolved(direct);
  const results = searchGlobalCities(trimmed, { limit: 1 });
  return results[0] ?? null;
}
