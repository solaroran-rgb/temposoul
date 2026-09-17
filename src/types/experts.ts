/**
 * D23-2 ｜ 大师测名（付费/免费预约）专家资料契约
 *
 * 合规红线（强制）：
 * - isMock 必须为 true，本文件内全部专家均为「示例专家」，仅用于流程演示。
 * - 严禁出现真人姓名、真实资质、协会头衔、证书编号、执业机构等可指向真实自然人的信息。
 * - bio 仅为通用能力描述，不得承诺测名效果、不得使用「必中/转运/改命」等断言。
 */

/** 专家领域 */
export type ExpertDomain = 'bazi' | 'namology' | 'fengshui';

/** 领域展示名映射（zh-CN 硬编码允许） */
export const EXPERT_DOMAIN_LABEL: Record<ExpertDomain, string> = {
  bazi: '八字命理',
  namology: '姓名学',
  fengshui: '堪舆风水',
};

/**
 * 示例专家档案。
 * isMock 字面量类型固定为 true，TS 层面防止误改成真实专家。
 */
export interface MockExpertProfile {
  /** 示例专家 ID（路由 :id 用） */
  expertId: string;
  /** 示例称呼（非真人） */
  name: string;
  /** 领域 */
  domain: ExpertDomain;
  /** 通用能力描述（不含资质/证书） */
  bio: string;
  /** 价格标签，如 "¥199/次" */
  priceLabel: string;
  /** 预期金额（分），与 priceLabel 对应，财务侧用 */
  expectedAmount: number;
  /** 【红线】强制示例标识 */
  isMock: true;
  /** 占位头像（可选，留空时走默认占位） */
  avatarUrl?: string;
}

/** 测名预约请求体 */
export interface ExpertBookingRequest {
  /** 预约 ID（确定性生成） */
  bookingId: string;
  /** 示例专家 ID */
  expertId: string;
  /** 待测名字 */
  targetName: string;
  /** 出生日期（可选，YYYY-MM-DD） */
  birthDate?: string;
  /** 联系方式（微信或邮箱） */
  contactWechatOrEmail: string;
}

/**
 * 示例专家种子数据：bazi / namology / fengshui 各 2 位，共 6 位。
 * 全部 isMock: true；bio 为通用流程演示描述。
 */
export const MOCK_EXPERTS: readonly MockExpertProfile[] = [
  {
    expertId: 'demo-bazi-01',
    name: '云衡先生（示例）',
    domain: 'bazi',
    bio: '示例专家，用于演示八字信息整理与文字解读流程。讲解干支、五行生克等传统文化概念，仅供流程体验，不代表任何真实从业者。',
    priceLabel: '¥199/次',
    expectedAmount: 19900,
    isMock: true,
  },
  {
    expertId: 'demo-bazi-02',
    name: '清如女士（示例）',
    domain: 'bazi',
    bio: '示例专家，用于演示排盘结果与用神取舍的讲解流程。内容基于通行本民俗说法，仅供流程体验，不承诺任何运势结论。',
    priceLabel: '¥259/次',
    expectedAmount: 25900,
    isMock: true,
  },
  {
    expertId: 'demo-namology-01',
    name: '砚之先生（示例）',
    domain: 'namology',
    bio: '示例专家，用于演示姓名笔画、五行、音律的整理与解读流程。所有分析为传统文化参考，仅供流程体验。',
    priceLabel: '¥159/次',
    expectedAmount: 15900,
    isMock: true,
  },
  {
    expertId: 'demo-namology-02',
    name: '知微女士（示例）',
    domain: 'namology',
    bio: '示例专家，用于演示姓名与用字寓意的讲解流程。不承诺改名转运，不做任何吉凶断言，仅供流程体验。',
    priceLabel: '¥189/次',
    expectedAmount: 18900,
    isMock: true,
  },
  {
    expertId: 'demo-fengshui-01',
    name: '怀谷先生（示例）',
    domain: 'fengshui',
    bio: '示例专家，用于演示家居/办公方位民俗概念的讲解流程。内容来自通行本阳宅文献摘录，仅供流程体验。',
    priceLabel: '¥299/次',
    expectedAmount: 29900,
    isMock: true,
  },
  {
    expertId: 'demo-fengshui-02',
    name: '见山女士（示例）',
    domain: 'fengshui',
    bio: '示例专家，用于演示楼层五行、朝向等民俗说法的整理流程。不承诺居住效果，不做健康/财运断言，仅供流程体验。',
    priceLabel: '¥239/次',
    expectedAmount: 23900,
    isMock: true,
  },
] as const;
