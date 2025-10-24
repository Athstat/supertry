import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { requestPushPermissions } from "../../utils/bridgeUtils";

/** Function that will check if a user has been alerted to enable
 * notifications before and if not prompts user to enable them 
 * temporal fix for EnableNotificationCard
 * */
export function useTempEnableNotificationAlert() {
    const {authUser} = useAuth();
    const localStorageKey = `user-prompted-to-enabled-notifications-${authUser?.kc_id}`;

    useEffect(() => {
        const fetcher = async () => {
            
            const isSet = localStorage.getItem(localStorageKey);

            if (isSet !== null) {
                return;
            }
        
            console.log("Requesting for push permissions")

            await requestPushPermissions();
            localStorage.setItem(localStorageKey, 'true');
        }

        fetcher();
    }, [localStorageKey]);
}