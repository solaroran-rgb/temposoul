/**
 * LightFun 路由：A 域轻娱乐 12 项 × 24 条子路由 + 1 个总览入口
 * 通用 LightFunTool 按 slug 渲染；总览 /lightfun → LightFunIndex
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const LightFunTool = lazy(() => import('@/pages/wiki/batch3a/LightFunTool'));
const LightFunIndex = lazy(() => import('@/pages/wiki/batch3a/LightFunIndex'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const LightFunRoutes = (
  <>
    {/* 总览入口（不计入 24 条内容路由） */}
    <Route path="/lightfun" element={wrap(<LightFunIndex />)} />

    {/* ── A-1 测字 ── */}
    <Route path="/tools/cezi" element={wrap(<LightFunTool slug="cezi" />)} />
    <Route path="/tools/cezi/:char" element={wrap(<LightFunTool slug="cezi" />)} />

    {/* ── A-2 指纹 ── */}
    <Route path="/tools/fingerprint-fun" element={wrap(<LightFunTool slug="fingerprint-fun" />)} />
    <Route
      path="/tools/fingerprint-fun/:type"
      element={wrap(<LightFunTool slug="fingerprint-fun" />)}
    />

    {/* ── A-3 生命灵数 ── */}
    <Route path="/tools/life-number" element={wrap(<LightFunTool slug="life-number" />)} />
    <Route path="/tools/life-number/:n" element={wrap(<LightFunTool slug="life-number" />)} />

    {/* ── A-4 生日密码 ── */}
    <Route path="/tools/birthday-code" element={wrap(<LightFunTool slug="birthday-code" />)} />
    <Route
      path="/tools/birthday-code/:mmdd"
      element={wrap(<LightFunTool slug="birthday-code" />)}
    />

    {/* ── A-5 生日花语 ── */}
    <Route path="/tools/birth-flower" element={wrap(<LightFunTool slug="birth-flower" />)} />
    <Route path="/tools/birth-flower/:month" element={wrap(<LightFunTool slug="birth-flower" />)} />

    {/* ── A-6 心理小测 ── */}
    <Route path="/tools/fun-psych-tests" element={wrap(<LightFunTool slug="fun-psych-tests" />)} />
    <Route
      path="/tools/fun-psych-tests/:testId"
      element={wrap(<LightFunTool slug="fun-psych-tests" />)}
    />
    <Route
      path="/tools/fun-psych-tests/:testId/result/:type"
      element={wrap(<LightFunTool slug="fun-psych-tests" />)}
    />

    {/* ── A-7 血型 ── */}
    <Route path="/tools/blood-type-fun" element={wrap(<LightFunTool slug="blood-type-fun" />)} />
    <Route
      path="/tools/blood-type-fun/:bt"
      element={wrap(<LightFunTool slug="blood-type-fun" />)}
    />

    {/* ── A-8 清宫表趣谈 ── */}
    <Route path="/tools/qinggong-fun" element={wrap(<LightFunTool slug="qinggong-fun" />)} />

    {/* ── A-9 眼跳喷嚏 ── */}
    <Route
      path="/tools/eye-twitch-sneeze-fun"
      element={wrap(<LightFunTool slug="eye-twitch-sneeze-fun" />)}
    />
    <Route
      path="/tools/eye-twitch-sneeze-fun/:shichen"
      element={wrap(<LightFunTool slug="eye-twitch-sneeze-fun" />)}
    />

    {/* ── A-10 名人星座 ── */}
    <Route
      path="/topics/celebrity-astrology"
      element={wrap(<LightFunTool slug="celebrity-astrology" />)}
    />
    <Route
      path="/topics/celebrity-astrology/:slug"
      element={wrap(<LightFunTool slug="celebrity-astrology" />)}
    />

    {/* ── A-11 二十八宿 ── */}
    <Route path="/knowledge/xiu-degree" element={wrap(<LightFunTool slug="xiu-degree" />)} />
    <Route path="/knowledge/xiu-degree/:xiu" element={wrap(<LightFunTool slug="xiu-degree" />)} />

    {/* ── A-12 阳宅趣味测 ── */}
    <Route
      path="/tools/yangzhai-fengshui-test"
      element={wrap(<LightFunTool slug="yangzhai-fengshui-test" />)}
    />
    <Route
      path="/tools/yangzhai-fengshui-test/result/:type"
      element={wrap(<LightFunTool slug="yangzhai-fengshui-test" />)}
    />
  </>
);
