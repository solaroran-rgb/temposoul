// src/data/onomastics/industry-wuxing.ts
export interface IndustryWuxing {
  industryId: string;
  industryName: string;
  wuxing: '金' | '木' | '水' | '火' | '土';
  description: string;
}

export const INDUSTRY_WUXING: IndustryWuxing[] = [
  { industryId: 'food', industryName: '餐饮', wuxing: '火', description: '烹饪属火' },
  { industryId: 'tech', industryName: '科技', wuxing: '金', description: '精密属金' },
  { industryId: 'trade', industryName: '商贸', wuxing: '金', description: '交易属金' },
  { industryId: 'education', industryName: '教育', wuxing: '木', description: '培育属木' },
  { industryId: 'finance', industryName: '金融', wuxing: '金', description: '财富属金' },
  { industryId: 'health', industryName: '健康', wuxing: '木', description: '生机属木' },
  { industryId: 'logistics', industryName: '物流', wuxing: '水', description: '流动属水' },
  { industryId: 'culture', industryName: '文化传媒', wuxing: '火', description: '传播属火' },
  { industryId: 'realestate', industryName: '房地产', wuxing: '土', description: '土地属土' },
  { industryId: 'agriculture', industryName: '农业', wuxing: '木', description: '种植属木' },
  { industryId: 'energy', industryName: '能源', wuxing: '火', description: '热能属火' },
  { industryId: 'consulting', industryName: '咨询', wuxing: '水', description: '智慧属水' },
];
