// 用 esbuild API 检查 SkyScene.ts 语法
import { transform } from 'esbuild';
import fs from 'node:fs';

const P = 'src/lib/sky/SkyScene.ts';
const src = fs.readFileSync(P, 'utf8');
try {
  await transform(src, { loader: 'ts', sourcefile: P });
  console.log('SYNTAX OK');
} catch (e) {
  console.log('SYNTAX ERROR:');
  console.log(e.message);
  if (e.location) console.log(JSON.stringify(e.location, null, 2));
}
