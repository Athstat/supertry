import { DjangoAuthUser } from "../../types/auth";
import { isKeycloakToken } from "../../utils/authUtils";
import { getAppStorage } from "../storage/appStorageFactory";
import { AUTH_USER_KEY, REFRESH_TOKEN_KEY, IS_GUEST_ACCOUNT_KEY, ACCESS_TOKEN_KEY } from "./authTokenService";


const appStorage = getAppStorage();

export const appStorageTokenService = {

    saveUserToLocalStorage: async (user: DjangoAuthUser) => {
        await appStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    },

    getUserFromLocalStorage: async () => {
        const jsonStr = await appStorage.getItem(AUTH_USER_KEY);

        if (!jsonStr) {
            return undefined;
        }

        try {
            const obj = JSON.parse(jsonStr);
            return obj as DjangoAuthUser
        } catch (err) {
            return undefined;
        }
    },

    /** Clears all user tokens saved in local storage */
    clearUserTokens: async () => {
        await appStorage.removeItem(REFRESH_TOKEN_KEY);
        await appStorage.removeItem(IS_GUEST_ACCOUNT_KEY);
        await appStorage.removeItem(AUTH_USER_KEY);

        await appStorageTokenService.clearAccessToken();
    },

    setAccessToken: async (token: string) => {
        console.log('Saving access token ', token);
        await appStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    getAccessToken: async () => {
        const token = await appStorage.getItem(ACCESS_TOKEN_KEY);

        if (token && isKeycloakToken(token)) {
            await appStorageTokenService.clearUserTokens();
            return null;
        }

        return token;
    },

    clearAccessToken: async () => {
        await appStorage.removeItem(ACCESS_TOKEN_KEY);
    },

    saveGuesAccountTokens: async (acessToken: string, user: DjangoAuthUser) => {
        await appStorageTokenService.setAccessToken(acessToken);
        await appStorageTokenService.saveUserToLocalStorage(user);
        await appStorage.setItem(IS_GUEST_ACCOUNT_KEY, 'true');
    },

    saveLoginTokens: async (accessToken: string, user: DjangoAuthUser) => {
        
        await appStorageTokenService.setAccessToken(accessToken);
        await appStorageTokenService.saveUserToLocalStorage(user);
    },

    getOnesignalId: async () => {
        return await appStorage.getItem('onesignal_id') ?? undefined;
    }
}