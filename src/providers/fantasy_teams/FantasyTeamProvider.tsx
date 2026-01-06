import { ScopeProvider } from "jotai-scope"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../../types/fantasyLeague"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { defaultFantasyPositions, IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam"
import { IProAthlete, PositionClass } from "../../../types/athletes"
import { hashFantasyTeamAthletes, sortFantasyTeamAthletes } from "../../../utils/athleteUtils"
import { Position } from "../../../types/position"
import { fantasyAnalytics } from "../../../services/analytics/fantasyAnalytics"
import { MAX_TEAM_BUDGET } from "../../../types/constants"
import { fantasyLeagueTeamAtom, fantasyTeamSlotsAtom, swapPlayerAtom, swapStateAtom, fantasyLeagueTeamLeagueRoundAtom, readOnlyAtom } from "../../../state/fantasy/fantasyLeagueTeam.atoms"
import { fantasyTeamAthletesAtom } from "../../../state/myTeam.atoms"

type Props = {
    team: IFantasyLeagueTeam,
    children?: ReactNode,
    leagueRound?: IFantasyLeagueRound,
    readOnly?: boolean
}

/** Provides team athlete data and fantasy league team data to be provided  */
export default function FantasyTeamProvider({ team, children, leagueRound, readOnly }: Props) {

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
            <InnerProvider leagueRound={leagueRound} team={team} readOnly={readOnly} >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}


function InnerProvider({ team, children, leagueRound, readOnly }: Props) {

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

        if (leagueRound) {
            setLeagueRound(leagueRound);
        }

        if (readOnly !== undefined) {
            setReadOnly(readOnly);
        }
        
    }, [setSlots, setTeam, team, leagueRound, setLeagueRound, readOnly, setReadOnly]);

    return (
        <>
            {children}
        </>
    )
}

// TODO: Move Hook to the right folder
/** Provides a hook for manipulating a fantasy league team  */
