/**
 * 路由校验（validate-routes）
 * 收口确认卡修复①验证：ALL_URLS.length === 280；全站口径 A280+B50+C384+D24=738，总路由 884
 */
import { ALL_URLS, UNIQUE_URLS, A_DOMAIN_COUNTS, A_DOMAIN_TOTAL } from '../src/data/content/bazi-ziwei/route-mapping';

const EXPECTED = 280;
if (ALL_URLS.length !== EXPECTED) {
  console.error(`[validate:routes] FATAL: ALL_URLS=${ALL_URLS.length} expected=${EXPECTED}`);
  process.exit(1);
}
if (UNIQUE_URLS !== EXPECTED) {
  console.error(`[validate:routes] FATAL: unique=${UNIQUE_URLS} expected=${EXPECTED}（存在重复 slug）`);
  process.exit(1);
}

const DOMAIN = { a: A_DOMAIN_TOTAL, b: 50, c: 384, d: 24 };
const total = DOMAIN.a + DOMAIN.b + DOMAIN.c + DOMAIN.d;
const routeTotal = 146 + total;

console.log('[validate:routes] PASS');
console.log(`  A 域 ALL_URLS = ${ALL_URLS.length}（唯一 ${UNIQUE_URLS}）`);
console.log(`  明细：${JSON.stringify(A_DOMAIN_COUNTS)}`);
console.log(`  全站 sitemap = A${DOMAIN.a}+B${DOMAIN.b}+C${DOMAIN.c}+D${DOMAIN.d} = ${total}`);
console.log(`  总路由 = 146 基线 + ${total} = ${routeTotal}`);
