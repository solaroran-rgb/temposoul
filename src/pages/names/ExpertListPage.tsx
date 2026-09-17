import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { safeStorage } from '@/lib/safe-storage';
import { generateTraceId } from '@/types/commerce';
import {
  EXPERT_DOMAIN_LABEL,
  MOCK_EXPERTS,
  type ExpertDomain,
  type MockExpertProfile,
} from '@/types/experts';

/**
 * D23-2 ｜ 大师测名 · 专家列表页
 * 路由：/names/expert
 *
 * 合规：全部专家 isMock:true，页面顶部常驻「示例专家，仅供流程体验」横幅。
 * 风控：点击「预约」时校验会话 + 10min 时间窗频次（GET /api/v1/security/rate-limit/check
 * 由文件内 mockCheckBookingRateLimit 兜底，BACKLOG），超阈值降级为「当前暂停预约」。
 * 六态机：idle / loading / ok / ok-empty / degraded / error。
 */

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

type TabKey = 'all' | ExpertDomain;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const RATE_KEY = 'temposoul:d23:expert:booking:window';
const SESSION_KEY = 'temposoul:d23:expert:booking:session';

/**
 * BACKLOG：真实 GET /api/v1/security/rate-limit/check 接入前的 Mock 兜底。
 * 前端无 IP，按 A.1 V-10 降级为「会话去重 + 时间窗」本地判定。
 */
async function mockCheckBookingRateLimit(): Promise<{ allowed: boolean; retryAfterMs: number }> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  const now = Date.now();
  const raw = safeStorage.getJSON<number[]>(RATE_KEY, []);
  const recent = raw.filter((t) => typeof t === 'number' && now - t < WINDOW_MS);

  // 同一会话内首次点击直接放行（会话去重：仅记录，不阻断首次）
  const hasSession = safeStorage.get(SESSION_KEY) === '1';

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = Math.min(...recent);
    return { allowed: false, retryAfterMs: Math.max(1000, oldest + WINDOW_MS - now) };
  }
  recent.push(now);
  safeStorage.setJSON(RATE_KEY, recent);
  if (!hasSession) safeStorage.set(SESSION_KEY, '1');
  return { allowed: true, retryAfterMs: 0 };
}

export default function ExpertListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [tab, setTab] = useState<TabKey>('all');
  const [experts, setExperts] = useState<MockExpertProfile[]>([]);
  const [retryAfter, setRetryAfter] = useState(0);

  const traceId = useMemo(() => generateTraceId(`expert-list:${tab}`), [tab]);

  useEffect(() => {
    trackPageView('/names/expert');
    // 示例数据为静态常量，模拟一次异步加载以走六态机
    const t = setTimeout(() => {
      setExperts(MOCK_EXPERTS as unknown as MockExpertProfile[]);
      setStatus(MOCK_EXPERTS.length ? 'ok' : 'ok-empty');
    }, 60);
    return () => clearTimeout(t);
  }, []);

  const filtered = experts
    .filter((e) => tab === 'all' || e.domain === tab)
    .slice()
    .sort((a, b) => a.domain.localeCompare(b.domain) || b.expectedAmount - a.expectedAmount);

  async function handleBookClick(expert: MockExpertProfile) {
    trackEvent('expert_booking_click', {
      traceId,
      expertId: expert.expertId,
      domain: expert.domain,
    });
    const result = await mockCheckBookingRateLimit();
    trackEvent('expert_rate_limit_check', {
      traceId,
      expertId: expert.expertId,
      allowed: result.allowed,
    });
    if (!result.allowed) {
      setRetryAfter(result.retryAfterMs);
      setStatus('degraded');
      return;
    }
    navigate(`/names/expert/${expert.expertId}`);
  }

  return (
    <div className="expert-list-page">
      <PageTopbar title="大师测名（示例专家）" onBack={() => navigate(-1)} />
      <PrivacyHint />

      <div className="mock-banner" role="note" aria-label="示例专家提示">
        当前展示为示例专家，仅供流程体验，不代表真实在册从业者。
      </div>

      {status === 'loading' && <div className="skeleton" aria-busy="true" />}

      {status === 'ok-empty' && <div className="empty">该领域暂无示例专家</div>}

      {status === 'degraded' && (
        <div className="degraded" role="alert">
          <p>当前暂停预约（预约频次超过限制）。</p>
          {retryAfter > 0 && <p>请约 {Math.ceil(retryAfter / 60000)} 分钟后再试。</p>}
          <button
            type="button"
            onClick={() => {
              setRetryAfter(0);
              setStatus('ok');
            }}
          >
            我知道了
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="error" role="alert">
          <p>专家列表加载失败。</p>
          <button type="button" onClick={() => setStatus('ok')}>
            重试
          </button>
        </div>
      )}

      {status === 'ok' && (
        <>
          <div className="tabs" role="tablist" aria-label="专家领域">
            {(['all', 'bazi', 'namology', 'fengshui'] as TabKey[]).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={tab === k}
                className={tab === k ? 'active' : ''}
                onClick={() => setTab(k)}
              >
                {k === 'all' ? '全部' : EXPERT_DOMAIN_LABEL[k]}
              </button>
            ))}
          </div>

          <ul className="expert-list">
            {filtered.map((e) => (
              <li key={e.expertId} className="expert-card">
                <div className="expert-head">
                  <span className="expert-name">
                    {e.name} <span className="mock-tag">示例</span>
                  </span>
                  <span className="expert-domain">{EXPERT_DOMAIN_LABEL[e.domain]}</span>
                </div>
                <p className="expert-bio">{e.bio}</p>
                <div className="expert-foot">
                  <span className="expert-price">{e.priceLabel}</span>
                  <button type="button" onClick={() => handleBookClick(e)}>
                    立即预约
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="to-detail-hint">
            也可查看 <Link to="/names/manual">手工起名</Link>。
          </p>
        </>
      )}
    </div>
  );
}
