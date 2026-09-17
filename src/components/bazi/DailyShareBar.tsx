// A11-2 · src/components/bazi/DailyShareBar.tsx · 分享栏
import { usePromptCopyShare } from '../../hooks/usePromptCopyShare';

export interface DailyShareBarProps {
  text: string;
}

export function DailyShareBar({ text }: DailyShareBarProps) {
  const { copyState, handleCopy, handleShare } = usePromptCopyShare(text);
  return (
    <div className="ts-daily-share">
      <button type="button" className="ts-btn" onClick={() => void handleCopy()}>
        复制文案
      </button>
      <button type="button" className="ts-btn ts-btn--ghost" onClick={() => void handleShare()}>
        分享
      </button>
      {copyState === '已复制' && <span className="ts-daily-share__hint">{copyState}</span>}
    </div>
  );
}

export default DailyShareBar;
