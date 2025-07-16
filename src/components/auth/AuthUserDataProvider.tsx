import useSWR from "swr"
import { swrFetchKeys } from "../../utils/swrKeys"
import { authService } from "../../services/authService";
import { LoadingState } from "../ui/LoadingState";
import { ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import { authUserAtom } from "../../state/authUser.atoms";

type Props = {
    children?: ReactNode
}

/** Provides the auth user atom to its children down the tree */
export default function AuthUserDataProvider({children} : Props) {

    const userFetchKey = swrFetchKeys.getAuthUserProfileKey();
    const {data: userInfo, isLoading: loadingUser} = useSWR(userFetchKey, () => authService.getUserInfo());
    const isLoading = loadingUser;

    const setAuthUser = useSetAtom(authUserAtom);

    useEffect(() => {
        if (userInfo) setAuthUser(userInfo);
    }, [userInfo])

    if (isLoading) return <LoadingState />

    return (
        <>
            {children}
        </>
    )
}
