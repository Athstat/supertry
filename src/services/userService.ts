import { DjangoAuthUser } from "../types/auth";
import { getUri } from "../utils/backendUtils";
import { logger } from "./logger";

export const userService = {
    getUserByEmail: async (email: string) : Promise<DjangoAuthUser | undefined> => {
        try {

            if (email === "") return undefined;

            const uri = getUri(`/api/v1/users/by-email/${email}`);
            const res = await fetch(uri);
            
            if (res.ok) {
                return (await res.json()) as DjangoAuthUser;
            }

            if (res.status === 400) {
                return undefined;
            }
        } catch (error) {
            logger.error('Error fetching user by email ', error)
            return undefined;
        }
    }
}