import { UserLocation } from "../../types/web";
import { logger } from "../logger"

export const geolocationService = {

    /* Function that gets the users geo location using their IP address */
    getLocation: async () : Promise<UserLocation | undefined> => {
        try {
            const uri = 'https://ipapi.co/json/';
            const res = await fetch(uri);

            if (res.ok) {
            return (await res.json()) as UserLocation;
            }
        } catch (err) {
            logger.error('Error fetching user location', err);
        }

        return undefined;
    }
}