import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { NameTestForm } from './components/NameTestForm';
import { NameProfileDossier } from './components/NameProfileDossier';
import { NameInsightPanel } from './components/NameInsightPanel';
import { useNameProfile } from './hooks/useNameProfile';

export function NameTestPage() {
  const nav = useNavigate();
  const { profile, loading, error, evaluate, reset } = useNameProfile();

  return (
    <>
      <PageTopbar title="姓名测试" onBack={() => nav('/')} />
      <main className="name-test-page">
        <p className="name-test-page__boundary">
          事实与民俗文化参考，不含吉凶预测、成功率或必然事件断言。
        </p>
        <NameTestForm onSubmit={evaluate} loading={loading} />
        {profile && (
          <>
            <NameProfileDossier profile={profile} />
            <NameInsightPanel profile={profile} />
            <button type="button" className="name-test-page__reset" onClick={reset}>
              重新测试
            </button>
          </>
        )}
        {error && <p className="name-test-page__error">{error}</p>}
      </main>
      <PrivacyHint />
    </>
  );
}
