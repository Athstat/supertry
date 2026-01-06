import { useAtom, useAtomValue } from "jotai";
import { useMemo, useCallback } from "react";
import { fantasyAnalytics } from "../../services/analytics/fantasyAnalytics";
import { fantasyLeagueTeamAtom, fantasyTeamSlotsAtom, swapStateAtom, swapPlayerAtom, fantasyLeagueTeamLeagueRoundAtom, readOnlyAtom } from "../../state/fantasy/fantasyLeagueTeam.atoms";
import { fantasyTeamAthletesAtom } from "../../state/myTeam.atoms";
import { IProAthlete, PositionClass } from "../../types/athletes";
import { MAX_TEAM_BUDGET } from "../../types/constants";
import { IFantasyLeagueTeamSlot, defaultFantasyPositions } from "../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { Position } from "../../types/position";
import { sortFantasyTeamAthletes, hashFantasyTeamAthletes } from "../../utils/athleteUtils";

export function useFantasyLeagueTeam() {

    const [team, setTeam] = useAtom(fantasyLeagueTeamAtom);
    const [teamAthletes] = useAtom(fantasyTeamAthletesAtom);
    const [slots, setSlots] = useAtom(fantasyTeamSlotsAtom);
    const [swapState, setSwapState] = useAtom(swapStateAtom);
    const [swapPlayer, setSwapPlayer] = useAtom(swapPlayerAtom);
    const leagueRound = useAtomValue(fantasyLeagueTeamLeagueRoundAtom);

    const isReadOnly = useAtomValue(readOnlyAtom);

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

        setSwapPlayer(undefined);
        setSlots(newSlots);

        return { playerRemoved };

    }, [slots, setSlots, setSwapPlayer]);

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
                    is_starting: s.slotNumber < 6,
                    athlete_team_id: athlete.team?.athstat_id,
                    athlete: athlete,
                    is_super_sub: s.slotNumber >= 6,
                    score: 0
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

        const ogTeamAthletes = team?.athletes || [];
        const slots = defaultFantasyPositions.map((p, index) => {

            const slotAthlete = ogTeamAthletes.find((a) => a.slot === index + 1);
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
        p: { name: string; position_class: PositionClass; isSpecial?: boolean },
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

        setSwapPlayer(undefined);

        console.log("Set Swap player to undefined");

        setPlayerAtSlot(swapState.slot, newAthlete);
        setSwapState({ open: false, slot: null, position: null });

        fantasyAnalytics.trackUsedSwapPlayerFeature();
    }, [setPlayerAtSlot, setSwapPlayer, setSwapState, swapState])

    const initiateSwap = (slot: IFantasyLeagueTeamSlot) => {
        const pos = toPosition(slot.position, slot.slotNumber - 1);
        setSwapState({ open: true, slot: slot.slotNumber, position: pos });

        if (slot.athlete) {
            setSwapPlayer(slot.athlete);
        } else {
            setSwapPlayer(undefined);
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
        
        setSwapPlayer(undefined);

        setSwapState({
            open: true,
            slot: slot.slotNumber,
            position: pos,
        });


    };

    const budgetRemaining = useMemo(() => {
        const swapPlayerFee = swapPlayer?.purchase_price || 0;
        return (MAX_TEAM_BUDGET + swapPlayerFee) - totalSpent;
    }, [swapPlayer?.purchase_price, totalSpent]);

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
        budgetRemaining,
        leagueRound,
        isReadOnly
    }
}