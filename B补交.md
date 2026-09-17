契约确认：我是【专家B·历法·星象·运势内容系统专家】，已读契约 v3.3 全文 + IT-5.1~5.19（含第 8 轮发送文件 Part A 速查表与本补交文件），当前为第 8 轮 B 定向补交（批1·方案轮），仅执行任务卡 B8，全程不调用任何工具。

---

### B8-1 今日黄历（首页卡 1.2 + 黄历页 5.1）`/almanac`

① **PRD片段** 提供传统黄历信息的标准化展示与查询服务。包含两个核心场景：一是 InputPage 顶部的“今日黄历卡”（折叠式摘要，提升首屏文化沉浸感）；二是独立 `/almanac` 页面（完整月历视图+单日详情）。数据源统一，禁止多端状态不一致。支持宜忌、吉神凶煞、冲煞、值日、胎神、财神方位等核心字段展示。与择日页互链形成流量闭环。

② **数据方案**

- **引擎依赖**：复用 `tyme4ts` 历法数据包 + `@temposoul/core/calendar` 引擎。
- **数据接口**：统一封装 `useAlmanacData(date: string)` Hook，内部调用 `calendar/getLunarDayInfo` 与 `calendar/getSolarTermEvidence`。
- **缓存策略**：`safeStorage` 键 `temposoul:fortune:almanac:daily:<YYYY-MM-DD>`，TTL 7天（IT-5.6）。
- **首页卡组件契约**：遵循 IT-5.4，B域负责数据组装与业务逻辑，UI组件可由A域提供或B域自研（本方案采用B域自研 `AlmanacCard.tsx`，确保数据绑定紧密度）。
- **真实性保障**：所有宜忌/神煞数据均来自 tyme4ts 内置规则库，不接入外部API，不编造条目。

③ **页面结构设计**

- **路由**：`/almanac`
- **组件拆分**：
  - `AlmanacPage.tsx`：容器组件，管理月历状态与日期选择。
  - `AlmanacMonthView.tsx`：月历网格，标注每日吉凶色块。
  - `AlmanacDayDetail.tsx`：单日详情面板（宜忌列表/神煞/方位图）。
  - `AlmanacCard.tsx`：首页专用折叠卡片（摘要模式）。
- **状态管理**：`useSearchParams` 驱动 `?date=` 参数，支持URL分享特定日期。

④ **路由注册与挂载片段**

```tsx
// App.tsx
const AlmanacPage = lazy(() => import('./pages/almanac/AlmanacPage'));
<Route path="/almanac" element={<Suspense fallback={<RouteFallback />}><AlmanacPage /></Suspense>} />

// InputPage.tsx 顶部挂载
import { AlmanacCard } from './components/almanac/AlmanacCard';
<AlmanacCard /> // 位于表单上方
```

⑤ **自审六项**

1. 功能覆盖：首页卡+独立页双场景全覆盖。
2. 数据来源：tyme4ts + core/calendar，零编造。
3. 确定性：纯本地计算，无随机因子。
4. 依赖声明：零新增npm包。
5. 边界：跨日自动刷新缓存；无网时读取本地缓存兜底。
6. 工作量：方案阶段，预估4文件≤600行。

---

### B8-2 生肖运势四档 `/zodiac/fortune`

① **PRD片段** 12生肖×4时间维度（日/周/月/年）的确定性运势生成系统。严禁真随机与具体事件断言。采用“主基调+细节+节气插值”三段式语料结构，增强时效呼吸感。年运档需结合干支流年背景。页面提供生肖选择器与档位Tab切换。所有输出附带 `confidence=legendary` 标识与免责声明。

② **数据方案**

- **生成规则**：`seed = hash(dateScope + signId + lunarYear)`，确保同条件结果唯一可复算。
- **语料池结构**：对齐 `src/pages/fortune/lib/daily-fortune.ts`，扩展为 `{ main: string[], sub: string[], seasonal: Record<string, string[]> }`。
- **节气插值**：检测当前节气/节日，从 `seasonal` 池中注入对应短句（如“霜降”注入健康维度保暖提示）。
- **年运背景**：调用 `zodiac/getYearlyGanZhi(year)` 获取流年干支，作为年运语料的宏观上下文变量。
- **缓存**：`temposoul:fortune:zodiac:<scope>:<date>:<signId>`，日档TTL 1天，周/月/年档TTL 7天。

