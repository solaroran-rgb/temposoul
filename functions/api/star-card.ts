/**
 * /api/star-card —— 每日星图服务端端点（A5 波2·M1 接线）
 *
 * 职责（A5 卡三、待接线项「API 端点 /api/star-card」）：
 *   读缓存键 → generateStarCard（五区块+熔断 L0-L3，纯规则零 LLM）→ 响应 JSON。
 *
 * 挂载：Cloudflare Pages 文件路由 functions/api/star-card.ts → /api/star-card。
 *   独立端点，不挂 /api/v1 catch-all（公开计算 API 与本端点语义不同）。
 *
 * P0 边界（如实）：
 *   - generateStarCard 为确定性纯函数（同输入恒同输出），本端点不做 KV 读写；
 *     buildCacheKeys 仅计算并回传缓存键供前端/后续 CDN 缓存对齐（双层落库留待 P1）。
 *   - 不接天气（P1 开关 weather=false）、不发邮件、不做埋点上报（均 A5 待接线项）。
 *   - 不引入任何个人敏感信息；uidHash 仅由调用方可选传入做个人层 key 隔离。
 */
import {
  generateStarCard,
  buildCacheKeys,
  DEFAULT_FLAGS,
} from '../../packages/core/src/star_card/index';
import type { StarCardInput, ClimateZone } from '../../packages/core/src/star_card/types';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/** 规则版本：与 core 规则表绑定，变更即缓存失效 */
const RULE_VERSION = '20261007-1';
const VALID_CLIMATE: ClimateZone[] = ['cold', 'temperate', 'subtropical', 'tropical', 'plateau'];

/** Asia/Shanghai 当日 YYYY-MM-DD（不依赖第三方日期库） */
function todayShanghai(): string {
  // Asia/Shanghai = UTC+8
  const sh = new Date(Date.now() + 8 * 3600 * 1000);
  const y = sh.getUTCFullYear();
  const m = String(sh.getUTCMonth() + 1).padStart(2, '0');
  const d = String(sh.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sp = url.searchParams;

  const dateKey = sp.get('dateKey') || todayShanghai();
  const tz = sp.get('tz') || 'Asia/Shanghai';
  const climateRaw = sp.get('climateZone') || 'temperate';
  const climateZone = (VALID_CLIMATE as string[]).includes(climateRaw)
    ? (climateRaw as ClimateZone)
    : 'temperate';
  const uidHash = sp.get('uidHash') || undefined;

  const input: StarCardInput = {
    dateKey,
    tz,
    ruleVersion: RULE_VERSION,
    climateZone,
    uidHash,
    weatherWarning: '', // P0 不接实时天气
  };

  // 读缓存键（P0 仅计算并回传，不做 KV 落库；确定性函数本身幂等）
  const cacheKeys = buildCacheKeys(dateKey, RULE_VERSION, tz, uidHash);

  const card = generateStarCard(input);

  return Response.json(
    {
      ok: true,
      data: {
        card,
        cacheKeys,
        flags: DEFAULT_FLAGS,
        ruleVersion: RULE_VERSION,
      },
    },
    { status: 200, headers: CORS_HEADERS },
  );
};
