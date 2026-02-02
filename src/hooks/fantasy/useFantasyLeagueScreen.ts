import { useContext } from "react";
import { FantasyLeagueScreenContext } from "../../contexts/fantasy/FantasyLeagueScreenContext";

/** Hook for accessing the fantasy league screen context */

export function useFantasyLeagueScreen() {
    const context = useContext(FantasyLeagueScreenContext);

    if (context === null) {
        throw new Error("useFantasyLeagueScreen used outside FantasyLeagueScreenProvider")
    } 

    const toggleEditBannerModal = () => {
        context.setShowEditBannerModal(prev => !prev);
    }

    const toggleEditLogoModal = () => {
        context.setShowEditLogoModal(prev => !prev);
    }

    return {
        ...context,
        toggleEditBannerModal,
        toggleEditLogoModal
    };
}