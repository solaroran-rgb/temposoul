/**
 * 发送通道抽象：mock（日志）↔ Resend（真实）
 *
 * 切换方式：环境变量配齐 RESEND_API_KEY + MAIL_FROM 后自动走 Resend，
 * 否则走 mock 日志。业务代码只依赖 MailProvider 接口，key 到位零改动。
 */

import { isMailConfigured, sendMail } from '../mailer';
import type { MailerEnv } from '../mailer';
import type { RenderedMail } from './types';

export interface OutgoingMail extends RenderedMail {
  to: string;
  flow: string;
}

export type SendOutcome = { ok: true } | { ok: false; error: string };

export interface MailProvider {
  /** 通道名，写入日志便于分辨 mock / 真实 */
  readonly name: 'mock' | 'resend';
  send(mail: OutgoingMail): Promise<SendOutcome>;
}

/** mock 日志前缀（统一口径，便于 grep 排查） */
export const MOCK_LOG_PREFIX = '[mail-mock]';

/** mock 发送：只写结构化日志，不发起任何网络请求 */
export function createMockProvider(): MailProvider {
  return {
    name: 'mock',
    async send(mail) {
      console.log(
        `${MOCK_LOG_PREFIX} flow=${mail.flow} to=${mail.to} subject=${JSON.stringify(mail.subject)} text=${JSON.stringify(mail.text.slice(0, 200))}`,
      );
      return { ok: true };
    },
  };
}

export function createResendProvider(env: MailerEnv): MailProvider {
  return {
    name: 'resend',
    async send(mail) {
      const r = await sendMail(env, {
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
      return r.ok ? { ok: true } : { ok: false, error: r.error };
    },
  };
}

/** 按 env 自动选择通道：配齐即真实，否则 mock */
export function createMailProvider(env: MailerEnv): MailProvider {
  return isMailConfigured(env) ? createResendProvider(env) : createMockProvider();
}
