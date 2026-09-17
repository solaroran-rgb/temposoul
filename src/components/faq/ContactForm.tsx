// D9-1
// src/components/faq/ContactForm.tsx
import React, { useState } from 'react';
import { z } from 'zod';

const contactSchema = z.object({
  subject: z.string().min(2, '主题至少 2 个字符'),
  email: z.string().email('请输入有效的邮箱'),
  description: z.string().min(10, '详细描述至少 10 个字符'),
});

export const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ subject: '', email: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [mailTriggered, setMailTriggered] = useState(false);

  const generateContent = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'Unknown';
    const ua = typeof window !== 'undefined' ? navigator.userAgent : 'Unknown';
    return `主题: ${form.subject}\n邮箱: ${form.email}\n当前页面: ${url}\n浏览器: ${ua}\n\n详细描述:\n${form.description}`;
  };

  const validate = () => {
    const res = contactSchema.safeParse(form);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return null;
    }
    setErrors({});
    return res.data;
  };

  const handleCopy = () => {
    if (!validate()) return;
    navigator.clipboard
      .writeText(generateContent())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        alert('复制失败，请手动复制');
      });
  };

  const handleMailto = () => {
    if (!validate()) return;
    const subject = encodeURIComponent(form.subject);
    const body = encodeURIComponent(generateContent());
    window.location.href = `mailto:support@temposoul.com?subject=${subject}&body=${body}`;
    setMailTriggered(true);
    setTimeout(() => setMailTriggered(false), 4000);
  };

  return (
    <div className="contact-form">
      <h3 className="contact-form__title">联系支持</h3>
      <p className="contact-form__notice">
        当前支持请求需通过邮件人工处理，我们承诺在 30 天内回复。
      </p>

      <div className="form-group">
        <label className="form-label">主题</label>
        <input
          className={`form-input ${errors.subject ? 'form-input--error' : ''}`}
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          aria-invalid={!!errors.subject}
        />
        {errors.subject && (
          <span className="form-error" role="alert">
            {errors.subject}
          </span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">邮箱</label>
        <input
          type="email"
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span className="form-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">详细描述</label>
        <textarea
          className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <span className="form-error" role="alert">
            {errors.description}
          </span>
        )}
      </div>

      {mailTriggered && (
        <p className="form-success" role="status">
          已尝试打开邮件客户端，如未响应请使用下方复制功能。
        </p>
      )}

      <div className="contact-form__actions">
        <button type="button" className="btn btn-secondary" onClick={handleCopy}>
          {copied ? '✅ 已复制' : '📋 复制内容'}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleMailto}>
          ✉️ 发送邮件
        </button>
      </div>
    </div>
  );
};
