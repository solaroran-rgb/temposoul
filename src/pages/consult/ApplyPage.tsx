import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import './ApplyPage.css';

export default function ApplyPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    trackPageView('/consult/apply');
    if (!name) {
      setError('姓名必填');
      return;
    }
    setError('');
    // 契约缺口：后端表单提交接口未建
  };

  return (
    <div className="apply-page">
      <PageTopbar title="入驻申请" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <p className="hint">数据最小化提示：不收集身份证号</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={error ? 'error' : ''}
      />
      {error && <div className="error-msg">{error}</div>}
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}
