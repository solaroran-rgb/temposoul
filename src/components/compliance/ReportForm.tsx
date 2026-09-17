import React, { useState } from 'react';
import { z } from 'zod';

const reportSchema = z.object({
  type: z.enum(['content', 'behavior', 'other']),
  description: z.string().min(10, '请详细描述问题（至少10个字符）'),
  contact: z.string().optional(),
});

export const ReportForm: React.FC = () => {
  const [formData, setFormData] = useState({
    type: 'content' as 'content' | 'behavior' | 'other',
    description: '',
    contact: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = reportSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 决策 26/24：绝不伪造后端成功态，明确告知仅为本地暂存
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="report-form report-form--success">
        <h3 className="form-title">反馈已暂存</h3>
        <p className="text-secondary">
          您的反馈内容已暂存于当前浏览器。由于在线举报系统正在升级中 (P1
          接入)，请通过邮件发送以完成正式提交。
        </p>
        <a
          href="mailto:support@temposoul.com?subject=投诉举报"
          className="btn btn-primary"
          style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}
        >
          前往邮件发送
        </a>
        <button
          className="btn btn-secondary"
          style={{ marginLeft: '1rem' }}
          onClick={() => setSubmitted(false)}
        >
          返回重新填写
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="report-form" noValidate>
      <h3 className="form-title">投诉与举报意向登记</h3>
      <p className="form-notice">我们重视您的反馈。当前为前端意向暂存，P1 将接入在线举报系统。</p>

      <div className="form-group">
        <label className="form-label">举报类型</label>
        <select
          className={`form-select ${errors.type ? 'form-input--error' : ''}`}
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as 'content' | 'behavior' | 'other' })
          }
          aria-invalid={!!errors.type}
        >
          <option value="content">违规内容</option>
          <option value="behavior">不当行为</option>
          <option value="other">其他</option>
        </select>
        {errors.type && <span className="form-error">{errors.type}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">详细描述 *</label>
        <textarea
          className={`form-textarea ${errors.description ? 'form-input--error' : ''}`}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          aria-invalid={!!errors.description}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">联系方式 (选填)</label>
        <input
          type="text"
          className="form-input"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          placeholder="邮箱或电话，以便我们向您反馈处理结果"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        暂存并获取邮件模板
      </button>
    </form>
  );
};
export default ReportForm;
