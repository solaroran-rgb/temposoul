
// A11-2 · src/components/bazi/DailyShareBar.tsx · 分享栏
import { usePromptCopyShare } from '../../hooks/usePromptCopyShare';

export interface DailyShareBarProps {
  text: string;
}

export function DailyShareBar({ text }: DailyShareBarProps) {
  const { copied, copy, share } = usePromptCopyShare(text);
  return (
    <div className="ts-daily-share">
      <button type="button" className="ts-btn" onClick={() => void copy()}>复制文案</button>
      <button type="button" className="ts-btn ts-btn--ghost" onClick={() => void share()}>分享</button>
      {copied && <span className="ts-daily-share__hint">已复制</span>}
    </div>
  );
}

export default DailyShareBar;

---

