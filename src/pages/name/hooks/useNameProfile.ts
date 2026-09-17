/**
 * 姓名评估 hook：本地调用 @temposoul/core/onomastics，无任何网络请求。
 */
import { useCallback, useMemo, useState } from 'react';
import { evaluateNameProfile } from '@temposoul/core/onomastics';
import type { NameInput, NameProfile } from '@temposoul/core/onomastics';
import {
  dossierProvider,
  getHomophoneTable,
  getZodiacRootTable,
} from '../../../data/character-dossier/loader';
import { trackName } from '../lib/trackName';
import { saveNameRecord } from '../lib/nameStorage';

export interface UseNameProfileResult {
  profile: NameProfile | null;
  loading: boolean;
  error: string | null;
  evaluate: (input: NameInput) => void;
  reset: () => void;
}

export function useNameProfile(): UseNameProfileResult {
  const [profile, setProfile] = useState<NameProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback((input: NameInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = evaluateNameProfile(input, {
        dossierProvider,
        zodiacRootTable: getZodiacRootTable(),
        homophoneTable: getHomophoneTable(),
      });
      setProfile(result);
      void trackName('trackNameTestSubmit', {
        type: input.type,
        script: input.script,
        length: `${input.surname}${input.given}`.length,
      });
      void saveNameRecord({
        surname: input.surname,
        given: input.given,
        type: input.type,
        script: input.script,
        summary: `笔画 ${result.fact.glyph.data.strokeCountTotal ?? '-'} / 证据 ${result.evidence.length} 条`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : '姓名评估失败，请稍后重试');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return useMemo(
    () => ({ profile, loading, error, evaluate, reset }),
    [profile, loading, error, evaluate, reset],
  );
}