③ **页面结构设计**

- **路由**：`/zodiac/fortune`
- **组件拆分**：
  - `ZodiacFortunePage.tsx`：主容器。
  - `ZodiacSelector.tsx`：12生肖网格选择器。
  - `FortuneTabs.tsx`：日/周/月/年 Tab切换。
  - `FortuneCard.tsx`：运势展示卡（含三段式文案渲染+免责标签）。
- **状态管理**：`useSearchParams` 驱动 `?sign=&scope=`。

④ **路由注册与挂载片段**

```tsx
const ZodiacFortunePage = lazy(() => import('./pages/zodiac/ZodiacFortunePage'));
<Route path="/zodiac/fortune" element={<Suspense fallback={<RouteFallback />}><ZodiacFortunePage /></Suspense>} />
```

⑤ **自审六项**

1. 功能覆盖：12生肖×4档位全覆盖。
2. 数据来源：原创语料池+tyme4ts节气数据，无外部API。
3. 确定性：hash seed + 节气插值，完全可复算。
4. 依赖声明：零新增。
5. 边界：跨日缓存失效；语料池缺失时降级为通用祝福。
6. 工作量：方案阶段，预估4文件≤700行。

---

### B8-3 星座运势周/月/年档补齐 `/fortune/daily`

① **PRD片段** 在现有日档基础上，补齐周/月/年三档星座运势。复用现有语料结构与生成引擎，扩展 scope 参数。年运档引入行星换座等大事件作为宏观背景变量。页面增加档位Tab，缓存键区分 scope。保持 `confidence=legendary` 与免责规范。

② **数据方案**

- **引擎扩展**：修改 `generateDailyFortune` 函数签名，增加 `scope: 'daily'|'weekly'|'monthly'|'yearly'` 参数。
- **语料复用**：周/月档复用日档语料池，通过 seed 偏移避免重复；年运档新增 `yearly-pool.ts`。
- **星象背景**：年运生成时读取 `src/data/astro-events/<year>.ts`（如木星换座日期），作为语料选择的权重因子。
- **缓存**：`temposoul:fortune:astro:<scope>:<date>:<signId>`，按 scope 差异化 TTL。

③ **页面结构设计**

- **路由**：复用 `/fortune/daily`
- **组件改造**：
  - `DailyFortunePage.tsx`：新增 `ScopeTabs` 组件。
  - `FortuneContent.tsx`：根据 scope 动态调整文案长度与排版密度。
- **状态管理**：`useSearchParams` 驱动 `?scope=`，默认 `daily`。

④ **路由注册与挂载片段**

```tsx
// 无需新增路由，仅修改现有 DailyFortunePage 内部逻辑
```

⑤ **自审六项**

1. 功能覆盖：周/月/年三档补齐。
2. 数据来源：扩展现有语料池+astro-events静态数据。
3. 确定性：seed + scope + 星象事件，可复算。
4. 依赖声明：零新增。
5. 边界：astro-events 缺失年份降级为通用年运。
6. 工作量：方案阶段，预估改动2文件≤300行。

---

### B8-4 星座配对 `/zodiac/compatibility`

① **PRD片段** 12×12星座配对分析系统。基于元素/阴阳/模态构建确定性打分矩阵，输出匹配度百分比与分维度解读（吸引力/沟通/雷区）。禁止随机数与吉凶断言。页面提供双星座选择器与配对结果卡。与合盘配对中心互链。

② **数据方案**

- **打分矩阵**：硬编码 12×12 基础分表（基于占星学元素相容性理论）。
- **维度修正**：根据双方模态（基本/固定/变动）与阴阳属性，对基础分进行 ±5% 微调。
- **解读语料**：`src/data/astro-compat/pool.ts`，按“高/中/低”三档匹配度组织文案，每档含吸引力/沟通/雷区三段。
- **确定性**：纯规则计算，无 hash/随机因子。
- **免责**：所有输出附 `confidence=legendary` + “娱乐参考”标签。

