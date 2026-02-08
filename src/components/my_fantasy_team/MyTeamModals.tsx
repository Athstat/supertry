import { AnimatePresence } from "framer-motion";
import { Fragment } from "react/jsx-runtime";
import PlayerProfileModal from "../player/PlayerProfileModal";
import PointsBreakdownModal from "../points_breakdown/PointsBreakdownModal";
import { PlayerActionModal } from "./PlayerActionModal";
import { useMyTeamModals } from "../../hooks/fantasy/my_team/useMyTeamModals";
import { useMyTeam } from "../../hooks/fantasy/my_team/useMyTeam";
import { useMyTeamActions } from "../../hooks/fantasy/my_team/useMyTeamActions";
import PlayerPicker from "../player_picker/PlayerPicker";
import { useState } from "react";
import { requestPushPermissions } from "../../utils/bridgeUtils";
import PushOptInModal from "../ui/PushOptInModal";

/** Renders the my team modals */
export default function MyTeamModals() {

    const { team, round, slots } = useMyTeam();
    const { cancelSwap, swapState, completeSwap, swapBudget } = useMyTeamActions();
    const isPlayerPickerOpen = Boolean(swapState.slot);

    const {
        selectedPlayer, showActionModal, showPointsModal, showProfileModal,
        handleCloseActionModal, handleClosePointsModal, handleCloseProfileModal,
        handleViewPointsBreakdown, handleViewProfile
    } = useMyTeamModals();

    const handleOnEnable = async () => {
        try {
            await requestPushPermissions();
        } catch (e) {
            console.error('Push permission error:', e);
        } finally {
            setShowPushModal(false);
        }
    }

    const handleOnNotNow = () => {
        try {
            localStorage.setItem('push_optin_dismissed', 'true');
        } catch (err) {
            console.log('Local Storage error ', err);
        }
        setShowPushModal(false);
    }

    // Push opt-in prompt state
    const [showPushModal, setShowPushModal] = useState(false);


    const exludePlayers = slots
        .filter(s => Boolean(s.athlete))
        .map(s => {
            return { tracking_id: s.athlete?.tracking_id ?? '' };
        })


    return (
        <Fragment>
            {selectedPlayer && showActionModal && (
                <AnimatePresence>
                    <PlayerActionModal
                        player={selectedPlayer}
                        onViewPointsBreakdown={handleViewPointsBreakdown}
                        onClose={handleCloseActionModal}
                        onViewProfile={handleViewProfile}
                    />
                </AnimatePresence>
            )}

            {selectedPlayer && showProfileModal && (
                <PlayerProfileModal
                    player={selectedPlayer}
                    isOpen={showProfileModal}
                    onClose={handleCloseProfileModal}
                />
            )}

            {selectedPlayer?.athlete && showPointsModal && team && (
                <PointsBreakdownModal
                    isOpen={showPointsModal}
                    athlete={selectedPlayer.athlete}
                    team={team}
                    onClose={handleClosePointsModal}
                    multiplier={selectedPlayer.is_captain ? 1.5 :

                        selectedPlayer.is_super_sub ? 0.5 : undefined

                    }

                    multiplierDescription={
                        selectedPlayer.is_captain ? "Captain Bonus" :
                            selectedPlayer.is_super_sub ? "Super Sub Reduction" : undefined
                    }

                />
            )}

            <PlayerPicker
                isOpen={isPlayerPickerOpen}
                positionPool={swapState.slot?.position.position_class}
                remainingBudget={swapBudget}
                excludePlayers={exludePlayers}
                onSelectPlayer={completeSwap}
                onClose={cancelSwap}
                targetLeagueRound={round}
                playerToBeReplaced={swapState.slot?.athlete?.athlete}
            />

            <PushOptInModal
                visible={showPushModal}
                onEnable={handleOnEnable}
                onNotNow={handleOnNotNow}
            />
        </Fragment>
    )
}
