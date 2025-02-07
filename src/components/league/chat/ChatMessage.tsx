import React, { useState } from 'react';
import { Trash2, SmilePlus } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  onDelete?: () => void;
  onReact: (messageId: string, emoji: string) => void;
}

export function ChatMessage({ message, isOwnMessage, onDelete, onReact }: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const quickReactions = ['👍', '❤️', '🔥', '👏', '😂'];

  return (
    <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      <img
        src={message.userAvatar}
        alt={message.userName}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : ''}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-600">{message.userName}</span>
          {message.isAdmin && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
              Admin
            </span>
          )}
          <span className="text-xs text-gray-400">{message.timestamp}</span>
        </div>
        
        <div className="relative group">
          <div
            className={`px-4 py-2 rounded-2xl max-w-md break-words ${
              isOwnMessage
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.content}
          </div>

          <div className="absolute top-0 -left-10 h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <SmilePlus size={16} />
            </button>
          </div>

          {isOwnMessage && onDelete && (
            <div className="absolute top-0 -left-10 h-full flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-red-100 rounded-full text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {showReactions && (
          <div className="absolute mt-2 bg-white rounded-full shadow-lg border p-1 flex gap-1 animate-fade-scale-up">
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(message.id, emoji);
                  setShowReactions(false);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReact(message.id, reaction.emoji)}
                className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-gray-600">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}