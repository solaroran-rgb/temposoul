/**
 * A9-诸葛神数：起数过程追踪条（本地侧补交：A 交付引用但未提供）
 * 展示起数规则的确定性过程（可复算、无隐藏随机），enabled=false 时隐藏。
 */

export function ZhugeCalculationTrace({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  const steps = ['输入 → 笔画数汇总', '除 384 取余 → 0–383 签号', '按签号取签文'];
  return (
    <details className="zhuge-trace" aria-label="起数过程">
      <summary className="zhuge-trace__summary">起数规则（可复算）</summary>
      <ol className="zhuge-trace__steps">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p className="zhuge-trace__note">规则公开、结果确定，不采用不可复现的隐藏随机。</p>
    </details>
  );
}
