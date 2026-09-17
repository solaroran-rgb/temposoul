# WORKLOG · 线程1 发布·产品·数据线（下一阶段）

> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败
> 接手顺序：任务卡.md → 本文件 → 产物目录 ｜ worktree：`.temposoul-wt\next-thread1`（thread/next1-product @ 723010f）

## 2026-09-14 00:25 ｜ T1-02 云存 charts + T1-03 账号删除 ✅（commit 09ee391）

- 做了什么：
  - `functions/api/_auth-shared.ts`：鉴权工具单一来源抽取（authenticate/verifyJwt/signJwt/hashPassword/corsPreflight）——防 H1 双份表复发；
  - `functions/api/charts.ts`：GET/POST/DELETE 云端排盘记录，**白名单脱敏**（只存年月日+干支结果+摘要；时分秒/经纬度/时区/真太阳时一律不收不存——部署计划书 5.5 隐私规范落地），配额 50 条/4KB，未认证 401；
  - `functions/api/auth/[[path]].ts`：重构为共享模块引用 + 新增 `delete-account`（级联清空 user/session/charts，旧 token 即刻失效）。
- 验证：新测试 `tests/charts-api.test.ts` 4 用例（脱敏 KV 原文层级断言/401/400/51 条拒绝/级联清理+token 失效）+ newsletter 回归 = **11/11**；踩坑一次：重写 auth 时 import 漏 signJwt（login 用），测试当场抓获即修。
- commit：09ee391 已推远端。前端 RecordsPage 接入留下一批（API 可先独立验收）。
- 下一步：T1-08 转化漏斗埋点 → T1-04 Lighthouse → BP1 批2（64 卦 CSV 导入 + iztro 映射层）。

## 2026-09-14 00:10 ｜ T1-06 终验 ✅ + 开工 T1-02

- core 全量回归 **1555/1555 全绿**（基线 1550+BP1 新 5 测试，零破坏）；thread/next1-product 已推远端（61abe2a + 34b294c）。
- 开工 T1-02 云存 charts：侦察 functions/api/auth 结构与 RecordsPage 存储现状。

## 2026-09-13 23:58 ｜ T1-06 BP1 键化批1 ✅（commit 61abe2a）

- 做了什么：命名基准核对（tools\bp1_key_check.py 与 T3 terms CSV 逐键比对：天干10/地支12/生肖12/五行5/十神10/六十甲子60 全 OK，64 卦 76 键留片2）→ `packages/core/src/ganzhi/term-keys.ts`（五类键表+getJiaziKey 程序生成）+ `packages/core/src/bazi/shishen-keys.ts`（十神键+getShiShenKey 别名不猜键）→ 两 index 挂导出 → 新测试 `tests/term-keys.test.ts`。
- 验证：core 构建 214 dist 零类型错误；键表测试 5/5；**test:api 108/108**；全量 test:core 后台验证中。
- 关键结论：纯新增导出零破坏（会签附加字段式落实）；wu 同 slug（戊干/午支）靠实体段区分；64 卦键（yijing:gua 76 键，六爻全名拼式非机械拼）与 iztro 映射层键留 BP1 批2。
- commit：61abe2a（分支 thread/next1-product 已推 solaroran-rgb）。

## 2026-09-13 23:40 ｜ 双线程开工初始化 ✅

- 做了什么：创建线程1/线程2 双 worktree（均基于最新部署线 723010f）；线程2 由后台子代理执行（T2-01 危机热线→T2-03 L4 分支引擎→T2-04 M3 全量→T2-02 词库批，条件执行）；线程1 依赖安装+core 构建后台进行。
- 产物路径：T1-01 内置 AI 启用清单（✅ 零代码结论：5 个 env 变量，唯一依赖=用户 DeepSeek key）；T1-10 阿里云迁移预案（✅ 香港轻量 Docker ¥24-34/月 推荐，DNS 切换+回滚预案成文）。
- 关键结论：T1-01 启用机制核毕——`AI_API_KEY/AI_BASE_URL/AI_MODEL/AI_BUILTIN_ENABLED/AI_DEFAULT_ENABLED` 五变量即上线，M1 合规链启用即生效；AI_DEFAULT_ENABLED 保持 false 作成本护栏。
- 下一步：T1-06 BP1 键化（ganzhi 常量对象化起步）→ T1-02 云存 charts → T1-03 账号删除。
- 阻塞项：⚠️ T1-01 等用户提供 DeepSeek API key（清单已备，拿到后 10 分钟可上线）；其余无阻塞。
