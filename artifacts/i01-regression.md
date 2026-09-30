# I01 最终回归报告

- 项目：TempoSoul 命律 网站建设系统
- 分支：`thread/t3-i18n-accuracy`
- 执行时间：2026-09-20（Asia/Shanghai）
- 执行环境：Windows + PowerShell 5.1，Node v22.23.2，npm 10.9.8
- 说明：构建链原脚本用 pnpm/npx，按提示优先直调 `node_modules\.bin\*.cmd`（tsc.cmd / vite.cmd / tsx.cmd），避免 WSL/代理干扰。

## 一、总体结论

| 维度 | 结论 |
| --- | --- |
| BUILD | **PASS**（core build + lint:content + tsc -b + vite build 全绿） |
| 类型检查 tsc -b | **PASS**（0 错误，与已知基线一致） |
| 路由校验 validate:routes | **PASS**（总路由 884） |
| 内容 lint lint:content | **PASS**（禁词/溯源/block 变体全合规，0 命中） |
| 核心测试 test:core | **PASS**（修复后 1596/1596，0 失败） |
| 前端测试 npm test | **PASS**（1845/1845，0 失败） |

总体：**BUILD PASS / TEST 通过率 100% / 路由 PASS**。

## 二、逐条命令记录

| # | 命令 | 退出码 | 关键输出摘录 | 结论 |
| --- | --- | --- | --- | --- |
| 1 | `node scripts/lint-content.mjs` | **0** | `[lint-content] 通过：禁词 / 溯源 / block 变体 全部合规` | PASS，无禁词命中 |
| 2 | `node_modules\.bin\tsc.cmd -b` | **0** | 无错误输出（修复后复核仍 0） | PASS，与基线 0 错误一致 |
| 3 | `node_modules\.bin\tsx.cmd --tsconfig tsconfig.app.json scripts/validate-routes.ts` | **0** | `[validate:routes] PASS`；A 域 ALL_URLS=280（唯一 280）；明细 `{"static":14,"ten_gods":10,"shen_sha":12,"four_transform":56,"four_transform_pairs":10,"ziwei_patterns":15,"limit_year":3,"transits":2,"palace_star":168}`；sitemap=A280+B50+C384+D24=738；总路由=146 基线+738=**884** | PASS |
| 4a | core build（`packages\core\` `npm run build`） | **0** | `node scripts/clean-dist.mjs && ... && tsc --build tsconfig.json --force && node scripts/add-esm-extensions.mjs`；`Fixed 234 dist files (added missing ESM extensions)`；耗时 **9.9s** | PASS |
| 4b | lint:content（build 链中段） | **0** | 同 #1 | PASS |
| 4c | tsc -b（build 链中段） | **0** | 无错误 | PASS |
| 4d | `node_modules\.bin\vite.cmd build` | **0** | vite v7.3.6；`✓ 1872 modules transformed`；`✓ built in 13.34s`（墙钟 14.3s）；最大 chunk：`loader-Do3ofRJ9.js 2369.58 kB (gzip 131.82)`、`chart-combined 1430.06 kB (gzip 446.36)`、`SkyPage 788.49 kB (gzip 229.62)`、`bazi-engine 709.01 kB (gzip 166.60)`、`iztro-vendor 474.36 kB (gzip 150.26)`、`solutionContext 358.79 kB (gzip 69.96)`；入口 `index-DAaO_ps_.css 154.31 kB (gzip 26.77)` | PASS（有非阻塞告警，见第四节） |
| 5 | `packages\core` `npm test`（run-core-tests.mjs） | **修复前 1 → 修复后 0** | 见第三节；修复后 `# tests 1596 / # pass 1596 / # fail 0`，耗时约 130s | 修复后 PASS |
| 6 | 根 `npm test`（core build + `tsx --test "tests/*.test.ts"`） | **0** | `# tests 1845 / # pass 1845 / # fail 0`，墙钟 163.5s | PASS |

