import { memo } from 'react';

interface DisclaimerInlineProps {
  variant?: 'report' | 'dimension';
}

function DisclaimerInlineBase({ variant = 'report' }: DisclaimerInlineProps) {
  const text =
    variant === 'report'
      ? '本报告基于传统命理体系与算法推演，用于自我觉察与生活参考，不构成医疗、法律、投资建议，也不预测命运。'
      : '以上内容为传统体系解读，仅供自我参考，请结合现实情况独立判断。';
  return (
    <p
      role="note"
      style={{
        color: '#8B949E',
        fontSize: 12,
        lineHeight: 1.6,
        margin: '12px 0',
        paddingLeft: 10,
        borderLeft: '3px solid #30363D',
      }}
    >
      {text}
    </p>
  );
}

export const DisclaimerInline = memo(DisclaimerInlineBase);
export default DisclaimerInline;
