/**
 * selftest.ts —— R-E3-2 验收自测（?selftest=tokens 动态加载，独立 chunk 不进主包；验收后可整文件删除）
 * 断言值来源：第二轮契约定案（cyan-core '#00E5FF' = IMMERSIVE D1 主发光；
 * cyan-constellation 'rgba(77,208,225,0.40)' = D2/D3 定案 #4DD0E1 @ 0.40）。
 * E4 若调值，同步改断言——这是契约测试，不是快照测试。
 * 输出：console 每项 PASS/FAIL + 汇总；window.__tokenSelftest = { ...results, pass }
 */
import { rawColor, managedColor, aliasAlpha, TOKEN_ALIAS } from './renderTokens';

export function runTokenSelftest(): Record<string, boolean> {
  const R: Record<string, boolean> = {};
  const near = (a: number, b: number, eps = 1 / 255) => Math.abs(a - b) <= eps;
  try {
    const c = rawColor('uColorCore');
    R['rawColor.cyanCore(#00E5FF)'] = near(c.r, 0) && near(c.g, 0xe5 / 255) && near(c.b, 1);
  } catch (e) {
    R['rawColor.cyanCore(#00E5FF)'] = false;
    console.error(e);
  }
  try {
    R['aliasAlpha.constellation(0.40)'] = near(aliasAlpha('uColorConstellation'), 0.4, 1e-6);
  } catch (e) {
    R['aliasAlpha.constellation(0.40)'] = false;
    console.error(e);
  }
  try {
    const bg = managedColor();
    R['managedColor.bgVoid(纯黑底契约)'] =
      [bg.r, bg.g, bg.b].every(Number.isFinite) && Math.max(bg.r, bg.g, bg.b) <= 0.15; // 附录 A「底色纯黑」——同时检测错键错值（亮色必挂）
  } catch (e) {
    R['managedColor.bgVoid(纯黑底契约)'] = false;
    console.error(e);
  }
  R['aliasTable.complete'] = Object.values(TOKEN_ALIAS).every(
    (k) => typeof k === 'string' && k.length > 0,
  );
  const pass = Object.values(R).every(Boolean);
  (window as unknown as Record<string, unknown>).__tokenSelftest = { ...R, pass };
  console.log('[selftest] ' + JSON.stringify(R) + ' → ' + (pass ? 'ALL PASS' : 'FAIL'));
  return R;
}
