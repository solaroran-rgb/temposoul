/**
 * D-2 公司起名引擎（品牌命名案例库 + 数字资产）
 * 来源：专家 D R3（143217.md D 段）+ R5 就绪表「3 案例 + 数字资产」
 * 口径：3 个命名案例（品牌定位/候选名/语义资产）+ 命名方法论数字资产
 */
import type { LightFunContentEnvelope } from './types';

export interface BrandCase {
  case_id: string;
  industry: string;
  positioning: string;
  candidates: Array<{
    name: string;
    pinyin: string;
    semantic: string;
    trademark_class: string;
    availability: 'available' | 'reserved' | 'conflict';
  }>;
  reasoning: string;
}

export interface NamingAsset {
  asset_id: string;
  title: string;
  summary: string;
  checklist: string[];
}

export interface BrandNamingPayload {
  cases: BrandCase[];
  methodology_assets: NamingAsset[];
}

const CASES: BrandCase[] = [
  {
    case_id: 'case_tea_brand',
    industry: '新中式茶饮',
    positioning: '东方草木 × 现代日常，面向 25-35 岁城市白领',
    candidates: [
      {
        name: '山序',
        pinyin: 'shān xù',
        semantic: '山林次第，时序自然',
        trademark_class: '30/35',
        availability: 'available',
      },
      {
        name: '拾叶',
        pinyin: 'shí yè',
        semantic: '拾取一叶，回归本味',
        trademark_class: '30/43',
        availability: 'available',
      },
      {
        name: '沐川',
        pinyin: 'mù chuān',
        semantic: '沐于清溪，川流不息',
        trademark_class: '30',
        availability: 'reserved',
      },
    ],
    reasoning:
      '「山序」以两字结构建立东方意象，读起来沉稳有余韵，商标 30/35 类可注册；避免使用直接暗示功效的字眼，保持文化留白。',
  },
  {
    case_id: 'case_app_brand',
    industry: '效率工具 App',
    positioning: '极简专注，帮助知识工作者心流',
    candidates: [
      {
        name: '落子',
        pinyin: 'luò zǐ',
        semantic: '落子无悔，专注当下',
        trademark_class: '9/42',
        availability: 'available',
      },
      {
        name: '素简',
        pinyin: 'sù jiǎn',
        semantic: '素心简事，去繁就简',
        trademark_class: '9',
        availability: 'conflict',
      },
      {
        name: '页川',
        pinyin: 'yè chuān',
        semantic: '一页一川，持续流动',
        trademark_class: '9/42',
        availability: 'available',
      },
    ],
    reasoning:
      '「落子」动作感强，与专注/决策心智吻合，APP 商店重名风险低；「素简」与既有品类词高度重合，不建议主用。',
  },
  {
    case_id: 'case_care_brand',
    industry: '家居香氛',
    positioning: '嗅觉情绪疗愈，东方草木调',
    candidates: [
      {
        name: '枕雾',
        pinyin: 'zhěn wù',
        semantic: '枕畔轻雾，安眠意象',
        trademark_class: '3/35',
        availability: 'available',
      },
      {
        name: '闻山',
        pinyin: 'wén shān',
        semantic: '以鼻观山，通感自然',
        trademark_class: '3',
        availability: 'available',
      },
      {
        name: '檐下',
        pinyin: 'yán xià',
        semantic: '檐下时光，居家归属',
        trademark_class: '3/21',
        availability: 'reserved',
      },
    ],
    reasoning:
      '「枕雾」直接锚定睡眠场景，香氛品类联想清晰；建议同步检索第 3 类与第 35 类商标，确认无在先权利。',
  },
];

const ASSETS: NamingAsset[] = [
  {
    asset_id: 'asset_checklist',
    title: '命名前自检清单',
    summary: '公司名落定前必查的 6 项基础项',
    checklist: [
      '商标检索：目标行业类别是否有在先注册',
      '工商核名：同行业同地区是否重名',
      '域名可用性：.com/.cn/.com.cn 与品牌社媒账号',
      '读音测试：跨方言与外语发音是否歧义',
      '视觉结构：字体排版是否易记易写',
      '语义边界：是否触碰行业限制与广告法红线',
    ],
  },
  {
    asset_id: 'asset_method',
    title: '三步命名法',
    summary: '定位 → 词根发散 → 收敛校验',
    checklist: [
      '第一步：写出品牌定位一句话（品类 + 人群 + 差异点）',
      '第二步：围绕定位发散 30 个候选词（不评判）',
      '第三步：按商标/域名/读音/语义四维收敛到 3 个',
    ],
  },
];

export function buildBrandNamingDataset(): BrandNamingPayload {
  return { cases: CASES, methodology_assets: ASSETS };
}

export const brandNamingData: LightFunContentEnvelope<BrandNamingPayload> = {
  id: 'brand-naming-engine',
  kind: 'lightfun',
  seo: {
    title: '公司起名引擎：品牌定位与命名方法论',
    description: '3 个真实行业命名案例 + 命名自检清单，辅助品牌名决策。',
    keywords: ['公司起名', '品牌命名', '商标检索'],
  },
  payload: buildBrandNamingDataset(),
  metadata: {
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
    version: '1.0.0',
    tags: ['naming', 'brand'],
  },
};
