# 审计报告 · 第一阶段 任务包 04/05/06（内容补缺与合规修复）

- 审计时间：2026-09-20
- 审计分支：thread/t3-i18n-accuracy
- 审计方式：只读（Read / Grep / Glob），未改源码、未跑构建/测试
- 审计员：只读审计模式

> 说明：任务卡中给出的文件路径（如 `src/pages/fengshui/BaZhaiPage.tsx`、`src/pages/divination/QimenPage.tsx`、`src/pages/divination/LiuyaoPage.tsx`）在仓库中并不存在同名文件。实际实现分布在 `src/components/MetaphysicsPanel/`、`src/components/DivinationPanel/TraditionalDivinationBoard.tsx`、`src/data/ziwei-stars/` 等处。本报告以代码实际位置为准进行核查。

---

## 一、任务包 04 · 内容补缺（命理数据三件）

### 4.1 八宅凶名温和释义 ✅

- 实际位置：`src/components/MetaphysicsPanel/index.tsx`
- 证据：
  - L39–44 定义 `BA_ZHAI_GENTLE_EXPLANATION` 映射：
    - `'绝命': '能量冲克较强，宜缓行调整'`
    - `'五鬼': '易生口舌是非，宜谨言慎行'`
    - `'六煞': '人情事务繁杂，宜理清边界'`
    - `'祸害': '健康留意，宜注重调养'`
  - L539–543 在凶名标签下方渲染 `<small>` 温和释义：
    ```tsx
    {BA_ZHAI_GENTLE_EXPLANATION[item.label] && (
      <small ...>{BA_ZHAI_GENTLE_EXPLANATION[item.label]}</small>
    )}
    ```
- 结论：四大凶名（绝命/五鬼/六煞/祸害）均带温和括号式释义，已上屏。

### 4.2 紫微 14 主星语料合规粗查 ✅

- 实际位置：`src/data/ziwei-stars/*.ts`（14 颗主星：ziwei/tianji/taiyang/wuqu/tiantian/tongtian/lianzhen/qiusha/tianfu/taiyin/tanlang/jumen/tianxiang/pojun）
- 粗查关键词：`必|一定|注定|疾病|癌症|投资|股票|克夫|克妻|短寿|血光|横死|自杀|出轨|牢狱` 等
- 证据：
  - 命中仅为传统术语性描述，如太阴「主富、靠积蓄、不动产生财」、武曲「理财务实/财库稳守」、破军「先破后成」、贪狼「横发横破」等，均为流派语汇，未发现「必赚/必离婚/会得癌症」类硬断言。
  - `loaders.ts` L5–6 注释标注新增 AI 语料为「AI生成待专家审计」，留了审计标签。
- 结论：粗查未发现明显医疗/宿命/投资硬断言；语料以流派描述为主。建议后续专家对 14 颗星逐句过一遍（本次仅粗查）。

### 4.3 流年具体月份时间窗 ✅

- 实际位置：`src/pages/bazi/LiunianPage.tsx` + `src/pages/bazi/components/LiunianTimeline.tsx`
- 证据：
  - `LiunianTimeline.tsx` L10 类型 `monthWindows?: { startDate: string; endDate: string }[]`
  - L18–20 `formatMonthWindows` 输出形如 `` `${w.month}月(${w.startDate}—${w.endDate})` ``
  - L33 表头列「流月窗口」；L48–52 渲染每个流年的流月起讫节气日期。
  - `LiunianPage.tsx` L368–370 渲染 `<L0SummaryCard timeWindow={...}/>` + `<LiunianTimeline items={liunian} .../>`。
- 备注：L0SummaryCard 的 `l0TimeWindow`（L170–180）只到「当年」粒度，detail 写「可结合流月进一步细化节奏」；具体到「X月」的窗口由 LiunianTimeline 表格承担，已在页面上呈现。

---

## 二、任务包 05 · 占卜+合盘三件

### 5.1 奇门应期首屏可见 ✅

- 实际位置：`src/components/DivinationPanel/TraditionalDivinationBoard.tsx`
- 证据：奇门盘组件 `QimenBoard`（L415 起）结构顺序为
  1. L421–429 `<TraditionalMeta>`（值符/值使/节气/旬空/驿马）
  2. L430–463 **应期 section**（`aria-label="应期"`，标题「应期（事态显现的节奏与触发）」，含节奏/大致区间 N天~N天/描述/触发条件/限制）
  3. L464 才是九宫盘 grid
- 结论：应期信息紧跟 meta 行、在九宫盘之前，属首屏可见位置。

### 5.2 合盘相处建议卡（不加分数）✅

