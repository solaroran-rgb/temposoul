/**
 * starShader.ts —— E1 交付星点 GLSL（契约表 §2.1-§2.4 终版）
 * 集成补丁（主审，按 E3 glowPoint 工厂契约 + 集成核对点②）：
 *   - vertex 补 uGlobalFade 声明 + vAlpha 乘入（D4 入场）
 *   - vertex 补地平线以下淡出（消除遮挡盘）
 * 输出形态：{ vertexShader, fragmentShader }（E3 P1 import 契约）
 */
export const STAR_GLSL = {
  vertexShader: `
// SkyScene.ts 内联 - 星点 vertexShader
// attribute: position (vec3, 天球坐标), aMag (float), aCi (float)
// uniform: uMagLimit, uDpr, uTime, uFlickerAmp, uCrossMag, uGlobalFade,
//          uColorBlue, uColorWhite, uColorWarm
//          （全部由 E3 renderTokens 从 E4 holographic-tokens 注入）
// varying: vAlpha, vColor, vIsBright

attribute float aMag;
attribute float aCi;

uniform float uMagLimit;
uniform float uDpr;
uniform float uTime;
uniform float uFlickerAmp;
uniform float uCrossMag;
uniform float uGlobalFade; // 集成补丁（E3 契约核对点② + D4 入场）

uniform vec3 uColorBlue;
uniform vec3 uColorWhite;
uniform vec3 uColorWarm;

varying float vAlpha;
varying vec3 vColor;
varying float vIsBright;

// 契约表 §2.2：BV -> RGB 分段 mix，含 K/M ×0.7
vec3 bvToRgb(float bv) {
  if (bv < 0.0) {
    return uColorBlue;
  }
  if (bv < 0.4) {
    float t = bv / 0.4;
    return mix(uColorBlue, uColorWhite, t);
  }
  if (bv < 0.8) {
    return uColorWhite;
  }
  if (bv < 1.4) {
    float t = (bv - 0.8) / 0.6;
    return mix(uColorWhite, uColorWarm, t) * 0.7;
  }
  return uColorWarm * 0.7;
}

// 契约表 §2.2：M 型（BV >= 1.4）额外 alpha ×0.6
float bvAlphaScale(float bv) {
  return bv >= 1.4 ? 0.6 : 1.0;
}

void main() {
  // 超星等上限：丢到裁剪空间外
  if (aMag > uMagLimit) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    vColor = vec3(0.0);
    vIsBright = 0.0;
    return;
  }

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;

  // 契约表 §2.1：clamp(2.4 * pow(b, 0.62), 0.65, 6.0) * uDpr
  float brightness = pow(10.0, -0.4 * (aMag - uMagLimit));
  float size = clamp(2.4 * pow(brightness, 0.62), 0.65, 6.0) * uDpr;

  // 契约表 §2.4：亮星触发十字衍射，point size 放大 1.6×
  // 契约表 §2.4 关闭条件：uCrossMag = -99.0
  float isBright = aMag < uCrossMag ? 1.0 : 0.0;
  float sizeMultiplier = (isBright > 0.5) ? 1.6 : 1.0;
  gl_PointSize = size * sizeMultiplier;

  // 契约表 §2.3：uFlickerAmp = 0.0 时物理关闭闪烁（表达式退化为 1.0）
  float flicker = (1.0 - uFlickerAmp) + uFlickerAmp * sin(uTime * 2.0 + aMag * 10.0);

  vAlpha = clamp(brightness, 0.0, 1.0) * flicker * bvAlphaScale(aCi);
  // 集成补丁（E3 glowPoint 契约核对点②）：D4 入场 + 地平线以下淡出（消除遮挡盘）
  vAlpha *= uGlobalFade;
  vAlpha *= smoothstep(-0.015, 0.02, position.y / 500.0);
  vColor = bvToRgb(aCi);
  vIsBright = isBright;
}

  `,
  fragmentShader: `
// SkyScene.ts 内联 - 星点 fragmentShader
// 亮核 + 十字衍射分离；亮星 point size 已放大 1.6×，
// 因此亮核半径 = 0.5 / 1.6 ≈ 0.3125（相对 point 坐标）

varying float vAlpha;
varying vec3 vColor;
varying float vIsBright;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;

  // 亮核：原尺寸的软边圆点
  float coreGlow = smoothstep(0.5, 0.0, d);

  float alpha = vAlpha * coreGlow;

  // 十字衍射：仅亮星（vIsBright > 0.5）
  // 亮核半径 0.3125；十字臂延伸到 point 边界
  if (vIsBright > 0.5) {
    float coreRadius = 0.3125;
    // 臂宽：abs(uv.axis) * 12.0 -> 臂半径约 0.042
    float armH = smoothstep(0.5, 0.0, abs(uv.y) * 12.0);
    float armV = smoothstep(0.5, 0.0, abs(uv.x) * 12.0);
    // 限制在 point 内
    float inPoint = step(d, 0.5);
    float cross = max(armH, armV) * inPoint * 0.15;
    // 亮核 + 十字取较大者，避免叠加过曝
    float coreFalloff = smoothstep(coreRadius, 0.0, d);
    alpha = vAlpha * max(coreFalloff, cross);
  }

  gl_FragColor = vec4(vColor, alpha);
}

  `,
} as const;
