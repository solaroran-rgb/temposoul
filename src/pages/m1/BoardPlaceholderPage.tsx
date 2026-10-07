/**
 * BoardPlaceholderPage —— 波2·M1 零路由板块「最小可渲染占位页」
 *
 * 用途：为已就绪引擎但尚未接线内容的板块（X1-D 系列）提供一个可路由、
 *       可渲染、文案明确的落地页。本页【不产生任何真实排盘结果/假数据】，
 *       仅做：中文标题 + 板块说明 + 结果占位区 + 「内容模板待填充」明确标注。
 *
 * 纪律：
 *  - 不伪装真实盘面（不调用任何算法、不渲染假星盘/假卦象）。
 *  - 所有文案中文；结果区为空占位，等待后续内容模板填充。
 *  - 本组件由 src/router/M1Routes.tsx 按板块配置逐一路由渲染（同 SeoListPage topic 模式）。
 */
interface BoardPlaceholderPageProps {
  /** 板块 slug（路由段），如 taiyi / qimen / liuyao */
  slug: string;
  /** 板块中文名（标题） */
  title: string;
  /** 所属栏目分类（占卜/三式/术数/风水/合参…） */
  category: string;
  /** 板块一句话说明（中文） */
  description: string;
}

export function BoardPlaceholderPage({
  slug,
  title,
  category,
  description,
}: BoardPlaceholderPageProps) {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '32px 20px 64px',
        color: 'inherit',
      }}
    >
      <p
        style={{
          fontSize: 13,
          letterSpacing: 2,
          opacity: 0.6,
          margin: '0 0 8px',
        }}
      >
        {category}
      </p>
      <h1 style={{ fontSize: 30, margin: '0 0 12px', fontWeight: 700 }}>{title}</h1>
      <p style={{ fontSize: 15, lineHeight: 1.8, opacity: 0.85, margin: '0 0 24px' }}>
        {description}
      </p>

      {/* 结果占位区：明确标注「内容模板待填充」，不放任何假数据 */}
      <div
        style={{
          border: '1px dashed rgba(140, 150, 180, 0.45)',
          borderRadius: 12,
          padding: '36px 24px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600 }}>
          结果占位区
        </p>
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 13,
            opacity: 0.65,
            lineHeight: 1.7,
          }}
        >
          本板块引擎层已就绪，页面外壳已打通路由；
          <br />
          当前为最小可渲染占位页，尚未接入排盘结果与交互表单。
        </p>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 12,
            border: '1px solid rgba(230, 180, 90, 0.5)',
            color: 'rgba(240, 200, 120, 0.95)',
          }}
        >
          内容模板待填充
        </span>
      </div>

      <p
        style={{
          marginTop: 20,
          fontSize: 12,
          opacity: 0.5,
          lineHeight: 1.7,
        }}
      >
        板块标识：{slug} ｜ 仅供娱乐参考，不构成任何决策建议。
      </p>
    </div>
  );
}

export default BoardPlaceholderPage;
