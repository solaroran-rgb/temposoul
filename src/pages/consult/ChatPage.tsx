import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { CHAT_SEED, ChatMessage } from '@/data/consult/chat';
import { trackPageView } from '@/lib/analytics';
import { safeStorage } from '@/lib/safe-storage';
import { guardText } from '@/lib/assertions-guard';
import './ChatPage.css';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function ChatPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState(() => safeStorage.getJSON<string>('chat:draft', ''));

  useEffect(() => {
    trackPageView('/consult/chat');
    setMessages(CHAT_SEED);
    setStatus(CHAT_SEED.length ? 'ok' : 'ok-empty');
  }, []);

  const handleSend = () => {
    if (!draft.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: draft,
      timestamp: Date.now(),
      ready: false,
    };
    setMessages([...messages, newMsg].sort((a, b) => a.timestamp - b.timestamp));
    setDraft('');
    safeStorage.remove('chat:draft');
    // 契约缺口：后端 WebSocket IM 网关未建
  };

  return (
    <div className="chat-page">
      <PageTopbar title="在线咨询" onBack={() => navigate(-1)} />
      <PrivacyHint />
      {status === 'loading' && <div className="skeleton" />}
      {status === 'ok' && (
        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className={`bubble ${m.sender}`}>
              {guardText(m.text)}
            </div>
          ))}
        </div>
      )}
      <div className="composer">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            safeStorage.setJSON('chat:draft', e.target.value);
          }}
        />
        <button onClick={handleSend}>发送</button>
        <button className="report-btn">举报</button>
      </div>
    </div>
  );
}
