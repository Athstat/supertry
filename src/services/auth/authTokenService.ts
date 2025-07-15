import { DjangoAuthUser } from "../../types/auth";

export const AUTH_USER_KEY = 'auth_user';
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const IS_GUEST_ACCOUNT_KEY = 'is_guest_account';
export const ONE_SIGNAL_ID = 'onesignal_id';

export const authTokenService = {

    saveUserToLocalStorage: (user: DjangoAuthUser) => {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    },

    getUserFromLocalStorage: () => {
        const jsonStr = localStorage.getItem(AUTH_USER_KEY);

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
    clearUserTokens: () => {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(IS_GUEST_ACCOUNT_KEY);
        localStorage.removeItem(AUTH_USER_KEY);

        authTokenService.clearAccessToken();
    },

    setAccessToken: (token: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    getAccessToken: () => {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    clearAccessToken: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },

    saveGuesAccountTokens: (acessToken: string, user: DjangoAuthUser) => {
        authTokenService.setAccessToken(acessToken);
        authTokenService.saveUserToLocalStorage(user);
        localStorage.setItem(IS_GUEST_ACCOUNT_KEY, 'true');
    },

    saveLoginTokens: (accessToken: string, user: DjangoAuthUser) => {
        authTokenService.setAccessToken(accessToken);
        authTokenService.saveUserToLocalStorage(user);
    },

    getOnesignalId: () => {
        return localStorage.getItem('onesignal_id') ?? undefined;
    }
}