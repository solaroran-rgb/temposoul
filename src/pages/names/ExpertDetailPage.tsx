import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { safeStorage } from '@/lib/safe-storage';
import { generateTraceId } from '@/types/commerce';
import { EXPERT_DOMAIN_LABEL, MOCK_EXPERTS, type ExpertBookingRequest } from '@/types/experts';

/**
 * D23-2 ｜ 大师测名 · 专家详情页
 * 路由：/names/expert/:id
 *
 * 合规：
 * - isMock 显著标注「示例专家，仅供流程体验」。
 * - 不接真实支付；预约成功仅生成本地预约凭证，走线下咨询通道。
 * 风控：提交预约前再次校验会话 + 10min 时间窗（与列表页同一 Mock 契约，BACKLOG）。
 * 六态机：idle / loading / ok / ok-empty / degraded / error。
 */

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const RATE_KEY = 'temposoul:d23:expert:booking:window';

/** BACKLOG：与 ExpertListPage 同契约的本地频次风控兜底。 */
async function mockCheckBookingRateLimit(): Promise<{ allowed: boolean; retryAfterMs: number }> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const now = Date.now();
  const raw = safeStorage.getJSON<number[]>(RATE_KEY, []);
  const recent = raw.filter((t) => typeof t === 'number' && now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return { allowed: false, retryAfterMs: Math.max(1000, Math.min(...recent) + WINDOW_MS - now) };
  }
  recent.push(now);
  safeStorage.setJSON(RATE_KEY, recent);
  return { allowed: true, retryAfterMs: 0 };
}

export default function ExpertDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');

  const expert = MOCK_EXPERTS.find((e) => e.expertId === id);

  const [targetName, setTargetName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState<ExpertBookingRequest | null>(null);
  const [retryAfter, setRetryAfter] = useState(0);

  const traceId = useMemo(() => generateTraceId(`expert-detail:${id}`), [id]);

  useEffect(() => {
    trackPageView(`/names/expert/${id}`);
    const t = setTimeout(() => {
      setStatus(expert ? 'ok' : 'ok-empty');
    }, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const canSubmit = targetName.trim().length > 0 && contact.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || !expert) return;
    setStatus('loading');
    const rate = await mockCheckBookingRateLimit();
    if (!rate.allowed) {
      setRetryAfter(rate.retryAfterMs);
      setStatus('degraded');
      return;
    }
    const booking: ExpertBookingRequest = {
      bookingId: `bk-${traceId}`,
      expertId: expert.expertId,
      targetName: targetName.trim(),
      birthDate: birthDate || undefined,
      contactWechatOrEmail: contact.trim(),
    };
    safeStorage.setJSON(`temposoul:d23:expert:booking:${booking.bookingId}`, booking);
    trackEvent('expert_booking_submitted', {
      traceId,
      expertId: expert.expertId,
      bookingId: booking.bookingId,
    });
    setSubmitted(booking);
    setStatus('idle');
  }

  return (
    <div className="expert-detail-page">
      <PageTopbar title="专家详情" onBack={() => navigate(-1)} />
      <PrivacyHint />

      <div className="mock-banner" role="note">
        示例专家，仅供流程体验（isMock: true）
      </div>

      {status === 'loading' && <div className="skeleton" aria-busy="true" />}

      {status === 'ok-empty' && (
        <div className="empty">
          <p>未找到该专家（{id}）。</p>
          <button type="button" onClick={() => navigate('/names/expert')}>
            返回专家列表
          </button>
        </div>
      )}

      {status === 'degraded' && (
        <div className="degraded" role="alert">
          <p>当前暂停预约（预约频次超过限制）。</p>
          {retryAfter > 0 && <p>请约 {Math.ceil(retryAfter / 60000)} 分钟后再试。</p>}
          <button type="button" onClick={() => setStatus('ok')}>
            我知道了
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="error" role="alert">
          <p>加载失败，请重试。</p>
          <button type="button" onClick={() => setStatus(expert ? 'ok' : 'ok-empty')}>
            重试
          </button>
        </div>
      )}

      {(status === 'ok' || status === 'idle') && expert && (
        <>
          <section className="expert-info">
            <h2>
              {expert.name} <span className="mock-tag">示例</span>
            </h2>
            <p className="domain">{EXPERT_DOMAIN_LABEL[expert.domain]}</p>
            <p className="bio">{expert.bio}</p>
            <p className="price">{expert.priceLabel}</p>
          </section>

          {submitted ? (
            <div className="booking-ok" aria-live="polite">
              <h3>预约已登记（演示）</h3>
              <p>预约凭证：{submitted.bookingId}</p>
              <p>客服将通过站内 /consult 通道与您联系；本服务为文化咨询，不承诺测名效果。</p>
              <button type="button" onClick={() => navigate('/consult')}>
                前往咨询通道
              </button>
            </div>
          ) : (
            <section className="booking-form">
              <h3>预约测名</h3>
              <label>
                待测姓名
                <input
                  type="text"
                  value={targetName}
                  maxLength={12}
                  onChange={(e) => setTargetName(e.target.value)}
                />
              </label>
              <label>
                出生日期（可选）
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </label>
              <label>
                微信 / 邮箱
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
              </label>
              <button type="button" disabled={!canSubmit} onClick={handleSubmit}>
                提交预约
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
