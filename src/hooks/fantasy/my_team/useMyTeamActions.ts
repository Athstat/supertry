
import { IProAthlete } from "../../../types/athletes";
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { getSlotsFromTeam, hashCompareFantasyTeams, setPlayerAtSlot } from "../../../utils/fantasy/myteamUtils";
import { useMyTeam } from "./useMyTeam";

/** Hook that provides functions to perform actions on a fantasy team */

export function useMyTeamActions() {
    const { setSelectedPlayer, setSlots, team, setSwapState, swapState, slots, budgetRemaining, selectedCount, teamCaptain } = useMyTeam();

    const subSlot = slots.find((s) => s.position.position_class === "super-sub" || !s.is_starting || s.slotNumber === 6);

    const subOutCandidate = slots.find((s) => {
        return s.slotNumber !== 6 && s.athlete?.position_class === subSlot?.athlete?.position_class
    });

    const viewPlayer = (player?: IFantasyTeamAthlete) => {
        setSelectedPlayer(player);
    }

    const setSlot = (slotNumber: number, newPlayer: IProAthlete) => {
        setSlots((prev) => {
            return setPlayerAtSlot(
                team,
                prev,
                slotNumber,
                newPlayer
            )
        })
    }

    const removePlayer = (slotNumber: number) => {
        setSlots((prev) => {
            return prev.map((s) => {
                if (s.slotNumber !== slotNumber) return s;

                return {
                    ...s,
                    athlete: undefined,
                    purchasePrice: 0,
                    isCaptain: false
                }
            })
        })
    }

    const setCaptain = (slotNumber: number) => {
        setSlots(prev => {

            const wasSlotAndPlayerFound = prev.find((s) => Boolean(s.athlete) && s.slotNumber === slotNumber);

            if (!wasSlotAndPlayerFound) return prev;

            return prev.map((s) => {
                const slotAthlete = s.athlete;

                if (!slotAthlete) {
                    return {
                        ...s,
                        isCaptain: false
                    };
                }

                if (s.slotNumber !== slotNumber) {
                    return {
                        ...s,
                        athlete: {
                            ...slotAthlete,
                            is_captain: false
                        },
                        isCaptain: false
                    }
                }

                return {
                    ...s,
                    athlete: {
                        ...slotAthlete,
                        is_captain: true
                    },
                    isCaptain: true
                }
            });

        });
    }

    const substituteIn = () => {

        if (!subSlot || !subSlot.athlete?.athlete) return;
        if (!subOutCandidate || !subOutCandidate.athlete?.athlete) return;

        const subInAthlete = subSlot?.athlete.athlete;
        const subOutAthlete = subOutCandidate?.athlete.athlete;

        if (!subInAthlete || !subOutAthlete) return;

        const subCandidateWasCaptain = subOutCandidate.athlete.tracking_id === teamCaptain?.athlete?.tracking_id

        setSlots((prev) => {

            prev = setPlayerAtSlot(
                team,
                prev,
                subSlot.slotNumber,
                subOutAthlete
            )

            prev = setPlayerAtSlot(
                team,
                prev,
                subOutCandidate.slotNumber,
                subInAthlete
            )

            return prev;
        });

        if (subCandidateWasCaptain) {
            // if you are substituting the captain out
            // make the sub in player the captain at the same slot

            setCaptain(subOutCandidate.slotNumber);
        }
    }

    const initiateSwap = (slot: IFantasyLeagueTeamSlot) => {
        setSwapState({ slot });
    }

    const cancelSwap = () => {
        setSwapState({ slot: undefined });
    }

    const completeSwap = (player: IProAthlete) => {
        const slot = swapState.slot;
        if (!slot || !player) return;

        setSlot(slot.slotNumber, player);
        cancelSwap();
    }

    const swapBudget = budgetRemaining + (swapState.slot?.athlete?.purchase_price ?? swapState.slot?.purchasePrice ?? 0);

    const changesDetected = !hashCompareFantasyTeams(team, slots);

    const resetToOriginalTeam = () => {
        setSlots(getSlotsFromTeam(team));
    }

    const isTeamFull = selectedCount === 6;

    return {
        setSlot,
        removePlayer,
        setCaptain,
        substituteIn,
        viewPlayer,
        swapState,
        initiateSwap,
        cancelSwap,
        completeSwap,
        slots,
        swapBudget,
        changesDetected,
        resetToOriginalTeam,
        isTeamFull,
        subOutCandidate
    }
}