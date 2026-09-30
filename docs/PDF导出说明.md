# 报告 PDF 导出说明（流年 / 合婚 / 起名）

> 对应任务卡 T08（上线待办清单 #27）。落地日期：2026-09-30。

## 1. 结论先行

三类报告都支持导出 PDF，走**客户端打印引擎 + 服务端鉴权闸门**：页面点「导出 PDF」→ 先过 `/api/v1/report/export`（鉴权 + 限流）→ 浏览器打印对话框 → 另存为 PDF。
正文用的是与网页同一份 DOM 与 CSS，所以版式天然一致、中文字体零缺字，服务端不落地任何文件。

## 2. 选型取舍

| 方案                                                  | 版式与网页一致               | 中文字体                                      | 能否跑在本站                                                                                                     | 成本                        | 结论               |
| ----------------------------------------------------- | ---------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------ |
| 无头浏览器渲染（puppeteer / playwright）              | 好                           | 好                                            | **不行**：站点是 Cloudflare Pages（`wrangler.toml` + `functions/`），edge runtime 无子进程、无 CDP，起不了浏览器 | 依赖极重                    | 否决               |
| 服务端 PDF 库重排（pdf-lib 等）                       | 差（等于另写一套排版）       | 差（要打包 CJK 字体，edge 内存/包体都扛不住） | 理论可行                                                                                                         | 高                          | 否决               |
| 第三方 PDF 服务（PDFreactor 等）                      | 好                           | 好                                            | 可行                                                                                                             | 付费 + 报告含生日等隐私外发 | 否决（合规与成本） |
| **客户端打印引擎（`window.print` + `@media print`）** | **同一份 DOM/CSS，天然一致** | **系统字体，浏览器内嵌子集，零乱码零缺字**    | 纯静态即可                                                                                                       | 零新增运行时依赖            | **采纳**           |

关键约束：站点跑在 Cloudflare Pages edge runtime，任务卡里「Node 系优先 puppeteer/playwright 无头渲染」的假设在此不成立。

## 3. 落地清单

| 文件                                                                                   | 作用                                                                                            |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `functions/api/v1/report/export.ts`                                                    | 导出闸门：JWT 未登录 401、每用户 10 次/分钟限流 429、类型校验 400                               |
| `src/lib/report/pdf-export.ts`                                                         | 文件名规范 `命律-<类型>-<姓名>-<YYYYMMDD>.pdf`、取授权、触发打印                                |
| `src/components/ReportExportButton.tsx`                                                | 统一导出按钮（拿到授权才放行；401/429 给中文提示）                                              |
| `src/styles/print.css`                                                                 | `@page A4` + 打印态：隐藏导航/表单/按钮/AI 面板，卡片与标题不被跨页切断，流年时间轴只保留目标年 |
| `src/pages/bazi/LiunianPage.tsx` / `CompatibilityPage.tsx` / `name/NameReportPage.tsx` | 三类报告页接入导出入口                                                                          |
| `src/pages/bazi/components/LiunianTimeline.tsx`                                        | 时间轴行加统一类名，供打印态筛选目标年                                                          |
| `tests/report-export.test.ts`                                                          | 接口验收：401 / 400 / 200 / 429（4 条全过）                                                     |
| `scripts/gen-report-pdf-samples.ts`                                                    | 样例生成（headless 本机 Chrome，page.pdf 走的就是生产打印路径）                                 |

## 4. 验收结果

- **样例 PDF**：`artifacts/report-pdf-samples/`
  - 命律-流年报告-李承泽-20260930.pdf（3 页）
  - 命律-合婚报告-张若曦李承泽-20260930.pdf（3 页）
  - 命律-起名报告-李昭元-20260930.pdf（1 页）
- 中文正常（无乱码/缺字）、版式与网页一致、分页合理；导出接口未登录被拒（401）由 `tests/report-export.test.ts` 覆盖。
- 分页处理的要点：流年页默认渲染 1900–2100 全生命轴（摊开会到 20 页），打印态只保留目标年一行，收敛到 3 页。

## 5. 重跑样例

```bash
node_modules/.bin/vite --port 5199          # 需要先起 dev server
node_modules/.bin/tsx scripts/gen-report-pdf-samples.ts
```

dev server 不跑 Cloudflare Functions，脚本用与线上同一个内核函数（`@temposoul/core` 的 `baziCalculator` / `analyzeBaziCompatibility`）给 `/api/v1/bazi/*` 打桩，保证样例内容与线上同源。

## 6. 已知问题（本次未改，报备）

1. **流月窗口显示 `undefined月`**：`src/pages/bazi/components/LiunianTimeline.tsx` 的 `formatMonthWindows` 读 `w.month`，而内核返回的是其他字段，网页与 PDF 里都显示为 `undefined月(起讫)`。属既有缺陷，不在本卡「只导出不改内容」边界内。
2. **合婚「证据汇总」恒显示「暂无证据汇总数据」**：`/api/v1/bazi/compatibility/prompt` 的 `resultSummary` 不产出 `summaryFact`（`buildBaziCompatibilityPromptApi` 只回 `people/dayMasterRelation/spousePalaceRelations/evidence`），前端取 `summary` 恒为 null。属既有缺陷。