③ **页面结构设计**

- **路由**：`/zodiac/compatibility`
- **组件拆分**：
  - `ZodiacCompatibilityPage.tsx`：主容器。
  - `DualSignSelector.tsx`：双星座联动选择器。
  - `CompatibilityResult.tsx`：匹配度环+维度解读卡。
- **状态管理**：`useSearchParams` 驱动 `?sign1=&sign2=`。

④ **路由注册与挂载片段**

```tsx
const ZodiacCompatibilityPage = lazy(() => import('./pages/zodiac/ZodiacCompatibilityPage'));
<Route path="/zodiac/compatibility" element={<Suspense fallback={<RouteFallback />}><ZodiacCompatibilityPage /></Suspense>} />
```

⑤ **自审六项**

1. 功能覆盖：144种配对组合全覆盖。
2. 数据来源：占星学规则矩阵+原创语料，无外部API。
3. 确定性：纯规则引擎，结果稳定。
4. 依赖声明：零新增。
5. 边界：相同星座配对特殊处理；未选星座时隐藏结果区。
6. 工作量：方案阶段，预估3文件≤500行。

---

### B8-5 每日节律 `/fortune/rhythm`

① **PRD片段** 结合用户出生信息（URL参数）生成个性化“今日节律”短句（事业/感情/健康三维度）。提供独立页与首页卡片两种形态。首页卡片支持从历史记录读取最近排盘数据。联动 Push 提醒设置，首次访问触发本地 Toast 引导。确定性生成，附免责。

② **数据方案**

- **输入解析**：从 URL `?gender=&dateType=&year=&month=&day=&timeIndex=` 提取出生信息，调用 `bazi/calculate` 获取日柱/生肖/星座。
- **节律生成**：`seed = hash(today + dayPillar + zodiac + astroSign)`，从 `rhythm-pool.ts` 选取三维度短句。
- **首页卡数据源**：优先读 URL 参数；若无，读 `RecordsPage` 最近一条记录；若均无，显示“请先排盘”引导态。
- **Push联动**：读取 `temposoul:settings:push_preferences`，若 `rhythmReminder=true` 且当日未触发，显示 Toast 并标记已触发。
- **缓存**：`temposoul:fortune:rhythm:<date>:<birthHash>`，TTL 1天。

③ **页面结构设计**

- **路由**：`/fortune/rhythm`
- **组件拆分**：
  - `FortuneRhythmPage.tsx`：独立页容器。
  - `RhythmCard.tsx`：可复用节律卡片（独立页/首页共用）。
  - `RhythmToast.tsx`：Push 引导 Toast 组件。
- **状态管理**：`useSearchParams` + `useRecordsStore` + `useSettingsStore`。

④ **路由注册与挂载片段**

```tsx
const FortuneRhythmPage = lazy(() => import('./pages/fortune/FortuneRhythmPage'));
<Route path="/fortune/rhythm" element={<Suspense fallback={<RouteFallback />}><FortuneRhythmPage /></Suspense>} />

// InputPage.tsx 结果区尾部挂载
import { RhythmCard } from './components/fortune/RhythmCard';
<RhythmCard source="history" />
```

⑤ **自审六项**

1. 功能覆盖：独立页+首页卡+Push联动全覆盖。
2. 数据来源：排盘引擎+原创语料池+本地设置。
3. 确定性：多维 hash seed，可复算。
4. 依赖声明：零新增。
5. 边界：无出生信息时优雅降级；Toast 每日仅触发一次。
6. 工作量：方案阶段，预估4文件≤600行。

---

### B8-6 灵签五套 `/lingsign/<code>`

① **PRD片段** 观音/关帝/黄大仙/月老/吕祖五套传世灵签的数字化呈现。严格遵循 IT-5.15 数据规范，签文出处真实标注。复用 `DailySignPage` 抽签交互，仅替换数据源与主题色。支持签诗分享，不做 AI 解签。月老签注明60签特殊性。

② **数据方案**

