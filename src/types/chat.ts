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

export type SupabaseChatMessage = {
  id: string;
  created_at: string;
  content: string;
  username: string;
  room_id: string;
};
