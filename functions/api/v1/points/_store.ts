// 积分体系数据存储（边缘运行时内存骨架）
//
// TODO(待绑 KV): 当前为模块级内存 mock，重启 / 多 isolate 后丢失。上线前接入 AUTH_KV 或 D1：
//   - 余额与流水按 userId 持久化（如 KV key `points:<userId>` / D1 表）；
//   - 每日去重、一次性任务记录改为服务端持久状态。
//   请求/响应 schema 已按真实接口定义，换存储层时无需改动路由层。
//
// TODO(待绑鉴权): 当前固定单用户 'local'，未读取会话身份；上线后按真实 userId 隔离。

export interface LedgerEntry {
  id: string;
  action: string;
  label: string;
  credits: number; // 正数为获得，预留负数为消耗
  createdAt: string;
}

export interface PointsState {
  userId: string;
  balance: number;
  ledger: LedgerEntry[];
  /** 每日任务：action -> 'YYYY-MM-DD' */
  lastDaily: Record<string, string>;
  /** 一次性任务：已完成的 action 集合 */
  claimedOnce: Record<string, boolean>;
}

export interface PointsAction {
  credits: number;
  label: string;
  period: 'daily' | 'once' | 'unlimited';
}

/** 可赚取积分的动作白名单（与前端 REWARD_RULES_SEED 对齐） */
export const ACTIONS: Record<string, PointsAction> = {
  daily_login: { credits: 5, label: '每日登录', period: 'daily' },
  share_result: { credits: 10, label: '分享一份报告', period: 'daily' },
  complete_profile: { credits: 50, label: '完善个人资料', period: 'once' },
};

export const ME: PointsState = {
  userId: 'local',
  balance: 60,
  ledger: [
    { id: 'led-001', action: 'daily_login', label: '每日登录', credits: 5, createdAt: '2026-09-19T09:12:00+08:00' },
    { id: 'led-002', action: 'share_result', label: '分享一份报告', credits: 10, createdAt: '2026-09-19T20:40:00+08:00' },
    { id: 'led-003', action: 'complete_profile', label: '完善个人资料', credits: 50, createdAt: '2026-09-18T14:05:00+08:00' },
  ],
  lastDaily: {},
  claimedOnce: { complete_profile: true },
};

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function genLedgerId(): string {
  return `led-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
