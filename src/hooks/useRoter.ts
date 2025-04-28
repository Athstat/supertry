import { useLocation, useNavigate } from "react-router-dom";

export function useRouter() {
    const navigate = useNavigate();
    const { pathname, state, search, hash } = useLocation();

    return {
        back: () => navigate(-1),
        forward: () => navigate(1),
        reload: () => {
            const currentURL = `${pathname}${search}${hash}`;
            navigate(currentURL, { replace: true, state: state});
        },
        push: (key: string) => navigate(key)
    }
}