// 7.2 十二项特色功能清单
// InputPage 专属：在快捷入口区下方，为每个排盘项目补一句"本项特色"说明。
// 文案克制、合规（不出现医疗 / 投资 / 宿命硬断言）。
import type { CSSProperties } from 'react';

interface FeatureItem {
  name: string;
  desc: string;
}

// 条目以实际路由为准（home-shortcuts.ts + 合婚 / 每日节律）。
const FEATURES: FeatureItem[] = [
  { name: '八字', desc: '四柱十神看先天格局' },
  { name: '紫微', desc: '星曜宫位读人生节奏' },
  { name: '西占', desc: '行星相位看内在天赋' },
  { name: '合婚', desc: '双人盘对照看相处契合' },
  { name: '每日', desc: '今日宜忌与节律提示' },
  { name: '奇门', desc: '时空局象看事势方位' },
  { name: '六爻', desc: '卦象爻辞问一事之疑' },
  { name: '塔罗', desc: '牌面映照当下心绪' },
  { name: '择日', desc: '历法宜择安排重要行事' },
  { name: '测名', desc: '姓名音形义轻参考' },
  { name: '起名', desc: '音形义兼顾的取名参考' },
  { name: '月相盘', desc: '月相周期看情绪潮汐' },
];

const sectionStyle: CSSProperties = {
  margin: '0 auto 18px',
  maxWidth: 600,
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.06)',
  background: 'linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(15,23,42,0.45) 100%)',
};

const titleStyle: CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
  letterSpacing: '0.06em',
  marginBottom: 10,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
  gap: '6px 14px',
};

const itemStyle: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.6,
  color: '#64748b',
};

const nameStyle: CSSProperties = {
  color: '#cbd5e1',
  fontWeight: 600,
  marginRight: 6,
};

export function FeatureHighlights() {
  return (
    <section className="input-feature-highlights" style={sectionStyle} aria-label="本项特色">
      <div style={titleStyle}>— 十二项特色 · 各看一侧 —</div>
      <div style={gridStyle}>
        {FEATURES.map((item) => (
          <div key={item.name} style={itemStyle}>
            <span style={nameStyle}>{item.name}</span>
            {item.desc}
          </div>
        ))}
      </div>
    </section>
  );
}
