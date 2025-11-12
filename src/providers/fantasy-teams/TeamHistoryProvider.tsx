import { useAtom, useSetAtom } from "jotai";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup"
import { teamHistoryCurrentRoundAtom, teamHistoryCurrentTeamAtom, teamHistoryTeamManagerAtom } from "../../state/fantasy/fantasy-teams/teamHistory.atoms";
import { ScopeProvider } from "jotai-scope";
import { Fragment, ReactNode, useEffect } from "react";
import { useUserRoundTeam } from "../../hooks/fantasy/useUserRoundTeam";
import { DjangoUserMinimal } from "../../types/auth";

type Props = {
    children?: ReactNode,
    user?: DjangoUserMinimal,
    loadingFallback?: ReactNode
}

/** Component that provides team history to its child components. 
 * Provder depends on the FantasyLeagueGroupProvider
 */
export default function TeamHistoryProvider({children, user, loadingFallback} : Props) {

    const atoms = [
        teamHistoryCurrentRoundAtom,
        teamHistoryCurrentTeamAtom,
        teamHistoryTeamManagerAtom
    ]

    return (
        <ScopeProvider 
            atoms={atoms}
        >
            <InnerProvider
                user={user}
                loadingFallback={loadingFallback}
            >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}

function InnerProvider({children, user, loadingFallback}: Props) {

    const { currentRound } = useFantasyLeagueGroup();

    const [round, setRound] = useAtom(teamHistoryCurrentRoundAtom);
    const setTeam = useSetAtom(teamHistoryCurrentTeamAtom);
    const [manager, setManager] = useAtom(teamHistoryTeamManagerAtom);

    const shouldFetch = Boolean(round) && Boolean(manager);
    const {roundTeam, isLoading: loadingTeam} = useUserRoundTeam(round, manager?.kc_id, shouldFetch);

    const isLoading = loadingTeam;

    useEffect(() => {
        if (currentRound) {
            setRound(currentRound);
        }

        if (user) {
            setManager(user);
        }

    }, [currentRound, setRound, setManager, manager, user]);

    useEffect(() => {
        if (roundTeam) {
            setTeam(roundTeam);
        }
    }, [roundTeam, setTeam]);

    if (isLoading) {
        return (
            <Fragment>
                {loadingFallback}
            </Fragment>
        )
    } 

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}
