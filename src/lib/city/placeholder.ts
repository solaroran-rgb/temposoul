import * as THREE from "three";
import { seededRandom } from "./seed";
import { COVERAGE, snapToCell } from "./projection";
import { CITY_CONFIG } from "./config";
// ⚠ E4 对接点（I4 集成适配）：E4 单源为字符串 token（hex / rgba），此处转换为 THREE.Color。
import { HOLOGRAPHIC_TOKENS } from "../../theme/holographic-tokens";
const cyanCore = new THREE.Color(HOLOGRAPHIC_TOKENS["cyan-core"]);
const cyanDim = new THREE.Color(HOLOGRAPHIC_TOKENS["cyan-dim"]);
const gridLine = new THREE.Color(HOLOGRAPHIC_TOKENS["grid-dark"]);

/** 仅含 position attribute 的非索引 LineSegments 几何合并（零 jsm 依赖） */
export function mergeLineGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let total = 0;
  for (const g of geos) total += (g.attributes.position as THREE.BufferAttribute).count;
  const arr = new Float32Array(total * 3);
  let off = 0;
  for (const g of geos) {
    const p = g.attributes.position as THREE.BufferAttribute;
    arr.set(p.array as Float32Array, off);
    off += p.count * 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return out;
}

function lineMat(color: number | THREE.Color, opacity: number): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color, transparent: true, opacity,
    depthWrite: false, blending: THREE.AdditiveBlending,
  });
}

interface RoadSeg { x0: number; z0: number; x1: number; z1: number }

/**
 * seeded 全息占位城 v2（B4 三要素：确定性 / 结构仿真实 / SCHEMATIC 信号）。
 * 伪路网骨架（主干十字 + 次级网格）→ 建筑沿街条带分布（"沿街"格式塔，非随机撒点）。
 * 零暖橙（C4：主焦点唯一 = 小人脚下，归 E3/E4，占位城不得抢占）。
 * userData.schematic=true 供 HUD 角标（文案 + i18n 归 E4）。
 */
