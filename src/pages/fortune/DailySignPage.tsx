import React, { useState, useCallback, useRef } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useAiChat } from '@/hooks/useAiChat';
import { usePromptCopyShare } from '@/hooks/usePromptCopyShare';
import { guardText } from '@/lib/assertions-guard'; // P0-2 修正：真实导出为 guardText
import { drawRandomSign } from '@temposoul/core/divination/ssgw'; // P0-3 修正：真实导出为 drawRandomSign
import './DailySignPage.css';

interface SignData {
  number: number;
  title: string;
  poem: string;
  interpretation: string;
}

export const DailySignPage: React.FC = () => {
  const [sign, setSign] = useState<SignData | null>(null);
  const [loading, setLoading] = useState(false);
  const ai = useAiChat();
  const guardRef = useRef('');

  const triggerAi = useCallback(
    (poem: string) => {
      ai.analyze(
        `请以传统文化学者的口吻，解读三山国王灵签诗句：“${poem}”。要求客观温和，仅作文化参考。`,
      );
    },
    [ai],
  );

  const handleDraw = useCallback(async () => {
    setLoading(true);
    guardRef.current = '';
    try {
      const res = await fetch('/api/v1/divination/ssgw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'random' }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error('API Error');
      setSign(json.data);
      triggerAi(json.data.poem);
    } catch (_e) {
      // 完美优化：API 失败时，调用本地 core 引擎真实降级，绝不伪造假数据
      const localSign = drawRandomSign();
      setSign({ ...localSign, interpretation: String(localSign.story ?? '') });
      triggerAi(localSign.poem);
    } finally {
      setLoading(false);
    }
  }, [triggerAi]);

  // 完美优化：流式输出实时经过断言柔化拦截
  const safeStream = ai.streamingContent ? guardText(ai.streamingContent) : '';
  const safeFinal =
    ai.turns.length > 0 && !ai.streamingContent
      ? guardText(ai.turns[ai.turns.length - 1].content)
      : '';

  const shareText = sign
    ? `🌌 TempoSoul 命律 · 每日一签\n【${sign.title}】\n${sign.poem}\n\n🔗 www.temposoul.com`
    : '';
  const { handleCopy, copyState } = usePromptCopyShare(shareText);

  return (
    <div className="daily-sign-page">
      <PageTopbar
        title="每日一签"
        onBack={() =>
          window.history.length > 1 ? window.history.back() : (window.location.href = '/')
        }
      />

      <div className="sign-draw-panel">
        <div className="sign-draw-panel__tube" />
        <button className="sign-draw-panel__btn" onClick={handleDraw} disabled={loading}>
          {loading ? '摇签中...' : '诚心抽签'}
        </button>
      </div>

      {sign && (
        <div className="sign-result-card">
          <div className="sign-result-card__head">
            <span>第 {sign.number} 签</span>
            <span>{sign.title}</span>
          </div>
          <blockquote>{sign.poem}</blockquote>
          <p className="sign-result-card__interp">{sign.interpretation}</p>
          <button className="share-btn" onClick={handleCopy} disabled={copyState === 'copying'}>
            {copyState === 'copied' ? '已复制' : '分享签文'}
          </button>
        </div>
      )}

      <div className="ai-section">
        <h3>AI 深度解签</h3>
        {ai.status === 'loading' && <p className="ai-loading">正在连接解签系统...</p>}
        {(safeStream || safeFinal) && <div className="ai-content">{safeStream || safeFinal}</div>}
      </div>

      <footer>
        <PrivacyHint />
      </footer>
    </div>
  );
};
export default DailySignPage;
