// src/data/knowledge/fengshui-manifest.ts
import type { KnowledgeArticle } from './schema';
import { fengshuiHomeArticles } from './content/fengshui-home';
import { fengshuiOfficeArticles } from './content/fengshui-office';
import { fengshuiShopArticles } from './content/fengshui-shop';

/**
 * 批4 C23 风水 18 篇（家居/办公/商铺 各 6 篇）聚合。
 * 主仓 registry.ts 通过 `import { FENGSHUI_ARTICLES } from './fengshui-manifest'`
 * 消费此数组（allArticleMeta 取元数据、loadArticle 取正文），故必须导出具名
 * FENGSHUI_ARTICLES 且元素为完整 KnowledgeArticle。
 */
export const FENGSHUI_ARTICLES: KnowledgeArticle[] = [
  ...fengshuiHomeArticles,
  ...fengshuiOfficeArticles,
  ...fengshuiShopArticles,
];

export default FENGSHUI_ARTICLES;
