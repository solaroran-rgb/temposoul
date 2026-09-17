# WORKLOG · 线程2 转译·内容·获客线

> 分支 thread/next2-content（worktree .temposoul-wt\next-thread2，基线 723010f）｜ 远程 solaroran-rgb

## 2026-09-13 · T2-01 心理危机热线预设 ✅

- **做了什么**：`src/lib/ai/compliance.ts` 新增危机干预层——中英双语危机倾向词表（轻生/自残/抑郁/英文 suicid*、self-harm 等 7 组正则）、`detectCrisis()`、7 语言热线表 `CRISIS_HOTLINES`（zh-CN: 12356+北京 010-82951332；en: 988+Samaritans 116 123；es/ja/ko/th/vi: findahelpline.com 指引，均标「待母语复核」）、system 危机干预指令 `buildCrisisSystemSection()`（最高优先级、放下命理框架、肯定生命价值、热线必须原样完整输出）、确定性收尾 `buildCrisisNotice()`。`proxy.ts` 接线：危机指令拼在 COMPLIANCE_RULES 之前；流尾热线由 proxy 直接写出（不经 OutputFuse/tagFilter，熔断/异常路径均兜底送达）。`COMPLIANCE_VERSION` m1.0→m1.1。
- **产物**：`src/lib/ai/compliance.ts`、`src/lib/ai/proxy.ts`、`tests/crisis-hotline.test.ts`
- **关键数据**：新增测试 10 项全过（命中/不误报/7 语言齐/指令优先级/热线文案过熔断安全/proxy 注入次序/流尾触达/危机+熔断共存/en 档 988/普通问题零影响）；回归 `test:api` 108/108 全绿；compliance+warning 既有 10 测全绿。
- **commit/push**：45b9317 → solaroran-rgb/thread/next2-content
- **下一步**：T2-03 分支选择引擎原型
- **阻塞**：无

## 2026-09-13 · T2-03 L4 分支选择引擎原型 ✅

- **做了什么**：新建 `src/lib/translation/branch-selector.ts`（纯确定性 `selectBranch`/`selectBranches`/`buildBranchSection`，零 LLM：条件命中取 priority 最小，条件盲区走无条件 fallback）+ 数据 `src/data/branch-definitions.ts`（十神 10 组 × 2-3 条件分支 + 1 fallback 共 31 分支；条件两维 `day_master_strength`（七级，T1 三倾向表决口径）+ `related_terms_present/absent`；白话按 V4.0 资产线示例风格（能量语言、禁吉凶词）起草，全标 draft，不伪造出处；archetype_key 用 T4 v1 三段式冒号形态）。
- **产物**：`src/lib/translation/branch-selector.ts`、`src/data/branch-definitions.ts`、`tests/branch-selector.test.ts`
- **关键数据**：新增测试 10 项全过（十神全覆盖/禁词扫描/七杀四分支逐一命中/条件盲区 fallback/多命中取 p1/absent 语义/key 归一化/批量排序去重/空值安全）；回归 `test:api` 108/108。
- **commit/push**：6512238
- **下一步**：T2-04 M3 全量接入
- **阻塞**：无

## 2026-09-13 · T2-04 M3 全量接入 ✅

- **做了什么**：`src/utils/ai/aiPrompts.ts`（真实 buildBaziPrompt 所在，任务卡写作 src/lib/ai/aiPrompts.ts 实为此文件）新增 `buildBranchMatches`（旺衰取 `analysis.dayMasterStrength.status` 七级 + relatedTerms 取四柱十神与藏干十神）与 `branchSection`，在两条构建路径（预设配置/通用）的 `anchorSection` 之后注入【分支白话】段（空段自然过滤，规避 buildPromptSection 空段坑）；`src/lib/ai/archetype-bridge.ts` provisional 注释按 T1 审计结论回填（十神 10×10 矩阵/旺衰三倾向表决七级/格局取用四层链/地支六合永不化）。
- **产物**：`src/utils/ai/aiPrompts.ts`、`src/lib/ai/archetype-bridge.ts`、`tests/bazi-prompt-archetype.test.ts`
- **关键数据**：新测试 7 项 + 既有 archetype 集成 10 项 + bazi-ai-prompt 30 项全过；`test:prompt` 229/229、`test:api` 108/108 全绿。
- **commit/push**：e9b2187
- **下一步**：T2-02 词库起草批次
- **阻塞**：无

## 2026-09-13 · T2-02 分支语义库起草批次 ✅（首批）

- **做了什么**：8080 本地 Qwen3.8-27B 探测可用（`/v1/models` 返回 Qwen3.8-27B-UD-VLM）→ 按条件执行。新建 `scripts/t2-branch-semantic.py`（复用 m2-gen-semantic 管线模式：enable_thinking=false、slot 礼让、2s 限速、3 次退避重试、JSONL 断点续传 `scripts/_t2_branch_semantic.jsonl`、msvcrt 实例互斥锁、禁词门禁），为 branch-definitions 全部 31 个分支各起草 1 条补充语义，写入 `src/data/branch-semantic-library.ts`（全标 draft，meta 注明模型与待终审状态；**不注入 AI prompt**——M3 段保持零 LLM 生成，仅作顾问终审内容资产）。批次 31 条 ≤60 上限。
- **产物**：`scripts/t2-branch-semantic.py`、`src/data/branch-semantic-library.ts`、`tests/branch-semantic-library.test.ts`（守卫测试：覆盖数/draft 标记/branchKey 对应/禁词门禁/长度）
- **关键数据**：31/31 生成成功、0 失败、0 触发禁词；守卫测试 3 项 + branch-selector 10 项全过；`test:api` 108/108。单批耗时约 4 分钟。
- **commit/push**：见 git log（t2-02 提交）
- **下一步**：词库 318→800 后续批次（pending_manual 术语 L1 起草）需按 50 条/批继续；本批为分支维度语义库
- **阻塞**：无（8080 管线可用）

## 总结 · 本线程当日收尾

- 提交链：45b9317（T2-01）→ a87feff（WORKLOG）→ 6512238（T2-03）→ e9b2187（T2-04）→ T2-02 提交，均推送 solaroran-rgb/thread/next2-content。
- 测试新增：crisis-hotline 10、branch-selector 10、bazi-prompt-archetype 7、branch-semantic-library 3，共 30 项；回归 prompt 229/229、api 108/108 全绿。
- 未做（按任务序列外）：T2-05 母语复核交付包、T2-06 回译实测、T2-07 视频发布、T2-08 Daily Energy（属获客/复核任务，本批未指派执行细节）。


