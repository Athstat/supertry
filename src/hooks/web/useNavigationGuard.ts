import { useEffect } from 'react';
import { navigationBarsAtoms } from './../../state/navigation/navigationBars.atoms';
import { useAtom } from "jotai";

/** Function that takes a navigation guard function as a parameter and sets it */
export function useNavigationGuard(func: () => boolean) {
    const [guardFun, setGuardFun] = useAtom(navigationBarsAtoms.navigationGuardFunctionAtom);

    useEffect(() => {
        
        setGuardFun(func);

        return () => {
            setGuardFun(undefined);
        }

    }, [func, setGuardFun]);

    return {
        guardFun
    }
}