import { useEffect } from 'react';
import { navigationBarsAtoms } from './../../state/navigation/navigationBars.atoms';
import { useAtom } from "jotai";

/** Function that takes a navigation guard function as a parameter and sets it */
export function useNavigationGuard(func: () => boolean) {
    const [guardFun, setGuardFun] = useAtom(navigationBarsAtoms.navigationGuardFunctionAtom);

    useEffect(() => {
        
        setGuardFun({
            guard: func
        });

        return () => {
            setGuardFun({guard: () => true});
        }

    }, [func, setGuardFun]);

    return {
        guardFun
    }
}