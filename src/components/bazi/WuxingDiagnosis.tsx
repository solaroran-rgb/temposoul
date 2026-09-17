// A11-1 · src/components/bazi/WuxingDiagnosis.tsx · 五行诊断
export interface WuxingDiagnosisProps {
  missing: string[];
  dominant: string[];
  ruleBasis: string[];
}

export function WuxingDiagnosis({ missing, dominant, ruleBasis }: WuxingDiagnosisProps) {
  return (
    <div className="ts-wuxing-diagnosis">
      <section className="ts-wuxing-diagnosis__block">
        <h3 className="ts-card__subtitle">缺失五行</h3>
        {missing.length > 0 ? (
          <p className="ts-wuxing-diagnosis__value">{missing.join('、')}</p>
        ) : (
          <p className="ts-wuxing-diagnosis__value ts-wuxing-diagnosis__value--empty">
            五行齐备，宜保持平衡
          </p>
        )}
      </section>
      <section className="ts-wuxing-diagnosis__block">
        <h3 className="ts-card__subtitle">过旺五行</h3>
        {dominant.length > 0 ? (
          <p className="ts-wuxing-diagnosis__value">{dominant.join('、')}</p>
        ) : (
          <p className="ts-wuxing-diagnosis__value ts-wuxing-diagnosis__value--empty">无明显过旺</p>
        )}
      </section>
      {ruleBasis.length > 0 && (
        <details className="ts-wuxing-diagnosis__details">
          <summary>判定规则（引擎口径）</summary>
          <ul>
            {ruleBasis.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default WuxingDiagnosis;
