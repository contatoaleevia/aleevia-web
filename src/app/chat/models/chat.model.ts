export interface Message {
  chat_id: string;
  content: MessageContent | string;
  id: string;
  message: string;
  role: 'assistant' | 'user';
  sent_at: string;
  isPlaceholder?: boolean;
}

export interface MessageContent {
  source: string;
  sourceId: string;
}