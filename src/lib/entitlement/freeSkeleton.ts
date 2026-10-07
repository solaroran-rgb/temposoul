/**
 * 免费层规则骨架（A9 P11 免费层去 LLM）
 *
 * 铁律：免费路径 0 次 LLM。产出为「规则 / 映射骨架」——基于已有排盘结构做确定性拼装，
 * 与 B1 管线 C1/C2「禁运行时 LLM」一致。核心结论故意截断在「未完成感」之前
 * （E2 实验调截点），引导付费解锁完整解读。
 *
 * 输入只接受结构化排盘结果（不接受自然语言 prompt），输出固定模板骨架，
 * 纯函数、可快照、可单测。
 */

import type { EntitlementKey } from './types';

/** 免费层可见的排盘要素（结构化，无个人隐私扩展） */
export interface FreeChartInput {
  /** 模式：单盘 single / 合婚 compatibility */
  mode: 'single' | 'compatibility';
  /** 主系统：bazi / ziwei / astrolabe / qizheng / bazhai 等 */
  system: string;
  /** 关键结构标签（来自已有规则引擎，如十神 / 宫位 / 星群） */
  structureTags: string[];
}

export interface FreeSkeleton {
  kind: 'free_skeleton_v1';
  /** 已展示的章节（规则骨架） */
  sections: Array<{ heading: string; body: string }>;
  /** 是否被截断（始终 true：核心结论前截断） */
  truncated: true;
  /** 截断提示（引导付费） */
  upsell: string;
  /** 标记：本骨架 0 次 LLM 调用 */
  llmCalls: 0;
  /** 解锁所需权益键 */
  unlockKey: EntitlementKey;
}

const DISCLAIMER = '以下为传统文化与生活方式的参考信息，仅供娱乐参考，不作预测与决策依据。';

/**
 * 生成免费规则骨架（纯函数，0 LLM）。
 * 不做任何「关系判定 / 必然结论」式断言；只客观陈列结构 + 正向建议句。
 */
export function buildFreeSkeleton(input: FreeChartInput): FreeSkeleton {
  const tags = input.structureTags.length > 0 ? input.structureTags : ['（暂无结构标签）'];
  const isCompat = input.mode === 'compatibility';

  const sections = [
    {
      heading: '一、你的排盘结构概览',
      body: `本次排盘系统为「${input.system}」。盘面关键结构标签：${tags.slice(0, 4).join('、')}。${DISCLAIMER}`,
    },
    {
      heading: isCompat ? '二、双盘客观要素对照' : '二、今日节奏参考',
      body: isCompat
        ? '已客观陈列双方盘面对照维度（五行分布 / 宫位）。本产品不出具「关系是否合适」式判定，仅提供文化视角的观察维度。'
        : '基于节气与盘面结构，给出生活层面的正向节奏建议（作息 / 着装主色倾向）。',
    },
    {
      heading: '三、深度解读预览（前 2 页·水印预览）',
      body: '深度解读的开头段落已生成（规则骨架版），核心结论与个性化推演被故意折叠——这是「未完成感」设计，付费解锁后展开完整 AI 深度解读。',
    },
  ];

  return {
    kind: 'free_skeleton_v1',
    sections,
    truncated: true,
    upsell: '解锁完整 AI 深度解读（去水印 / 可留存 / 可导出 PDF）→',
    llmCalls: 0,
    unlockKey: 'report.deep',
  };
}

/**
 * 免费层拦截判定：当请求 report.deep 且用户无有效权益时，
 * 调用方必须用 buildFreeSkeleton 兜底，禁止回退到 LLM。
 * 返回 true 表示「应走免费骨架」。
 */
export function shouldUseFreeSkeleton(allowed: boolean): boolean {
  return !allowed;
}
