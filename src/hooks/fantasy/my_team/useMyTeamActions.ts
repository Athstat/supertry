
import { IProAthlete } from "../../../types/athletes";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { setPlayerAtSlot } from "../../../utils/fantasy/myteamUtils";
import { useMyTeam } from "./useMyTeam";

/** Hook that provides functions to perform actions
 * on a fantasy team */
export function useMyTeamActions() {
    const { setSelectedPlayer, setSlots, team } = useMyTeam();

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
        setSlots((prev) => {
            const subSlot = prev.find((s) => !s.is_starting || s.slotNumber === 6);
            if (!subSlot || !subSlot.athlete?.athlete) return prev;

            const samePositionPlayer = prev.find((s) => {
                return s.slotNumber !== 6 && s.position.position_class === subSlot.position.position_class
            });

            if (!samePositionPlayer || !samePositionPlayer.athlete?.athlete) return prev;

            prev = setPlayerAtSlot(
                team,
                prev,
                subSlot.slotNumber,
                samePositionPlayer?.athlete.athlete
            )

            prev = setPlayerAtSlot(
                team,
                prev,
                samePositionPlayer.slotNumber,
                subSlot?.athlete.athlete
            )

            return prev;
        })
    }

    return {
        setSlot,
        removePlayer,
        setCaptain,
        substituteIn,
        viewPlayer
    }
}