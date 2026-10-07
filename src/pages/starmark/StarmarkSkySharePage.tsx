/**
 * StarmarkSkySharePage —— A7 StarMark 星空证书复现页（/starmark/sky/:cert_id）
 *
 * 路由：/starmark/sky/:cert_id（cert_id = sky_id，Base32 8 位；隐私分享链接只放 certId，P13）
 *
 * 设计说明（如实，继承基础版纪律）：
 *  - 同参数逐星复现由 src/lib/starmark/reproduce.ts / verify.ts 提供（内存证书库 + 服务端重渲染）。
 *  - 但 L1 渲染链 renderer-l1 → pixel-surface 顶层依赖 pngjs / Node Buffer，
 *    【不进入浏览器包】（否则 vite build 会把 Node 原生模块打进前端包而失败）。
 *  - 因此本页【不在浏览器里渲染星空、不伪造星点】；它是「证书落地 + 复现契约 + 参数明细」页：
 *    展示 cert_id、冻结的证书版本指纹（星表/算法/投影/色标/历元/时间尺度/渲染版本）、
 *    P13 隐私口径、当前上线实验变体，并埋 page_land（含 wechat_in 必埋字段）。
 *  - 真正的「输入 sky_id → 服务端同参数重渲染 → 逐星比对 → 一键截图」由服务端证书库完成，
 *    报告结构见 cert-summary.buildCertReport（可截图）；冷启动无历史证书属 P0 内存实现已知项。
 */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  STAR_CATALOG_VERSION,
  ALGORITHM_VERSION,
  TIME_SCALE,
  EPOCH,
  PROJECTION_VERSION,
  COLOR_SYSTEM,
  DEFAULT_MAG_LIMIT,
  L1_RENDER_VERSION,
  STAR_SHADER_VERSION,
  THREE_VERSION_LOCK,
} from '@/lib/starmark/version';
import { trackStarMark, STAR_MARK_EVENTS } from '@/lib/starmark/analytics';
import { getExperimentFlags } from '@/lib/starmark/experiments';
import { isWechatIn } from '@/lib/starmark/wechat';
import { buildPublicShareUrl } from '@/lib/starmark/share-url';

export function StarmarkSkySharePage() {
  const { certId } = useParams<{ certId: string }>();
  const flags = getExperimentFlags();

  // 必埋：page_land（含 wechat_in）。仅浏览器侧触发，node SSR/测试不跑。
  useEffect(() => {
    if (typeof window === 'undefined') return;
    trackStarMark(STAR_MARK_EVENTS.pageLand, {
      sky_id: certId,
      wechat_in: isWechatIn(),
      preset_type: flags.e1_formFriction,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certId]);

  const certRows: [string, string][] = [
    ['星表版本', STAR_CATALOG_VERSION],
    ['算法版本', ALGORITHM_VERSION],
    ['时间尺度', TIME_SCALE],
    ['历元', EPOCH],
    ['投影模型', PROJECTION_VERSION],
    ['色标', COLOR_SYSTEM],
    ['星等阈值', `mag ≤ ${DEFAULT_MAG_LIMIT}`],
    ['L1 渲染版本', L1_RENDER_VERSION],
    ['Shader 版本', STAR_SHADER_VERSION],
    ['three 锁定', THREE_VERSION_LOCK],
  ];

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
          依据复现契约：以 sky_id 取回生成时的观测参数，在服务端按同算法重渲染，应得到与原始证书逐星一致的星空快照；
          若参数被篡改，复算快照必然不符，并提示「参数已被修改」。对外分享链接只携带证书编号，不暴露经纬度与称谓（隐私口径）。
        </p>
      </div>

      {/* 证书内容 / 参数明细（B3 二：证书内容清单；纯版本指纹，可截图） */}
      <div
        style={{
          border: '1px solid rgba(120,150,220,0.25)',
          borderRadius: 12,
          padding: '18px 20px',
          marginBottom: 20,
        }}
      >
        <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 14 }}>证书内容（版本指纹）</p>
        {certRows.map(([k, v]) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              fontSize: 12,
              lineHeight: 2,
              borderBottom: '1px solid rgba(140,150,180,0.12)',
            }}
          >
            <span style={{ opacity: 0.6 }}>{k}</span>
            <span style={{ fontFamily: 'monospace', textAlign: 'right' }}>{v}</span>
          </div>
        ))}
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
          复现与接线说明
        </p>
        <p style={{ margin: '0 0 6px' }}>
          · 逐星复现比对（比对星数 / 超差星数 / 最大屏幕偏差）由服务端证书库出报告，结构见 cert-summary（一键可截图）；
        </p>
        <p style={{ margin: '0 0 6px' }}>
          · 当前落地变体：E1={flags.e1_formFriction}（参数预设入口）、E2={flags.e2_paywallPosition}（先预览再出墙）；
        </p>
        <p style={{ margin: 0 }}>
          · 对外分享链接：{certId ? buildPublicShareUrl(certId) : '/starmark/sky/:cert_id'}（城市级坐标，精确级需显式授权）。
        </p>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, opacity: 0.5, lineHeight: 1.7 }}>
        仅供娱乐参考，不构成任何决策建议。
      </p>
    </div>
  );
}

export default StarmarkSkySharePage;
