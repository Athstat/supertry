import { useAtom, useSetAtom } from "jotai";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup"
import { teamHistoryCurrentRoundAtom, teamHistoryCurrentTeamAtom, teamHistoryTeamManagerAtom } from "../../state/fantasy/fantasy-teams/teamHistory.atoms";
import { ScopeProvider } from "jotai-scope";
import { Fragment, ReactNode, useEffect } from "react";
import { useUserRoundTeam } from "../../hooks/fantasy/useUserRoundTeam";
import { DjangoUserMinimal } from "../../types/auth";
import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";
import { useDebounced } from "../../hooks/web/useDebounced";
import { useQueryState } from "../../hooks/web/useQueryState";
import { queryParamKeys } from "../../types/constants";
import { AnimatePresence } from "framer-motion";

type Props = {
    children?: ReactNode,
    user?: DjangoUserMinimal,
    loadingFallback?: ReactNode
}

/** Component that provides team history to its child components. 
 * Provder depends on the FantasyLeagueGroupProvider
 */
export default function TeamHistoryProvider({ children, user, loadingFallback }: Props) {

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

function InnerProvider({ children, user, loadingFallback }: Props) {

    const [roundNumber, setRoundNumber] = useQueryState(queryParamKeys.ROUND_NUMBER_QUERY_KEY);
    const [roundId, setRoundId] = useQueryState(queryParamKeys.ROUND_ID_QUERY_KEY);
    const { currentRound, sortedRounds } = useFantasyLeagueGroup();

    const setRound = useSetAtom(teamHistoryCurrentRoundAtom);
    const [, setManager] = useAtom(teamHistoryTeamManagerAtom);

    useEffect(() => {
        if (currentRound) {
            setRound(currentRound);
        }
    }, [currentRound, setRound]);

    useEffect(() => {
        if (user) {
            setManager(user);
        }
    }, [user, setManager])

    useEffect(() => {

        if (!roundId && roundNumber) {

            const matchingRound = sortedRounds.find((r) => {
                return r.start_round?.toString() === (roundNumber || "")
            });

            if (matchingRound) {
                setRoundId(matchingRound.id);
                return;
            }
        }

        if (!roundId && currentRound) {
            setRoundId(currentRound.id);
            return;
        }

    }, [currentRound, roundId, roundNumber, setRoundId, setRoundNumber, sortedRounds]);

    return (
        <Fragment>
            <RoundTeamProvider
                loadingFallback={loadingFallback}
                user={user}
            >
                {children}
            </RoundTeamProvider>
        </Fragment>
    )
}


function RoundTeamProvider({ loadingFallback, children }: Props) {
    const setRoundTeam = useSetAtom(teamHistoryCurrentTeamAtom);

    const { round, manager } = useTeamHistory();
    const shouldFetch = Boolean(round) && Boolean(manager);

    const { roundTeam, isLoading: loadingTeam } = useUserRoundTeam(round?.id, manager?.kc_id, shouldFetch);

    const isLoading = useDebounced(loadingTeam, 2000);

    useEffect(() => {
        if (roundTeam) {
            setRoundTeam(roundTeam);
        }
    }, [roundTeam, setRoundTeam]);

    if (isLoading) {
        return (
            <Fragment>
                {loadingFallback}
            </Fragment>
        )
    }


    return (
        <Fragment>
            <AnimatePresence >
                {children}
            </AnimatePresence>
        </Fragment>
    )

}