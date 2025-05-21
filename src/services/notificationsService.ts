/** Notification Service */

import { getAuthHeader, getUri } from "../utils/backendUtils"
import { authService } from "./authService";

export const notificationService = {

    /** Updates the users preference on the type of game updates they want to revieve */
    updateGameUpdatesPreferences: async (preference: string) => {
        try {
            
            const userInfo = authService.getUserInfo();
            const userId = userInfo?.id ?? "fall-back-id";

            const uri = getUri(`/api/v1/notifications/users/${userId}/preferences/game-updates/${preference}`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: "PUT"
            });

            return await res.json();

        } catch (error) {
            console.log("Error updating game updates ", error);
            return undefined;
        }
    } 
}