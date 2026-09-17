
// A11-2 · src/components/bazi/DailyThemeCard.tsx · 主题卡
import type { DailyTheme } from '../../data/bazi/daily-corpus';

const THEME_LABEL: Record<DailyTheme, string> = {
  focus: '今日关注',
  advice: '今日建议',
  reminder: '今日提醒',
};

export interface DailyThemeCardProps {
  theme: DailyTheme;
  text: string;
}

export function DailyThemeCard({ theme, text }: DailyThemeCardProps) {
  return (
    <article className="ts-daily-theme" role="article" aria-label={THEME_LABEL[theme]}>
      <h3 className="ts-daily-theme__title">{THEME_LABEL[theme]}</h3>
      <p className="ts-daily-theme__text">{text}</p>
    </article>
  );
}

export default DailyThemeCard;

