/**
 * AI 深度解读 hook：走 POST /api/v1/ai/analyze（SSE），复用既有 useAiChat，禁止自研流解析。
 * 集成说明：v3.2 未声明 useAiChat 的导出签名，本文件通过适配层调用并做能力探测；
 * 若签名不匹配，界面显示「AI 解读暂不可用」降级，不阻塞主流程（缺口 G24）。
 */
import { useCallback, useState } from 'react';

import { useAiChat } from '../../../hooks/useAiChat';
import { buildNamePrompt } from '../lib/buildNamePrompt';
import type { NameProfile } from '@temposoul/core/onomastics';

interface AiChatLike {
  send?: (payload: unknown) => void | Promise<void>;
  content?: string;
  loading?: boolean;
  streaming?: boolean;
  error?: string | null;
  reset?: () => void;
}

export interface UseNameInsightResult {
  content: string;
  loading: boolean;
  error: string | null;
  available: boolean;
  run: (profile: NameProfile) => void;
  reset: () => void;
}

const DISCLAIMER = 'AI 解读为辅助性文化说明，附解释边界，不构成吉凶预测或必然事件断言。';

export function useNameInsight(): UseNameInsightResult {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chat = (useAiChat as unknown as () => AiChatLike)();

  const run = useCallback(
    (profile: NameProfile) => {
      setError(null);
      setContent('');
      if (typeof chat?.send !== 'function') {
        setError('AI 解读暂不可用，可稍后重试（姓名档案不受影响）');
        return;
      }
      setLoading(true);
      try {
        const payload = { prompt: buildNamePrompt(profile) };
        const r = chat.send(payload) as unknown;
        if (r && typeof (r as Promise<void>).then === 'function') {
          (r as Promise<void>)
            .catch(() => setError('AI 解读失败，可稍后重试'))
            .finally(() => setLoading(false));
        } else {
          setContent(typeof chat.content === 'string' ? chat.content : '');
          setLoading(false);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'AI 解读失败，可稍后重试');
        setLoading(false);
      }
    },
    [chat],
  );

  const reset = useCallback(() => {
    setContent('');
    setError(null);
    chat?.reset?.();
  }, [chat]);

  return {
    content: content || (typeof chat?.content === 'string' ? chat.content : ''),
    loading: loading || Boolean(chat?.loading || chat?.streaming),
    error: error || chat?.error || null,
    available: typeof chat?.send === 'function',
    run,
    reset,
    disclaimer: DISCLAIMER,
  } as UseNameInsightResult & { disclaimer: string };
}
