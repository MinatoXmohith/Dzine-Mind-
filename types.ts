export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum DesignMode {
  CRITIC = 'Design Critic',
  CREATIVE = 'Creative Thought',
  ADVISOR = 'Future Advisor',
  TRENDS = 'Trend Intelligence'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  attachment?: {
    mimeType: string;
    data: string; // base64
  };
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentMode: DesignMode;
  error: string | null;
}

export interface Attachment {
  mimeType: string;
  data: string;
}