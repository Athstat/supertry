import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { useMyTeam } from "./useMyTeam";

/** Hook that provides functions for closing and opening */
export function useMyTeamModals() {

    const { modalsState, setModalsState, selectedPlayer, setSelectedPlayer: setSelectedPlayer } = useMyTeam();

    const { showActionModal, showPointsModal, showProfileModal } = modalsState;

    const setShowActionModal = (val: boolean) => {
        setModalsState((prev) => {
            return {
                ...prev,
                showActionModal: val
            }
        })
    };

    const setShowProfileModal = (val: boolean) => {
        setModalsState((prev) => {
            return {
                ...prev,
                showProfileModal: val
            }
        })
    };

    const setShowPointsModal = (val: boolean) => {
        setModalsState((prev) => {
            return {
                ...prev,
                showPointsModal: val
            }
        })
    };;


    const handlePlayerClick = (player: IFantasyTeamAthlete) => {
        setSelectedPlayer(player);
        setShowActionModal(true);
    };

    const handleCloseActionModal = () => {
        setShowActionModal(false);
        setSelectedPlayer(undefined);
    };

    const handleViewProfile = () => {
        setShowActionModal(false);
        setShowPointsModal(false);

        setShowProfileModal(true);
    };

    const handleViewPointsBreakdown = () => {
        setShowActionModal(false);
        setShowProfileModal(false);

        setShowPointsModal(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileModal(false);
        setShowActionModal(true);
    };

    const handleClosePointsModal = () => {
        setShowPointsModal(false);
        setShowActionModal(true);
    };

    return {
        ...modalsState,
        handlePlayerClick,
        handleCloseActionModal,
        handleViewPointsBreakdown,
        handleViewProfile,
        handleCloseProfileModal,
        handleClosePointsModal,
        showActionModal,
        showProfileModal,
        showPointsModal,
        selectedPlayer
    }
}