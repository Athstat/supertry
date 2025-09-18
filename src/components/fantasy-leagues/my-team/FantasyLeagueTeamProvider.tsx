import { ScopeProvider } from "jotai-scope"
import { fantasyLeagueTeamAtom, fantasyTeamAthletesAtom, fantasyTeamSlotsAtom } from "../../../state/fantasy/fantasyLeagueTeam.atoms"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { useAtom, useSetAtom } from "jotai"
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { defaultFantasyPositions, IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { IProAthlete } from "../../../types/athletes"

type Props = {
    team: IFantasyLeagueTeam,
    children?: ReactNode
}

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

    const setSlots = useSetAtom(fantasyTeamSlotsAtom);

    useEffect(() => {
        if (team.athletes) {

            const teamAthletes: IFantasyTeamAthlete[] = team.athletes;

            const slots = defaultFantasyPositions.map((p, index) => {

                const slotAthlete = teamAthletes.find((a) => a.slot === index);

                const slot: IFantasyLeagueTeamSlot = {
                    position: p,
                    slotNumber: index,
                    athlete: slotAthlete,
                    purchasePrice: slotAthlete?.purchase_price ?? 0
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

    const totalTeamPurchaseValue: number = useMemo(() => {
        return slots.reduce((sum, s) => {
            return sum + (s.purchasePrice ?? 0);
        }, 0);
    }, [teamAthletes]);

    const removePlayerAtSlot = useCallback((slotNumber: number) => {

        const newSlots = slots.map((s) => {
            if (s.slotNumber === slotNumber) return s;

            return {
                ...s,
                athlete: undefined,
                purchasePrice: undefined
            }

        });

        setSlots(newSlots);

    }, [slots, slots]);

    const setPlayerAtSlot = useCallback((slotNumber: number, athlete: IProAthlete) => {
        
        if (!team) return;

        const newSlots: IFantasyLeagueTeamSlot[] = slots.map((s) => {
            if (s.slotNumber !== slotNumber) return s;

            return {
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
        });

        setSlots(newSlots);

    }, [slots, setSlots]);

    return {
        slots, setSlots,
        teamAthletes,
        team, setTeam,
        totalTeamPurchaseValue,
        removePlayerAtSlot,
        setPlayerAtSlot
    }
}