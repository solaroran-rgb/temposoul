// A11-5 · src/components/divination/ZhugeInputPanel.tsx · 起数输入
import { useState } from 'react';

export interface ZhugeInputPanelProps {
  disabled?: boolean;
  onCompute?: (a: string, b: string) => void;
}

export function ZhugeInputPanel({ disabled = false, onCompute }: ZhugeInputPanelProps) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  function handleSubmit() {
    setMsg(null);
    const ca = a.trim();
    const cb = b.trim();
    if (!ca || !cb) {
      setMsg('请输入两个字');
      return;
    }
    if (ca.length !== 1 || cb.length !== 1) {
      setMsg('每个输入框仅一个汉字');
      return;
    }
    onCompute?.(ca, cb);
  }

  return (
    <div className="ts-zhuge-input">
      <label>
        字一
        <input value={a} maxLength={1} disabled={disabled} onChange={(e) => setA(e.target.value)} />
      </label>
      <label>
        字二
        <input value={b} maxLength={1} disabled={disabled} onChange={(e) => setB(e.target.value)} />
      </label>
      <button
        type="button"
        className="ts-btn ts-btn--primary"
        disabled={disabled}
        onClick={handleSubmit}
      >
        起数
      </button>
      {disabled && <p className="ts-zhuge-input__hint">起数规则开发中，敬请期待</p>}
      {msg && (
        <p className="ts-alert ts-alert--error" role="alert">
          {msg}
        </p>
      )}
    </div>
  );
}

export default ZhugeInputPanel;
