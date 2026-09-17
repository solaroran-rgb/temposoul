import React, { useState } from 'react';
import { z } from 'zod';

const dsarSchema = z.object({
  requestType: z.enum(['export', 'delete']),
  email: z.string().email('请输入有效的电子邮箱格式'),
  description: z.string().min(10, '请简要说明您的请求（至少10个字符）'),
});

export const DsarRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    requestType: 'export' as 'export' | 'delete',
    email: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [mailTriggered, setMailTriggered] = useState(false);

  const generateMailContent = () => {
    return `请求类型: ${formData.requestType === 'export' ? '数据导出' : '账户删除'}\n联系邮箱: ${formData.email}\n简要说明: ${formData.description}`;
  };

  const validate = () => {
    const result = dsarSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return null;
    }
    setErrors({});
    return result.data;
  };

  const handleCopy = () => {
    if (!validate()) return;
    navigator.clipboard
      .writeText(generateMailContent())
      .catch(() => {
        alert('复制失败，请手动复制');
      })
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
  };

  const handleMailto = () => {
    const data = validate();
    if (!data) return;

    const subject = encodeURIComponent(`DSAR Request: ${data.requestType}`);
    const body = encodeURIComponent(generateMailContent());
    window.location.href = `mailto:support@temposoul.com?subject=${subject}&body=${body}`;
    setMailTriggered(true);
    setTimeout(() => setMailTriggered(false), 4000);
  };

  return (
    <div className="dsar-form">
      <h3 className="form-title">数据主体访问请求 (DSAR)</h3>
      <p className="form-notice">
        当前 DSAR 请求需通过邮件人工处理，我们承诺在收到邮件后 30 天内回复。
      </p>

      <div className="form-group">
        <label className="form-label">请求类型</label>
        <select
          className={`form-select ${errors.requestType ? 'form-input--error' : ''}`}
          value={formData.requestType}
          onChange={(e) =>
            setFormData({ ...formData, requestType: e.target.value as 'export' | 'delete' })
          }
          aria-invalid={!!errors.requestType}
        >
          <option value="export">数据导出</option>
          <option value="delete">账户删除</option>
        </select>
        {errors.requestType && <span className="form-error">{errors.requestType}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">联系邮箱</label>
        <input
          type="email"
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">简要说明</label>
        <textarea
          className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          aria-invalid={!!errors.description}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      {mailTriggered && (
        <p className="form-success">
          已尝试打开您的邮件客户端，如未响应，请使用下方“一键复制”功能。
        </p>
      )}

      <div className="dsar-form__actions">
        <button type="button" className="btn btn-secondary" onClick={handleCopy}>
          {copied ? '✅ 已复制模板' : '📋 一键复制邮件模板'}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleMailto}>
          ✉️ 唤起邮件客户端发送
        </button>
      </div>
    </div>
  );
};
export default DsarRequestForm;
