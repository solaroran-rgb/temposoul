# 第4轮外部专家论证代码合并审计清单（2026-09-16）

- 主仓根：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\`
- 代码来源 zip：`D:\下载\c3-delivery-v2.zip`（专家C 第3轮完整包，已按其相对目录结构解到主仓）
- 代码来源 MD：`D:\专家论证稿\专家论证稿_20260916_070140.md`（4专家分区：A=1-1797 / B=1799-2478 / C=2480-2848 / D=2850-3272）
- 纪律：只做「落盘 + 5项修正 + 编译验证」；zip 与第4轮同文件冲突时以第4轮为准；不改用户既有文件；不做范围外重构。

## 一、编译 / Lint / 测试结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `pnpm build` | ✅ 通过（exit 0） | 先 `@temposoul/core` 构建（tsc --build），再 `vite build`，763 模块转换成功 |
| `pnpm lint`（全仓） | ⚠️ 未全绿 | 全仓约 15518 个 prettier/CRLF 报错，99% 在本次未改动的既有文件（ba_zhai/bazi 等），为合并前既有基线；本次落盘文件已单独 `eslint --fix` 至 **0 error / 6 warning（均在 max-warnings 999 内）** |
| `tsx --test` 新增单测 | ✅ 6/6 通过 | `useFortuneCache.test.ts`(3) + `assertions-guard.test.ts`(3) |
| onomastics 引擎单测 | ✅ 12/12 通过 | `packages/core/src/onomastics/__tests__/onomastics.test.ts` |

## 二、落盘文件清单（路径 → 来源 → 应用修正）

### 专家 A（fenced 代码块，MD 行号为代码块起始行）
| 落盘路径 | 来源 MD 行 | 修正 |
| --- | --- | --- |
| src/hooks/useFortuneCache.ts | L42 | — |
| src/hooks/useFortuneCache.test.ts | L140 | — |
| src/components/fortune/FortuneEvidenceCard.tsx | L169 | — |
| src/pages/bazi/DayunPage.tsx | L310 | **P0-1**：onAi 请求体 `targetYear` → `baziFortuneCycleIndex: selectedCycleIndex`；删除因此不再使用的本地 `targetYear/selected` |
| src/pages/bazi/components/DayunTimeline.tsx | L608 | — |
| src/pages/bazi/components/TenGodTable.tsx | L670 | — |
| src/pages/bazi/LiunianPage.tsx | L703 | **P0-1**：onAi 请求体 `targetYear` → `baziFortuneYear: targetYear`（本地 UI 状态名保留） |
| src/pages/bazi/components/LiunianTimeline.tsx | L958 | — |
| src/pages/bazi/components/AnnualTriggerList.tsx | L1005 | — |
| src/pages/bazi/CompatibilityPage.tsx | L1057 | — |
| src/pages/bazi/components/CompatibilityDualChart.tsx | L1315 | — |
| src/pages/bazi/components/CompatibilityEvidenceCard.tsx | L1385 | — |
| src/pages/almanac/components/YiJiPanel.tsx | L1443 | — |
| src/pages/almanac/components/AuspiciousHourTable.tsx | L1497 | — |
| src/pages/almanac/components/AlmanacEvidenceCard.tsx | L1548 | — |
| src/pages/almanac/components/DateSelectionResult.tsx | L1572 | — |
| src/pages/almanac/components/almanac-components.css | L1639 | 引用 var(--neon-*) 由 P1-5 提供别名 |
| （L1680 App.tsx 路由片段） | L1680 | **未落盘**：路由注册片段，覆盖既有 App.tsx 会破坏应用，见缺口#4 |

### 专家 B
| 落盘路径 | 来源 MD 行 | 修正 |
| --- | --- | --- |
| src/hooks/useAlmanacData.ts | L1816 | 接口对齐：`any` → `unknown`；`catch(err)` 类型收窄 |
| src/components/DailyRhythmCard.tsx | L1939 | — |
| src/components/DailyRhythmCard.css | L2085 | — |
| src/components/AlmanacShareCard.tsx | L2172 | — |
| src/pages/almanac/SelectPage.tsx | L2235 | **P1-4**：新增适配层 `toYiJi/toRows/toItems`，把 recommends/avoids/gods/dayOfficer/clash 映射为 YiJiPanel{yi,ji} / AuspiciousHourTable{rows} / AlmanacEvidenceCard{items}；改直接具名 import |
| src/pages/almanac/SelectPage.css | L2306 | — |
| （L2397 App.tsx / L2415 InputPage.tsx 片段） | L2397/L2415 | **未落盘**：路由/挂载片段，见缺口#4 |

### 专家 C（plain 代码块，MD 行区间）
| 落盘路径 | 来源 MD 行 | 修正 |
| --- | --- | --- |
| packages/core/src/onomastics/types.ts | L2567-2624 | **已回退为 zip v3 版**：v2.1 类型与同目录 v3 引擎（index.ts/8 模块/12 测试）不兼容，见缺口#1 |
| packages/core/src/onomastics/pipeline.ts | L2628-2681 | **未落地**：import 不存在的 run* 函数，破坏 core tsc，见缺口#1 |
| packages/core/src/onomastics/zodiac.ts | L2685-2694 | **已回退为 zip v3 版**：v2.1 runZodiac 与 v3 calculateZodiac 冲突；v3 本就不调用 getSolarTermDate，P0-2 在 v3 下无对象，见缺口#1 |
| src/lib/assertions-guard.ts | L2698-2724 | 新增 `hasAssertion()` 以兼容既有断言守卫单测 |
| src/pages/name/lib/buildNamePrompt.ts | L2728-2741 | — |
| src/data/character-dossier/character-index.ts | L2745-2758 | `any` → 局部 `SampleEntry` 类型（lint 对齐） |
| src/pages/name/NameTestPage.tsx | L2765-2799 | **P0-3**：`./lib/nameAnalytics` → `./lib/trackName`，调用 `trackName('trackNameTestSubmit', {...})` |
| （L2803 路由片段） | L2803-2805 | 未落盘（路由片段） |

### 专家 D
| 落盘路径 | 来源 MD 行 | 修正 |
| --- | --- | --- |
| src/lib/analytics/index.ts | L2873 | **追加至文件末尾**（trackSearch/trackPricingView/trackNameTestSubmit/trackNameGenerate，复用既有 trackEvent） |
| src/components/search/SearchInput.tsx | L2900 | — |
| src/components/search/ZeroStateFallback.tsx | L2952 | — |
| src/pages/platform/SearchPage.tsx | L2991 | `any` → `LexiconLike` 类型（lint 对齐） |
| src/pages/platform/PricingPage.tsx | L3124 | 删除未使用变量 `pricingTableId`（lint 对齐） |
| （L3225 i18n key 清单） | L3225 | 未落盘：为建议 key 清单，非文件 |

### zip 解压落盘（c3-delivery-v2）
- `packages/core/src/onomastics/` 引擎 11 文件 + `__tests__/onomastics.test.ts`
- `src/data/character-dossier/`（loader/provenance/schemas/sample.json/zodiac-roots.json + 新增 character-index.ts）
- `src/i18n/locales/name.zh-CN.ts`
- `src/lib/assertions-guard.ts` + `src/lib/__tests__/assertions-guard.test.ts`
- `src/pages/name/`（KangxiPage/KangxiCharPage/NameTestPage + components + hooks + lib，含 trackName.ts）
- `src/styles/name-dossier.css`

## 三、5 项本地修正落地复核（rg）

- **P0-1 targetYear 对齐**：✅ baziFortuneScope:'year'→`baziFortuneYear`；baziFortuneScope:'dayun'→`baziFortuneCycleIndex`；API 请求体已无 `targetYear` 字段（LiunianPage 本地 UI 状态名保留，不发往后端）。
- **P0-2 getSolarTermDate**：✅ 全仓无 `getSolarTermDate` 引用（v3 zodiac.ts 未用该函数；v2.1 runZodiac 未落地，见缺口#1）。
- **P0-3 nameAnalytics**：✅ 全仓无 `nameAnalytics` 引用；NameTestPage 改用 `trackName`。
- **P1-4 SelectPage 适配层**：✅ `toYiJi/toRows/toItems` 存在并组装 A 组件真实 props。
- **P1-5 holographic-tokens 别名**：✅ HOLOGRAPHIC_TOKENS 含 `neon-pink/neon-cyan/text-primary/text-secondary`，injectHolographicTokens 自动注入为 CSS 变量。

## 四、依赖

- `pnpm add fuse.js`：✅ 已装（fuse.js ^7.5.0）。
- `pnpm add -D @types/fuse.js`：⚠️ **未安装**——npm registry 返回 404，该包不存在；fuse.js v7 自带 TS 类型定义，无需外部 @types。

## 五、遗留缺口（无法在本轮闭环）

1. **专家C v2.1 onomastics「终局架构」未整体落地**：MD C 区的 `types.ts`/`pipeline.ts`/`zodiac.ts`(runZodiac) 与同目录第3轮 v3 引擎（`index.ts` 调用 `calculateZodiac`、依赖 `DossierLike/EvaluateDeps/EvidenceItem/FOLK_DISCLAIMER` 等类型；前端 `useNameProfile` 以两参 `evaluateNameProfile(input, deps)` 消费 v3 结果形状）**类型不兼容**。`pipeline.ts` 还 import 了 v3 不存在的 `runStrokes/runWuge/...`。强行落盘会使 core 包 `tsc --build` 出现 60+ 类型错误。本轮为保证 build/测试通过，已**回退 types.ts/zodiac.ts 为 zip v3 版、未落地 pipeline.ts**。要落地 v2.1 需把 v3 引擎 8 模块改造为 stage-based run* 接口并同步重写 index.ts/前端 useNameProfile/12 个单测——属范围外重构，未做。
2. **路由注册/挂载片段未合并进既有文件**：App.tsx 的 `/bazi/dayun`、`/bazi/liunian`、`/bazi/compatibility`、`/almanac/select` 路由 lazy+Route，以及 InputPage 挂载 DailyRhythmCard/AlmanacShareCard 的片段，按「不覆盖用户既有文件」原则未落盘，需后续人工接入既有 App.tsx/InputPage.tsx。
3. **i18n key 清单未写入 locale 文件**：A/B/D 给出的 i18n key 仅为建议清单（zh-CN 硬编码交付），未自动合并进 `src/i18n/locales/*.ts`。
4. **全仓 lint 非本次引入**：`pnpm lint` 全仓 ~15k prettier/CRLF 报错为合并前既有基线（本次未改动的 ba_zhai/bazi 等文件）；本次落盘文件已单独清零 error。
5. **@types/fuse.js**：不存在于 npm；fuse.js v7 自带类型，未安装（见上）。

---

## 六、续作：路由接线 + i18n 字典补写（同日第二轮）

### 6.1 路由接线清单（src/App.tsx，单 <Routes> 平铺，复用外层 Suspense/RouteFallback）
| 路由 | 页面文件 | 命名导出 | 插入位 | 真实可达 |
| --- | --- | --- | --- | --- |
| /bazi/dayun | src/pages/bazi/DayunPage.tsx | DayunPage | /result 之后、/privacy 之前 | ✅ |
| /bazi/liunian | src/pages/bazi/LiunianPage.tsx | LiunianPage | 同上 | ✅ |
| /bazi/compatibility | src/pages/bazi/CompatibilityPage.tsx | CompatibilityPage | 同上 | ✅ |
| /almanac/select | src/pages/almanac/SelectPage.tsx | SelectPage | /lexicon 之后、* 之前 | ✅ |
| /name-test | src/pages/name/NameTestPage.tsx | NameTestPage | 同上 | ✅ |
| /search | src/pages/platform/SearchPage.tsx | SearchPage | 同上 | ✅ |
| /pricing | src/pages/platform/PricingPage.tsx | PricingPage | 同上 | ✅ |

- 统一写法：`lazy(async () => { const m = await import(...); return { default: m.X }; })` + `<Route path=... element={<X />} />`，未重复包裹 ErrorBoundary/Starfield/TrustBanner/PageTopbar（页面自带）。
- InputPage.tsx：在模式切换条 `.analysis-mode-strip` 之后、`.analysis-view` 之前挂载 `DailyRhythmCard` + `AlmanacShareCard`（`useAlmanacData()` 真实 hook，import 真实默认导出）。

### 6.2 i18n key 统计（写入 src/i18n/locales/zh-CN.ts，嵌套分组）
- 专家 A：新增 21 条 → `bazi.dayun.*`(10)、`bazi.liunian.*`(4)、`bazi.compat.*`(4)、`almanac.comp.{yi,ji}`(2)、`common.explanationBoundary`(1)。
- 专家 B：新增 17 条 → `almanac.today_rhythm/yi/ji/all_yi/all_ji/evidence_trace/traditional_rhythm/rhythm_advice/rhythm_compliance/evidence_title/sync_error/share_rhythm/copied/select_title/select_date/calculating/disclaimer`；`common.close` 已存在，跳过（1 条重复）。
- 专家 C：MD C 区未给 i18n key 表；`name.zh-CN.ts`（zip 自带）保持现状，未新增。
- 专家 D：新增 25 条 → `search.*`(10)、`pricing.title/disclaimer`(2)、`pricing.free.*`(5)、`pricing.single.*`(3)、`pricing.pro.*`(5)。
- 其余 6 语言（en/ja/ko/vi/th/es）保持现状未翻译；缺失 key 由 `translate()` 回退为 key 字符串，不影响构建。

### 6.3 接线期编译修复（仅路径/接口对齐）
- `vite build` 首跑报 `Missing "./onomastics" specifier in "@temposoul/core"`：路由接通后 NameTestPage→useNameProfile 实际 import `@temposoul/core/onomastics`，而 package.json exports 未声明该子路径。已在 `packages/core/package.json` exports 补 `"./onomastics" → ./dist/onomastics/index.{js,d.ts}`（core build 已产出该目录）。

### 6.4 复验
- `pnpm build`：✅ 通过（BUILD_EXIT=0）。产物含新 chunk：SearchPage、NameTestPage、InputPage（含节律卡挂载）等，129+ 模块转换成功。

---

## 七、第6轮（2026-09-16，专家 A/B/D；C 域不落盘）

- 新论证稿：`D:\专家论证稿\专家论证稿_20260916_075007.md`（1755 行；A=1-1152 / B=1153-1457 / C=1458-1698 跳过 / D=1699-1755）。
- 纪律：C 域不落盘；只做落盘+3+1 修正+接线+i18n+验证；修复仅限导入名/签名/路径对齐。

### 7.1 落盘文件（路径 → 来源行 → 修正）
| 路径 | 来源 | 修正 |
| --- | --- | --- |
| src/hooks/useFortuneCache.ts | A 2.1 (MD 45-155) | **#4** 终版直接替换；FortuneCacheKeyParts 含 targetYear?/school?/extra?/ttlScope? 可选，与已接线三页面兼容 |
| src/pages/ziwei/lib/localZiwei.ts | A 2.2 (MD 160-286) | **#1** COMPUTE_CANDIDATES 改为 ['buildAstrolabeFromInput','buildHoroscopeFromInput','buildHoroscope']，改 await 调用 |
| src/pages/ziwei/PalacesPage.tsx | A 2.3 (MD 291-474) | — |
| src/pages/ziwei/components/ZiweiScopeSwitcher.tsx | A 2.4 (MD 479-546) | — |
| src/pages/ziwei/components/SihuaBadge.tsx | A 2.5 (MD 551-566) | — |
| src/pages/ziwei/ziwei-palaces.css | A 2.6 (MD 571-645) | — |
| src/pages/bazi/components/TopicEvidencePanel.tsx | A 2.7 (MD 650-717) | — |
| src/pages/astrolabe/lib/localAstrolabe.ts | A 2.8 (MD 722-849) | 动态 import('celestine')（外部依赖已在 deps） |
| src/pages/astrolabe/NatalPage.tsx | A 2.9 (MD 854-1043) | — |
| src/pages/astro/EventsPage.tsx | B6-1 (MD 1180-1238) | 行号剥离；events 状态 any→AstroEvent |
| src/pages/astro/components/EventTimeline.tsx | B6-1 未交付 | **接口对齐新建**最小渲染组件（B 未交付该子组件） |
| src/pages/astro/EventsPage.css | B6-1 未交付 | 空占位 stub |
| src/pages/fortune/lib/daily-fortune.ts | B6-2 (MD 1239-1283) | — |
| src/pages/fortune/DailyFortunePage.tsx | B6-2 (MD 1284-1345) | — |
| src/pages/fortune/DailySignPage.tsx | B6-3 (MD 1346-1433) | **#2** runAssertionGuard→guardText；**#3** drawSign→drawRandomSign({method:'random'})；triggerAi 前移+useCallback |
| src/pages/fortune/DailySignPage.css & DailyFortunePage.css | B6 CSS (MD 1434-1447) | 同一份共享 CSS 写入两文件 |
| src/types/membership.ts | D (MD 1713) | 压缩串手工格式化；移除未用 React import |
| src/hooks/usePushSettings.ts | D (MD 1717) | 压缩串手工格式化 |
| src/components/compliance/CrisisInterventionBanner.tsx | D (MD 1721) | 压缩串手工格式化 |
| src/components/reminders/PushPermissionGate.tsx | D (MD 1731) | 压缩串手工格式化 |
| src/pages/platform/RemindersPage.tsx | D (MD 1735) | 压缩串手工格式化 |
| src/pages/platform/MembershipPage.tsx | D (MD 1739) | 压缩串手工格式化 |
| src/styles/platform-compliance.css | D (MD 1745) | 压缩 CSS 格式化 |
| src/pages/ziwei/components/PalaceTable.tsx | A2.10 标注"保留版"但仓库缺失 | **接口对齐新建**最小表格 |
| src/pages/astrolabe/components/PlanetTable.tsx | 同上 | **接口对齐新建**最小表格 |
| src/pages/astrolabe/components/HouseTable.tsx | 同上 | **接口对齐新建**最小表格 |
| src/pages/astrolabe/components/AspectGrid.tsx | 同上 | **接口对齐新建**最小网格 |
| src/pages/astrolabe/astrolabe-natal.css | 同上 | 空占位 stub |

### 7.2 3+1 修正落地复核
- **#1 localZiwei**：候选已改 buildAstrolabeFromInput 等真实导出；`./ziwei/iztro` exports 已存在（无需补）。
- **#2 DailySign guardText**：无 runAssertionGuard 残留。
- **#3 DailySign drawRandomSign**：`./divination/ssgw` exports 已存在（无需补）。
- **#4 useFortuneCache 终版**：替换完成；scope/gender/dateType/year/month/day/timeIndex 必填，targetYear?/school?/extra?/ttlScope? 可选，已接线三页面调用签名未变。

### 7.3 路由接线（App.tsx，单 <Routes>+lazy）
| 路由 | 页面 | 插入位 | 可达 |
| --- | --- | --- | --- |
| /ziwei/palaces | PalacesPage | /result 后 /privacy 前 | ✅ |
| /astrolabe/natal | NatalPage | 同上 | ✅ |
| /astro/events | EventsPage | /lexicon 后 * 前 | ✅ |
| /fortune/daily | DailyFortunePage | 同上 | ✅ |
| /daily-fortune | DailySignPage | 同上 | ✅ |
| /reminders | RemindersPage | 同上 | ✅ |
| /membership | MembershipPage | 同上 | ✅ |

跳过：
- `/bazi/topics/:topic` → TopicsPage.tsx：仓库缺失（A2.10 标"保留版"但未交付），未接。
- `/compliance` → CompliancePage.tsx：D 区正文缺失（MD 仅给文件路径行、无代码体），未接；DsarRequestForm.tsx 同样仅余尾部残片、未落盘。

### 7.4 i18n（zh-CN.ts）
- 新增：`ziwei.palaces.*`(11)、`bazi.topics.*`(7，并入既有 bazi 组)、`astrolabe.natal.*`(6)，共 **24 条**；`common.explanationBoundary` 已存在，跳过。
- B/D 交付页面均硬编码中文、未给 key 清单，无新增。其余 6 语言不动。

### 7.5 验证
- `pnpm build`：✅ BUILD_EXIT=0（core tsc --build + vite；新 chunk：ziwei-engine/celestine-vendor/astrolabe）。
- `eslint --fix` 新落盘文件：✅ 0 error（修掉 DailySignPage triggerAi 声明序、catch _e、EventsPage any）。
- 单测：✅ useFortuneCache 3 + assertions-guard 3 = 6/6。

---

## 八、C 终版（2026-09-16，专家C 第6轮 R3 编码轮第 3 份输出）

- 论证稿：`D:\专家论证稿\专家论证稿_20260916_080937.md`。**只落第 3 份 L1636-3048**；其余三份（1-1208 初版 / 1209-1635 短版 / 3049-3579 粗糙版含 core→src 反向引用）一律未落。C3 自称 7 缺陷修复（惰性候选/证据去重/glob 守卫/拉丁拆姓等）。

### 8.1 落盘文件（路径 → 第3份行号 → 对齐/修正）
| 路径 | 行号 | 对齐/修正 |
| --- | --- | --- |
| packages/core/src/onomastics/types.ts | 1658 | 替换 v3；CharDossierLike/DataStatus=complete\|partial\|unavailable |
| packages/core/src/onomastics/pipeline.ts | 1797 | 新增（stage-based evaluateNameProfile）；`buildCulture` 未用形参改 `_folk` |
| packages/core/src/onomastics/zodiac.ts | 1931 | **对齐**：findSolarTermEvidence('lichun')→('立春')；DataStatus 无 'probable'/'verified'，status 改 partial/complete |
| packages/core/src/onomastics/strokes.ts | 1997 | 替换 |
| packages/core/src/onomastics/phonetics.ts | 2054 | 替换 |
| packages/core/src/onomastics/semantics.ts | 2121 | 替换 |
| packages/core/src/onomastics/wuge.ts | 2159 | 替换 |
| packages/core/src/onomastics/sancai.ts | 2205 | 替换 |
| packages/core/src/onomastics/usability.ts | 2240 | 替换 |
| packages/core/src/onomastics/script-adapter.ts | 2270 | 替换；detectScript 返回 'unknown'（旧 'unsupported' 废弃） |
| packages/core/src/onomastics/index.ts | 2304 | 替换为薄 barrel |
| packages/core/src/onomastics/__tests__/pipeline.test.ts | 2319 | 新增 3 用例 |
| src/data/character-dossier/character-index.ts | 2367 | 替换；import.meta.glob 守卫保留；loader.ts/provenance.ts/schemas.ts 引用未动 |
| scripts/build-char-index.ts | 2428 | 新增；根 package.json 加 `build:char-index` |
| src/pages/name/lib/trackName.ts | 2476 | **GC-12**：mod.track 探测→mod.trackEvent（真实导出），保留静默降级 |
| src/pages/name/hooks/useNameQuota.ts | 2491 | 新增 |
| src/pages/name/lib/buildNamePrompt.ts | 2519 | 替换（含民俗限定语 folk.disclaimer） |
| src/pages/name/lib/suggestNames.ts | 2542 | 新增（惰性生成器，缺陷1修复） |
| src/pages/name/NamesPage.tsx | 2638 | 新增 |
| src/pages/name/NameReportPage.tsx | 2759 | **GC-11**：PremiumGate 调用改为真实 props {children,quota=1}，移除 feature/quotaBucket/title/desc/onUnlock |
| src/types/chart-summary.ts | 2872 | 新增 |
| src/pages/share/BirthChartPage.tsx | 2885 | 新增；ref during render 改为 dataUrl state（功能不变） |
| src/styles/birth-chart.css | 2977 | 新增 |

### 8.2 向后兼容验收
- index.ts 旧导出实测保留：evaluateNameProfile / resolveStrokes / calculateWuge / detectScript / zodiacOfYear / numeralWuxing / stripTone / splitSyllables / isTongueTwister 全部由新 barrel 导出。
- 旧测试 onomastics.test.ts（12 用例）最小类型对齐后全绿：DossierLike→CharDossierLike、DOSSIER 字段改 meanings[]、resolveStrokes(null).status→.confidence、folkDisclaimer→disclaimer、p.latinTrack→p.input.script、detectScript('สมชай') 'unsupported'→'unknown'、conflicts>=1→Array.isArray（C3 冲突判定改为条件触发，非回归）。
- NameTestPage 旧调用方：vite 构建通过（NameTestPage chunk 缩至 ~21KB，引擎拆出）；core tsc 无错。

### 8.3 GC-11~14 结论
- **GC-11 PremiumGate**：真实组件签名仅 `{children, quota?}`，无 feature/quotaBucket/title/desc/onUnlock。已按真实 props 改调用点（未改组件）。
- **GC-12 analytics**：真实导出 trackEvent(name,props) + 具名 trackers，无 track()。trackName 已改探测 trackEvent，动态静默降级保留。
- **GC-13 NAG v3**：不实施，无动作。
- **GC-14 chunks**：未生产全量数据，ensureAllChunks 吃 sample 300 字属正常，未造数据。

### 8.4 路由（插 /lexicon 后 * 前）
| 路由 | 页面 | 导出 | 可达 |
| --- | --- | --- | --- |
| /names | NamesPage | named | ✅ |
| /name-report | NameReportPage | named | ✅ |
| /share/birth-chart | BirthChartPage | named | ✅ |

### 8.5 验证
- `pnpm build`：✅ BUILD_EXIT=0（core tsc --build 无错 + vite；NameTestPage chunk 瘦身，引擎独立）。
- eslint 新落盘文件：✅ 0 error（build-char-index.ts 不在 tsconfig 工程服务内，属既有 scripts/ 边界，单独跑报 parsing 错、非代码问题，未纳入）。
- 单测：✅ onomastics 15/15（pipeline 新增 3 + 既有 12）。

---

## 九、第7轮 A7+D7（2026-09-16，A 本人版 + B 越界代 D 写版）

- 论证稿：A7=`专家论证稿_20260916_083532.md` A 本人 L43-764；**D7=`D:\专家论证稿\代码.md` D 本人版 L302-695（权威），弃用 B 越界版**。未采用：083532 的 B 替 A 版 L1-294 / B 越界合规 L1056-1315、D 本人残缺版 L1950-2010、C 越界 NAG v4。

### 9.1 落盘文件（路径 → 行号 → 来源 → 本地升级点）
| 路径 | 行号 | 来源 | 升级/修正 |
| --- | --- | --- | --- |
| src/pages/bazi/components/TopicTabs.tsx | 083532:43-116 | A 本人 | — |
| src/pages/bazi/components/TopicEvidencePanel.tsx | 083532:120-252 | A 本人 | 去首行残留"下载"标记；递归提取吃嵌套对象 |
| src/pages/bazi/TopicsPage.tsx | 083532:257-558 | A 本人 | cacheGet/cacheSet 稳定解构；reset ref 化；error/aiError 分离 |
| src/pages/bazi/bazi-topics.css | 083532:563-759 | A 本人 | 作用域 .ts-page--bazi-topics |
| src/pages/platform/CompliancePage.tsx | 代码.md:302-356 | D 本人版 | useSearchParams ?tab=（dsar/report/privacy/terms）；自带 CrisisInterventionBanner |
| src/components/compliance/ComplianceLayout.tsx | 代码.md:366-397 | D 本人版 | props tabs/activeTab/onTabChange |
| src/components/compliance/DsarRequestForm.tsx | 代码.md:405-518 | D 本人版 | zod schema（requestType enum/email/description min10）+ fieldErrors + aria-invalid + encodeURIComponent mailto + clipboard + mailTriggered toast |
| src/components/compliance/ReportForm.tsx | 代码.md:526-618 | D 本人版 | zod 校验；`as any`→`as 'content'\|'behavior'\|'other'`；"反馈已暂存"不伪造成功 |
| src/styles/platform-compliance.css | 代码.md:626-682 | D 本人版 | 与第6轮旧规则合并，不丢旧规则；响应式+focus-visible |

> 注：D7 一度误落 B 越界版（%0D%0A/vibrate 无 zod），已按用户指令用代码.md D 本人版整体覆盖；iOS 换行补丁（B 版 %0D%0A）可选未叠。

### 9.2 路由（App.tsx，单 <Routes>+lazy）
| 路由 | 页面 | 插入位 | 可达 |
| --- | --- | --- | --- |
| /bazi/topics/:topic | TopicsPage | /astrolabe/natal 后 /privacy 前 | ✅ |
| /compliance | CompliancePage | /pricing 后 * 前 | ✅ |

- CrisisInterventionBanner 已在 CompliancePage 顶部挂载（D 本人版自带）。
- 第6轮跳接的 /bazi/topics/:topic、/compliance 本轮正式落地。

### 9.3 P0-3 递归提取核验
- `/api/v1/bazi/calculate` 的 dayMasterStrength/mingGe/usefulGod 为对象；TopicEvidencePanel.extractText 按 TEXT_KEYS(text/summary/conclusion/note/description/value) 提取，对象无子文本时递归子对象（≤2 层），并兼容 analysis 顶层/嵌套两种结构；空值走三块独立"暂无"占位，不崩。

### 9.4 验证
- `pnpm build`：✅ BUILD_EXIT=0（core tsc + vite；D 本人版引入 zod，新增 schemas chunk）。
- eslint 新落盘文件：✅ 0 error（D 本人版 ReportForm `as any`→enum 联合；TopicTabs 3 条 react-refresh warning 为既有基线级别，可接受）。
- 单测：✅ onomastics 15/15 + useFortuneCache/assertions 6/6，无回归。




