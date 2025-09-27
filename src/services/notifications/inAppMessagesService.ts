import { InAppMessage, InAppMessageCount } from "../../types/notifications/inAppMessage";
import { getAuthHeader, getUri } from "../../utils/backendUtils"
import { logger } from "../logger";

export const inAppMessagesServices = {
    getCount: async () : Promise<InAppMessageCount | undefined> =>  {
        try {
            const uri = getUri(`/api/v1/notifications/in-app/count`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as InAppMessageCount;
            }
        } catch (err) {
            logger.error('Error fetching in app messages for user ', err);
        }

        return undefined;
    },

    getMessages: async (unread?: boolean) : Promise<InAppMessage[]> => {
        try {
            const queryParams = unread ? '?unread=true' : ''; 
            const uri = getUri(`/api/v1/notifications/in-app${queryParams}`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as InAppMessage[]
            }
        } catch (err) {
            logger.error('Error fetching in app messages ', err);
        }

        return [];
    },

    markAsRead: async (messageId: string) : Promise<InAppMessage | undefined> => {
        try {
            const uri = getUri(`/api/v1/notifications/in-app/${messageId}/mark-as-read`);
            
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'PUT'
            });

            if (res.ok) {
                return (await res.json()) as InAppMessage;
            }

        } catch (err) {
            logger.error('Error marking message as read ', err);
        }

        return undefined;
    }
}