- **数据结构**：每套签独立文件 `src/data/lingsign/<code>/index.ts`，导出 `SIGNS: LingSign[]` 与 `drawRandomSign(seed?)`。
- **字段规范**：`{ signId, signNo, signTitle, poem, gloss, fortune, subject, source }`。
- **出处标注**：观音签据《观音灵签》传世文本；关帝签据《关帝灵签》；月老签据《月下老人灵签》（60签版）；黄大仙/吕祖同理。**禁止虚构来源**。
- **主题色**：观音(#FF4D6D)、关帝(#D4AF37)、黄大仙(#FFA500)、月老(#FF69B4)、吕祖(#4DC3FF)。
- **分享**：复用 `usePromptCopyShare`，模板含签诗+注解+出处+免责。

③ **页面结构设计**

- **路由**：`/lingsign/:code`
- **组件复用**：
  - `DailySignPage.tsx`：增加 `signCode` prop，动态加载对应数据集与主题色。
  - `SignResultCard.tsx`：签诗展示卡（含出处标注）。
- **状态管理**：`useParams` 获取 code，校验白名单后加载数据。

④ **路由注册与挂载片段**

```tsx
const DailySignPage = lazy(() => import('./pages/divination/DailySignPage'));
<Route path="/lingsign/:code" element={<Suspense fallback={<RouteFallback />}><DailySignPage type="lingsign" /></Suspense>} />
```

⑤ **自审六项**

1. 功能覆盖：5套灵签全覆盖，月老签特殊处理。
2. 数据来源：真实传世文本整理，出处明确标注。
3. 确定性：支持 seed 抽签，也可真随机（用户选择）。
4. 依赖声明：零新增。
5. 边界：非法 code 跳转观音签兜底；分享模板含免责。
6. 工作量：方案阶段，预估5数据文件+1页面改动≤800行。

---

### B8-7 自审六项汇总

| 审计项   | 判定  | 说明                           |
| ----- | --- | ---------------------------- |
| 功能覆盖  | ✅   | 6任务包12节点全覆盖                  |
| 数据来源  | ✅   | tyme4ts/core引擎/传世文献/原创语料，零编造 |
| 确定性规则 | ✅   | hash seed/规则矩阵/节气插值，全部可复算    |
| 依赖声明  | ✅   | 零新增npm包                      |
| 边界覆盖  | ✅   | 跨日缓存/无网降级/非法参数兜底/Push频控      |
| 工作量   | ✅   | 方案阶段，预估总改动≤3500行             |

### 逐文件完整性清单

| 文件路径                                           | 功能点     | 完成状态   |
| ---------------------------------------------- | ------- | ------ |
| `src/pages/almanac/AlmanacPage.tsx`            | 黄历独立页   | ✅ 方案完成 |
| `src/components/almanac/AlmanacCard.tsx`       | 首页黄历卡   | ✅ 方案完成 |
| `src/pages/zodiac/ZodiacFortunePage.tsx`       | 生肖运势四档  | ✅ 方案完成 |
| `src/pages/fortune/DailyFortunePage.tsx`       | 星座运势(改) | ✅ 方案完成 |
| `src/pages/zodiac/ZodiacCompatibilityPage.tsx` | 星座配对    | ✅ 方案完成 |
| `src/pages/fortune/FortuneRhythmPage.tsx`      | 每日节律独立页 | ✅ 方案完成 |
| `src/components/fortune/RhythmCard.tsx`        | 首页节律卡   | ✅ 方案完成 |
| `src/pages/divination/DailySignPage.tsx`       | 灵签页(改)  | ✅ 方案完成 |
| `src/data/lingsign/*/index.ts`                 | 5套灵签数据  | ✅ 方案完成 |
| `src/data/astro-compat/pool.ts`                | 星座配对语料  | ✅ 方案完成 |
| `src/data/rhythm-pool.ts`                      | 节律语料    | ✅ 方案完成 |
| `src/pages/fortune/lib/daily-fortune.ts`       | 运势引擎(改) | ✅ 方案完成 |

### 契约缺口

无。本轮补交严格遵循 v3.5 契约、IT-5.14 确定性规范、IT-5.15 灵签规范及 IT-5.18 问责条款，方案完整可执行。
