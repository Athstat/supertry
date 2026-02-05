import { useMemo, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useRealtimeChat } from '../../../hooks/chat/useRealtimeChat';
import { useChatScroll } from '../../../hooks/chat/useChatScroll';
import { SupabaseChatMessage } from '../../../types/chat';
import PrimaryButton from '../../ui/buttons/PrimaryButton';
import { useAuth } from '../../../contexts/auth/AuthContext';

export default function FantasyLeagueChatTab() {
  const { league } = useFantasyLeagueGroup();
  const { authUser } = useAuth();

  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const roomId = league?.id;
  const leagueTitle = league?.title || 'League';
  const username = authUser?.username || authUser?.first_name || 'Member';

  const { messages, sendMessage, isLoading, error } = useRealtimeChat({
    roomId,
    username,
    historyLimit: 100,
  });

  useChatScroll(scrollRef, [messages.length]);

  const isReady = Boolean(roomId);

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    await sendMessage(trimmed);
    setDraft('');
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSend();
    }
  };

  const headerLabel = useMemo(() => `${leagueTitle} Chat`, [leagueTitle]);

  return (
    <div className="flex flex-col gap-4 px-4 pb-32 py-4 overflow-x-hidden">
      
      <div className="flex flex-row items-center gap-2">
        <MessageSquare className="text-slate-700 dark:text-slate-300" />
        <p className="text-lg font-bold">{headerLabel}</p>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-3 py-4 h-[420px] overflow-y-auto"
      >
        {isLoading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading messages...</p>
        )}

        {!isLoading && messages.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No messages yet. Start the conversation.
          </p>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.username === username}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex flex-col gap-2">
        <textarea
          className="w-full min-h-[90px] resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/80 px-4 py-3 text-base md:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={isReady ? 'Type a message...' : 'Chat is unavailable'}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isReady}
        />

        <div className="flex justify-end">
          <PrimaryButton
            onClick={handleSend}
            disabled={!isReady || draft.trim().length === 0}
            className="w-auto px-4 py-2"
          >
            <span className="text-sm">Send</span>
            <Send className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

type MessageBubbleProps = {
  message: SupabaseChatMessage;
  isCurrentUser: boolean;
};

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const timestamp = formatTimestamp(message.created_at);

  return (
    <div
      className={`flex flex-col gap-1 ${
        isCurrentUser ? 'items-end' : 'items-start'
      }`}
    >
      <div className="text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          {isCurrentUser ? 'You' : message.username}
        </span>
        <span className="px-1">•</span>
        <span>{timestamp}</span>
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
          isCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function formatTimestamp(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
