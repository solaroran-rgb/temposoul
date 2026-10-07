# E-08 · 报告 PDF 渲染管线（pdfkit + CJK 字体子集）

服务端 / 脚本侧可复用的中文 PDF 渲染模块。选型：**pdfkit**（纯 JS，无 headless 浏览器依赖，契合付费报告服务端可靠出件）。
本目录为**独立模块**，自带 `node_modules`，不接入根 pnpm workspace，不改动根 `package.json` / `pnpm-lock.yaml`。

## 目录与入口

| 文件 | 作用 |
| --- | --- |
| `renderReportPdf.mjs` | **可复用管线主入口**：`renderReportPdf({ report, outPath, fullFontBuffer, subset=true })` |
| `subset.mjs` | 收集报告字符 + harfbuzz 字体子集化 |
| `fontSource.mjs` | 定位中文字体（env > 仓库 assets > Windows 系统字体） |
| `sample-content.mjs` | 十维报告样例数据（对应 `src/lib/server/report/generator.ts` 的 `TenDimReport` 结构） |
| `gen-sample.mjs` | CLI：生成样例 PDF + 全字体对比 PDF + 证据 JSON |
| `verify-subset.mjs` | CLI：解析任意 PDF，报告内嵌 `BaseFont` 与解压后字体程序字节 |
| `_preview.mjs` | 开发辅助：用 Chromium 把 PDF 截图成 PNG 肉眼核验 |

未来 N-07 异步报告 job 集成方式：`import { renderReportPdf } from './renderReportPdf.mjs'`，
传入 `TenDimReport.structured` 适配后的对象 + 字体 buffer，拿到 PDF Buffer / 写盘路径即可入对象存储。

## 字体（CJK 字体内嵌来源）

- **源字体路径（本机）**：`C:\Windows\Fonts\simhei.ttf`（黑体，单文件 TTF，9,745,792 字节）
- 备选：`C:\Windows\Fonts\Deng.ttf`（等线）、`C:\Windows\Fonts\simkai.ttf`（楷体）
- 覆盖优先级见 `fontSource.mjs`，可用环境变量 `TEMPOSoul_CJK_FONT` 覆盖。
- **为何不把整份字体提交进仓库**：simhei.ttf 系微软系统字体，含许可限制且 9.7MB 过大；
  管线运行时按路径读取，**只把报告用到的字形子集嵌入 PDF**。如需仓库内自包含，
  把一个可再分发的开源中文字体（如思源黑体/Noto Sans CJK 的 OTF/TTF）放到 `assets/fonts/` 即可，管线自动优先。

## 运行方式（重新生成样例）

```powershell
cd "E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\scripts\pdf-render"
# 首次：安装隔离依赖（已装好则跳过）
npm install --no-audit --no-fund
# 生成样例 PDF + 证据
node gen-sample.mjs
# 单独核验某个 PDF 的内嵌字体
node verify-subset.mjs "out\命律-十维报告样例.pdf"
```

产物（`out/`）：
- `命律-十维报告样例.pdf` —— 交付样例（6 页，中文完整渲染）
- `_证据_全字体嵌入对比.pdf` —— 同内容、传入整字体的对比件
- `assets/simhei.subset.ttf` —— harfbuzz 产出的子集字体实体
- `subset-evidence.json` —— 体积 / 内嵌字体证据（可复跑刷新）

## 字体子集证据（实测 2026-10-08）

| 指标 | 数值 |
| --- | --- |
| 源字体整份 | 9,745,792 B（9.7 MB） |
| 报告用到字符数 | 711 |
| harfbuzz 子集字体实体 | 152,204 B |
| PDF 内 `BaseFont` | `CZZZZZ+SimHei`（**6 字母前缀 = PDF 标准子集标记**） |
| PDF 内嵌字体程序（FlateDecode 解压后） | **138,796 B** |
| 内嵌 / 整份字体 | **1.42 %** |
| 样例 PDF 总体积 | 95,803 B（≈94 KB） |

关键事实（如实说明，不夸大）：
- pdfkit 在嵌入 TrueType 时**本身就只写页面用到的字形**（即使传入整份 9.7MB 字体，
  内嵌程序也只有 ~140KB，`BaseFont` 同样带 `CZZZZZ+` 子集前缀）。这是本管线体积可控的根本原因。
- 本模块额外用 harfbuzz（`subset-font`）做**显式预子集**，产出可审计的 `simhei.subset.ttf`，
  并对字符集做安全兜底（ASCII + 常用中文标点），避免 pdfkit 内部行为变动时失控。
- 复跑 `node verify-subset.mjs <pdf>` 即可重新量出内嵌字体程序字节。

## 七语支持方案（本期仅中文落地，其余给方向）

- **中文（zh）**：本期已落地。源 `simhei.ttf`，子集内嵌，渲染正常。
- **日文（ja）**：思路同中文，换含日文汉字 + 假名的字体（如 Noto Sans JP / 筑紫）。
  注意日文汉字与中文汉字字形不同（如「直」「骨」「关」），**不能直接复用 simhei**，需按 lang 选字体族。
  pdfkit 内嵌多字体：`doc.registerFont('ja', jaSubsetTtf)` 后按语种切 `doc.font('ja')`。
- **韩文（ko）**：需含 Hangul 的字体（Noto Sans KR）。Hangul 音节组合数极大，
  必须靠子集按报告实际字符裁剪，否则单字体可达十几 MB。管线的 `collectUsedChars` 已自动收集，可直接复用。
- **泰文（th）**：泰文有上下组合元音/声调符号，**排版复杂度高**，pdfkit 基础文本排版对泰文 shaping
  支持有限。建议泰文报告改走「HTML→PDF（Chromium/WeasyPrint）」分支，或在 pdfkit 内仅做纯文本、
  复杂 shaper 交给浏览器打印路径。本期不实现。
- 落地原则：每语种一个子集字体文件 + 一个 lang→字体映射表；新增语种 = 加一个字体源 + 一条映射，不改管线。

## 依赖变更记录

- 本模块 `scripts/pdf-render/package.json` 新增隔离依赖：`pdfkit@^0.20.2`、`subset-font@^2.9.0`。
- **未改动根 `package.json` / `pnpm-lock.yaml`**（二者当时已有并行批次未提交修改，保持零连带）。
- 依赖装在 `scripts/pdf-render/node_modules`（独立），纯 JS 无原生编译。
