import { createContext, ReactNode, useContext } from "react"
import { DjangoAuthUser } from "../types/auth";
import { authTokenService } from "../services/auth/authTokenService";
import { getBridgeAuthV2 } from "../hooks/useBridgeAuth";
import ScrummyLoadingState from "../components/ui/ScrummyLoadingState";
import { logoutFromBridge } from "../utils/bridgeUtils";
import useSWR from "swr";

type AuthTokenContextProps = {
    /** The auth token for the current login session */
    accessToken?: string,

    /** A function to change the auth token  */
    setAcessToken: (newToken: string) => void,

    /** Get Local Storage User */
    getUserInfoFromLocalStorage: () => DjangoAuthUser | undefined,

    /** Saves the user passed in the param as the local storage user */
    saveUserInfoToLocalStorage: (user: DjangoAuthUser) => void,

    clearAccessTokenAndUser: () => void
}

const AuthTokenContext = createContext<AuthTokenContextProps | undefined>(undefined);


type Props = {
    children?: ReactNode
}

/** A Provider that handles retrieving the saved auth token from local storage
 * as well as the scrummy mobile webview bridge, and makes it available to children
 * below the component
 */

export default function AuthTokenProvider({ children }: Props) {

    const key = `auth/auth-token`;
    const {saveAccessTokenToMobile} = getBridgeAuthV2();
    const {data: accessToken, isLoading, mutate: setAccessToken} = useSWR(key, () => fetcher());

    // If auth token has been replaced, then notify bridge of this
    const handleChangeAuthToken = (token: string) => {
        setAccessToken(token);
        authTokenService.setAccessToken(token);
        saveAccessTokenToMobile(token);
    }

    const handleSaveLocalStorageUser = (user: DjangoAuthUser) => {
        // Save user to localstorage
        authTokenService.saveUserToLocalStorage(user);
    }

    const getUserInfoFromLocalStorage = (): DjangoAuthUser | undefined => {
        return authTokenService.getUserFromLocalStorage();
    }


    const handleClearAuthTokenAndUser = () => {
        setAccessToken(undefined);

        logoutFromBridge();

        authTokenService.clearAccessToken();
        authTokenService.clearUserTokens();
        authTokenService.cleanupKeycloakTokens();
    };

    if (isLoading) {
        return <ScrummyLoadingState />
    }

    return (
        <AuthTokenContext.Provider
            value={{
                saveUserInfoToLocalStorage: handleSaveLocalStorageUser,
                accessToken,
                setAcessToken: handleChangeAuthToken,
                getUserInfoFromLocalStorage,
                clearAccessTokenAndUser: handleClearAuthTokenAndUser
            }}
        >
            {children}
        </AuthTokenContext.Provider>
    )
}

/** Provides auth token functionality */
export function useAuthToken(): AuthTokenContextProps {
    const context = useContext(AuthTokenContext);

    if (!context) {
        throw Error("Auth User Token hook should be used inside an auth token provider");
    }

    return context
}

const fetcher = async () => {

    const {getSavedAccessTokenFromMobile, saveAccessTokenToMobile} = getBridgeAuthV2();

    const tokenFromBridge = await getSavedAccessTokenFromMobile();

    if (tokenFromBridge) {
        authTokenService.setAccessToken(tokenFromBridge);
        return tokenFromBridge;
    }

    const tokenFromLocalStorage = authTokenService.getAccessToken();

    if (tokenFromLocalStorage) {
        saveAccessTokenToMobile(tokenFromLocalStorage);
        return tokenFromLocalStorage;
    }

    return undefined;
}