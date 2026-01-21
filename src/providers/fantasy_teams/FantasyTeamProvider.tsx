import { useSetAtom } from "jotai";
import { ScopeProvider } from "jotai-scope"
import { ReactNode, useEffect } from "react";
import { fantasyLeagueTeamAtom, fantasyTeamSlotsAtom, swapPlayerAtom, swapStateAtom, fantasyLeagueTeamLeagueRoundAtom, readOnlyAtom } from "../../state/fantasy/fantasyLeagueTeam.atoms";
import { fantasyTeamAthletesAtom } from "../../state/myTeam.atoms";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { defaultFantasyPositions, IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";

type Props = {
    team: IFantasyLeagueTeam,
    children?: ReactNode,
    readOnly?: boolean
}

/** Provides team athlete data and fantasy league team data to be provided  */
export default function FantasyTeamProvider({ team, children, readOnly }: Props) {

    const atoms = [
        fantasyLeagueTeamAtom,
        fantasyTeamAthletesAtom,
        fantasyTeamSlotsAtom,
        swapPlayerAtom,
        swapStateAtom,
        fantasyLeagueTeamLeagueRoundAtom,
        readOnlyAtom
    ];

    return (
        <ScopeProvider atoms={atoms} >
            <InnerProvider team={team} readOnly={readOnly} >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}


function InnerProvider({ team, children, readOnly }: Props) {

    const {round} = useTeamHistory();
    const setTeam = useSetAtom(fantasyLeagueTeamAtom);
    const setSlots = useSetAtom(fantasyTeamSlotsAtom);

    const setLeagueRound = useSetAtom(fantasyLeagueTeamLeagueRoundAtom);
    const setReadOnly = useSetAtom(readOnlyAtom);

    useEffect(() => {

        if (team) {
            setTeam(team);
        }

        if (team.athletes) {

            const teamAthletes: IFantasyTeamAthlete[] = team.athletes;

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

        if (round) {
            setLeagueRound(round);
        }

        if (readOnly !== undefined) {
            setReadOnly(readOnly);
        }
        
    }, [setSlots, setTeam, team, round, setLeagueRound, readOnly, setReadOnly]);

    return (
        <>
            {children}
        </>
    )
}