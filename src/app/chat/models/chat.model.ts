export interface Message {
  chat_id: string;
  content: string;
  id: string;
  role: 'assistant' | 'user';
  sent_at: string;
  isPlaceholder?: boolean;
} 