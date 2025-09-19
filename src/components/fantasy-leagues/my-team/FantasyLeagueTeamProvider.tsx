import { ScopeProvider } from "jotai-scope"
import { fantasyLeagueTeamAtom, fantasyTeamAthletesAtom, fantasyTeamSlotsAtom } from "../../../state/fantasy/fantasyLeagueTeam.atoms"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { useAtom, useSetAtom } from "jotai"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { defaultFantasyPositions, IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { IProAthlete } from "../../../types/athletes"
import { hashFantasyTeamAthletes, sortFantasyTeamAthletes } from "../../../utils/athleteUtils"

type Props = {
    team: IFantasyLeagueTeam,
    children?: ReactNode
}

/** Provides team athlete data and fantasy league team data to be provided  */
export default function FantasyLeagueTeamProvider({ team, children }: Props) {

    const atoms = [fantasyLeagueTeamAtom, fantasyTeamAthletesAtom, fantasyTeamSlotsAtom];

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
    }, [team]);

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

        return {playerRemoved};

    }, [slots, setSlots]);

    const setPlayerAtSlot = useCallback((slotNumber: number, athlete: IProAthlete) => {
        console.log("About to run function to set a player on a slot", team);
        if (!team) return;

        const newSlots: IFantasyLeagueTeamSlot[] = slots.map((s) => {
            
            console.log("Current slot ", s);
            
            if (s.slotNumber !== slotNumber) return s;

            console.log("Slot Matches");

            const newSlot = {
                ...s,
                athlete: {
                    ...athlete,
                    team_id: team?.id,
                    purchase_price: athlete.price ?? 0,
                    slot: s.slotNumber,
                    id: new Date().valueOf(), // temporal id,
                    athlete_id: athlete.tracking_id
                },
                purchasePrice: athlete.price
            }

            console.log("New player slot to be set ", newSlot);

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
                athlete: athlete,
                purchasePrice: athlete.price
            }
        });

        setSlots(newSlots);

    }, [slots, setSlots]);


    const teamCaptain = useMemo(() => {
        const foundAthlete = slots.find((s) => s.athlete && s.isCaptain);
        return foundAthlete?.athlete;
    }, [slots]);

    const setTeamCaptainAtSlot = useCallback((slotNumber: number) => {

        setSlots(prev => {

            const wasSlotAndPlayerFound = prev.find((s) => Boolean(s.athlete) && s.slotNumber === slotNumber);

            if (!wasSlotAndPlayerFound) return prev;

            return prev.map((s) => {
                if (s.slotNumber !== slotNumber) {
                    return {
                        ...s,
                        isCaptain: false
                    }
                }

                return {
                    ...s,
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
    }, [slots, setSlots, teamAthletes]);

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

    }, [slots, teamAthletes]);

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
        isTeamFull
    }
}