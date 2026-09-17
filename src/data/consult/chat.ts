export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: number;
  ready: boolean;
}

export const CHAT_SEED: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: '你好，我想看八字',
    timestamp: Date.now() - 60000,
    ready: false,
  },
  {
    id: 'msg-2',
    sender: 'advisor',
    text: '你好，请提供出生年月日时',
    timestamp: Date.now() - 30000,
    ready: false,
  },
];
