import useSWR from "swr";
import { inAppMessagesServices } from "../../services/notifications/inAppMessagesService";
import { useMemo } from "react";

/** Get in app message counts */
export function useInAppMessageCount() {
    const key = `/in-app-messages-count`;
    const { data, isLoading } = useSWR(key, () => inAppMessagesServices.getCount());

    const unread_count = useMemo(() => {
        if (data) {
            return data.unread_count
        }

        return 0;
    }, [data]);

    const read_count = useMemo(() => {
        if (data) {
            return data.read_count
        }

        return 0;
    }, [data]);

    const total_count = useMemo(() => {

        if (data) {
            return data.total_count
        }

        return 0;
    }, [data]);

    return { total_count, read_count, unread_count, isLoading }
}