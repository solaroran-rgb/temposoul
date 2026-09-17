/**
 * 冻结产物清单（freeze-artifacts）→ build/artifacts.json
 * 收口确认卡连带：total_sitemap === 738（A280+B50+C384+D24）
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// 引入 A 域口径（模块本身带 280 断言）
import { A_DOMAIN_TOTAL, A_DOMAIN_COUNTS } from '../src/data/content/bazi-ziwei/route-mapping';
// B/C/D 域口径（route-mapping-bcd 模块自带 50/384/24/738 断言，R5 数据源声明）
import { B_DOMAIN_COUNT, C_DOMAIN_COUNT, D_DOMAIN_COUNT, SITE_ALL_URLS } from '../src/data/content/bazi-ziwei/route-mapping-bcd';

const DOMAIN_COUNTS = {
  a: A_DOMAIN_TOTAL, // 280
  b: B_DOMAIN_COUNT, // 50
  c: C_DOMAIN_COUNT, // 384
  d: D_DOMAIN_COUNT, // 24
};
const TOTAL_SITEMAP = DOMAIN_COUNTS.a + DOMAIN_COUNTS.b + DOMAIN_COUNTS.c + DOMAIN_COUNTS.d; // 738
if (TOTAL_SITEMAP !== SITE_ALL_URLS.length) {
  throw new Error(`[freeze] total mismatch: ${TOTAL_SITEMAP} vs site=${SITE_ALL_URLS.length}`);
}

function sha256File(p: string): string | undefined {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  } catch {
    return undefined;
  }
}

const artifacts = {
  version: '2.0.0',
  frozenAt: new Date().toISOString(),
  total_sitemap: TOTAL_SITEMAP,
  domain_a_count: DOMAIN_COUNTS.a,
  domain_b_count: DOMAIN_COUNTS.b,
  domain_c_count: DOMAIN_COUNTS.c,
  domain_d_count: DOMAIN_COUNTS.d,
  route_total: 146 + TOTAL_SITEMAP, // 884（146 基线 + 738）
  a_domain_breakdown: { ...A_DOMAIN_COUNTS },
  // 三层 Merkle（尽力而为；不存在则为 null）
  layer1_route_hash: sha256File(path.join(repoRoot, 'build', 'routes.json')),
  layer2_content_hash: sha256File(path.join(repoRoot, 'build', 'content-fingerprint.json')),
  layer3_asset_hash: sha256File(path.join(repoRoot, 'dist', 'index.html')),
};

fs.mkdirSync(path.join(repoRoot, 'build'), { recursive: true });
fs.writeFileSync(path.join(repoRoot, 'build', 'artifacts.json'), JSON.stringify(artifacts, null, 2), 'utf8');
console.log(`[freeze] wrote build/artifacts.json total_sitemap=${TOTAL_SITEMAP} route_total=${artifacts.route_total}`);