export function buildPlaceholderCity(seedKey: string, mobile: boolean): THREE.Group {
  const rnd = seededRandom("temposoul:" + seedKey);
  const group = new THREE.Group();
  group.name = "placeholder-city";

  // 1) 暗网格
  const grid = new THREE.GridHelper(COVERAGE * 2, mobile ? 12 : 24, gridLine, gridLine);
  const gm = grid.material as THREE.LineBasicMaterial;
  gm.transparent = true; gm.opacity = 0.10; gm.depthWrite = false;
  gm.blending = THREE.AdditiveBlending;
  grid.name = "ph-grid";
  group.add(grid);

  // 2) 噪声地形（F7 修复：振幅 ×0.8 且基准 -0.05，恒低于路网 y=0.10，无穿插）
  const seg = mobile ? 20 : 40;
  const terrGeo = new THREE.PlaneGeometry(COVERAGE * 2, COVERAGE * 2, seg, seg);
  terrGeo.rotateX(-Math.PI / 2);
  const gp = new Float32Array(256);
  for (let i = 0; i < 256; i++) gp[i] = rnd.next();
  const tPos = terrGeo.attributes.position as THREE.BufferAttribute;
  const fade = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number, z: number) => {
    const at = (ix: number, iz: number) =>
      gp[(((ix % 16) + 16) % 16) * 16 + (((iz % 16) + 16) % 16)];
    const x0 = Math.floor(x), z0 = Math.floor(z);
    const tx = fade(x - x0), tz = fade(z - z0);
    return (at(x0, z0) * (1 - tx) + at(x0 + 1, z0) * tx) * (1 - tz) +
           (at(x0, z0 + 1) * (1 - tx) + at(x0 + 1, z0 + 1) * tx) * tz;
  };
  for (let i = 0; i < tPos.count; i++) {
    const x = tPos.getX(i), z = tPos.getZ(i);
    const edge = Math.min(1, Math.max(0, (Math.hypot(x, z) - COVERAGE * 0.5) / (COVERAGE * 0.5)));
    tPos.setY(i, -0.05 + (noise(x / 40, z / 40) - 0.5) * 2.4 * edge * edge);
  }
  const terr = new THREE.LineSegments(new THREE.WireframeGeometry(terrGeo), lineMat(cyanDim, 0.06));
  terrGeo.dispose();
  terr.name = "ph-terrain";
  group.add(terr);

  // 3) 伪路网骨架：主干十字（带抖动）+ 次级平行网格
  const roads: RoadSeg[] = [];
  const jitter = () => rnd.range(-12, 12);
  const za = jitter(), zb = jitter(), xa = jitter(), xb = jitter();
  roads.push({ x0: -COVERAGE, z0: za, x1: COVERAGE, z1: zb });   // 主干东西
  roads.push({ x0: xa, z0: -COVERAGE, x1: xb, z1: COVERAGE });   // 主干南北
  const offs = mobile ? [-90, 90] : [-120, -60, 60, 120];
  for (const o of offs) {
    roads.push({ x0: -COVERAGE, z0: o, x1: COVERAGE, z1: o });
    roads.push({ x0: o, z0: -COVERAGE, x1: o, z1: COVERAGE });
  }
  const roadPos: number[] = [];
  for (const r of roads) roadPos.push(r.x0, 0.10, r.z0, r.x1, 0.10, r.z1);
  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(roadPos, 3));
  const roadLines = new THREE.LineSegments(roadGeo, lineMat(cyanDim, 0.16));
  roadLines.name = "ph-roads";
  group.add(roadLines);

  // 4) 沿街建筑条带：沿路网等距采样 → 两侧偏移 → CELL 吸附去重；中心高边缘矮（高度韵律）
  const count = mobile ? CITY_CONFIG.PLACEHOLDER_COUNT_MOBILE : CITY_CONFIG.PLACEHOLDER_COUNT;
  const used = new Set<string>();
  const edgeGeos: THREE.BufferGeometry[] = [];
  const STEP = 13;
  outer:
  for (const r of roads) {
    const len = Math.hypot(r.x1 - r.x0, r.z1 - r.z0);
    if (len < 1e-6) continue;
    const dx = (r.x1 - r.x0) / len, dz = (r.z1 - r.z0) / len;
    const nx = -dz, nz = dx;   // 法向
    for (let t = STEP; t < len - STEP; t += STEP) {
      if (rnd.next() > 0.65) continue;
      for (const side of [-1, 1]) {
        if (edgeGeos.length >= count) break outer;
        if (rnd.next() > 0.6) continue;
        const off = side * rnd.range(4, 8);
        const c = snapToCell({ x: r.x0 + dx * t + nx * off, z: r.z0 + dz * t + nz * off });
        const key = `${c.x},${c.z}`;
        if (used.has(key)) continue;
        used.add(key);
        const rad = Math.hypot(c.x, c.z) / COVERAGE;
        const hMul = 1.3 - 0.6 * Math.min(1, rad);   // 中心高、边缘矮
        const w = rnd.range(4, 9), d = rnd.range(4, 9), h = rnd.range(2, 14) * hMul;
        const box = new THREE.BoxGeometry(w, h, d);
        box.translate(c.x, h / 2, c.z);
        edgeGeos.push(new THREE.EdgesGeometry(box));
        box.dispose();
      }
    }
  }
  if (edgeGeos.length) {
    const bLines = new THREE.LineSegments(mergeLineGeometries(edgeGeos), lineMat(cyanCore, 0.30));
    bLines.name = "ph-buildings";
    group.add(bLines);
  }
  edgeGeos.forEach((g) => g.dispose());

  // 5) 河流（1~2 条贝塞尔双线）
  const riverPos: number[] = [];
  const rivers = rnd.next() < 0.5 ? 2 : 1;
  for (let k = 0; k < rivers; k++) {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-COVERAGE, 0, rnd.range(-COVERAGE * 0.7, COVERAGE * 0.7)),
      new THREE.Vector3(-COVERAGE * 0.3, 0, rnd.range(-COVERAGE * 0.8, COVERAGE * 0.8)),
      new THREE.Vector3(COVERAGE * 0.3, 0, rnd.range(-COVERAGE * 0.8, COVERAGE * 0.8)),
      new THREE.Vector3(COVERAGE, 0, rnd.range(-COVERAGE * 0.7, COVERAGE * 0.7)),
    );
    for (const off of [-0.75, 0.75]) {
      let px = 0, pz = 0;
      for (let i = 0; i <= 48; i++) {
        const p = curve.getPoint(i / 48);
        const tg = curve.getTangent(i / 48).normalize();
        const cx = p.x - tg.z * off, cz = p.z + tg.x * off;
        if (i > 0) riverPos.push(px, 0.12, pz, cx, 0.12, cz);
        px = cx; pz = cz;
      }
    }
  }
  if (riverPos.length) {
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute("position", new THREE.Float32BufferAttribute(riverPos, 3));
    const rLines = new THREE.LineSegments(rGeo, lineMat(cyanDim, 0.14));
    rLines.name = "ph-rivers";
    group.add(rLines);
  }

  // SCHEMATIC 信号：HUD 角标文案归 E4（D2/D3），此处仅置 userData 标志
  group.userData = { schematic: true };
  return group;
}
