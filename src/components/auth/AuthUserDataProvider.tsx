import { ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import { authUserAtom } from "../../state/authUser.atoms";
import { useAuth } from "../../contexts/auth/AuthContext";

type Props = {
    children?: ReactNode
}

/** Provides the auth user atom to its children down the tree */
export default function AuthUserDataProvider({children} : Props) {

    const {authUser} = useAuth();
    const setAuthUser = useSetAtom(authUserAtom);

    useEffect(() => {
        if (authUser) setAuthUser(authUser);
    }, [authUser, setAuthUser])

    return (
        <>
            {children}
        </>
    )
}
