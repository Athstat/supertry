import { useAtom } from "jotai";
import { browserHistoryAtoms } from "../../state/web/browserHistory.atoms";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useNavigateBack() {
    const navigate = useNavigate();
    const [stack, setStack] = useAtom(browserHistoryAtoms.historyStackAtom);

    const hardPop = useCallback((fallback?: string) => {

        stack.hardPop();
        const nextPath = stack.peek();

        setStack(stack);

        if (nextPath) {
            navigate(nextPath);
            return;
        }

        if (fallback) {
            navigate(fallback);
            return;
        }

    }, [navigate, setStack, stack]);

    const softPop = useCallback((fallback?: string) => {
        stack.softPop();
        const nextPath = stack.peek();

        setStack(stack);

        if (nextPath) {
            navigate(nextPath);
            return;
        }

        if (fallback) {
            navigate(fallback);
            return;
        }
    }, [navigate, setStack, stack]);

    return { softPop, hardPop }
}