// src/lib/sky/shaders/star.vert
// attribute: position (vec3, 天球坐标), aMag (float), aCi (float)
// uniform: uMagLimit, uDpr, uTime
// varying: vAlpha, vColor

attribute float aMag;
attribute float aCi;

uniform float uMagLimit;
uniform float uDpr;
uniform float uTime;

varying float vAlpha;
varying vec3 vColor;

vec3 bvToRgb(float bv) {
  float t = clamp((bv + 0.4) / 2.0, 0.0, 1.0);
  vec3 cool = vec3(0.60, 0.75, 1.00);
  vec3 mid  = vec3(1.00, 1.00, 1.00);
  vec3 warm = vec3(1.00, 0.85, 0.65);
  vec3 red  = vec3(1.00, 0.60, 0.40);
  if (t < 0.33) return mix(cool, mid, t / 0.33);
  if (t < 0.66) return mix(mid, warm, (t - 0.33) / 0.33);
  return mix(warm, red, (t - 0.66) / 0.34);
}

void main() {
  // 超出星等上限：丢到裁剪空间外，零碎片开销
  if (aMag > uMagLimit) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    vColor = vec3(0.0);
    return;
  }

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;

  float brightness = pow(10.0, -0.4 * (aMag - uMagLimit));
  float size = clamp(2.2 * brightness, 0.5, 5.0) * uDpr;
  gl_PointSize = size;

  float flicker = 0.9 + 0.1 * sin(uTime * 2.0 + aMag * 10.0);
  vAlpha = clamp(brightness, 0.0, 1.0) * flicker;
  vColor = bvToRgb(aCi);
}