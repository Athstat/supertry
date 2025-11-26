import { useAtom } from "jotai";
import { browserHistoryAtoms } from "../../state/web/browserHistory.atoms";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useNavigateBack() {
    const navigate = useNavigate();
    const [stack, setStack] = useAtom(browserHistoryAtoms.historyStackAtom);

    const hardPop = useCallback(() => {

        stack.hardPop();
        const nextPath = stack.peek();

        setStack(stack);

        if (nextPath) {
            navigate(nextPath);
            return;
        }

    }, [navigate, setStack, stack]);

    const softPop = useCallback(() => {
        stack.softPop();
        const nextPath = stack.peek();

        setStack(stack);

        if (nextPath) {
            navigate(nextPath);
            return;
        }
    }, [navigate, setStack, stack]);

    return {softPop, hardPop}
}