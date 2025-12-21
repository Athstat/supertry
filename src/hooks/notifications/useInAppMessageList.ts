import useSWR from "swr";
import { inAppMessagesServices } from "../../services/notifications/inAppMessagesService";
import { useMemo } from "react";

/** Hook that fetches in app message list */
export function useInAppMessageList() {
    const key = `/in-app-notifications/user-messages`;
    const { data: messages, isLoading, mutate } = useSWR(key, () => inAppMessagesServices.getMessages());

    const sortedMessages = useMemo(() => {
        const copy = [...(messages ?? [])]
        return copy.sort((a, b) => {
            const aEpoch = new Date(a.created_at).valueOf();
            const bEpoch = new Date(b.created_at).valueOf();

            return bEpoch - aEpoch
        })
    }, [messages]);

    const unreadMessages = useMemo(() => {
        const copy = [...(sortedMessages ?? [])]
        return copy.filter((m) => {
            return m.is_read === false
        })
    }, [sortedMessages]);

    const readMessages = useMemo(() => {
        const copy = [...(sortedMessages ?? [])]
        return copy.filter((m) => {
            return m.is_read === true
        })
    }, [sortedMessages]);

    const unreadCount = unreadMessages.length;
    const readCount = readMessages.length;

    return {
        messages,
        readCount,
        unreadCount,
        unreadMessages,
        readMessages,
        isLoading,
        refresh: mutate
    }

}