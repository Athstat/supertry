import { useAtom } from "jotai";
import { navigationBarsAtoms } from "../../state/navigation/navigationBars.atoms";
import { useCallback, useEffect } from "react";

/** Navigation Bars hook for controlling top and bottom nav hooks  */
export function useNavigationBars() {
    const [bottomNavViewMode, setBottomNavViewMode] = useAtom(navigationBarsAtoms.bottomBarViewModeAtom);
    const [topNavViewMode, setTopNavViewMode] = useAtom(navigationBarsAtoms.topBarViewModeAtom);

    const hideTopNav = useCallback(() => {
        setTopNavViewMode("hidden");
    }, [setTopNavViewMode]);

    const revealTopNav = useCallback(() => {
        setTopNavViewMode("visible");
    }, [setTopNavViewMode]);

    const hideBottomNav = useCallback(() => {
        setBottomNavViewMode("hidden");
    }, [setBottomNavViewMode]);

    const revealBottomNav = useCallback(() => {
        setBottomNavViewMode("visible");
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

/** Hook that when mounted will auto hide the top navigation bar,
 * and then reveal it when dismounted */

export function useHideTopNavBar() {
    
    const {hideTopNav, revealTopNav} = useNavigationBars();
    
    useEffect(() => {
        hideTopNav();

        return () => {
            revealTopNav();
        }
    })
}

/** Hook that when mounted will auto hide the bottom navigation bar,
 * and then reveal it when dismounted */
export function useHideBottomNavBar() {
    
    const {hideBottomNav, revealBottomNav} = useNavigationBars();
    
    useEffect(() => {
        hideBottomNav();

        return () => {
            revealBottomNav();
        }
    })
}