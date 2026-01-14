import { createContext, ReactNode, useEffect, useState } from "react"
import { useAuth } from "../../../contexts/AuthContext";
import { authService } from "../../../services/authService";

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

    const [isProcessing, setIsProcessing] = useState(false);
    const { authStatus, setAuth } = useAuth();

    useEffect(() => {
        const authenticator = async () => {

            if (authStatus !== 'unauthenticated') return;

            setIsProcessing(true);

            try {

                const res = await authService.authenticateAsGuestUser({
                    realDeviceId: guestDeviceName,
                    storedDeviceId: guestDeviceName
                });

                const { data } = res;

                if (data) {
                    setAuth(data.token, data.user);
                    setIsProcessing(false);
                    return;
                }

            } finally {
                setIsProcessing(false);
            }

        }

        authenticator();

    }, [authStatus, guestDeviceName, setAuth]);

    if (authStatus === 'loading' || isProcessing) {
        return (
            <>{loadingFallback}</>
        )
    }

    return (
        <TempGuestUserContext.Provider value={{ guestDeviceName }} >
            {children}
        </TempGuestUserContext.Provider>
    )
}
