/**
 * 邮件五流 · 策略与模板装配
 *
 * 铁律：模板文案不在调度层改写。既有两流（newsletter_confirm / report_delivery）
 * 的渲染函数由本模块统一导出，原始调用点改为 import 复用，措辞与线上逐字一致。
 */

import type { FlowPolicy, MailFlowId, MailRenderInput, RenderedMail } from './types';

const BRAND_FALLBACK = 'TempoSoul';

function brandOf(env: MailRenderInput['env']): string {
  return env.MAIL_FROM_NAME?.trim() || BRAND_FALLBACK;
}

/** 取 payload 字符串字段，缺失时回落默认值（模板不做校验，校验在入队前完成） */
function str(payload: Record<string, unknown>, key: string, fallback = ''): string {
  const v = payload[key];
  return typeof v === 'string' && v.length > 0 ? v : fallback;
}

/** 公共邮件外壳：品牌卡片 + 免责脚注，与既有两封邮件的视觉语言保持一致 */
function wrap(brand: string, title: string, bodyHtml: string, footer = ''): string {
  return [
    `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.7;color:#1a1230;max-width:520px;margin:0 auto;padding:24px;">`,
    `<h2 style="margin:0 0 12px;font-size:18px;">${title}</h2>`,
    bodyHtml,
    footer ? `<p style="margin:18px 0 0;font-size:12px;color:#8b93a7;">${footer}</p>` : '',
    `<p style="margin:18px 0 0;font-size:12px;color:#6b7280;">— ${brand}</p>`,
    `</div>`,
  ].join('');
}

function cta(url: string, label: string): string {
  return [
    `<p style="margin:0 0 18px;text-align:center;">`,
    `<a href="${url}" style="display:inline-block;padding:10px 26px;border-radius:10px;background:linear-gradient(135deg,#ffd166,#b48cff);color:#1a1230;font-weight:700;text-decoration:none;">${label}</a>`,
    `</p>`,
    `<p style="margin:0 0 8px;font-size:12px;color:#6b7280;">如果按钮无法点击，复制此链接到浏览器：</p>`,
    `<p style="margin:0 0 18px;font-size:12px;word-break:break-all;"><a href="${url}" style="color:#7c5cff;">${url}</a></p>`,
  ].join('');
}

const DISCLAIMER =
  '本报告/内容基于东方智慧与算法模型生成，旨在提供个人成长洞察与视角启发，不构成任何医疗、法律或投资建议。';

/**
 * 既有流 1：订阅确认信（文案与 functions/api/v1/newsletter-confirm.ts 原始实现逐字一致）
 * 由 newsletter-confirm.ts 与本调度器共用，避免两处模板漂移。
 */
export function renderConfirmationMail(brand: string, confirmUrl: string): RenderedMail {
  return {
    subject: `[${brand}] 请确认订阅 / Confirm your subscription`,
    html: [
      `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.7;color:#1a1230;max-width:520px;margin:0 auto;padding:24px;">`,
      `<h2 style="margin:0 0 12px;font-size:18px;">${brand} · 邮件订阅确认</h2>`,
      `<p style="margin:0 0 12px;font-size:14px;">你好，</p>`,
      `<p style="margin:0 0 12px;font-size:14px;">感谢订阅 ${brand}。请点击下面的按钮完成邮箱确认（双确认，7 天内有效）：</p>`,
      `<p style="margin:0 0 18px;text-align:center;">`,
      `<a href="${confirmUrl}" style="display:inline-block;padding:10px 26px;border-radius:10px;background:linear-gradient(135deg,#ffd166,#b48cff);color:#1a1230;font-weight:700;text-decoration:none;">确认订阅 / Confirm</a>`,
      `</p>`,
      `<p style="margin:0 0 8px;font-size:12px;color:#6b7280;">如果按钮无法点击，复制此链接到浏览器：</p>`,
      `<p style="margin:0 0 18px;font-size:12px;word-break:break-all;"><a href="${confirmUrl}" style="color:#7c5cff;">${confirmUrl}</a></p>`,
      `<p style="margin:0;font-size:12px;color:#8b93a7;">若非本人订阅可忽略本邮件，无需退订。</p>`,
      `</div>`,
    ].join(''),
    text: [
      `${brand} · 邮件订阅确认`,
      '',
      `感谢订阅 ${brand}。请访问以下链接完成邮箱确认（双确认，7 天内有效）：`,
      confirmUrl,
      '',
      '若非本人订阅可忽略本邮件。',
    ].join('\n'),
  };
}

