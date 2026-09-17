// 从专家论证稿 md 提取代码块到磁盘
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const mdPath = process.argv[2];
const root = process.argv[3];
const md = readFileSync(mdPath, 'utf8');
const lines = md.split('\n');

// 匹配 "文件 N: `path`" 或 "### 文件 N/M `path`"
const fileRe = /(?:##|###)\s*文件[^`]*`([^`]+)`/;
let currentPath = null;
let inCode = false;
let codeLang = '';
let buf = [];
let written = [];

function flush() {
  if (!currentPath || buf.length === 0) { buf = []; inCode = false; return; }
  const outPath = join(root, currentPath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, buf.join('\n'));
  written.push(outPath.replace(root, '.'));
  buf = [];
  inCode = false;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const fm = line.match(fileRe);
  if (fm && !inCode) {
    // 新文件头：先 flush 上一个
    flush();
    currentPath = fm[1].trim();
    continue;
  }
  if (line.startsWith('```')) {
    if (!inCode) {
      inCode = true;
      codeLang = line.slice(3).trim();
      buf = [];
    } else {
      // 结束
      flush();
      currentPath = null;
    }
    continue;
  }
  if (inCode) buf.push(line);
}
flush();

console.log('Written files:');
for (const w of written) console.log('  ', w);
console.log('Total:', written.length);
