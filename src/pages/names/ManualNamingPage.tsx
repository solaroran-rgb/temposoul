import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { safeStorage } from '@/lib/safe-storage';
import {
  BillingStatus,
  generateDeterministicOrderId,
  generateTraceId,
  MANUAL_NAMING_TIERS,
  type CommercialWorkOrder,
  type ManualNamingRequest,
  type ManualNamingTierId,
} from '@/types/commerce';

/**
 * D23-1 ｜ 手工起名（付费）流程页
 * 路由：/names/manual
 *
 * 商业纪律：
 * - 不接真实支付、不下发支付订单号；提交只生成平台内部结算工单号。
 * - 提交前强制勾选《文化咨询服务条款》（agreedToTerms === true）。
 * - 六态机：idle / loading / ok / ok-empty / degraded / error。
 *
 * BACKLOG：真实后端 `POST /api/v1/commerce/work-orders` 待平台侧接入，
 * 当前使用文件内 mockCreateWorkOrder 兜底（纯前端、确定性、不产生真实网络请求）。
 */

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

const RATE_LIMIT_KEY = 'temposoul:d23:manual:submit:window';
const SESSION_FLAG_KEY = 'temposoul:d23:manual:submit:session';
const WINDOW_MS = 10 * 60 * 1000; // 10 分钟时间窗
const MAX_PER_WINDOW = 3;

/** BACKLOG：真实 POST /api/v1/commerce/work-orders 接入前的 Mock 兜底。 */
async function mockCreateWorkOrder(req: ManualNamingRequest): Promise<CommercialWorkOrder> {
  // 模拟网络时延，保持确定性（不引入随机延迟）
  await new Promise((resolve) => setTimeout(resolve, 300));

  const tier = MANUAL_NAMING_TIERS.find((t) => t.tierId === req.tierId) ?? MANUAL_NAMING_TIERS[0];
  const createdAt = Date.now();
  const orderId = generateDeterministicOrderId(
    [req.tierId, req.babyInfo.surname, req.contactEmail, createdAt].join('|'),
  );

  // 写本地待跟进记录（客服线下核对用），不代表真实落库
  safeStorage.setJSON(`temposoul:d23:manual:work-order:${orderId}`, {
    orderId,
    tierId: req.tierId,
    surname: req.babyInfo.surname,
    contactEmail: req.contactEmail,
    createdAt,
  });

  return {
    orderId,
    serviceType: 'manual_naming',
    tierId: req.tierId,
    expectedAmount: tier.expectedAmount,
    actualAmount: 0, // 线下收款后由客服回填
    status: BillingStatus.PENDING_REVIEW,
    createdAt,
  };
}

/** 本地频次风控：会话去重 + 10min 时间窗（前端无 IP，按 A.1 V-10 降级方案）。 */
function checkSubmitRate(): { allowed: boolean; reason: string } {
  const now = Date.now();
  const raw = safeStorage.getJSON<number[]>(RATE_LIMIT_KEY, []);
  const recent = raw.filter((t) => typeof t === 'number' && now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return { allowed: false, reason: '操作过于频繁，请稍后再试' };
  }
  recent.push(now);
  safeStorage.setJSON(RATE_LIMIT_KEY, recent);
  safeStorage.set(SESSION_FLAG_KEY, '1');
  return { allowed: true, reason: '' };
}

function formatYuan(fen: number): string {
  return `¥${(fen / 100).toFixed(2)}`;
}

