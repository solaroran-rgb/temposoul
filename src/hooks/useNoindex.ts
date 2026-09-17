// A23 共享 · 互动/结果页 noindex 钩子（声明式，幂等）
// 供 A23 各页面在 mount 时把 robots 设为 noindex,follow。
import { useEffect } from 'react';

export function useNoindex(): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex,follow';
  }, []);
}
