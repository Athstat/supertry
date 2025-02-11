import React, { useState } from "react";
import { Trash2, Smile } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../../../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  onDelete?: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

export function ChatMessage({
  message,
  isOwnMessage,
  onDelete,
  onReact,
}: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`flex ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      } items-start gap-2 group`}
    >
      <img
        src={message.userAvatar}
        alt={message.userName}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              isOwnMessage ? "text-right" : ""
            } text-gray-600 dark:text-gray-400`}
          >
            {message.userName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {message.timestamp}
          </span>
        </div>
        <div
          className={`relative group rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? "bg-primary-600 text-white ml-auto"
              : "bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-gray-100"
          }`}
        >
          {message.content}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="absolute -right-10 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white dark:bg-dark-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Smile size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        {message.reactions.length > 0 && (
          <div
            className={`flex gap-1 ${
              isOwnMessage ? "justify-end" : "justify-start"
            }`}
          >
            {message.reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact(message.id, reaction.emoji)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-700 text-sm hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                <span>{reaction.emoji}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {reaction.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {isOwnMessage && onDelete && (
        <button
          onClick={() => onDelete(message.id)}
          className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