### 任务点名用例复核（#6 中单独重跑确认）
- `navigation-matrix.test.ts`：**5/5**（H01 矩阵无死链 / 核心链路八字→大运→流年→择日 / 模板路由解析 / 详情页前缀回退 / key 唯一互解析）。
- `g02-prose-wiring.test.ts`：8/8（runSolution 散文诗结构、同盘同诗、异盘异诗、降级短句、可回溯 atom_id、不触三道闸、confidenceToLevel 五档、confidenceLabel/toAiConfidence）。
- `g03-ai-response.test.ts`：11/11（buildAiResponse 四段齐全、极性→建议、排序带 refs、空 output 兜底、仲裁张力、散文收尾、formatAiResponse 等）。
- `bazi-chart-board.test.ts`：修复后 2/2。

## 三、失败清单（修复前 → 已修复）

修复前 `test:core` 出现 2 个失败，均在同一文件、同一根因：

| 测试名 | 首行报错 | 性质判定 |
| --- | --- | --- |
| `not ok 140 八字结果盘应展示排盘预警和稳定基础参考`（`tests/bazi-chart-board.test.ts:1`） | `error: 'useI18n must be used within I18nProvider'`（栈：`useI18n → useTermLabel → BaziGanZhiValue (BaziChartBoard.tsx:79)`） | **测试夹具缺 Provider**（已知历史类问题，非业务失败） |
| `not ok 141 八字女命日柱应标注元女`（`tests/bazi-chart-board.test.ts:1`） | `error: 'useI18n must be used within I18nProvider'`（同栈） | **测试夹具缺 Provider**（已知历史类问题，非业务失败） |

根因：`BaziChartBoard` 经 `useTermLabel → useI18n`，而该测试直接 `renderToStaticMarkup(<BaziChartBoard/>)` 未包 `I18nProvider`；SSR 渲染无 Provider 时 `useI18n()` 抛错。此为授权修复范围 (a)「测试里缺 I18nProvider 包裹」。

修复后：`test:core` 1596/1596、`npm test` 1845/1845，无任何 `not ok`。

## 四、修复清单（仅测试夹具，未动业务）

1. **文件**：`tests/bazi-chart-board.test.ts`
   - 新增导入：`import { I18nProvider } from '../src/i18n';`
   - 新增 `renderBoard(props)` 辅助函数：用 `createElement(I18nProvider, null, createElement(BaziChartBoard, props))` 包裹后再 `renderToStaticMarkup`（Provider 默认 locale=zh-CN，与用例断言的「元男/元女」等中文文案一致）。
   - 将两处 `renderToStaticMarkup(createElement(BaziChartBoard, {...}))` 改为调用 `renderBoard({...})`。
   - 性质：测试夹具补 Provider，零业务逻辑改动；`safeStorage` 在 Node 下安全返回 null，Provider 的 `useEffect` 在 SSR 不执行，不引入副作用。
   - 验证：单独重跑该文件 2/2 通过；重跑 `test:core` 1596/1596 通过；`tsc -b` 仍 0 错误。

未做任何业务逻辑重写、未删功能、未改 `src/` 下任何文件。

## 五、非阻塞观察（不在授权修复范围，仅记录）

1. `vite build` 有 esbuild css minify 告警：`src/pages/bazi/bazi-topics.css` 内含被粘贴进来的 TSX/JSX 片段（`// src/App.tsx 顶部 lazy 声明区`、`element={<Suspense ...>}`、`fallbackSearch={...}` 等），esbuild 报 `css-syntax-error`/`js-comment-in-css`。**仅告警、构建退出码 0**。属内容/粘贴污染，非本次授权修复项（非测试夹具、非未用导入/类型小错、非 lint:content 禁词），保持原样未动，建议后续单独清理。
2. 动态+静态混合导入告警（非错误）：`report-events.ts`、`data/names/content/base.ts`、`KnowledgeListPage.tsx`、`KnowledgeDetailPage.tsx` 同时被动态与静态导入，不影响产物。
3. chunk 体积告警：`loader` 2.37MB、`chart-combined` 1.43MB 等超过 700kB，仅性能提示，非失败。

## 六、复跑命令备查

```
node scripts/lint-content.mjs
node_modules\.bin\tsc.cmd -b
node_modules\.bin\tsx.cmd --tsconfig tsconfig.app.json scripts/validate-routes.ts
# 构建链（等价 npm run build）
  packages\core\ 下 npm run build
  node scripts/lint-content.mjs
  node_modules\.bin\tsc.cmd -b
  node_modules\.bin\vite.cmd build
packages\core\ 下 npm test        # test:core
根 npm test                       # 前端全量
```
