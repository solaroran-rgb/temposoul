# -*- coding: utf-8 -*-
"""双线程开工收口：从 next2 worktree 同步 WORKLOG/产物到主树 + 计划勾选。"""
import io
import os
import re
import shutil

BASE = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统"
WT2 = os.path.join(BASE, r".temposoul-wt\next-thread2")
DOCS = r"docs\audit\2026-09-13-上线前加固\下一阶段"

# 1) 同步线程2 WORKLOG（分支内提交的）到主树交接目录
src_wl = os.path.join(WT2, DOCS, r"线程2-转译内容获客线\WORKLOG.md")
dst_wl = os.path.join(BASE, DOCS, r"线程2-转译内容获客线\WORKLOG.md")
if os.path.exists(src_wl):
    shutil.copy2(src_wl, dst_wl)
    print("WORKLOG synced:", os.path.getsize(dst_wl), "bytes")
else:
    print("WARN: thread2 WORKLOG not found at", src_wl)

# 2) 计划文件勾选已完成项
plan_path = os.path.join(BASE, r"docs\audit\2026-09-13-上线前加固\下一阶段工作计划.md")
with io.open(plan_path, "r", encoding="utf-8") as f:
    plan = f.read()

done_marks = {
    "☐ W0.1": "✅ W0.1",  # 保留原行首，改勾
}
replacements = [
    ("☐ P1.1 **内置 AI 解读启用**", "🟡 P1.1 **内置 AI 解读启用**（清单就绪待 key）"),
    ("☐ P1.2 心理危机热线预设", "✅ P1.2 心理危机热线预设（线程2 @45b9317）"),
    ("☐ P1.5 排盘记录云端保存最小版", "✅ P1.5 排盘记录云端保存最小版（线程1 @09ee391，API 侧；前端 UI 待接）"),
    ("☐ P1.6 账号删除（GDPR 最小合规）", "✅ P1.6 账号删除（GDPR 最小合规）（线程1 @09ee391）"),
    ("☐ P1.8 首页品牌收口", "🟡 P1.8 首页品牌收口（Slogan 已落 @34b294c；空哲学文件处置待定）"),
    ("☐ P2.1 词库 800 MVP 收口", "🔄 P2.1 词库 800 MVP 收口（线程2 分支语义库 31 条 @d7abe00 起步）"),
    ("☐ P2.2 L4 分支选择引擎原型", "✅ P2.2 L4 分支选择引擎原型（线程2 @6512238，十神 31 分支）"),
    ("☐ P2.3 BP1 引擎键化实施", "🔄 P2.3 BP1 引擎键化实施（批1 @61abe2a：99 键；批2=64卦/iztro 映射层待做）"),
    ("☐ P2.5 M3 全量接入", "✅ P2.5 M3 全量接入（线程2 @e9b2187，含分支白话注入）"),
    ("☐ W0.8（新增）阿里云迁移预备", "✅ W0.8（新增）阿里云迁移预备（T1-10 预案成文）"),
]
n = 0
for old, new in replacements:
    if old in plan:
        plan = plan.replace(old, new)
        n += 1
with io.open(plan_path, "w", encoding="utf-8") as f:
    f.write(plan)
print("plan checkboxes updated:", n)

# 3) 双线程首批战报追加到计划文件尾
addition = """

---

## 双线程首批战报（2026-09-14 00:40 更新）

| 线程 | commit 链（已推 solaroran-rgb） | 交付 | 测试 |
|---|---|---|---|
| 线程1 next1-product | 61abe2a → 34b294c → 09ee391 | BP1 键化批1（99 键，与术语 CSV 0 分歧）/ Slogan 落 SEO / 云存 charts（白名单脱敏）/ 账号删除级联 / T1-01 启用清单 / T1-10 阿里云预案 | 键表 5/5 + api 108/108 + **core 1555/1555** + charts 11/11 |
| 线程2 next2-content | 45b9317 → a87feff → 6512238 → e9b2187 → d7abe00 | 危机热线（7 语言+流尾绕熔断触达）/ L4 分支引擎（十神 31 分支纯确定性）/ M3 全量（分支白话注入真实 prompt）/ 分支语义库 31 条（8080 管线 31/31） | 新测试 30/30 + api 108×4 + prompt 229 |

**合并预检**：`git merge-tree next1 × next2` = **零冲突**，可并行合并（合并权在主控；合并后跑全量三套件）。
**任务卡偏差修正**：M3 接线点实为 `src/utils/ai/aiPrompts.ts`（任务卡误写 src/lib/ai/，线程2 按实况接线并记录）。
"""
if "双线程首批战报" not in plan:
    with io.open(plan_path, "a", encoding="utf-8") as f:
        f.write(addition)
    print("battle report appended")
