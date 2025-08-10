import React, { useState, useRef } from "react";
import { Send, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const quickEmojis = ["👍", "❤️", "🔥", "👏", "😂", "🎉", "🏉", "💪"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 ark:bg-dark-800/40 "
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-dark-800/40 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-500"
      />
      <button
        type="submit"
        className="p-2 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
      >
        <Send size={20} />
      </button>
    </form>
  );
}
