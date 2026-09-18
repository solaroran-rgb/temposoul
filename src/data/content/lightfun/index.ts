/**
 * A 域（轻娱乐占卜与趣味测试）聚合出口
 * 12 项内容 + 24 条子路由
 */
export * from './lightfun.types';
export { LIGHTFUN_REGISTRY, getLightFun, type LightFunSlug } from './lightfun.registry';
export { LIGHTFUN_ITEMS, LIGHTFUN_FLAT_ROUTES, type FlatRoute } from './route-mapping-lightfun';

export const LIGHTFUN_DOMAIN_COUNT = 12;
