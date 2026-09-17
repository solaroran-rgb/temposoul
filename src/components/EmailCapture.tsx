import { useCallback, useState, type FormEvent } from 'react';
import { useI18n } from '@/i18n';

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cardStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: 420,
  margin: '0 auto',
  padding: '18px 20px',
  borderRadius: 14,
  background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.10), rgba(180, 140, 255, 0.12))',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  textAlign: 'center',
};

const inputStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255, 255, 255, 0.18)',
  background: 'rgba(19, 16, 25, 0.6)',
  color: '#e8eaf0',
  fontSize: 14,
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 10,
  padding: '10px 0',
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(135deg, #ffd166, #b48cff)',
  color: '#1a1230',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
};

export function EmailCapture({ source = 'website' }: { source?: string }) {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      const value = email.trim();
      if (!EMAIL_RE.test(value)) {
        setStatus('error');
        return;
      }
      setStatus('loading');
      try {
        const res = await fetch('/api/v1/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: value, source }),
        });
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    },
    [email, source],
  );

  return (
    <section className="email-capture" aria-label={t('newsletter.title')} style={cardStyle}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#ffd166', marginBottom: 6 }}>
        {t('newsletter.title')}
      </div>
      <div style={{ fontSize: 13, color: '#c6cbd8', marginBottom: 12 }}>
        {t('newsletter.subtitle')}
      </div>
      {status === 'success' ? (
        <div style={{ fontSize: 14, color: '#7ecb9b', fontWeight: 600, padding: '10px 0' }}>
          {t('newsletter.success')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('newsletter.placeholder')}
            style={inputStyle}
            aria-label={t('newsletter.placeholder')}
          />
          <button type="submit" disabled={status === 'loading'} style={btnStyle}>
            {status === 'loading' ? t('common.loading') : t('newsletter.subscribe')}
          </button>
        </form>
      )}
      {status === 'error' ? (
        <div style={{ fontSize: 12, color: '#ff8fa3', marginTop: 8 }}>{t('newsletter.error')}</div>
      ) : null}
      <div style={{ fontSize: 11, color: '#8b93a7', marginTop: 10 }}>{t('newsletter.privacy')}</div>
    </section>
  );
}
