import { useBlocker } from "react-router-dom";
import { useNavigateBack } from "./useNavigateBack";
import { useEffect } from "react";

/** Hook that overides the browser back functionality */
export function useInterceptBrowserBack() {
    const {hardPop} = useNavigateBack();

    const blocker = useBlocker(({historyAction}) => {
        return historyAction === "POP";
    });

    useEffect(() => {
        if (blocker.state === "blocked") {
            blocker.reset();

            hardPop('/dashboard', {bypassGuard: true});
        }
    }, [blocker, hardPop])
}