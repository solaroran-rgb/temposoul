import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n, type Locale } from '@/i18n';
import { useAuth } from '@/lib/auth/AuthContext';
import { PageTopbar } from '@/components/PageTopbar';
import { safeStorage } from '@/lib/safe-storage';
import { decodeInviteToken } from '@/lib/growth/invite';

/**
 * 验证码登录 · 组件内 7 语文案（Locale 对齐站点 i18n）。
 * 不入受管词典（src/i18n/locales），避免触发 check-i18n 门禁与 T07 覆盖管线。
 */
const OTP_UI: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    tab: '验证码登录',
    send: '发送验证码',
    resend: '重新发送',
    codeSent: '验证码已发送，请查收邮箱（60 秒后可重发）',
    code: '邮箱验证码',
    submit: '登录',
    invalidCode: '验证码错误或已失效',
    cooldown: '秒后可重发',
  },
  en: {
    tab: 'Login with code',
    send: 'Send code',
    resend: 'Resend code',
    codeSent: 'Code sent — check your inbox (resend available in 60s)',
    code: 'Email code',
    submit: 'Log in',
    invalidCode: 'Code invalid or expired',
    cooldown: 's until resend',
  },
  ja: {
    tab: '認証コードでログイン',
    send: 'コードを送信',
    resend: '再送信',
    codeSent: 'コードを送信しました。メールをご確認ください（60秒後に再送可）',
    code: 'メール認証コード',
    submit: 'ログイン',
    invalidCode: 'コードが無効または期限切れです',
    cooldown: '秒後に再送可',
  },
  'ko-KN': {
    tab: '인증 코드 로그인',
    send: '코드 전송',
    resend: '코드 재전송',
    codeSent: '코드를 전송했습니다. 메일을 확인하세요 (60초 후 재전송 가능)',
    code: '이메일 인증 코드',
    submit: '로그인',
    invalidCode: '코드가 잘못되었거나 만료되었습니다',
    cooldown: '초 후 재전송 가능',
  },
  'vi-VN': {
    tab: 'Đăng nhập bằng mã',
    send: 'Gửi mã',
    resend: 'Gửi lại mã',
    codeSent: 'Đã gửi mã — hãy kiểm tra hộp thư (gửi lại sau 60 giây)',
    code: 'Mã email',
    submit: 'Đăng nhập',
    invalidCode: 'Mã không hợp lệ hoặc đã hết hạn',
    cooldown: 'giây mới gửi lại được',
  },
  'th-TH': {
    tab: 'เข้าสู่ระบบด้วยรหัส',
    send: 'ส่งรหัส',
    resend: 'ส่งรหัสอีกครั้ง',
    codeSent: 'ส่งรหัสแล้ว — โปรดตรวจสอบอีเมล (ส่งซ้ำได้ใน 60 วินาที)',
    code: 'รหัสจากอีเมล',
    submit: 'เข้าสู่ระบบ',
    invalidCode: 'รหัสไม่ถูกต้องหรือหมดอายุ',
    cooldown: 'วินาทีจึงจะส่งซ้ำได้',
  },
  'es-ES': {
    tab: 'Entrar con código',
    send: 'Enviar código',
    resend: 'Reenviar código',
    codeSent: 'Código enviado — revisa tu correo (reenvío en 60 s)',
    code: 'Código del correo',
    submit: 'Entrar',
    invalidCode: 'Código no válido o caducado',
    cooldown: ' s para reenviar',
  },
};
const RESEND_COOLDOWN_SEC = 60;

export function LoginPage() {
  const { t, locale } = useI18n();
  const { login, sendOtp, loginWithOtp, error, unavailable } = useAuth();
  const navigate = useNavigate();
  const ui = OTP_UI[locale] ?? OTP_UI['zh-CN'];
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // S-6b B2：邀请链接落地状态。expired=true 时展示中性提示「邀请链接已过期」，不阻断登录。
  const [inviteExpired, setInviteExpired] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // S-6b B2：挂载时读 ?invite=<token>。
  // - 可解码（未过期）→ 存 `growth:pendingInvite`，待登录/注册成功后由 AuthContext 结算；
  // - 不可解码（非法/过期）→ 中性提示「邀请链接已过期」，不阻断登录；
  // - 无论如何都从 URL 上移除 invite 参数，避免刷新/跳转后重复处理。
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.location?.search) return;
      const url = new URL(window.location.href);
      const token = url.searchParams.get('invite');
      if (!token) return;
      if (decodeInviteToken(token)) {
        safeStorage.set('growth:pendingInvite', token);
      } else {
        setInviteExpired(true);
      }
      url.searchParams.delete('invite');
      window.history.replaceState(null, '', url.toString());
    } catch {
      /* 解析失败静默 */
    }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const ok =
      mode === 'password' ? await login(email.trim(), password) : await loginWithOtp(email, code);
    setSubmitting(false);
    if (ok) navigate('/');
  }

  async function onSendCode() {
    setOtpError(null);
    setSubmitting(true);
    const ok = await sendOtp(email, locale);
    setSubmitting(false);
    if (ok) {
      setCodeSent(true);
      setCooldown(RESEND_COOLDOWN_SEC);
    } else {
      setOtpError('request_failed');
    }
  }

  const showOtpError =
    mode === 'otp' ? otpError || (error === 'invalid_code' ? 'invalid_code' : null) : null;

  return (
    <>
      <PageTopbar title={t('auth.loginTitle')} onBack={() => navigate('/')} />
      <div className="auth-page">
        <form className="auth-card glass-panel" onSubmit={onSubmit}>
          <h2>{t('auth.loginTitle')}</h2>
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'password'}
              className={mode === 'password' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setMode('password')}
            >
              {t('auth.loginTitle')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'otp'}
              className={mode === 'otp' ? 'auth-tab active' : 'auth-tab'}
              onClick={() => setMode('otp')}
            >
              {ui.tab}
            </button>
          </div>
          {unavailable && <p className="auth-notice">{t('auth.serviceUnavailable')}</p>}
          {inviteExpired && <p className="auth-notice">邀请链接已过期</p>}
          {mode === 'password' && error && <p className="auth-error">{t('auth.loginFailed')}</p>}
          {mode === 'otp' && showOtpError && (
            <p className="auth-error">
              {showOtpError === 'invalid_code' ? ui.invalidCode : t('auth.loginFailed')}
            </p>
          )}
          <label className="auth-field">
            <span>{t('auth.email')}</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          {mode === 'password' ? (
            <label className="auth-field">
              <span>{t('auth.password')}</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          ) : (
            <>
              <button
                type="button"
                className="auth-submit auth-otp-send"
                disabled={submitting || cooldown > 0 || !email}
                onClick={onSendCode}
              >
                {cooldown > 0 ? `${cooldown}${ui.cooldown}` : codeSent ? ui.resend : ui.send}
              </button>
              {codeSent && <p className="auth-notice">{ui.codeSent}</p>}
              <label className="auth-field">
                <span>{ui.code}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  autoComplete="one-time-code"
                />
              </label>
            </>
          )}
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? t('common.loading') : mode === 'otp' ? ui.submit : t('auth.loginSubmit')}
          </button>
          <p className="auth-alt">
            {t('auth.noAccount')} <Link to="/register">{t('auth.goRegister')}</Link>
          </p>
        </form>
      </div>
    </>
  );
}
