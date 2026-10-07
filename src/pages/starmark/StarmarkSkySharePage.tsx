/**
 * StarmarkSkySharePage —— A7 StarMark 星空证书复现页（/starmark/sky/:cert_id）
 *
 * 路由：/starmark/sky/:cert_id（cert_id = sky_id，Base32 8 位）
 *
 * 设计说明（如实）：
 *  - 同参数复现能力由 src/lib/starmark/reproduce.ts 提供（内存证书库 sky_id→同参数重渲染）。
 *  - 但 L1 渲染链 renderer-l1 → pixel-surface 顶层依赖 pngjs / Node Buffer，
 *    【不进入浏览器包】（否则 vite build 会把 Node 原生模块打进前端包而失败）。
 *  - 因此本前端页为「证书落地占位页」：展示 cert_id、说明复现契约与待接线项，
 *    【不渲染假星空、不伪造星点】。真正的服务端复现（KV 持久化证书库 +
 *    /api/starmark/sky/:cert_id 出图端点）留待后续接线批次。
 */
import { useParams } from 'react-router-dom';

export function StarmarkSkySharePage() {
  const { certId } = useParams<{ certId: string }>();

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '32px 20px 64px',
      }}
    >
      <p style={{ fontSize: 13, letterSpacing: 2, opacity: 0.6, margin: '0 0 8px' }}>
        星刻 StarMark
      </p>
      <h1 style={{ fontSize: 28, margin: '0 0 16px', fontWeight: 700 }}>
        星空证书复现
      </h1>

      <div
        style={{
          border: '1px dashed rgba(140, 150, 180, 0.45)',
          borderRadius: 12,
          padding: '24px',
          background: 'rgba(255,255,255,0.03)',
          marginBottom: 20,
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.8 }}>
          证书编号（sky_id）：
        </p>
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1,
            fontFamily: 'monospace',
          }}
        >
          {certId ? certId : '（未提供 cert_id）'}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.8,
            opacity: 0.7,
          }}
        >
          本页为同参数复现落地位。依据复现契约：以 sky_id 取回生成时的观测参数，
          在服务端按同算法重渲染，应得到与原始证书逐星一致的星空快照；
          若参数被篡改，复算快照必然不符，并提示「参数已被修改」。
        </p>
      </div>

      <div
        style={{
          padding: '16px 18px',
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.8,
          opacity: 0.75,
          background: 'rgba(230,180,90,0.08)',
          border: '1px solid rgba(230,180,90,0.35)',
        }}
      >
        <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'rgba(240,200,120,0.95)' }}>
          待接线标注
        </p>
        <p style={{ margin: '0 0 6px' }}>
          · 当前 L1 出图依赖服务端软件渲染（pngjs），未在浏览器侧渲染星空图像；
        </p>
        <p style={{ margin: '0 0 6px' }}>
          · 证书库为 P0 进程内内存实现，冷启动后无历史证书，持久化（KV）待接；
        </p>
        <p style={{ margin: 0 }}>
          · 正式证书出图端点 /api/starmark/sky/:cert_id 与分享版式留后续批次（当前显示本页内嵌说明）。
        </p>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
        仅供娱乐参考，不构成任何决策建议。
      </p>
    </div>
  );
}

export default StarmarkSkySharePage;