export default function ManualNamingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');

  // 表单
  const [tierId, setTierId] = useState<ManualNamingTierId>('standard');
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('unknown');
  const [birthDate, setBirthDate] = useState('');
  const [surname, setSurname] = useState('');
  const [requirements, setRequirements] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  // 条款弹窗
  const [termsOpen, setTermsOpen] = useState(false);

  // 结果
  const [order, setOrder] = useState<CommercialWorkOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const traceId = useMemo(
    () => generateTraceId(`manual-naming:${tierId}:${surname || 'new'}`),
    [tierId, surname],
  );

  useEffect(() => {
    trackPageView('/names/manual');
  }, []);

  const selectedTier =
    MANUAL_NAMING_TIERS.find((t) => t.tierId === tierId) ?? MANUAL_NAMING_TIERS[0];

  const canSubmit =
    agreed &&
    surname.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail.trim());

  async function handleSubmit() {
    if (!canSubmit) {
      // 未勾选条款时强制打开条款弹窗
      if (!agreed) setTermsOpen(true);
      return;
    }
    const rate = checkSubmitRate();
    trackEvent('manual_naming_submit_click', {
      traceId,
      tierId,
      allowed: rate.allowed,
    });
    if (!rate.allowed) {
      setErrorMsg(rate.reason);
      setStatus('degraded');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    const req: ManualNamingRequest = {
      requestId: '',
      tierId,
      babyInfo: {
        gender,
        birthDate: birthDate || undefined,
        surname: surname.trim(),
      },
      parentRequirements: requirements.trim(),
      contactEmail: contactEmail.trim(),
      agreedToTerms: true,
    };
    try {
      const wo = await mockCreateWorkOrder(req);
      req.requestId = wo.orderId;
      setOrder(wo);
      setStatus('ok');
      trackEvent('manual_naming_workorder_created', {
        traceId,
        orderId: wo.orderId,
        tierId: wo.tierId,
        expectedAmount: wo.expectedAmount,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('maintenance')) {
        setStatus('degraded');
      } else {
        setErrorMsg('提交失败，请稍后重试');
        setStatus('error');
      }
    }
  }

  return (
    <div className="manual-naming-page">
      <PageTopbar title="手工起名（文化咨询）" onBack={() => navigate(-1)} />
      <PrivacyHint />

      {status === 'loading' && <div className="skeleton" aria-busy="true" />}

      {status === 'degraded' && (
        <div className="degraded" role="alert">
          <p>咨询通道维护中，当前暂不可提交。</p>
          <p>{errorMsg || '请稍后再来，或先浏览免费内容。'}</p>
          <button type="button" onClick={() => navigate('/names')}>
            返回名字频道
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="error" role="alert">
          <p>{errorMsg || '网络异常，请重试。'}</p>
          <button type="button" onClick={() => setStatus('idle')}>
            重试
          </button>
        </div>
      )}

      {status === 'ok' && order && (
        <div className="ok" aria-live="polite">
          <h2>提交成功</h2>
          <p>您的平台工单号：</p>
          <p className="order-id" data-testid="order-id">
            {order.orderId}
          </p>
          <ul>
            <li>档位：{selectedTier.name}</li>
            <li>预期金额：{formatYuan(order.expectedAmount)}</li>
            <li>预计排期：约 {selectedTier.turnaroundDays} 个自然日</li>
            <li>当前状态：待人工复核（{BillingStatus.PENDING_REVIEW}）</li>
          </ul>
          <p>
            请添加客服并备注工单号进行线下确认与收款；起名为传统文化参考，不承诺改名转运或必然成功。
          </p>
          <button type="button" onClick={() => navigate('/consult')}>
            前往咨询通道
          </button>
        </div>
      )}

      {(status === 'idle' || status === 'error') && (
        <div className="form-area">
          <section className="tiers">
            <h2>选择服务档位</h2>
            {MANUAL_NAMING_TIERS.map((t) => (
              <label key={t.tierId} className={`tier${tierId === t.tierId ? ' active' : ''}`}>
                <input
                  type="radio"
                  name="tier"
                  checked={tierId === t.tierId}
                  onChange={() => setTierId(t.tierId)}
                />
                <span className="tier-name">{t.name}</span>
                <span className="tier-price">{formatYuan(t.expectedAmount)}</span>
                <span className="tier-desc">{t.description}</span>
              </label>
            ))}
          </section>

          <section className="form">
            <h2>填写需求</h2>
            <label>
              姓氏
              <input
                type="text"
                value={surname}
                maxLength={8}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="必填，如：李"
              />
            </label>
            <label>
              性别
              <select value={gender} onChange={(e) => setGender(e.target.value as typeof gender)}>
                <option value="unknown">暂不确定</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </label>
            <label>
              出生日期（可选）
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </label>
            <label>
              起名诉求（可选）
              <textarea
                value={requirements}
                maxLength={200}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="如：希望含水字旁、避免生僻字等"
              />
            </label>
            <label>
              联系邮箱
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </label>

            <label className="agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                我已阅读并同意
                <button type="button" className="linklike" onClick={() => setTermsOpen(true)}>
                  《文化咨询服务条款》
                </button>
                ，理解起名结果为传统文化参考，不承诺改名转运或必然成功。
              </span>
            </label>

            <button type="button" disabled={!canSubmit} onClick={handleSubmit}>
              提交预约（生成工单号）
            </button>
          </section>
        </div>
      )}

      {termsOpen && (
        <div className="modal-mask" role="dialog" aria-modal="true" aria-label="文化咨询服务条款">
          <div className="modal">
            <h2>文化咨询服务条款</h2>
            <div className="modal-body">
              <p>1. 本服务为传统文化类信息咨询，仅供文化交流与流程体验。</p>
              <p>2. 起名结果属于民俗文化参考，不构成对个人命运、事业、健康的任何承诺或保证。</p>
              <p>
                3.
                平台不接入在线支付，工单提交后由客服通过站内通道或邮件与您联系，线下确认金额后收款。
              </p>
              <p>4. 您填写的邮箱、出生日期等信息仅用于本次咨询沟通，平台不向第三方出售。</p>
            </div>
            <label className="modal-agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              我已阅读并同意上述条款
            </label>
            <div className="modal-actions">
              <button type="button" onClick={() => setTermsOpen(false)}>
                关闭
              </button>
              <button type="button" disabled={!agreed} onClick={() => setTermsOpen(false)}>
                同意并关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
