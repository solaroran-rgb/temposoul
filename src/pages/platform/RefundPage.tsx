import { useState } from 'react';
import { getAuthToken } from '../../lib/auth/token';

// 认证 token 统一走 lib/auth/token（ND-1 修复），隐私模式安全
function safeGetToken(): string | null {
  return getAuthToken();
}

export default function RefundPage() {
  const [reason, setReason] = useState('');
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCancelSubscription = async () => {
    setLoadingCancel(true);
    setMessage(null);
    try {
      const token = safeGetToken();
      const res = await fetch('/api/v1/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setMessage({ type: 'success', text: '订阅已成功取消，当前计费周期结束后生效。' });
      } else {
        setMessage({
          type: 'error',
          text: '取消失败，请稍后重试或通过 LemonSqueezy 门户自助取消。',
        });
      }
    } catch (_e) {
      setMessage({ type: 'error', text: '网络错误，请检查连接。' });
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleRefundRequest = async () => {
    if (!reason.trim()) return;
    setLoadingRefund(true);
    setMessage(null);
    try {
      const token = safeGetToken();
      const res = await fetch('/api/v1/refund', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: '退款申诉已提交，我们将在 3 个工作日内处理。' });
        setReason('');
      } else {
        setMessage({ type: 'error', text: '申诉提交失败，请重试。' });
      }
    } catch (_e) {
      setMessage({ type: 'error', text: '网络错误，请检查连接。' });
    } finally {
      setLoadingRefund(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-gray-200 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">订阅管理与退款申诉</h1>

        {/* FTC 一键取消 */}
        <section className="mb-8 p-6 bg-[#161B22] border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">一键取消订阅 (FTC 合规)</h2>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            取消后，您的订阅将在当前计费周期结束后失效。若接口异常，您也可通过
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline ml-1"
            >
              LemonSqueezy 客户门户
            </a>
            直接管理。
          </p>
          <button
            onClick={handleCancelSubscription}
            disabled={loadingCancel}
            aria-label="确认取消订阅"
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingCancel ? '处理中...' : '确认取消订阅'}
          </button>
        </section>

        {/* 7天无理由退款 */}
        <section className="mb-8 p-6 bg-[#161B22] border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">7天无理由退款申诉</h2>
          <p className="text-gray-400 mb-4 text-sm leading-relaxed">
            若您在新购订阅后 7 天内，可申请全额退款。
          </p>
          <label htmlFor="refund-reason" className="block text-sm font-medium text-gray-300 mb-2">
            退款原因 <span className="text-red-400">*</span>
          </label>
          <textarea
            id="refund-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="请简述退款原因..."
            className="w-full p-3 bg-[#0D1117] border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 resize-y"
            rows={4}
            aria-required="true"
          />
          <button
            onClick={handleRefundRequest}
            disabled={loadingRefund || !reason.trim()}
            aria-label="提交退款申诉"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#161B22] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingRefund ? '提交中...' : '提交退款申诉'}
          </button>
        </section>

        {/* 消息提示 */}
        {message && (
          <div
            role="alert"
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-900/30 border-green-700 text-green-300'
                : 'bg-red-900/30 border-red-700 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
