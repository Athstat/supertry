/** Notification Service */

import { NotificationProfile, UpdateNotificationProfileReq } from "../types/notifications";
import { getAuthHeader, getUri } from "../utils/backendUtils"
import { authService } from "./authService";
import { logger } from "./logger";

export const notificationService = {

    /** Updates the users preference on the type of game updates they want to revieve */
    updateGameUpdatesPreferences: async (preference: string) => {
        try {
            
            const userInfo = await authService.getUserInfo();
            const userId = userInfo?.kc_id ?? "fall-back-id";

            const uri = getUri(`/api/v1/notifications/users/${userId}/preferences`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
                body: JSON.stringify({
                    game_updates_preference: preference
                }),
                method: "PUT"
            });

            return await res.json();

        } catch (error) {
            console.log("Error updating game updates ", error);
            return undefined;
        }
    },

    getNotificationProfile: async (userId: string) : Promise<NotificationProfile | undefined> => {
        try {
            const uri = getUri(`/api/v1/notifications/profiles/${userId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as NotificationProfile
            }
        } catch (err) {
            logger.error("Error fetching user notification profile ", err);
        }

        return undefined;
    },

    updateNotificationProfile: async (userId: string, data: UpdateNotificationProfileReq) : Promise<NotificationProfile | undefined> => {
        try {
            const uri = getUri(`/api/v1/notifications/profiles/${userId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: "PUT",
                body: JSON.stringify(data)
            });

            if (res.ok) {
                return (await res.json()) as NotificationProfile
            }
        } catch (err) {
            logger.error("Error updating notification profile ", err);
        }

        return undefined;
    }
}