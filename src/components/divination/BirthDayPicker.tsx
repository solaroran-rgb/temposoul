import './BirthDayPicker.css';

interface BirthDayPickerProps {
  month: number;
  day: number;
  onChange: (month: number, day: number) => void;
  disabled?: boolean;
  label?: string;
}

const MONTH_DAYS: Record<number, number> = {
  1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
  7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31,
};

export function BirthDayPicker({ month, day, onChange, disabled, label }: BirthDayPickerProps) {
  const maxDay = MONTH_DAYS[month] ?? 31;
  const safeDay = Math.min(day, maxDay);

  return (
    <div className="birth-day-picker">
      {label && <label className="birth-day-picker__label">{label}</label>}
      <select
        className="birth-day-picker__select"
        disabled={disabled}
        value={month}
        onChange={(e) => {
          const m = Number(e.target.value);
          const cap = MONTH_DAYS[m] ?? 31;
          onChange(m, Math.min(safeDay, cap));
        }}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m}月</option>
        ))}
      </select>
      <select
        className="birth-day-picker__select"
        disabled={disabled}
        value={safeDay}
        onChange={(e) => onChange(month, Number(e.target.value))}
      >
        {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}日</option>
        ))}
      </select>
    </div>
  );
}
