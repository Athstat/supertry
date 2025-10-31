import { ScopeProvider } from "jotai-scope"
import { fantasyLeagueTeamAtom, fantasyTeamAthletesAtom, fantasyTeamSlotsAtom, swapPlayerAtom, swapStateAtom } from "../../../state/fantasy/fantasyLeagueTeam.atoms"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { useAtom, useSetAtom } from "jotai"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { defaultFantasyPositions, IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { IProAthlete } from "../../../types/athletes"
import { hashFantasyTeamAthletes, sortFantasyTeamAthletes } from "../../../utils/athleteUtils"
import { Position } from "../../../types/position"
import { fantasyAnalytics } from "../../../services/analytics/fantasyAnalytics"
import { MAX_TEAM_BUDGET } from "../../../types/constants"

type Props = {
    team: IFantasyLeagueTeam,
    children?: ReactNode
}

/** Provides team athlete data and fantasy league team data to be provided  */
export default function FantasyLeagueTeamProvider({ team, children }: Props) {

    const atoms = [
        fantasyLeagueTeamAtom,
        fantasyTeamAthletesAtom,
        fantasyTeamSlotsAtom,
        swapPlayerAtom,
        swapStateAtom
    ];

    return (
        <ScopeProvider atoms={atoms} >
            <InnerProvider team={team} >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}


function InnerProvider({ team, children }: Props) {

    const setTeam = useSetAtom(fantasyLeagueTeamAtom);
    const setSlots = useSetAtom(fantasyTeamSlotsAtom);

    useEffect(() => {

        if (team) {
            setTeam(team);
        }

        if (team.athletes) {

            const teamAthletes: IFantasyTeamAthlete[] = team.athletes;

            console.log("Team Athletes Size: ", teamAthletes);

            const slots = defaultFantasyPositions.map((p, index) => {

                const slotAthlete = teamAthletes.find((a) => a.slot === index + 1);
                const slotNumber = slotAthlete?.slot ?? (index + 1);

                const slot: IFantasyLeagueTeamSlot = {
                    position: p,
                    slotNumber: slotNumber,
                    athlete: slotAthlete,
                    purchasePrice: slotAthlete?.purchase_price ?? 0,
                    is_starting: slotNumber !== 6,
                    isCaptain: slotAthlete?.is_captain
                }

                return slot;
            });

            setSlots(slots);

        }
    }, [setSlots, setTeam, team]);

    return (
        <>
            {children}
        </>
    )
}

/** Provides a hook for manipulating a fantasy league team  */
export function useFantasyLeagueTeam() {

    const [team, setTeam] = useAtom(fantasyLeagueTeamAtom);
    const [teamAthletes] = useAtom(fantasyTeamAthletesAtom);
    const [slots, setSlots] = useAtom(fantasyTeamSlotsAtom);
    const [swapState, setSwapState] = useAtom(swapStateAtom);
    const [swapPlayer, setSwapPlayer] = useAtom(swapPlayerAtom);

    const totalSpent: number = useMemo(() => {
        return slots.reduce((sum, s) => {
            const nextSum = sum + (s.purchasePrice ?? 0);
            return nextSum;
            // if (nextSum > MAX_TEAM_BUDGET) return MAX_TEAM_BUDGET
            // else return nextSum;

        }, 0);
    }, [slots]);

    const selectedCount = useMemo(() => {
        return slots.reduce((sum, s) => {
            return sum + (s.athlete ? 1 : 0);
        }, 0)
    }, [slots]);

    const removePlayerAtSlot = useCallback((slotNumber: number) => {

        let playerRemoved = false;

        const newSlots = slots.map((s) => {
            if (s.slotNumber !== slotNumber) return s;
            playerRemoved = true;
            return {
                ...s,
                athlete: undefined,
                purchasePrice: 0,
                isCaptain: false
            }

        });

        setSlots(newSlots);

        return { playerRemoved };

    }, [slots, setSlots]);

    const setPlayerAtSlot = useCallback((slotNumber: number, athlete: IProAthlete) => {
        if (!team) return;

        const newSlots: IFantasyLeagueTeamSlot[] = slots.map((s) => {

            if (s.slotNumber !== slotNumber) return s;

            const newSlot = {
                ...s,
                athlete: {
                    ...athlete,
                    is_captain: s.isCaptain,
                    team_id: team?.id,
                    purchase_price: athlete.price ?? 0,
                    slot: s.slotNumber,
                    id: new Date().valueOf(), // temporal id,
                    athlete_id: athlete.tracking_id,

                },
                purchasePrice: athlete.price,
            }

            return newSlot;
        });

        setSlots(newSlots);

    }, [slots, setSlots, team]);

    const setOldPlayerAtSlot = useCallback((slotNumber: number, athlete: IFantasyTeamAthlete) => {

        if (!team) return;

        const newSlots: IFantasyLeagueTeamSlot[] = slots.map((s) => {
            if (s.slotNumber !== slotNumber) return s;

            return {
                ...s,
                athlete: {
                    ...athlete,
                    is_captain: s.isCaptain
                },
                purchasePrice: athlete.price
            }
        });

        setSlots(newSlots);

    }, [team, slots, setSlots]);


    const teamCaptain = useMemo(() => {
        const foundAthlete = slots.find((s) => s.athlete && s.isCaptain);
        return foundAthlete?.athlete;
    }, [slots]);

    const setTeamCaptainAtSlot = useCallback((slotNumber: number) => {

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

    }, [setSlots]);


    const resetToOriginalTeam = useCallback(() => {

        const slots = defaultFantasyPositions.map((p, index) => {

            const slotAthlete = teamAthletes.find((a) => a.slot === index + 1);
            const slotNumber = slotAthlete?.slot ?? (index + 1);

            const slot: IFantasyLeagueTeamSlot = {
                position: p,
                slotNumber: slotNumber,
                athlete: slotAthlete,
                purchasePrice: slotAthlete?.purchase_price ?? 0,
                is_starting: slotNumber !== 6,
                isCaptain: slotAthlete?.is_captain
            }

            return slot;
        });

        setSlots(slots);
    }, [setSlots, teamAthletes]);

    const originalSlots = useMemo(() => {
        const slots = defaultFantasyPositions.map((p, index) => {

            const slotAthlete = teamAthletes.find((a) => a.slot === index + 1);
            const slotNumber = slotAthlete?.slot ?? (index + 1);

            const slot: IFantasyLeagueTeamSlot = {
                position: p,
                slotNumber: slotNumber,
                athlete: slotAthlete,
                purchasePrice: slotAthlete?.purchase_price ?? 0,
                is_starting: slotNumber !== 6,
                isCaptain: slotAthlete?.is_captain
            }

            return slot;
        });


        return slots;

    }, [teamAthletes]);

    const originalCaptain = useMemo(() => {
        return originalSlots.find((s) => s.isCaptain === true)?.athlete;
    }, [originalSlots]);

    const changesDetected = useMemo(() => {
        let oldAthletes = (team?.athletes) ?? [];
        let newAthletes: IFantasyTeamAthlete[] = [];

        slots.forEach((s) => {
            if (s.athlete) {
                newAthletes.push(s.athlete);
            }
        });

        oldAthletes = sortFantasyTeamAthletes(oldAthletes);
        newAthletes = sortFantasyTeamAthletes(newAthletes);

        const oldAthletesHash = hashFantasyTeamAthletes(oldAthletes);
        const newAthletesHash = hashFantasyTeamAthletes(newAthletes);

        return oldAthletesHash !== newAthletesHash;

    }, [team, slots]);

    const isTeamFull = useMemo(() => selectedCount === 6, [selectedCount]);

    const toPosition = (
        p: { name: string; position_class: string; isSpecial?: boolean },
        index: number
    ): Position => ({
        id: p.position_class || String(index),
        name: p.name,
        shortName: p.name.slice(0, 2).toUpperCase(),
        x: '0',
        y: '0',
        positionClass: p.position_class,
        isSpecial: Boolean(p.isSpecial),
    });

    const completeSwap = useCallback((newAthlete: IProAthlete) => {

        if (!swapState || swapState.slot === null) return;


        setPlayerAtSlot(swapState.slot, newAthlete);
        setSwapState({ open: false, slot: null, position: null });

        fantasyAnalytics.trackUsedSwapPlayerFeature();
    }, [setPlayerAtSlot, setSwapState, swapState])

    const initiateSwap = (slot: IFantasyLeagueTeamSlot) => {
        const pos = toPosition(slot.position, slot.slotNumber - 1);
        setSwapState({ open: true, slot: slot.slotNumber, position: pos });

        if (slot.athlete) {
            setSwapPlayer(slot.athlete);
        }
    };

    const cancelSwap = useCallback(() => {
        setSwapPlayer(undefined);

        setSwapState({
            open: false,
            slot: null,
            position: undefined,
        });
    }, [setSwapPlayer, setSwapState]);

    const initateSwapOnEmptySlot = (slot: IFantasyLeagueTeamSlot) => {

        // Set slot state
        const pos = toPosition(slot.position, slot.slotNumber - 1);

        setSwapState({
            open: true,
            slot: slot.slotNumber,
            position: pos,
        });

        setSwapPlayer(undefined);

    };

    const budgetRemaining = (MAX_TEAM_BUDGET) - totalSpent;

    return {
        slots, setSlots,
        teamAthletes,
        team, setTeam,
        totalSpent,
        removePlayerAtSlot,
        setPlayerAtSlot,
        selectedCount,
        teamCaptain,
        setTeamCaptainAtSlot,
        resetToOriginalTeam,
        originalSlots,
        originalCaptain,
        setOldPlayerAtSlot,
        changesDetected,
        isTeamFull,
        initiateSwap,
        completeSwap,
        initateSwapOnEmptySlot,
        cancelSwap,
        swapPlayer,
        swapState,
        budgetRemaining
    }
}