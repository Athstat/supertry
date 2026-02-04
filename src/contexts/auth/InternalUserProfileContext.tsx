import { createContext, ReactNode } from "react"
import { useAuth } from "./AuthContext";
import useSWR, { KeyedMutator } from "swr";
import { userService } from "../../services/userService";
import { InternalUserProfile } from "../../types/auth";

type InternalUserProfileContextProps = {
    internalProfile?: InternalUserProfile,
    isLoading?: boolean,
    refresh: KeyedMutator<InternalUserProfile | undefined>
}

export const InternalUserProfileContext = createContext<InternalUserProfileContextProps | null>(null);

type Props = {
    children?: ReactNode
}

export default function InternalUserProfileProvider({children} : Props) {

    const {authUser} = useAuth();

    const key = authUser ? `/users/${authUser?.kc_id}/internal-profile` : null;
    const {data: internalProfile, isLoading, mutate: refresh} = useSWR(key, () => userService.getInternalProfile(authUser?.kc_id || ''));

    return (
        <InternalUserProfileContext.Provider
            value={{
                isLoading,
                internalProfile,
                refresh
            }}
        >
            {children}
        </InternalUserProfileContext.Provider>
    )
}

