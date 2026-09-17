// ============================================================
import { useCallback, useEffect, useState } from 'react';

export type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

/**

* 共享异步页面状态机: 统一 loading → ok/ok-empty/error 流转

* 用法: const [state, retry] = useAsyncPage(data, hasData);
  */
  export function useAsyncPage<T>(_dataSource: ReadonlyArray<T>, hasData: boolean): [PageState, () => void] {
  const [state, setState] = useState<PageState>('loading');
  
  useEffect(() => {
   const t = window.setTimeout(() => {
     setState(hasData ? 'ok' : 'ok-empty');
   }, 0);
   return () => window.clearTimeout(t);
  }, [hasData]);
  
  const retry = useCallback(() => {
   setState('loading');
   window.setTimeout(() => setState(hasData ? 'ok' : 'ok-empty'), 0);
  }, [hasData]);
  
  return [state, retry];
}
