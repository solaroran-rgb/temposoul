// /newsletter · 邮件订阅管理页
// 交互：订阅（邮箱+频率，POST /api/v1/newsletter，双确认）/ 查询状态与频率（POST /manage）/ 退订（POST /unsubscribe）
import { useState, type FormEvent } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { useNavigate } from 'react-router-dom';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './newsletter.css';

type Frequency = 'daily' | 'weekly' | 'monthly';
type Tone = 'ok' | 'err' | null;

interface StatusInfo {
  status: string;
  subscribed: boolean;
  frequency: Frequency | null;
}

const FREQ_LABEL: Record<Frequency, string> = {
  daily: '每日',
  weekly: '每周',
  monthly: '每月',
};

function statusText(status: string): string {
  switch (status) {
    case 'confirmed':
      return '已确认订阅';
    case 'pending':
      return '待确认（请查收确认邮件，点击链接完成确认）';
    case 'unsubscribed':
      return '已退订';
    case 'none':
      return '未订阅';
    default:
      return status;
  }
}

export default function NewsletterPage() {
  const navigate = useNavigate();
  useDocumentMeta({ title: '邮件订阅管理' });

  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: Tone; text: string }>({ tone: null, text: '' });
  const [status, setStatus] = useState<StatusInfo | null>(null);

  async function post(path: string, body: Record<string, unknown>) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return (await res.json()) as Record<string, unknown>;
  }

  const onSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setMsg({ tone: null, text: '' });
    try {
      const j = await post('/api/v1/newsletter', { email, frequency, source: 'newsletter-page' });
      if (j.ok) {
        setMsg({
          tone: 'ok',
          text: j.already
            ? '该邮箱已在订阅列表中，频率已更新。'
            : '订阅请求已提交，确认邮件已发送（双确认）。',
        });
      } else {
        setMsg({ tone: 'err', text: `订阅失败：${j.error ?? '未知错误'}` });
      }
    } catch {
      setMsg({ tone: 'err', text: '网络异常，请稍后重试。' });
    } finally {
      setBusy(false);
    }
  };

  const onQuery = async () => {
    if (!email.trim()) return;
    setBusy(true);
    setMsg({ tone: null, text: '' });
    setStatus(null);
    try {
      const j = await post('/api/v1/newsletter/manage', { email });
      if (j.ok) {
        setStatus({
          status: (j.status as string) ?? 'none',
          subscribed: Boolean(j.subscribed),
          frequency: (j.frequency as Frequency | null) ?? 'weekly',
        });
      } else {
        setMsg({ tone: 'err', text: `查询失败：${j.error ?? '未知错误'}` });
      }
    } catch {
      setMsg({ tone: 'err', text: '网络异常，请稍后重试。' });
    } finally {
      setBusy(false);
    }
  };

  const onSaveFrequency = async (freq: Frequency) => {
    setBusy(true);
    try {
      const j = await post('/api/v1/newsletter/manage', { email, frequency: freq });
      if (j.ok) {
        setStatus((s) => (s ? { ...s, frequency: freq } : s));
        setMsg({ tone: 'ok', text: `发送频率已更新为「${FREQ_LABEL[freq]}」。` });
      } else {
        setMsg({ tone: 'err', text: `更新失败：${j.error ?? '未知错误'}` });
      }
    } catch {
      setMsg({ tone: 'err', text: '网络异常，请稍后重试。' });
    } finally {
      setBusy(false);
    }
  };

  const onUnsubscribe = async () => {
    if (!email.trim()) return;
    setBusy(true);
    try {
      const j = await post('/api/v1/newsletter/unsubscribe', { email });
      if (j.ok) {
        setStatus((s) => (s ? { ...s, status: 'unsubscribed', subscribed: false } : s));
        setMsg({ tone: 'ok', text: '已为该邮箱退订。如需恢复，重新提交订阅即可。' });
      } else {
        setMsg({ tone: 'err', text: `退订失败：${j.error ?? '未知错误'}` });
      }
    } catch {
      setMsg({ tone: 'err', text: '网络异常，请稍后重试。' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="nl-page">
      <PageTopbar title="邮件订阅管理" onBack={() => navigate(-1)} />
      <header className="nl-hero">
        <h1>邮件订阅管理</h1>
        <p className="nl-desc">订阅命律的内容更新，随时查询状态、调整频率或退订。</p>
        <p className="nl-note">订阅采用双确认：提交后需点击邮件中的确认链接才算生效。</p>
      </header>

      <section className="nl-card">
        <h2>订阅 / 更新频率</h2>
        <form onSubmit={onSubscribe}>
          <label className="nl-field">
            邮箱
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <div className="nl-freq">
            {(Object.keys(FREQ_LABEL) as Frequency[]).map((f) => (
              <label key={f}>
                <input
                  type="radio"
                  name="frequency"
                  checked={frequency === f}
                  onChange={() => setFrequency(f)}
                />
                {FREQ_LABEL[f]}
              </label>
            ))}
          </div>
          <button type="submit" className="nl-btn" disabled={busy}>
            {busy ? '提交中…' : '订阅 / 保存频率'}
          </button>
        </form>
      </section>

      <section className="nl-card">
        <h2>查询状态与退订</h2>
        <p className="nl-note">输入同一邮箱，查看当前订阅状态，可调整频率或退订。</p>
        <div className="nl-actions">
          <button type="button" className="nl-btn" onClick={onQuery} disabled={busy}>
            查询状态
          </button>
          <button
            type="button"
            className="nl-btn nl-btn--ghost"
            onClick={onUnsubscribe}
            disabled={busy}
          >
            退订
          </button>
        </div>

        {status && (
          <div className="nl-status">
            <div>
              当前状态：<strong>{statusText(status.status)}</strong>
            </div>
            {status.frequency && <div>发送频率：{FREQ_LABEL[status.frequency]}</div>}
            {status.subscribed && (
              <div className="nl-actions">
                <span>调整频率：</span>
                {(Object.keys(FREQ_LABEL) as Frequency[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className="nl-btn nl-btn--ghost"
                    disabled={busy || status.frequency === f}
                    onClick={() => onSaveFrequency(f)}
                  >
                    {FREQ_LABEL[f]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {msg.text && (
        <p className={`nl-msg ${msg.tone === 'ok' ? 'nl-msg--ok' : 'nl-msg--err'}`} role="status">
          {msg.text}
        </p>
      )}

      <footer className="nl-disclaimer">
        <p>
          我们仅用你的邮箱发送所选频率的内容更新，不会向第三方分享。你可以随时查询状态或退订。
          本站所有命理内容仅供娱乐与自我觉察，不构成专业建议。
        </p>
      </footer>
    </div>
  );
}