- 实际位置：`src/pages/bazi/CompatibilityPage.tsx`
- 证据：
  - L81 注释「5.2 内容补缺：基于双方日主十神关系推导相处模式与建议（规则化，不显示分数）」
  - L82–120 定义 `TenGodCategory` → mode/advice 映射（比和/我生/生我/我克/克我）
  - L193–200 `cohabit` useMemo 推导模式与建议
  - L411–422 渲染 `<h2>相处建议</h2>` 卡片：mode 标签 + advice 段落 + 边界说明「不计算、不显示匹配分数或成功率」。
- 结论：相处建议卡已加，且明确不加分数。

### 5.3 六爻卦爻辞展示 ✅

- 实际位置：`src/components/DivinationPanel/TraditionalDivinationBoard.tsx`（六爻/纳甲盘组件 L127 起）
- 证据：
  - L198–203 `<HexagramVerseCard label="本卦卦辞爻辞" name guaCi yaoCi />`
  - L204–210 变卦 `<HexagramVerseCard label="变卦卦辞爻辞" .../>`
  - L212–217 互卦 `<HexagramVerseCard label="互卦卦辞爻辞" .../>`
  - `HexagramVerseCard`（L99–103）渲染 `<b>卦辞</b>{guaCi}` 及爻辞列表。
- 结论：本/变/互三卦的卦辞爻辞均已上屏。

---

## 三、任务包 06 · 调试修复与合规五件

### 6.1 测试页移出导航 + noindex ✅

- 路由：`src/App.tsx` L409 `<Route path="/solution/test" element={<SolutionTestPage />} />`（保留路由供直链访问）。
- noindex：`src/config/batch4-routes.ts` L63 登记 `{ path: '/solution/test', requiresNoindex: true, ... }`；由 `src/components/platform/ComplianceGuard.tsx` L75–79 在路由命中时注入 `<meta name="robots" content="noindex, nofollow">`。
- 导航：`src/components/SiteNav.tsx` 中 grep `solution|test|测试` 仅命中风水测试/心理小测/姓名测试等业务测试项，**未出现 `/solution/test` 或「解盘引擎测试」入口**；`home-shortcuts.ts` 也无引用。
- 备注：`SolutionTestPage.tsx` 自身未调 `useNoindex()`，但 noindex 由全局 `ComplianceGuard` 统一注入，效果等价。

### 6.2 清宫表路由残留拦截 ✅

- 实际位置：`src/router/A23Routes.tsx`
- 证据：
  - L17 `const QinggongNoticePage = lazy(() => import('@/pages/divination/qinggong/QinggongNoticePage'))`
  - L41–42 注释「A23-4 清宫表（合规下线，直链统一落地说明页）」+ `<Route path="/divination/qinggong" element={wrap(<QinggongNoticePage />)} />`
  - `QinggongNoticePage.tsx` L5–6 说明「原交互工具因性别预测合规风险已停用；直链 /divination/qinggong 统一落地此说明页」，L18 标题「清宫表（生男生女预测）已暂停服务」。
  - 旧交互页 `QinggongPage.tsx` 在全仓 grep 仅自引用（L8/L12），**未被任何路由 lazy import / 引用**，成为死代码，不会被访问到。
- 备注：`src/data/divination/qinggong/table.ts` 数据仍在，但无路由可达；文化趣谈版 `/tools/qinggong-fun` 走 lightfun 路由（`LightFunRoutes.tsx` L66），不做性别预测。

### 6.3 全站免责声明 ✅

- 实际位置：`src/components/SiteFooter.tsx`
- 证据：
  - L4–5 注释「全局页脚免责声明——挂载于 App 布局层，所有非沉浸式页面底部固定展示」
  - L10–28 `<footer className="global-disclaimer" position:fixed>{t('disclaimer')}</footer>`
  - `src/App.tsx` L7 import、L532 `{!isSkyImmersive && <SiteFooter />}`（除沉浸式星盘页外全站挂载）。
  - 文案 `src/i18n/locales/zh-CN.ts` L92：「仅供娱乐与自我觉察，不构成任何专业建议。」；隐私区 L116 更长版本：「不构成任何医疗、法律、财务或人生决策建议。人生重大选择请咨询具备资质的专业人士。」
- 结论：全局 Footer 已挂，除沉浸式页外所有页面底部均出现免责声明。

### 6.4 22 禁词前端过滤 ⚠️（主链路已覆盖，AI 聊天框未过滤）

- 过滤函数：`src/lib/client-compliance.ts`
  - L1 注释「22 禁词（医疗/法律/投资/宿命/心理危机）过滤」
  - L36–46 `filterBannedWords(text)` 将命中禁词替换为 `［已过滤］`
  - 词表来源 `src/lib/server/compliance/blacklist.ts`：
    - 宿命 7 词、医疗 7 词、法律 5 词、投资 6 词、心理危机 5 词（合计约 30 词，比任务卡「22」略多，覆盖更全）。
