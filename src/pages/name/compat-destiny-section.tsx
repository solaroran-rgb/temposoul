// src/pages/name/compat-destiny-section.tsx
import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { guardText } from '@/lib/assertions-guard';
import { trackEvent } from '@/lib/analytics';
import { ttlCache } from '@/lib/safe-storage-ttl';
import { stableHash } from '@/data/content/deterministic';
import { DESTINY_COPY } from '@/data/name/compat-destiny';
import type { DestinyDimensionCopy } from '@/data/name/compat-destiny';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const FALLBACK_COPY = DESTINY_COPY[0] as DestinyDimensionCopy;

export interface DestinySectionProps {
  readonly primaryName: string;
  readonly partnerName: string;
}

export function DestinyDimensionSection({
  primaryName,
  partnerName,
}: DestinySectionProps): ReactElement {
  const [copy, setCopy] = useState<DestinyDimensionCopy | null>(null);

  const seed = useMemo(
    () => stableHash(`${primaryName}|${partnerName}`) >>> 0,
    [primaryName, partnerName],
  );

  useEffect(() => {
    if (primaryName.length === 0 || partnerName.length === 0) {
      setCopy(null);
      return;
    }
    const cacheKey = `temposoul:name:compat:${seed}`;
    const cachedKey = ttlCache.get<string>(cacheKey);
    const byCache = DESTINY_COPY.find((c) => c.key === cachedKey);
    const bySeed = DESTINY_COPY[seed % DESTINY_COPY.length];
    const picked = byCache ?? bySeed ?? FALLBACK_COPY;
    ttlCache.set(cacheKey, picked.key, CACHE_TTL_MS);
    trackEvent('name_compat_destiny_view', { dimension: picked.key });
    setCopy(picked);
  }, [seed, primaryName, partnerName]);

  if (copy === null) return <></>;

  return (
    <section className="compat-page__destiny">
      <h3 className="compat-page__destiny-title">{copy.label}</h3>
      <p className="compat-page__destiny-text">{guardText(copy.text)}</p>
      <ConfidenceBadge confidence="probable" />
      <p className="compat-page__destiny-note">
        缘分维度为民俗文化参考，配对评分保持既有展示，不构成任何关系断言。
      </p>
    </section>
  );
}