/**
 * 既有流 5：深度报告投递信（文案与 src/lib/server/report/email.ts 原始实现逐字一致）
 */
export function renderReportDeliveryMail(reportUrl: string): RenderedMail {
  return {
    subject: '您的命律十维深度报告已生成',
    html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0D1117;">您的生命规律洞察报告已就绪</h2>
          <p>点击以下链接查看您的专属十维深度解析：</p>
          <p><a href="${reportUrl}" style="display: inline-block; padding: 12px 24px; background-color: #161B22; color: #ffffff; text-decoration: none; border-radius: 8px;">查看我的报告</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #666;">
            免责提示：本报告基于东方智慧与算法模型生成，旨在提供个人成长洞察与视角启发，不构成任何医疗、法律或投资建议。命运掌握在您自己手中。
          </p>
        </div>
      `,
    text: `您的生命规律洞察报告已就绪\n\n点击以下链接查看您的专属十维深度解析：${reportUrl}\n\n免责提示：本报告基于东方智慧与算法模型生成，旨在提供个人成长洞察与视角启发，不构成任何医疗、法律或投资建议。命运掌握在您自己手中。`,
  };
}

export const FLOW_POLICIES: Record<MailFlowId, FlowPolicy> = {
  // 1. 订阅确认信（营销 · 退订可拦）
  newsletter_confirm: {
    id: 'newsletter_confirm',
    kind: 'marketing',
    respectUnsubscribe: true,
    defaultMaxAttempts: 5,
    render({ payload, env }) {
      return renderConfirmationMail(brandOf(env), str(payload, 'confirmUrl'));
    },
  },

  // 2. 注册欢迎信（营销 · 退订可拦）
  register_welcome: {
    id: 'register_welcome',
    kind: 'marketing',
    respectUnsubscribe: true,
    defaultMaxAttempts: 5,
    render({ to, payload, env }) {
      const brand = brandOf(env);
      const nickname = str(payload, 'nickname', to.split('@')[0] ?? '朋友');
      const homeUrl = str(payload, 'homeUrl', 'https://temposoul.pages.dev');
      const html = wrap(
        brand,
        `${brand} · 欢迎加入`,
        [
          `<p style="margin:0 0 12px;font-size:14px;">${nickname}，你好：</p>`,
          `<p style="margin:0 0 12px;font-size:14px;">欢迎来到 ${brand} 命律。这里可以排八字、起紫微、问卦象，也可以随时回看你的专属命盘。</p>`,
          cta(homeUrl, '开始我的第一次排盘'),
          `<p style="margin:0 0 12px;font-size:12px;color:#6b7280;">如果这不是你本人注册，请忽略本邮件。</p>`,
        ].join(''),
        DISCLAIMER,
      );
      const text = [
        `${brand} · 欢迎加入`,
        '',
        `${nickname}，你好：`,
        `欢迎来到 ${brand} 命律。这里可以排八字、起紫微、问卦象，也可以随时回看你的专属命盘。`,
        `开始：${homeUrl}`,
        '',
        '如果这不是你本人注册，请忽略本邮件。',
        '',
        DISCLAIMER,
        `— ${brand}`,
      ].join('\n');
      return { subject: `[${brand}] 欢迎加入 ${brand} 命律`, html, text };
    },
  },

  // 3. OTP 验证码（事务 · 退订不拦：安全凭证 ≠ 营销）
  otp_code: {
    id: 'otp_code',
    kind: 'transactional',
    respectUnsubscribe: false,
    defaultMaxAttempts: 3,
    render({ payload, env }) {
      const brand = brandOf(env);
      const code = str(payload, 'code', '------');
      const ttl = str(payload, 'ttlMinutes', '10');
      const html = wrap(
        brand,
        `${brand} · 登录验证码`,
        [
          `<p style="margin:0 0 12px;font-size:14px;">你的验证码是：</p>`,
          `<p style="margin:0 0 12px;font-size:28px;font-weight:700;letter-spacing:6px;text-align:center;color:#7c5cff;">${code}</p>`,
          `<p style="margin:0 0 12px;font-size:12px;color:#6b7280;">${ttl} 分钟内有效。若非本人操作，请忽略本邮件并及时修改密码。</p>`,
        ].join(''),
        '请勿将验证码告知任何人，TempoSoul 客服不会向你索取验证码。',
      );
      const text = [
        `${brand} · 登录验证码`,
        '',
        `你的验证码是：${code}`,
        `${ttl} 分钟内有效。若非本人操作，请忽略本邮件并及时修改密码。`,
        '',
        '请勿将验证码告知任何人，TempoSoul 客服不会向你索取验证码。',
      ].join('\n');
      return { subject: `[${brand}] 登录验证码 ${code}`, html, text };
    },
  },

  // 4. 找回密码（事务 · 退订不拦）
  password_reset: {
    id: 'password_reset',
    kind: 'transactional',
    respectUnsubscribe: false,
    defaultMaxAttempts: 5,
    render({ payload, env }) {
      const brand = brandOf(env);
      const resetUrl = str(payload, 'resetUrl');
      const ttl = str(payload, 'ttlMinutes', '30');
      const html = wrap(
        brand,
        `${brand} · 重置密码`,
        [
          `<p style="margin:0 0 12px;font-size:14px;">我们收到了重置密码的请求。点击下面的按钮设置新密码（${ttl} 分钟内有效）：</p>`,
          cta(resetUrl, '重置我的密码'),
          `<p style="margin:0 0 12px;font-size:12px;color:#6b7280;">若非本人操作请忽略本邮件，你的密码不会发生任何变化。</p>`,
        ].join(''),
        '请勿转发本邮件，链接包含你的专属重置凭证。',
      );
      const text = [
        `${brand} · 重置密码`,
        '',
        `我们收到了重置密码的请求。访问以下链接设置新密码（${ttl} 分钟内有效）：`,
        resetUrl,
        '',
        '若非本人操作请忽略本邮件，你的密码不会发生任何变化。',
        '',
        '请勿转发本邮件，链接包含你的专属重置凭证。',
      ].join('\n');
      return { subject: `[${brand}] 重置密码`, html, text };
    },
  },

  // 5. 深度报告投递（事务 · 退订不拦：已付费交付物）
  report_delivery: {
    id: 'report_delivery',
    kind: 'transactional',
    respectUnsubscribe: false,
    defaultMaxAttempts: 6,
    render({ payload }) {
      return renderReportDeliveryMail(str(payload, 'reportUrl'));
    },
  },
};

export const MAIL_FLOW_IDS = Object.keys(FLOW_POLICIES) as MailFlowId[];

export function isMailFlowId(value: unknown): value is MailFlowId {
  return typeof value === 'string' && value in FLOW_POLICIES;
}

export function getFlowPolicy(flow: MailFlowId): FlowPolicy {
  return FLOW_POLICIES[flow];
}

/** 装配一封邮件（纯函数，便于测试与复用） */
export function renderMail(
  flow: MailFlowId,
  to: string,
  payload: Record<string, unknown>,
  env: MailRenderInput['env'],
): RenderedMail {
  return FLOW_POLICIES[flow].render({ to, payload, env });
}
