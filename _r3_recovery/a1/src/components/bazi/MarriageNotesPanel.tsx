
// A11-3 · src/components/bazi/MarriageNotesPanel.tsx · 婚恋提示
import { MARRIAGE_TIERS, type MarriageTier } from '../../data/bazi/marriage-tiers';

export interface MarriageNotesPanelProps {
  tier: MarriageTier;
}

export function MarriageNotesPanel({ tier }: MarriageNotesPanelProps) {
  const note = MARRIAGE_TIERS[tier];
  return (
    <div className="ts-marriage-note">
      <h3 className="ts-marriage-note__title">{note.title}</h3>
      <p className="ts-marriage-note__body">{note.body}</p>
      <p className="ts-marriage-note__meta">出处：{note.source}｜{note.note}</p>
    </div>
  );
}

export default MarriageNotesPanel;

