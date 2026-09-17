import { sendMail, isMailConfigured } from '../mailer';
import type { ReportTask } from './state-machine';

export async function deliverReportEmail(
  env: Env,
  task: ReportTask,
  reportUrl: string,
): Promise<void> {
  if (!isMailConfigured(env)) {
    console.warn('[Email] Mailer not configured, skipping delivery.');
    return;
  }

  // Read user email from sub record or fallback
  const subRaw = await env.AUTH_KV.get(`sub:${task.userId}`);
  const subData = subRaw ? JSON.parse(subRaw) : {};
  const email = subData.email;

  if (!email) {
    console.warn(`[Email] No email found for user ${task.userId}, skipping.`);
    return;
  }

  try {
    await sendMail(env, {
      to: email,
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
    });
  } catch (e) {
    // Failure must not block state machine
    console.error(
      `[Email] Failed to deliver report email for task ${task.id}:`,
      e instanceof Error ? e.message : String(e),
    );
  }
}
