#!/usr/bin/env bash
# L1 回滚脚本（rollback-l1）
# 收口确认卡修复③：末尾 git stash pop（stash push 成功后），恢复用户未提交改动
set -euo pipefail
TARGET="${1:?用法: $0 <target-commit>}"

# 检查未提交改动
if [[ -n "$(git status --porcelain)" ]]; then
  echo "WARN 工作区有未提交改动，将 stash 后继续"
  git stash push -u -m "rollback-l1 pre-stash $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  STASHED=1
else
  STASHED=0
fi

git fetch origin
git checkout "$TARGET"
pnpm install --frozen-lockfile
pnpm build
wrangler pages deploy dist --project-name temposoul --branch main

# 解析新 Deployment ID（stdin 方式）
DEPLOY_JSON=$(wrangler pages deployment list --project-name temposoul --json)
NEW_ID=$(printf '%s' "$DEPLOY_JSON" | node --input-type=module -e "
let s='';process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>{
  const i=s.indexOf('[');const j=s.lastIndexOf(']');
  if(i<0||j<0){console.error('no json');process.exit(1);}
  const a=JSON.parse(s.slice(i,j+1));
  console.log(a[0]?.id ?? '');
})")
echo "rollback deployed: id=$NEW_ID target=$TARGET"

# 记录锚点
node --input-type=module -e "
import fs from 'node:fs';
fs.mkdirSync('docs', { recursive: true });
const entry = '\n## ' + new Date().toISOString() + ' L1 回滚\n- 目标 commit：$TARGET\n- 新 Deployment ID：$NEW_ID\n- 状态：rolled-back\n';
fs.appendFileSync('docs/deploy-log.md', entry, 'utf8');
"

# 修复③：恢复被 stash 的未提交改动
if [[ "$STASHED" == "1" ]]; then
  echo "恢复原未提交改动 (git stash pop)"
  git stash pop || echo "WARN stash pop 冲突，请手工处理: git stash list / git stash apply"
fi