- 已接入：
  - `src/components/fortune/L0SummaryCard.tsx` L6 import，L188/214/215/315/353 在白话结论/建议/摘要渲染前均调 `filterBannedWords`。
  - `src/components/fortune/L0ConclusionCard.tsx` L5 import，L206 逐条过滤后渲染。
- 缺口：`src/components/AIChatBox.tsx`（自由对话式 AI 输出，`renderMarkdown(content)` L57–63 直接 marked.parse 渲染）**未调用 `filterBannedWords`**，用户在流年/合盘等页追问式 AI 回复可能绕过前端禁词过滤。建议补一处 `renderMarkdown(filterBannedWords(content))`。

### 6.5 三道闸前端提示 ✅

- 判定函数：`src/lib/client-compliance.ts` L67–72 `evaluateThreeGates({ text, barnumRatio, confidenceDisclosed })` 返回 `{ safety, barnum, factual }`。
- UI 展示：
  - `L0SummaryCard.tsx` L106–110 `GATE_META = [安全闸/巴纳姆闸/事实闸]`；L236–244 调用 `evaluateThreeGates`；L459–465 渲染三个闸的通过/未通过徽章。
  - `L0ConclusionCard.tsx` L47–51 同样 `GATE_META`；L78–86 判定；L150–155 渲染三道闸提示条。
- 结论：安全闸（无禁词）/巴纳姆闸（≤0.25）/事实闸（无强断言+置信度披露）三道闸均有前端 UI 提示。

---

## 四、汇总

| 子任务 | 状态 | 代码证据（路径：行） |
|---|---|---|
| 4.1 八宅凶名温和释义 | ✅ | `src/components/MetaphysicsPanel/index.tsx:39-44, 539-543` |
| 4.2 紫微14主星语料合规粗查 | ✅ | `src/data/ziwei-stars/*.ts`（粗查无硬断言；`loaders.ts:5-6` 标 AI 待审） |
| 4.3 流年具体月份时间窗 | ✅ | `src/pages/bazi/components/LiunianTimeline.tsx:10,18-20,33,48-52` |
| 5.1 奇门应期首屏 | ✅ | `src/components/DivinationPanel/TraditionalDivinationBoard.tsx:430-463`（在九宫盘 L464 之前） |
| 5.2 合盘相处建议卡 | ✅ | `src/pages/bazi/CompatibilityPage.tsx:81-120, 193-200, 411-422` |
| 5.3 六爻卦爻辞 | ✅ | `src/components/DivinationPanel/TraditionalDivinationBoard.tsx:198-217`（本/变/互卦） |
| 6.1 测试页 noindex + 移出导航 | ✅ | `src/config/batch4-routes.ts:63` + `src/components/platform/ComplianceGuard.tsx:75-79`；`SiteNav.tsx` 无 `/solution/test` |
| 6.2 清宫表路由拦截 | ✅ | `src/router/A23Routes.tsx:41-42` → `QinggongNoticePage`；旧 `QinggongPage.tsx` 未被路由引用 |
| 6.3 全站免责声明 | ✅ | `src/components/SiteFooter.tsx:4-28` + `src/App.tsx:532`；文案 `i18n/locales/zh-CN.ts:92,116` |
| 6.4 22 禁词前端过滤 | ⚠️ | `src/lib/client-compliance.ts:36-46`；L0 卡片已过滤（`L0SummaryCard.tsx:188,315,353`、`L0ConclusionCard.tsx:206`）；**`AIChatBox.tsx` 未过滤** |
| 6.5 三道闸前端提示 | ✅ | `src/lib/client-compliance.ts:67-72`；`L0SummaryCard.tsx:106-110,459-465`、`L0ConclusionCard.tsx:47-51,150-155` |

## 五、遗留建议（非本次验收阻断项）

1. **6.4 缺口**：`AIChatBox.tsx` 的自由对话输出未过 `filterBannedWords`，建议在 `renderMarkdown` 入参前包一层过滤。
2. **4.2 深度审计**：本次仅关键词粗查，14 颗主星语料仍带「AI生成待专家审计」标签，建议专家逐句复核。
3. **4.3 L0 时间窗粒度**：`LiunianPage.tsx:170-180` 的 `l0TimeWindow` 仍只到「当年」，流月窗口由独立表格承担；若希望结论卡直接落月，可在 `l0TimeWindow` 内补流月条目。
4. **死代码**：`QinggongPage.tsx` 与 `src/data/divination/qinggong/table.ts` 已无路由可达，可考虑后续清理。
