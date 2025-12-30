import { navigationBarsAtoms } from './../../state/navigation/navigationBars.atoms';
import { useAtom, useAtomValue } from "jotai";
import { browserHistoryAtoms } from "../../state/web/browserHistory.atoms";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useNavigateBack() {
    const navigate = useNavigate();
    const [stack, setStack] = useAtom(browserHistoryAtoms.historyStackAtom);
    const navigationGuardObj = useAtomValue(navigationBarsAtoms.navigationGuardFunctionAtom);

    const checkShouldNavigate = useCallback(() => {
        if (navigationGuardObj !== undefined) {
            const { guard } = navigationGuardObj;
            const shouldNavigate = guard();

            return shouldNavigate;
        }

        return true;
    }, [navigationGuardObj]);

    const hardPop = useCallback((fallback?: string) => {

        if (checkShouldNavigate() === false) {
            return;
        }

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

    }, [checkShouldNavigate, navigate, setStack, stack]);

    const softPop = useCallback((fallback?: string) => {

        if (checkShouldNavigate() === false) {
            return;
        }

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
    }, [checkShouldNavigate, navigate, setStack, stack]);

    return { softPop, hardPop }
}