// src/components/user/PointsSystem.tsx
// 9.3 积分体系：真实调用 /api/v1/points/me 渲染余额与流水，
//   领取任务时 POST /api/v1/points/earn；接口失败时优雅降级为本地存储，不白屏。
import { useEffect, useState } from 'react';
import { safeStorage } from '@/lib/safe-storage';
import { REWARD_RULES_SEED, type RewardRule } from '@/data/account/rewards';

const POINTS_KEY = 'ts_points_total';
const CLAIMED_KEY = 'ts_points_claimed';

interface LedgerEntry {
  id: string;
  action: string;
  label: string;
  credits: number;
  createdAt: string;
}

const ACTION_LABEL: Record<RewardRule['action'], string> = {
  daily_login: '每日登录',
  share_result: '分享一份报告',
  complete_profile: '完善个人资料',
};
const PERIOD_LABEL: Record<RewardRule['period'], string> = {
  daily: '每日',
  once: '一次性',
  unlimited: '不限',
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function readJSON<T>(key: string, fallback: T): T {
  const raw = safeStorage.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function PointsSystem() {
  const [total, setTotal] = useState(() => Number(safeStorage.get(POINTS_KEY)) || 0);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [claimed, setClaimed] = useState<Record<string, string>>(() => readJSON(CLAIMED_KEY, {}));
  const [degraded, setDegraded] = useState(false);
  const [earning, setEarning] = useState<string | null>(null);

  // 拉取真实余额与流水；失败则保持本地存储为降级来源
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/points/me', { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`http_${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (typeof data.balance === 'number') setTotal(data.balance);
        setLedger(Array.isArray(data.ledger) ? data.ledger : []);
        setDegraded(false);
      } catch {
        if (!cancelled) setDegraded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    safeStorage.set(POINTS_KEY, String(total));
  }, [total]);
  useEffect(() => {
    safeStorage.set(CLAIMED_KEY, JSON.stringify(claimed));
  }, [claimed]);

  const canClaim = (rule: RewardRule): boolean => {
    const last = claimed[rule.action];
    if (rule.period === 'daily') return last !== todayStr();
    if (rule.period === 'once') return !last;
    return true;
  };

  const markClaimed = (rule: RewardRule) =>
    setClaimed((c) => ({ ...c, [rule.action]: rule.period === 'daily' ? todayStr() : 'done' }));

  const claim = async (rule: RewardRule) => {
    if (!canClaim(rule) || earning) return;
    setEarning(rule.action);
    try {
      const res = await fetch('/api/v1/points/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: rule.action }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.balance === 'number') setTotal(data.balance);
        if (data.entry) setLedger((l) => [data.entry as LedgerEntry, ...l]);
        markClaimed(rule);
        setDegraded(false);
      } else if (res.status === 409) {
        // 服务端判定已领取：同步本地领取态
        markClaimed(rule);
      } else {
        throw new Error(`http_${res.status}`);
      }
    } catch {
      // 降级：接口不可用时本地乐观加积分
      setTotal((t) => t + rule.credits);
      markClaimed(rule);
      setDegraded(true);
    } finally {
      setEarning(null);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 20, marginBottom: 18,
    }}>
      {/* 积分余额 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>我的积分</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#fbbf24' }}>{total}</div>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right' }}>
          每日签到与分享<br />可持续累积积分
        </div>
      </div>

      {degraded && (
        <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 12 }}>
          积分服务暂不可用，当前展示本地数据
        </div>
      )}

      {/* 任务列表 */}
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>积分任务</div>
      {REWARD_RULES_SEED.map((rule) => {
        const ok = canClaim(rule);
        const busy = earning === rule.action;
        return (
          <div
            key={rule.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 10, marginBottom: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: '#e2e8f0' }}>{ACTION_LABEL[rule.action]}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{PERIOD_LABEL[rule.period]} · +{rule.credits} 分</div>
            </div>
            <button
              onClick={() => claim(rule)}
              disabled={!ok || busy}
              style={{
                padding: '8px 18px', borderRadius: 8, cursor: ok ? 'pointer' : 'default',
                border: 'none', fontSize: 13, fontWeight: 600,
                background: ok ? 'linear-gradient(90deg,#6366f1,#fbbf24)' : 'rgba(255,255,255,0.08)',
                color: ok ? 'white' : '#64748b',
              }}
            >
              {busy ? '领取中…' : ok ? '领取' : '已领'}
            </button>
          </div>
        );
      })}

      {/* 积分流水 */}
      <div style={{ fontSize: 14, fontWeight: 600, margin: '18px 0 12px', color: '#cbd5e1' }}>积分流水</div>
      {ledger.length === 0 ? (
        <div style={{ fontSize: 12, color: '#64748b' }}>暂无流水，完成任务即可获得积分</div>
      ) : (
        ledger.slice(0, 20).map((entry) => (
          <div
            key={entry.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderRadius: 10, marginBottom: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: '#e2e8f0' }}>{entry.label}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {new Date(entry.createdAt).toLocaleString('zh-CN')}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: entry.credits >= 0 ? '#34d399' : '#f87171' }}>
              {entry.credits >= 0 ? `+${entry.credits}` : entry.credits}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
