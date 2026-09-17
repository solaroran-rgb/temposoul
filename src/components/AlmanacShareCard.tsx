// 修正：IT-1.4 依据（usePromptCopyShare 必传 shareText，解构 handleCopy/copyState）
// 优化：增加 aria-live 播报复制状态，提升无障碍体验
import React, { useMemo } from 'react';
import { usePromptCopyShare } from '@/hooks/usePromptCopyShare';
import { AlmanacDayData } from '@/hooks/useAlmanacData';

interface AlmanacShareCardProps {
  data: AlmanacDayData;
}

export const AlmanacShareCard: React.FC<AlmanacShareCardProps> = ({ data }) => {
  const shareText = useMemo(() => {
    const lines = [
      `🌌 TempoSoul 命律 · 今日节律 (${data.date} ${data.weekday})`,
      `📅 ${data.lunarDate} | ${data.ganzhi.year} ${data.ganzhi.month} ${data.ganzhi.day}`,
      '',
      `✨ 宜：${data.recommends.join('、') || '诸事皆宜'}`,
      `🌊 忌：${data.avoids.join('、') || '诸事不忌'}`,
    ];
    if (data.clash) lines.push(`⚠️ 冲煞：${data.clash}`);
    lines.push('', `🔗 探索更多命理证据：www.temposoul.com`);
    lines.push(`⚠️ 本内容基于传统历法生成，仅供文化参考。`);
    return lines.join('\n');
  }, [data]);

  const { handleCopy, copyState } = usePromptCopyShare(shareText);

  const buttonText =
    copyState === 'copied'
      ? '已复制到剪贴板'
      : copyState === 'copying'
        ? '复制中...'
        : '分享今日节律';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        className="almanac-share-btn"
        onClick={handleCopy}
        disabled={copyState === 'copying'}
        aria-label={buttonText}
        style={{
          background:
            'linear-gradient(135deg, var(--neon-pink, #ff4d6d) 0%, var(--neon-cyan, #4dc3ff) 100%)',
          border: 'none',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
          cursor: copyState === 'copying' ? 'wait' : 'pointer',
          fontWeight: 'bold',
          marginTop: '16px',
          width: '100%',
          fontSize: '1rem',
          opacity: copyState === 'copying' ? 0.8 : 1,
          transition: 'opacity 0.2s, transform 0.1s',
          transform: copyState === 'copied' ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {buttonText}
      </button>
      {/* 无障碍状态播报 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
        }}
      >
        {copyState === 'copied' ? '分享文案已成功复制到剪贴板' : ''}
      </div>
    </div>
  );
};

export default AlmanacShareCard;
