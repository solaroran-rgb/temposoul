// F04 · AI追问框组件（第二阶段收口合并）
// 目标：所有结果页底部统一 AI 追问框，用户可继续提问。
//
// 设计：
// - 直接消费 useAiChat（与 AiChatPanel 同源的流式/重试状态机），
//   不另起一套请求栈，保证追问与主面板对话一致。
// - contextPrompt：当前页面排盘 + L0 结论摘要（页面侧构建）。
// - 追问历史按 resetKey 存 localStorage，同页刷新不丢上下文。
// - 紧凑布局：底部固定追问行，不做全高面板，适合挂在结果页底部。
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { marked } from '@/lib/marked-init';
import { useAiChat } from '@/hooks/useAiChat';
import type { AiRequestConfig } from '@/lib/ai/settings';
import {
  buildAiChatInitialPrompt,
  loadAiChatHistory,
  saveAiChatHistory,
  upsertAiChatSession,
  createAiChatSessionId,
  createAiChatTitle,
} from '@/lib/ai/chat-history';
import type { AiChatSession } from '@/lib/ai/chat-history';
import { filterBannedWords } from '@/lib/client-compliance';

interface AIChatBoxProps {
  /** 页面上下文：排盘数据 + L0 结论摘要（不含用户问题） */
  contextPrompt: string;
  /** resetKey 变化时切换会话上下文（如切换排盘来源/年份） */
  resetKey?: string;
  /** 会话缓存 key；不传时由 resetKey + contextPrompt 派生 */
  historyKey?: string;
  /** AI 请求配置（端点/模型），不传时用全局默认 */
  aiConfig?: AiRequestConfig;
  /** 输入占位文案 */
  placeholder?: string;
  /** 最大保留会话数 */
  maxSessions?: number;
}

const STORAGE_PREFIX = 'temposoul:ai-chat-box:v1:';

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function storageKeyFor(historyKey?: string, resetKey?: string, contextPrompt?: string) {
  const base = historyKey ?? `${resetKey ?? ''}\n${contextPrompt ?? ''}`;
  const trimmed = base.trim();
  if (!trimmed) return '';
  return `${STORAGE_PREFIX}${hashText(trimmed)}:${trimmed.length}`;
}

function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    return marked.parse(filterBannedWords(content)) as string;
  } catch {
    return content;
  }
}

