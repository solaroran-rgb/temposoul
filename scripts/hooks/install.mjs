#!/usr/bin/env node
/**
 * T-15C · C3 · 安装 L3 熔断 pre-commit 钩子到 .git/hooks/pre-commit（本地激活）。
 * 幂等：已含本钩子标记则跳过；不覆盖他人已有钩子（若存在且无标记，追加调用而非覆盖）。
 * 用法：node scripts/hooks/install.mjs
 */
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const MARKER = '# T-15C polysemy-breakdown';
const scriptBody = `#!/bin/sh
# git pre-commit hook (auto-installed by scripts/hooks/install.mjs)
${MARKER}
node "$(git rev-parse --show-toplevel)/scripts/hooks/pre-commit-polysemy-breakdown.mjs"
exit $?
`;

let gitDir;
try {
  gitDir = execFileSync('git', ['rev-parse', '--git-dir'], { encoding: 'utf8' }).trim();
} catch {
  console.error('install: 不在 git 仓库中，跳过。');
  process.exit(1);
}

mkdirSync(gitDir + '/hooks', { recursive: true });
const hookPath = gitDir + '/hooks/pre-commit';

if (existsSync(hookPath)) {
  const existing = readFileSync(hookPath, 'utf8');
  if (existing.includes(MARKER)) {
    console.log('install: pre-commit 已含 T-15C 熔断钩子，跳过。');
    process.exit(0);
  }
  // 已有他人钩子：追加本调用，保留原内容
  writeFileSync(hookPath, existing.trimEnd() + '\n\n# --- appended by T-15C polysemy-breakdown ---\n' + scriptBody.split('\n').slice(2).join('\n'));
  console.log('install: 已在既有 pre-commit 末尾追加 T-15C 熔断钩子。');
  process.exit(0);
}

writeFileSync(hookPath, scriptBody);
console.log('install: 已写入 ' + hookPath);
process.exit(0);
