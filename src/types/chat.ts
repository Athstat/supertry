export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  reactions: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  isAdmin?: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isAdmin?: boolean;
}