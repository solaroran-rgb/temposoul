/**
 * 全息光学视觉 Token 体系 (Single Source of Truth)
 * 严格遵循附录 A 约束、第二轮 C4/C5/D6 裁定及第三轮 R-E4-2 修复指令
 */
export const HOLOGRAPHIC_TOKENS = {
  // 1. 背景与网格
  'bg-void': '#000000',             
  'grid-dark': 'rgba(0, 229, 255, 0.08)', 

  // 2. 青蓝发光族
  'cyan-core': '#00E5FF',           
  'cyan-glow': 'rgba(0, 229, 255, 0.35)', 
  'cyan-dim': '#008B99',            
  'cyan-constellation': 'rgba(77, 208, 225, 0.40)', // D2 裁定 alpha 0.40

  // 3. 文本
  'text-bright': '#FFFFFF',         
  'text-dim': 'rgba(255, 255, 255, 0.60)', 

  // 4. 暖橙点缀 (C4 裁定：全局 < 1%)
  'accent-warm': '#FF8C00',         

  // 5. 排版 (补齐第 10 键，供 CSS 注入)
  'font-mono': "'JetBrains Mono', 'Space Grotesk', monospace",
} as const;

export type HolographicTokenKey = keyof typeof HOLOGRAPHIC_TOKENS;

/**
 * D6 裁定：Shader Uniform 别名映射
 * 供 E1 (CELESTIAL) 与 E3 (REALTIME) 在 GLSL 中引用
 */
export const UNIFORM_ALIASES = {
  uColorCore: HOLOGRAPHIC_TOKENS['cyan-core'],
  uColorWhite: HOLOGRAPHIC_TOKENS['text-bright'],
  uColorWarm: HOLOGRAPHIC_TOKENS['accent-warm'],
  uColorDim: HOLOGRAPHIC_TOKENS['cyan-dim'],
  uColorConstellation: HOLOGRAPHIC_TOKENS['cyan-constellation'],
  uColorBlue: HOLOGRAPHIC_TOKENS['cyan-core'], 
} as const;

/**
 * 初始化注入：在应用入口调用，将 TS 常量同步为 CSS Variables
 */
export function injectHolographicTokens() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(HOLOGRAPHIC_TOKENS).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}