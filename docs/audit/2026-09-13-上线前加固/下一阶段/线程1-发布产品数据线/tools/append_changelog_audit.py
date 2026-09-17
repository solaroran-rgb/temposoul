# -*- coding: utf-8 -*-
"""子图A §十三落盘审计：更新日志 UTF-16LE 置顶追加。"""
import io

P = r"E:\KnowledgeOS\AI地图\_更新日志.md"
ENTRY = (
    "- 2026-09-14 **双线程首批落盘审计+子图A §十三（ZCode）**：审计实态=代码 8 commits 两分支已推未合并"
    "（next1 @09ee391 BP1批1 99键/Slogan/云存脱敏/删号，core 1555；next2 @d7abe00 危机热线/L4分支引擎/M3 全量/语义库 31 条，新测试 30），"
    "merge-tree 零冲突，合并部署权主控；文档 6 件齐（计划勾选+任务卡×2+WORKLOG×2+T1-01/T1-10）；"
    "子图A 新增 §十三=落盘审计表+下一阶段剩余计划逐项（线程1 剩 5 项/线程2 剩 4 项/主控合并 sw v8/用户四钥匙）；"
    "最上游解锁=用户 DeepSeek key（内置 AI 10 分钟）+定价拍板\r\n"
)

with io.open(P, "rb") as f:
    data = f.read()
text = (data[2:] if data[:2] == b"\xff\xfe" else data).decode("utf-16-le")
lines = text.split("\r\n")
insert_at = 0
for i, ln in enumerate(lines):
    if ln.startswith("- "):
        insert_at = i
        break
lines.insert(insert_at, ENTRY.rstrip("\r\n"))
with io.open(P, "wb") as f:
    f.write(b"\xff\xfe" + "\r\n".join(lines).encode("utf-16-le"))
print("audit changelog appended at line", insert_at)
