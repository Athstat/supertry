import { createContext, ReactNode, useEffect } from "react"
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/authService";
import { useDelay } from "../../../hooks/web/useDelay";
import { useTempGuestUser } from "../../../hooks/auth/useTempGuestUser";

type Props = {
    children?: ReactNode,
    loadingFallback?: ReactNode,
    guestDeviceName?: string
}

type TempGuestUserContext = {
    guestDeviceName?: string
}


export const TempGuestUserContext = createContext<TempGuestUserContext | null>(null);

/** Component that temporarily provides a guest user account to its children */
export default function TempGuestUserProvider({ children, loadingFallback, guestDeviceName = 'temp_guest_user_provider_device_id' }: Props) {

    const {isDelaying} = useDelay(500);
    const { setAuth, isAuthenticated, authUser, isLoading: loadingAuth } = useAuth();

    const isLoading = loadingAuth || isDelaying
    
    useEffect(() => {
        const authenticator = async () => {

            if (isLoading) {
                return;
            }

            if (isAuthenticated || authUser) {
                console.log("User is already authenticated ")
                return;
            }

            const res = await authService.authenticateAsGuestUser({
                realDeviceId: guestDeviceName,
                storedDeviceId: guestDeviceName
            });

            const { data } = res;

            if (!data) {
                return;
            }

            setAuth(data.token, data.user);
        }

        authenticator();
    }, [authUser, guestDeviceName, isAuthenticated, isLoading, setAuth]);

    if (isDelaying) {
        return (
            <>{loadingFallback}</>
        )
    }

    return (
        <TempGuestUserContext.Provider value={{guestDeviceName}} >
            <Inner>
                {children}
            </Inner>
        </TempGuestUserContext.Provider>
    )
}

type InnerProps = {
    children?: ReactNode
}

function Inner({children} : InnerProps) {
    
    const {deauthenticate} = useTempGuestUser();

    useEffect(() => {
        return () => {
            deauthenticate();
        }
    })
    
    return (
        <>
            {children}
        </>
    )
}
