/**
 * M1Routes —— 波2·M1 路由补全（X1-D 系列零路由板块 + 合参入口 + A7 证书复现）
 *
 * 挂载方式（与 DailyRoutes / SeoRoutes 同构）：
 *   在 src/App.tsx 顶部 import { M1Routes } from '@/router/M1Routes';
 *   并在 <Routes> 内与其他 *Routes 并列处追加 {M1Routes}。
 *
 * 范围（本块只新增，不动既有 109 条 path）：
 *   13 个零路由板块 + /synthesis 合参一级路由（X1-D-03）
 *   + A7 StarMark 证书复现落地位 /starmark/sky/:cert_id。
 *
 * 占位纪律：13 个板块已全部接线真实排盘页（波4 完成、批次3 移除占位回落）；
 *   合参 /synthesis 为真实双盘合参页（波4）。
 */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const StarmarkSkySharePage = lazy(() => import('@/pages/starmark/StarmarkSkySharePage'));

/**
 * 波4·内容模板填充 —— 14 个占位板块升级为真实排盘页（引擎/内容就绪，页面层接线）。
 * 按 path 映射真实页面组件；13 个 BOARDS 全部命中真实页，占位回落已随批次3 移除。
 * 只做 element 接线，不增删任何路由 path、不改 BOARDS 结构、不动 App.tsx 挂载。
 */
const REAL_BOARD_PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  // 术数历法三
  '/metaphysics/taiyi': lazy(() => import('@/pages/m1/TaiyiPage')),
  '/metaphysics/huangji-jingshi': lazy(() => import('@/pages/m1/HuangjiJingshiPage')),
  '/metaphysics/wuyun-liuqi': lazy(() => import('@/pages/m1/WuyunLiuqiPage')),
  // 三式类
  '/divination/qimen': lazy(() => import('@/pages/m1/QimenPage')),
  '/divination/liuren': lazy(() => import('@/pages/m1/LiurenPage')),
  '/divination/jinkoujue': lazy(() => import('@/pages/m1/JinkoujuePage')),
  // 占卜轻量
  '/divination/liuyao': lazy(() => import('@/pages/m1/LiuyaoPage')),
  '/divination/meihua': lazy(() => import('@/pages/m1/MeihuaPage')),
  '/divination/xiaoliuren': lazy(() => import('@/pages/m1/XiaoliurenPage')),
  '/divination/lenormand': lazy(() => import('@/pages/m1/LenormandPage')),
  '/divination/ssgw': lazy(() => import('@/pages/m1/SsgwPage')),
  // 风水二
  '/fengshui/xuankong': lazy(() => import('@/pages/m1/XuankongPage')),
  '/fengshui/residential': lazy(() => import('@/pages/m1/ResidentialPage')),
};

const SynthesisPage = lazy(() => import('@/pages/m1/SynthesisPage'));

