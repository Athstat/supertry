import { useContext } from "react";
import { FantasyLeagueScreenContext } from "../../contexts/fantasy/FantasyLeagueScreenContext";

/** Hook for accessing the fantasy league screen context */

export function useFantasyLeagueScreen() {
    const context = useContext(FantasyLeagueScreenContext);

    if (context === null) {
        throw new Error("useFantasyLeagueScreen used outside FantasyLeagueScreenProvider")
    } 

    const toggleEditBanner = () => {
        context.setShowEditBanner(prev => !prev);
    }

    const toggleEditLogo = () => {
        context.setShowEditLogo(prev => !prev);
    }
    
    const toggleShowEditInfo = () => {
        context.setShowEditInfo(prev => !prev);
    }

    return {
        ...context,
        toggleEditBanner,
        toggleEditLogo,
        toggleShowEditInfo
    };
}