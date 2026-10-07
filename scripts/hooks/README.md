# L3 计价熔断 pre-commit 钩子（T-15C · C3）

> 规则来源：`E-04 裁决补充《B-4 计价口径统一 20261008》` + B-3 17 条消解决策树。
> 真值定价模块：`packages/core/src/vedic/cost.ts`（`estimateVedicCost` / `VEDIC_L3_BREAKDOWN_THRESHOLD = 3`）。

## 计价口径（R2 区间制，冻结）

| 冲突数 | 处置 | 名义单价/批 | 本钩子行为 |
|---|---|---|---|
| 0 | 机器直出 + 抽检 | ¥0.5（L1） | 放行（exit 0） |
| 1–2 | 人工单条译审 | ¥15（L2） | 告警但放行（exit 0） |
| ≥3 | 人工全批译审 + 返工 | ¥150（L3） | **熔断拦截（exit 1）→ 有效计价 ¥0** |

- 「冲突」= key 库同一 term 的多义 sense 冲突（B-3 决策树判定）。
- L3 熔断语义：≥3 冲突在 CI pre-commit 拦下，不进入人工译审流水线，无效人工成本归零（`effectivePrice=¥0`）。
- 计价只用于成本核算/预算门禁，**不向用户收费**；R1 分级单价 ¥30/150/500 已作废。

## 文件

- `pre-commit-polysemy-breakdown.mjs`：钩子主体。默认读 `git diff --cached`；`--diff-file=<path>` 喂固定 diff 做两态自测。
- `install.mjs`：幂等安装到 `.git/hooks/pre-commit`（已有他人钩子则追加不覆盖）。

## 自动判定规则（结构性信号）

1. 取本次暂存（staged）改动。
2. 只统计 key 库文件（`src/data/mappings/`、`src/data/lexicon*.ts`）中**新增**的多义 sense 行，形如 `R('<namespace>', '<term>', '<senseId>', ...)`。
3. 对新增行里的 `term` 去重计数 = 冲突数。
4. ≥3 → exit 1 熔断；1–2 → exit 0 告警；0（含完全不碰 key 库的提交）→ exit 0 放行。

## 局限（如实登记）

- B-3 决策树的**最终语义判定**——某个 term 落到哪个 namespace 的 sense——属专家人工消歧，本钩子**不做语义裁决**。它是预算门禁/熔断：数出结构性冲突并在 ≥3 时拦下，转人工按 B-3 树消解后再提交。
- 非 key 库改动（页面/脚本/样式/内容）一律冲突数=0 直接放行，**不破坏既有提交流**。
- 失败策略：脚本自身任何异常 → fail-open 告警放行；仅正面数出 ≥3 冲突才 fail-closed 拦截。

## 两态自测

```powershell
# 阻断态（应 exit 1）
node scripts/hooks/pre-commit-polysemy-breakdown.mjs --diff-file=block.diff
# 放行态（应 exit 0）
node scripts/hooks/pre-commit-polysemy-breakdown.mjs --diff-file=pass.diff
```
