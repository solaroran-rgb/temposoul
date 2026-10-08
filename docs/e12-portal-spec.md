# E-12 门户层重审 · 门户页建设范式 Spec（Subagent 硬约束）

> 来源：E-12 论证卡（豆包综合裁决 20261008）+ A 席 tokens（E-11 视觉）。
> 用途：并行建设 /stars /living /plus 三个门户页，与 seed（AcademyPage.tsx）严格同构。

## 1. 必须复用的共享资产（已存在，禁止重写）

| 文件 | 路径 | 说明 |
|---|---|---|
| 共享样式 | `src/pages/portal/portal.css` | 全部样式类（portal-page / portal-hero / portal-card / portal-today / portal-tools / portal-compliance / portal-btn / portal-chip / portal-section 等）。**禁止新建 css 文件**，页面装饰用页面内 `<style>`（参照 AcademyPage） |
| 共享组件 | `src/pages/portal/PortalShared.tsx` | `PortalTodayCard`（每日新款入口·24h IANA）、`PortalToolBelt`（趣味工具带二级区）、`PortalCompliance`（合规句）。**必须复用，禁止自建** |
| 范式参考 | `src/pages/portal/AcademyPage.tsx` | seed 页，严格模仿其结构/类名/写法 |

## 2. 页面文件（你只负责写这一个文件）

- `/stars` → `src/pages/portal/StarsPage.tsx`，导出 `export function StarsPage()`
- `/living` → `src/pages/portal/LivingPage.tsx`，导出 `export function LivingPage()`
- `/plus` → `src/pages/portal/PlusPage.tsx`，导出 `export function PlusPage()`

## 3. 页面结构（固定顺序，与 AcademyPage 一致）

```
<div className="portal-page portal-page--<key>">
  <SeoHead title=... description=... />   // 中性文化向，title 含「命律 TempoSoul」
  <div className="portal-page__inner">
    <header className="portal-hero portal-hero--<key>">   // Hero 主角化，见 §4
      eyebrow / title / sub / cta（2 个 portal-btn）
      <style>…页面专属装饰…</style>       // 仅装饰，不新增类体系
    </header>
    <section className="portal-section">  // 内容主角区，portal-grid + portal-card×N
    </section>
    <PortalTodayCard />
    <PortalToolBelt />                    // 二级区（趣味工具带，底部弱化）
    <PortalCompliance />
  </div>
</div>
```

## 4. 每页内容要求（E-11 主角化）

### /stars 星律宇宙（P-1100，重设计）
- **Hero 锚定真实星空**：深色星空背景（CSS 星点/星轨渐变装饰）+ 月相视觉（可用 CSS 圆月装饰或引入 `src/lib/sky/moon.ts` 的月相计算，二选一，**禁止引入整个 SkyPage WebGL 场景**）；文案零「算命」；CTA=「沉浸星空 →」(/sky) + 星象日历(/astro/events)。
- **内容主角区=星象日历（真实天文）**，卡片 ≥6：`/astrolabe/moon-phase` 月相、`/astro/events` 星象日历（新月/满月/水逆）、`/astrolabe/ephemeris` 星历表、`/astrology/zodiac` 星座百科、`/astrolabe/mansions` 二十八宿、`/astrolabe/retrograde` 西占逆行、`/astrolabe/saturn-return` 土星回归、`/astrology/parenting` 育儿占星（learning）。
- **二级区**：natal/transits/synastry（西占排盘）**降为二级**——放在 PortalToolBelt 下方加一个「西占排盘（传统占星视角）」折叠/弱化小区块，链接 `/astrolabe/natal` `/astrolabe/transits` `/zodiac/compatibility` `/compatibility/birthday`，带合规句「此为传统命理观点」。**不得放 Hero/内容主角区**。

### /living 生活历法（P-1300，重设计）
- **Hero=今日历法卡**：直接展示今天日期 + 黄历要素（宜忌/生肖/干支可由你从既有数据源读取或静态示例+「每日更新」标注），CTA=「今日黄历」(/almanac) + 万年历(/almanac/calendar)。
- **内容主角区前置 almanac/calendar**：`/almanac` 今日黄历、`/almanac/calendar` 万年历、`/almanac/select` 择日工具、`/almanac/directions` 吉位煞向、`/almanac/is-lucky/marriage` 婚嫁吉日、`/daily/today`、`/calendar/pick` 择时工具、`/tools/life-rhythm-calendar` 节律月历。
- **中位 zodiac/names/fengshui**：`/zodiac/fortune` 生肖运势、`/zodiac/buddha` 生肖本命佛、`/zodiac/tai-sui` 太岁查询、`/names` 智能起名、`/kangxi` 康熙字典、`/name-test` 姓名测试、`/insights/name-popularity-trends` 名字热度趋势、`/fengshui/bazhai` 八宅风水、`/tools/yangzhai-fengshui-test` 阳宅趣味测。
- **divination/fun 降底部**：已在 PortalToolBelt（趣味工具带），不额外放置；如需补充 fun 链接仅限：`/tools/birthday-code` `/tools/fun-psych-tests` `/gems` `/divination/fingerprint`。
- **Hero 无占卜词**（「黄历」「历法」「生活」主题）。

### /plus 专家与会员（P-1600，中性商业门户）
- **Hero=会员权益**：权益主题（免费层/订阅/深度内容），CTA=「查看定价」(/pricing) + 「会员中心」(/membership)。不涉占卜主推。
- **内容主角区**（consult/experts/membership/pricing/vip/shop 全保留）：`/pricing` 订阅定价、`/membership` 会员中心、`/vip` 会员权益、`/consult` 在线咨询、`/experts` 专家团队、`/shop` 商城、`/account/credits` 积分充值、`/account/points` 积分中心、`/account/rewards` 奖励中心、`/affiliate` 联盟营销、`/partners/creator-syndicate` 创作者联盟、`/services/senior-name-consultant` 顾问测名。
- 商业文案中性，不做疗效/决定类断言。

## 5. 硬约束（红线，违反即退回）

1. **Hero 区（eyebrow/title/sub/cta 文案）禁止出现**：算命、占卜、命运、预测、运势、注定。grep 会抽查。
2. **全局禁词 0**：药方、诊断、注定（全页含 Hero 与描述）。
3. **链接白名单**：只使用本 Spec §4 列出的路由 + `/#paipan-tool` + `/search`。**禁止自创/猜测 URL**（153 冻结）。
4. **类名体系**：只消费 portal.css 的类；页面装饰用 `<style>` 内嵌，选择器以 `.portal-hero--<key>` 或 `.portal-page--<key>` 为前缀。
5. **不 import** 任何他人文件（除 PortalShared/portal.css/SeoHead/既有数据源）。
6. 文案中性文化向、原创、不编造数据；「传统命理观点」句由 PortalCompliance 统一承载，二级涉占区块可再附一句（文字 `此为传统命理观点`）。
7. **只写你的目标文件**，不修改 portal.css / PortalShared.tsx / AcademyPage.tsx / 任何其他文件。

## 6. 交付自检（完成后逐项自查并在返回中报告）

- [ ] 目标文件已写入 `src/pages/portal/<Page>.tsx` 绝对路径
- [ ] Hero 无占卜词（自查 + 给出 Hero 文案清单）
- [ ] 全局无 药方/诊断/注定
- [ ] 所有链接 ∈ 白名单
- [ ] 结构顺序与 AcademyPage 一致（Hero→内容主角区→Today→ToolBelt→Compliance）
- [ ] 文件可被 TypeScript 编译（无类型错误，import 路径正确）
