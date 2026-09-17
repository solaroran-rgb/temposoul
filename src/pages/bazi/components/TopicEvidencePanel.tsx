// src/pages/bazi/components/TopicEvidencePanel.tsx · IT-2.2 依据
// 修正：analysis 递归文本提取（支持 string / {text,summary,conclusion,note} / 嵌套）；三块独立占位
import {
  FortuneEvidenceCard,
  relationsToEvidence,
} from '../../../components/fortune/FortuneEvidenceCard';

interface TenGodRow {
  pillar: string;
  tenGod: string;
}

function normalizeTenGods(raw: unknown): TenGodRow[] {
  if (!raw || typeof raw !== 'object') return [];
  const r = raw as Record<string, unknown>;
  const map: Array<[string, string]> = [
    ['year', '年柱'],
    ['month', '月柱'],
    ['day', '日柱'],
    ['hour', '时柱'],
  ];
  const out: TenGodRow[] = [];
  for (const [k, label] of map) {
    const v = r[k];
    if (typeof v === 'string' && v.trim()) out.push({ pillar: label, tenGod: v });
  }
  return out;
}

const TEXT_KEYS = ['text', 'summary', 'conclusion', 'note', 'description', 'value'] as const;

/** 递归提取文本：string 直接返回；对象按 TEXT_KEYS 提取；最多 2 层 */
function extractText(v: unknown, depth = 0): string | null {
  if (depth > 2) return null;
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  for (const k of TEXT_KEYS) {
    const s = o[k];
    if (typeof s === 'string' && s.trim()) return s.trim();
  }
  // 若对象无直接文本，尝试递归其子对象（最多 2 层）
  for (const k of Object.keys(o)) {
    const child = extractText(o[k], depth + 1);
    if (child) return child;
  }
  return null;
}

function pickAnalysisText(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return [];
  const r = raw as Record<string, unknown>;
  // 兼容 analysis 顶层直接给三字段，或 analysis 嵌在 raw.analysis
  const source =
    r.dayMasterStrength || r.mingGe || r.usefulGod
      ? r
      : r.analysis && typeof r.analysis === 'object'
        ? (r.analysis as Record<string, unknown>)
        : r;

  const out: string[] = [];
  const push = (v: unknown, label: string) => {
    const t = extractText(v);
    if (t) out.push(`${label}：${t}`);
  };
  push(source.dayMasterStrength, '日主强弱');
  push(source.mingGe, '命格');
  push(source.usefulGod, '用神');
  return Array.from(new Set(out));
}

export interface TopicEvidencePanelProps {
  tenGods: unknown;
  pillarRelations: unknown;
  analysis: unknown;
}

export function TopicEvidencePanel({
  tenGods,
  pillarRelations,
  analysis,
}: TopicEvidencePanelProps) {
  const tg = normalizeTenGods(tenGods);
  const ev = relationsToEvidence(pillarRelations);
  const an = pickAnalysisText(analysis);

  return (
    <div className="ts-topic-evidence">
      <div className="ts-topic-evidence__block">
        <h3 className="ts-card__subtitle">四柱十神</h3>
        {tg.length > 0 ? (
          <table className="ts-table">
            <thead>
              <tr>
                <th>柱</th>
                <th>十神</th>
              </tr>
            </thead>
            <tbody>
              {tg.map((r, i) => (
                <tr key={`${r.pillar}-${i}`}>
                  <td>{r.pillar}</td>
                  <td>{r.tenGod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="ts-empty">暂无十神数据</div>
        )}
      </div>

      <div className="ts-topic-evidence__block">
        <h3 className="ts-card__subtitle">四柱关系</h3>
        {ev.length > 0 ? (
          <FortuneEvidenceCard title="关系证据" items={ev} />
        ) : (
          <div className="ts-empty">暂无关系证据</div>
        )}
      </div>

      <div className="ts-topic-evidence__block">
        <h3 className="ts-card__subtitle">命理分析</h3>
        {an.length > 0 ? (
          <ul className="ts-topic-evidence__list">
            {an.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <div className="ts-empty">暂无命理分析</div>
        )}
      </div>
    </div>
  );
}

export default TopicEvidencePanel;