function wrap(el: ReactNode): ReactNode {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

interface M1Board {
  path: string;
  slug: string;
  title: string;
  category: string;
  description: string;
}

/**
 * 13 个零路由板块 + 合参 /synthesis（X1-D-03）
 * 【修复批次2 任务8c + 批次3】本数组 13 个板块均已在 REAL_BOARD_PAGES 接线真实排盘页（@temposoul/core 引擎），
 *   占位回落分支已随批次3 移除；description 字段保留作数据注释与展示兜底（未命中时抛错，不再占位渲染）。
 */
const BOARDS: M1Board[] = [
  // —— 术数历法三（太乙 / 皇极经世 / 五运六气）——（已接线真实页）
  {
    path: '/metaphysics/taiyi',
    slug: 'taiyi',
    title: '太乙神数',
    category: '术数 · 三式',
    description:
      '太乙神数为古代三式之首，以太乙积年与九宫十六神推国运与岁时大势。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/metaphysics/huangji-jingshi',
    slug: 'huangji-jingshi',
    title: '皇极经世',
    category: '术数 · 历法易数',
    description:
      '皇极经世以元会运世推步天地气化与治乱节律，属宏观时间易学。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/metaphysics/wuyun-liuqi',
    slug: 'wuyun-liuqi',
    title: '五运六气',
    category: '术数 · 历法易数',
    description:
      '五运六气依天干地支推每年岁运与客气主气，附会物候与健康参考。（已接线真实排盘页，description 仅作兜底展示）',
  },
  // —— 三式类（奇门遁甲 / 大六壬 / 金口诀）——（已接线真实页）
  {
    path: '/divination/qimen',
    slug: 'qimen',
    title: '奇门遁甲',
    category: '占卜 · 三式',
    description:
      '奇门遁甲以九宫八门九星八神将时空格局用于方位与择时参考。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/divination/liuren',
    slug: 'liuren',
    title: '大六壬',
    category: '占卜 · 三式',
    description:
      '大六壬以月将加时起四课三传，占事物缘起与发展。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/divination/jinkoujue',
    slug: 'jinkoujue',
    title: '金口诀',
    category: '占卜 · 三式',
    description:
      '金口诀（大六壬金口诀）以地分将神人元简化课式，直断吉凶方位。（已接线真实排盘页，description 仅作兜底展示）',
  },
  // —— 占卜轻量（六爻 / 梅花易数 / 小六壬 / 雷诺曼 / 三山国王灵签）——（已接线真实页）
  {
    path: '/divination/liuyao',
    slug: 'liuyao',
    title: '六爻',
    category: '占卜 · 易占',
    description:
      '六爻以铜钱摇卦装六亲六神断事，为传统易占主流之一。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/divination/meihua',
    slug: 'meihua',
    title: '梅花易数',
    category: '占卜 · 易占',
    description:
      '梅花易数以心动起卦、体用生克断事，重即时外应。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/divination/xiaoliuren',
    slug: 'xiaoliuren',
    title: '小六壬',
    category: '占卜 · 速占',
    description:
      '小六壬以月日时落六宫（大安留连速喜赤口小吉空亡）做速断。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/divination/lenormand',
    slug: 'lenormand',
    title: '雷诺曼',
    category: '占卜 · 西洋牌阵',
    description:
      '雷诺曼牌以 36 张象征牌读具体人事与走向，牌阵简明。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/divination/ssgw',
    slug: 'ssgw',
    title: '三山国王灵签',
    category: '占卜 · 灵签',
    description:
      '三山国王灵签为地方信仰签诗，抽签得号附签诗解。（已接线真实排盘页，description 仅作兜底展示）',
  },
  // —— 风水二（玄空飞星 / 住宅风水）——（已接线真实页）
  {
    path: '/fengshui/xuankong',
    slug: 'xuankong',
    title: '玄空飞星',
    category: '风水 · 理气',
    description:
      '玄空飞星以三元九运与山向飞星论断宅运吉凶。（已接线真实排盘页，description 仅作兜底展示）',
  },
  {
    path: '/fengshui/residential',
    slug: 'residential',
    title: '住宅风水',
    category: '风水 · 形势',
    description:
      '住宅风水依坐向、户型与外部形势做居住环境参考。（已接线真实排盘页，description 仅作兜底展示）',
  },
];

export const M1Routes = (
  <>
    {BOARDS.map((b) => {
      const BoardPage = REAL_BOARD_PAGES[b.path];
      // 波4·批次3：13 个 BOARDS 全部映射真实排盘页；未映射即构建期缺陷，运行时抛错而非占位渲染。
      if (!BoardPage) {
        throw new Error(`[M1Routes] 板块未接线真实排盘页: ${b.path}`);
      }
      return <Route key={b.path} path={b.path} element={wrap(<BoardPage />)} />;
    })}

    {/* 合参一级路由（X1-D-03：建一级路由；导航第3位/首页入口卡属共享组件改动，见波3 W3.1 交付说明） */}
    <Route path="/synthesis" element={wrap(<SynthesisPage />)} />

    {/* A7 StarMark 证书复现落地位（同参数重渲染契约见 src/lib/starmark/reproduce.ts） */}
    <Route path="/starmark/sky/:cert_id" element={wrap(<StarmarkSkySharePage />)} />
  </>
);
