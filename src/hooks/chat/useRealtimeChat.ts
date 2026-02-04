import { useEffect, useMemo, useRef, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase/supabaseClient';
import { SupabaseChatMessage } from '../../types/chat';

type UseRealtimeChatOptions = {
  roomId?: string;
  username?: string;
  historyLimit?: number;
};

type UseRealtimeChatResult = {
  messages: SupabaseChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
};

const defaultHistoryLimit = 100;

export function useRealtimeChat({
  roomId,
  username,
  historyLimit = defaultHistoryLimit,
}: UseRealtimeChatOptions): UseRealtimeChatResult {
  const [messages, setMessages] = useState<SupabaseChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const channelName = useMemo(() => (roomId ? `room:${roomId}` : undefined), [roomId]);

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!supabase) {
        setError('Supabase is not configured.');
        setIsLoading(false);
        return;
      }

      if (!roomId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(historyLimit);

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setMessages(data || []);
      }

      setIsLoading(false);
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [roomId, historyLimit]);

  useEffect(() => {
    if (!channelName || !roomId || !supabase) return;

    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'message' }, (payload) => {
        const nextMessage = payload.payload as SupabaseChatMessage;
        setMessages((prev) => mergeMessage(prev, nextMessage));
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [channelName, roomId]);

  const sendMessage = async (content: string) => {
    if (!supabase) {
      setError('Supabase is not configured.');
      return;
    }

    if (!roomId || !username) {
      setError('Chat is not ready yet.');
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) return;

    const { data, error: insertError } = await supabase
      .from('messages')
      .insert({
        content: trimmed,
        username,
        room_id: roomId,
      })
      .select('*')
      .single();

    if (insertError || !data) {
      setError(insertError?.message || 'Failed to send message');
      return;
    }

    setMessages((prev) => mergeMessage(prev, data));

    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'message',
        payload: data,
      });
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  };
}

function mergeMessage(
  existing: SupabaseChatMessage[],
  nextMessage?: SupabaseChatMessage
): SupabaseChatMessage[] {
  if (!nextMessage) return existing;

  const alreadyExists = existing.some((message) => message.id === nextMessage.id);
  if (alreadyExists) return existing;

  const merged = [...existing, nextMessage];
  merged.sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    return aTime - bTime;
  });

  return merged;
}
