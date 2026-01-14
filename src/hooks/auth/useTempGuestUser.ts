import { useContext } from "react";
import { TempGuestUserContext } from "../../components/auth/guest/TempGuestUserProvider";
import { useAuth } from "../../contexts/AuthContext";

export function useTempGuestUser() {
    const {authUser, logout} = useAuth();
    const context = useContext(TempGuestUserContext);

    if (!context) {
        throw Error('useTempGuestUser() hook should be used inside the TempGuestUserProvider');
    }

    const deauthenticate = () => {
        if (authUser?.device_id === context.guestDeviceName) {
            logout();
        }
    }

    return {
        deauthenticate
    }
}