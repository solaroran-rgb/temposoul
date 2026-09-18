import { useState } from 'react';

export default function SolutionTestPage() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h2>解盘引擎测试页</h2>
      <p>点击按钮测试</p>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px 20px', fontSize: 16 }}>
        计数: {count}
      </button>
    </div>
  );
}
