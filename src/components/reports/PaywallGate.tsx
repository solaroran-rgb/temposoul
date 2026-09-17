import { memo, useEffect, useRef, useState } from 'react';

type PaywallReason = 'locked' | 'pending_payment' | 'refunded';

interface PaywallGateProps {
  reportId: string;
  reason: PaywallReason;
  onView?: (reason: PaywallReason) => void;
  onWaitlistSubmit?: (domain: string) => void;
}

const REASON_TITLE: Record<PaywallReason, string> = {
  locked: '十维深度报告未解锁',
  pending_payment: '十维深度报告即将开放',
  refunded: '本报告已退款',
};

const REASON_BODY: Record<PaywallReason, string> = {
  locked: '当前为免费预览。留下邮箱，开放时第一时间通知你。',
  pending_payment: '支付通道正在接入。留下邮箱，开放时第一时间通知你。',
  refunded: '如已退款，可重新购买；或留下邮箱等待新一轮开放。',
};

function maskDomain(email: string): string {
  const at = email.indexOf('@');
  if (at < 0) return 'invalid';
  return email.slice(at + 1).toLowerCase();
}

async function submitWaitlist(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/v1/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'report_waitlist' }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: data.error || `http_${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}

function PaywallGateBase({ reason, onView, onWaitlistSubmit }: PaywallGateProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    onView?.(reason);
  }, [reason, onView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email.indexOf('@') < 0) {
      setStatus('error');
      setErrorMsg('请输入有效邮箱');
      return;
    }
    setStatus('submitting');
    const res = await submitWaitlist(email);
    if (res.ok) {
      setStatus('ok');
      onWaitlistSubmit?.(maskDomain(email));
    } else {
      setStatus('error');
      setErrorMsg(res.error || '提交失败，请稍后再试');
    }
  };

  return (
    <div
      role="region"
      aria-label="报告付费与等待名单"
      style={{
        background: '#161B22',
        border: '1px solid #30363D',
        borderRadius: 12,
        padding: 20,
        maxWidth: 480,
        margin: '24px auto',
        textAlign: 'center',
      }}
    >
      <h3 style={{ color: '#E6EDF3', fontSize: 16, margin: '0 0 8px' }}>{REASON_TITLE[reason]}</h3>
      <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>
        {REASON_BODY[reason]}
      </p>
      {status === 'ok' ? (
        <p style={{ color: '#3FB950', fontSize: 14 }}>已加入名单，感谢等待。</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="邮箱"
            autoComplete="email"
            style={{
              flex: 1,
              background: '#0D1117',
              border: '1px solid #30363D',
              borderRadius: 8,
              color: '#E6EDF3',
              padding: '10px 12px',
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            style={{
              background: status === 'submitting' ? '#1F6FEB' : '#238636',
              border: 'none',
              borderRadius: 8,
              color: '#FFFFFF',
              padding: '10px 16px',
              fontSize: 14,
              cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'submitting' ? '提交中' : '通知我'}
          </button>
        </form>
      )}
      {status === 'error' ? (
        <p style={{ color: '#F85149', fontSize: 12, marginTop: 8 }}>{errorMsg}</p>
      ) : null}
    </div>
  );
}

export const PaywallGate = memo(PaywallGateBase);
export default PaywallGate;
