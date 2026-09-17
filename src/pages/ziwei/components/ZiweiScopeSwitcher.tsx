// 修正：抽 Segmented 子组件；补 aria 属性
type Algorithm = 'default' | 'zhongzhou';
type School = 'sanhe' | 'feixing' | 'sihua';
type Scope = 'decadal' | 'yearly';

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}

function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="ts-ziwei-switcher__group">
      <span className="ts-ziwei-switcher__label">{label}</span>
      <div className="ts-segmented" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={value === o.value ? 'is-active' : ''}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  algorithm: Algorithm;
  school: School;
  scope: Scope;
  onAlgorithmChange: (a: Algorithm) => void;
  onSchoolChange: (s: School) => void;
  onScopeChange: (s: Scope) => void;
}

const ALGO_OPTIONS: Array<{ value: Algorithm; label: string }> = [
  { value: 'default', label: '传统' },
  { value: 'zhongzhou', label: '中州派' },
];
const SCHOOL_OPTIONS: Array<{ value: School; label: string }> = [
  { value: 'sanhe', label: '三合' },
  { value: 'feixing', label: '飞星' },
  { value: 'sihua', label: '四化' },
];
const SCOPE_OPTIONS: Array<{ value: Scope; label: string }> = [
  { value: 'decadal', label: '大限' },
  { value: 'yearly', label: '流年' },
];

export function ZiweiScopeSwitcher(props: Props) {
  const { algorithm, school, scope, onAlgorithmChange, onSchoolChange, onScopeChange } = props;
  return (
    <div className="ts-ziwei-switcher">
      <Segmented
        label="算法"
        value={algorithm}
        options={ALGO_OPTIONS}
        onChange={onAlgorithmChange}
      />
      <Segmented label="流派" value={school} options={SCHOOL_OPTIONS} onChange={onSchoolChange} />
      <Segmented
        label="AI 分析范围"
        value={scope}
        options={SCOPE_OPTIONS}
        onChange={onScopeChange}
      />
    </div>
  );
}

export default ZiweiScopeSwitcher;
