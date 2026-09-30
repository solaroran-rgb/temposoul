/**
 * @file 星空纪念 · 保存弹窗 + 我的纪念列表
 * 供 SkyPage 复用：把当前星空时刻存为纪念事件，并管理已保存事件（分享/删除）。
 */
import { useState, useEffect, type CSSProperties } from 'react';
import { getAuthToken } from '@/lib/auth/token';
import {
  createSkyEvent,
  listSkyEvents,
  deleteSkyEvent,
  buildShareUrl,
  type SkyEvent,
} from '@/lib/skyevent/api';

const overlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 60,
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(2px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const panel: CSSProperties = {
  width: 420,
  maxWidth: '92vw',
  background: 'rgba(3,8,12,0.95)',
  border: '1px solid rgba(0,229,255,0.25)',
  borderRadius: 4,
  padding: 28,
  color: '#c8f0fa',
  fontFamily: "'Inter','Noto Sans SC',system-ui,sans-serif",
};

const input: CSSProperties = {
  width: '100%',
  background: 'rgba(0,229,255,0.03)',
  border: '1px solid rgba(0,229,255,0.2)',
  color: '#c8f0fa',
  padding: '10px 14px',
  borderRadius: 2,
  outline: 'none',
  boxSizing: 'border-box',
  fontSize: 13,
  marginBottom: 14,
};

export function SaveMemorialModal(props: {
  open: boolean;
  onClose: () => void;
  eventTime: string;
  lat: number;
  lng: number;
  locationName: string;
  defaultTitle?: string;
}) {
  const { open, onClose, eventTime, lat, lng, locationName, defaultTitle } = props;
  const [title, setTitle] = useState(defaultTitle ?? '');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState<SkyEvent | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!getAuthToken()) {
      setErr('请先登录后再保存纪念');
      return;
    }
    if (!title.trim()) {
      setErr('请填写纪念名称');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const evt = await createSkyEvent({
        title: title.trim(),
        note: note.trim(),
        eventTime,
        lat,
        lng,
        locationName,
        skySnapshot: { source: 'SkyPage', savedAt: new Date().toISOString() },
      });
      setSaved(evt);
    } catch (e) {
      setErr(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const copy = async () => {
    if (!saved) return;
    try {
      await navigator.clipboard.writeText(buildShareUrl(saved.shareToken));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        {saved ? (
          <>
            <div style={{ fontSize: 16, letterSpacing: 2, marginBottom: 14 }}>已保存为星空纪念 ✦</div>
            <div style={{ fontSize: 13, lineHeight: 2, marginBottom: 16 }}>
              <div>名称 · {saved.title}</div>
              <div>
                地点 · {saved.locationName}（{saved.lat.toFixed(2)}°N {saved.lng.toFixed(2)}°E）
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(143,232,255,0.7)', marginBottom: 10 }}>
              分享名片链接：
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#00e5ff',
                wordBreak: 'break-all',
                background: 'rgba(0,229,255,0.06)',
                padding: '10px 12px',
                borderRadius: 2,
                marginBottom: 16,
              }}
            >
              {buildShareUrl(saved.shareToken)}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={btnPrimary} onClick={copy}>
                {copied ? '已复制' : '复制链接'}
              </button>
              <a
                href={buildShareUrl(saved.shareToken)}
                target="_blank"
                rel="noreferrer"
                style={btnGhost}
              >
                查看名片
              </a>
              <button style={btnGhost} onClick={onClose}>
                完成
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 16, letterSpacing: 2, marginBottom: 6 }}>保存此星空为纪念</div>
            <div style={{ fontSize: 11, color: 'rgba(143,232,255,0.6)', marginBottom: 16 }}>
              {locationName} · {eventTime.slice(0, 16).replace('T', ' ')}
            </div>
            <input
              style={input}
              placeholder="纪念名称（如：生日那晚的星空）"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              style={{ ...input, minHeight: 70, resize: 'vertical' }}
              placeholder="纪念文案（可选，最多 2000 字）"
              value={note}
              maxLength={2000}
              onChange={(e) => setNote(e.target.value)}
            />
            {err && (
              <div style={{ color: '#ff8a8a', fontSize: 12, marginBottom: 12 }}>{err}</div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button style={btnPrimary} onClick={submit} disabled={saving}>
                {saving ? '保存中…' : '保存纪念'}
              </button>
              <button style={btnGhost} onClick={onClose}>
                取消
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function MySkyEventsPanel(props: { open: boolean; onClose: () => void; onChanged: () => void }) {
  const { open, onClose, onChanged } = props;
  const [events, setEvents] = useState<SkyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!getAuthToken()) {
      setEvents([]);
      return;
    }
    setLoading(true);
    listSkyEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const copy = async (evt: SkyEvent) => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(evt.shareToken));
      setCopiedId(evt.id);
      setTimeout(() => setCopiedId((c) => (c === evt.id ? null : c)), 2000);
    } catch {
      /* ignore */
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteSkyEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      onChanged();
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ ...panel, width: 480 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 16, letterSpacing: 2, marginBottom: 14 }}>我的星空纪念</div>
        {!getAuthToken() && (
          <div style={{ fontSize: 13, color: 'rgba(143,232,255,0.7)', lineHeight: 2 }}>
            请先
            <a href="/login" style={{ color: '#00e5ff' }}>
              登录
            </a>
            后查看你保存的纪念事件。
          </div>
        )}
        {getAuthToken() && loading && (
          <div style={{ fontSize: 13, color: 'rgba(143,232,255,0.6)' }}>加载中…</div>
        )}
        {getAuthToken() && !loading && events.length === 0 && (
          <div style={{ fontSize: 13, color: 'rgba(143,232,255,0.6)' }}>
            还没有保存的纪念。在星空页点击「保存纪念」即可记录此刻星空。
          </div>
        )}
        {getAuthToken() &&
          events.map((evt) => (
            <div
              key={evt.id}
              style={{
                border: '1px solid rgba(0,229,255,0.18)',
                borderRadius: 3,
                padding: '12px 14px',
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14, color: '#e0f7ff', marginBottom: 4 }}>{evt.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(143,232,255,0.6)', marginBottom: 8 }}>
                {evt.locationName} · {evt.eventTime.slice(0, 16).replace('T', ' ')}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={btnGhostSmall} onClick={() => copy(evt)}>
                  {copiedId === evt.id ? '已复制' : '复制链接'}
                </button>
                <a
                  href={buildShareUrl(evt.shareToken)}
                  target="_blank"
                  rel="noreferrer"
                  style={btnGhostSmall}
                >
                  查看
                </a>
                <button
                  style={{ ...btnGhostSmall, color: '#ff8a8a', borderColor: 'rgba(255,138,138,0.3)' }}
                  onClick={() => remove(evt.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button style={btnGhost} onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

const btnPrimary: CSSProperties = {
  marginTop: 'auto',
  padding: '12px 18px',
  borderRadius: 2,
  border: '1px solid #00e5ff',
  background: 'transparent',
  color: '#00e5ff',
  cursor: 'pointer',
  fontSize: 13,
  letterSpacing: '0.2em',
};
const btnGhost: CSSProperties = {
  padding: '12px 18px',
  borderRadius: 2,
  border: '1px solid rgba(0,229,255,0.3)',
  background: 'transparent',
  color: '#8fe8ff',
  cursor: 'pointer',
  fontSize: 13,
  letterSpacing: '0.15em',
  textDecoration: 'none',
  textAlign: 'center',
};
const btnGhostSmall: CSSProperties = {
  padding: '6px 12px',
  borderRadius: 2,
  border: '1px solid rgba(0,229,255,0.25)',
  background: 'transparent',
  color: '#8fe8ff',
  cursor: 'pointer',
  fontSize: 12,
  textDecoration: 'none',
  textAlign: 'center',
};
