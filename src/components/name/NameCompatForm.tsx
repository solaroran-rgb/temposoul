/**
 * C9-姓名配对：表单组件（本地侧补交：C 交付清单缺该组件）
 */
import React, { useState } from 'react';

export interface CompatFormValue {
  aName: string;
  aScript: string;
  bName: string;
  bScript: string;
}

const SCRIPTS = ['中文', '拼音'] as const;

export function NameCompatForm({
  onSubmit,
  loading,
}: {
  onSubmit: (v: CompatFormValue) => void;
  loading?: boolean;
}) {
  const [aName, setAName] = useState('');
  const [aScript, setAScript] = useState<string>('中文');
  const [bName, setBName] = useState('');
  const [bScript, setBScript] = useState<string>('中文');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aName.trim() || !bName.trim() || loading) return;
    onSubmit({ aName: aName.trim(), aScript, bName: bName.trim(), bScript });
  };

  return (
    <form className="name-compat-form" onSubmit={submit}>
      <div className="name-compat-form__row">
        <label className="name-compat-form__field">
          <span>姓名 A</span>
          <input
            value={aName}
            onChange={(e) => setAName(e.target.value)}
            placeholder="输入姓名"
            maxLength={12}
          />
        </label>
        <label className="name-compat-form__field">
          <span>输入方式</span>
          <select value={aScript} onChange={(e) => setAScript(e.target.value)}>
            {SCRIPTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="name-compat-form__row">
        <label className="name-compat-form__field">
          <span>姓名 B</span>
          <input
            value={bName}
            onChange={(e) => setBName(e.target.value)}
            placeholder="输入姓名"
            maxLength={12}
          />
        </label>
        <label className="name-compat-form__field">
          <span>输入方式</span>
          <select value={bScript} onChange={(e) => setBScript(e.target.value)}>
            {SCRIPTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" className="name-compat-form__submit" disabled={loading}>
        {loading ? '计算中…' : '开始配对'}
      </button>
    </form>
  );
}
