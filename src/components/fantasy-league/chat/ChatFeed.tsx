import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, ChevronDown } from "lucide-react";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatMessage, ChatUser } from "../../../types/chat";

interface ChatFeedProps {
  messages: ChatMessage[];
  currentUser: ChatUser;
  onSendMessage: (content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function ChatFeed({
  messages,
  currentUser,
  onSendMessage,
  onDeleteMessage,
  onReactToMessage,
}: ChatFeedProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } =
        chatContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-3 border-b border-gray-100 dark:border-gray-800/40">
        <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-gray-100">
          <MessageSquare size={20} className="text-primary-500" />
          League Discussion
        </h2>
      </div>

      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white dark:bg-dark-800/40"
      >
        {messages.map((message) => (
          <ChatMessageComponent
            key={message.id}
            message={message}
            isOwnMessage={message.userId === currentUser.id}
            onDelete={
              message.userId === currentUser.id || currentUser.isAdmin
                ? () => onDeleteMessage(message.id)
                : undefined
            }
            onReact={onReactToMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-16 right-4 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors animate-fade-scale-up"
        >
          <ChevronDown size={18} />
        </button>
      )}

      <div className="border-t border-gray-100 dark:border-gray-700/50 p-3 bg-white dark:bg-dark-800/40 ">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
