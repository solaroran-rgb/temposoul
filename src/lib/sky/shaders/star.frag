// src/lib/sky/shaders/star.frag
// 圆形软边光点，叠加混合

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;

  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, vAlpha * glow);
}