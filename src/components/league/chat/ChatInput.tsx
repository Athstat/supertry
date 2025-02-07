import React, { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const quickEmojis = ['👍', '❤️', '🔥', '👏', '😂', '🎉', '🏉', '💪'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 bg-white p-3 border-t">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            maxLength={500}
          />
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Smile size={18} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={18} />
        </button>
      </div>

      {showEmojis && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border p-2 animate-fade-scale-up">
          <div className="flex gap-1 flex-wrap max-w-[200px]">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setMessage((prev) => prev + emoji);
                  setShowEmojis(false);
                  inputRef.current?.focus();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg text-xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}