function AIChatBoxImpl({
  contextPrompt,
  resetKey,
  historyKey,
  aiConfig,
  placeholder = '还有问题？在这里继续追问…',
  maxSessions = 20,
}: AIChatBoxProps) {
  const chat = useAiChat(aiConfig);
  const { turns, streamingContent, status, error, hasStarted } = chat;

  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const sessionsRef = useRef<AiChatSession[]>([]);
  const activeIdRef = useRef('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const storageKey = useMemo(
    () => storageKeyFor(historyKey, resetKey, contextPrompt),
    [historyKey, resetKey, contextPrompt],
  );
  const isBusy = status === 'loading' || status === 'streaming';
  const isContextReady = contextPrompt.trim().length > 0;

  const applyHistory = useCallback(
    (nextSessions: AiChatSession[], nextActiveId: string, persist = true) => {
      sessionsRef.current = nextSessions;
      activeIdRef.current = nextActiveId;
      setSessions(nextSessions);
      setActiveSessionId(nextActiveId);
      if (persist) {
        const trimmed = nextSessions.slice(-maxSessions);
        saveAiChatHistory(storageKey, {
          sessions: trimmed,
          activeSessionId: nextActiveId,
        });
      }
    },
    [maxSessions, storageKey],
  );

  // resetKey / 上下文变化 → 恢复历史会话
  useEffect(() => {
    const saved = loadAiChatHistory(storageKey);
    const active = saved.sessions.find((s) => s.id === saved.activeSessionId);
    sessionsRef.current = saved.sessions;
    activeIdRef.current = active?.id ?? '';
    setSessions(saved.sessions);
    setActiveSessionId(active?.id ?? '');
    setInputValue('');
    setHistoryOpen(false);

    if (active) {
      chat.restore(active.turns, buildAiChatInitialPrompt(contextPrompt, active));
    } else {
      chat.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, contextPrompt, resetKey]);

  // 对话结束后持久化当前会话
  useEffect(() => {
    if (!hasStarted || (status !== 'done' && status !== 'error')) return;
    const sessionId = activeIdRef.current;
    const current = sessionsRef.current.find((s) => s.id === sessionId);
    if (!current || current.turns === turns) return;
    const updated: AiChatSession = { ...current, turns, updatedAt: new Date().toISOString() };
    applyHistory(upsertAiChatSession(sessionsRef.current, updated), updated.id);
  }, [applyHistory, hasStarted, status, turns]);

  // 自动跟随滚动
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, streamingContent, status]);

  const startNewSession = useCallback(
    (text: string) => {
      const now = new Date().toISOString();
      const session: AiChatSession = {
        id: createAiChatSessionId(),
        title: createAiChatTitle(text, 'AI 追问'),
        initialQuestion: text.trim(),
        promptMode: 'context-question',
        turns: [],
        createdAt: now,
        updatedAt: now,
      };
      applyHistory(upsertAiChatSession(sessionsRef.current, session), session.id, false);
      chat.analyze(contextPrompt + '\n\n' + text);
    },
    [applyHistory, chat, contextPrompt],
  );

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isBusy || !isContextReady) return;
    setInputValue('');
    if (!hasStarted) {
      startNewSession(text);
    } else {
      chat.ask(text);
    }
  }, [inputValue, isBusy, isContextReady, hasStarted, chat, startNewSession]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleRetry = useCallback(() => {
    if (!isBusy) chat.retry();
  }, [chat, isBusy]);

  const handleNewChat = useCallback(() => {
    if (isBusy) return;
    applyHistory(sessionsRef.current, '');
    chat.reset();
    setInputValue('');
    setHistoryOpen(false);
    inputRef.current?.focus();
  }, [applyHistory, chat, isBusy]);

  const handleSelectSession = useCallback(
    (session: AiChatSession) => {
      if (isBusy || session.id === activeIdRef.current) return;
      applyHistory(sessionsRef.current, session.id, false);
      chat.restore(session.turns, buildAiChatInitialPrompt(contextPrompt, session));
      setInputValue('');
      setHistoryOpen(false);
    },
    [applyHistory, chat, contextPrompt, isBusy],
  );

  return (
    <section
      className="ai-chat-box"
      style={{
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* 头部 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
          💬 AI 追问
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={() => setHistoryOpen((v) => !v)}
              style={{
                fontSize: 12,
                padding: '3px 10px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              历史 {sessions.length}
            </button>
          )}
          {(hasStarted || activeSessionId) && (
            <button
              type="button"
              onClick={handleNewChat}
              disabled={isBusy}
              style={{
                fontSize: 12,
                padding: '3px 10px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                opacity: isBusy ? 0.5 : 1,
              }}
            >
              新对话
            </button>
          )}
        </div>
      </div>

      {/* 消息区 */}
      <div
        ref={scrollRef}
        style={{
          maxHeight: 320,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {!hasStarted && !streamingContent && isContextReady ? (
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            基于上方解盘结果继续追问，答案会结合你的排盘上下文。
          </div>
        ) : null}

        {turns.map((turn, index) =>
          turn.role === 'user' ? (
            <div key={index} style={{ alignSelf: 'flex-end', maxWidth: '75%' }}>
              <div
                style={{
                  background: 'rgba(99,102,241,0.18)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  fontSize: 14,
                  color: '#e2e8f0',
                }}
              >
                {turn.content}
              </div>
            </div>
          ) : (
            <div key={index} style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div
                className="ai-chat-msg-bubble markdown-body"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  fontSize: 14,
                  color: '#e2e8f0',
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(turn.content) }}
              />
            </div>
          ),
        )}

        {streamingContent ? (
          <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div
              className="markdown-body"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '8px 12px',
                fontSize: 14,
                color: '#e2e8f0',
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingContent) }}
            />
          </div>
        ) : null}

        {status === 'loading' && !streamingContent ? (
          <div style={{ color: '#94a3b8', fontSize: 13 }}>AI 正在思考…</div>
        ) : null}
      </div>

      {/* 历史面板 */}
      {historyOpen && sessions.length > 0 ? (
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            margin: '0 14px 8px',
            padding: '10px',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => handleSelectSession(session)}
              disabled={isBusy}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '6px 10px',
                fontSize: 13,
                color:
                  session.id === activeSessionId ? '#a5b4fc' : '#94a3b8',
                background:
                  session.id === activeSessionId ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              {session.title}
              <span style={{ marginLeft: 8, fontSize: 11, color: '#64748b' }}>
                {session.turns.length} 条
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* 错误提示 + 输入行 */}
      {error ? (
        <div
          style={{
            margin: '0 14px 8px',
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(251,113,133,0.10)',
            color: '#fb7185',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ flex: 1 }}>{error}</span>
          {chat.canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              style={{
                fontSize: 12,
                padding: '3px 10px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#e2e8f0',
                cursor: 'pointer',
              }}
            >
              重试
            </button>
          )}
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <textarea
          ref={inputRef}
          className="ai-chat-box-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={!isContextReady}
          style={{
            flex: 1,
            resize: 'none',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '10px 12px',
            fontSize: 14,
            color: '#e2e8f0',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isBusy || !inputValue.trim() || !isContextReady}
          aria-label="发送追问"
          style={{
            width: 40,
            borderRadius: 10,
            background: isBusy
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(99,102,241,0.35)',
            border: 'none',
            color: '#e2e8f0',
            cursor: isBusy ? 'default' : 'pointer',
            opacity: isBusy ? 0.5 : 1,
          }}
        >
          {isBusy ? (
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#e2e8f0',
                borderRadius: 999,
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            '↑'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

export const AIChatBox = AIChatBoxImpl;
export default AIChatBox;
