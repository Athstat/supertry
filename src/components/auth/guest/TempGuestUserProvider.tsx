import { ReactNode, useEffect, useState } from "react"
import { authService } from "../../../services/authService";
import { authTokenService } from "../../../services/auth/authTokenService";
import { TEMP_GUEST_USER_DEVICE_ID } from "../../../types/constants";

type Props = {
    children?: ReactNode,
    loadingFallback?: ReactNode,
    guestDeviceName?: string
}

/** Component that temporarily provides a guest user account to its children */
export default function TempGuestUserProvider({ children, loadingFallback }: Props) {

    const guestDeviceName = TEMP_GUEST_USER_DEVICE_ID;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authenticator = async () => {

            try {
                const token = authTokenService.getAccessToken();

                if (token !== null) {
                    return;
                }

                const res = await authService.authenticateAsGuestUser({
                    realDeviceId: guestDeviceName,
                    storedDeviceId: guestDeviceName
                });

                if (res.data) {
                    authTokenService.saveLoginTokens(res.data.token, res.data.user);
                }
            } finally {
                setIsLoading(false);
            }

        }

        authenticator();

        return () => {
            const flush = async () => {
                const user = authService.getUserInfoSync();

                if (user?.device_id === TEMP_GUEST_USER_DEVICE_ID) {
                    authService.logout();
                }
            }

            flush();
         }
    })

    if (isLoading) {
        return (
            <>{loadingFallback}</>
        )
    }

    return (
        <>
            {children}
        </>
    )
}
