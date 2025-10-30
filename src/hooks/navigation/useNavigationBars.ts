import { useAtom } from "jotai";
import { navigationBarsAtoms } from "../../state/navigation/navigationBars.atoms";
import { useCallback } from "react";

/** Navigation Bars hook for controlling top and bottom nav hooks  */
export function useNavigationBars() {
    const [bottomNavViewMode, setBottomNavViewMode] = useAtom(navigationBarsAtoms.bottomBarViewModeAtom);
    const [topNavViewMode, setTopNavViewMode] = useAtom(navigationBarsAtoms.topBarViewModeAtom);

    const hideTopNav = useCallback(() => {
        setTopNavViewMode("hidden");
    }, [setTopNavViewMode]);

    const revealTopNav = useCallback(() => {
        setTopNavViewMode("hidden");
    }, [setTopNavViewMode]);

    const hideBottomNav = useCallback(() => {
        setBottomNavViewMode("hidden");
    }, [setBottomNavViewMode]);

    const revealBottomNav = useCallback(() => {
        setBottomNavViewMode("hidden");
    }, [setBottomNavViewMode]);

    return {
        bottomNavViewMode,
        topNavViewMode,
        hideTopNav,
        revealTopNav,
        hideBottomNav, 
        revealBottomNav
    }
}