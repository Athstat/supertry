import { ReactNode, useEffect } from "react"
import { currGroupMemberAtom, fantasyLeagueGroupAtom, fantasyLeagueGroupMembersAtom, fantasyLeagueGroupRoundsAtom } from "../../../state/fantasy/fantasyLeagueGroup.atoms"
import { ScopeProvider } from "jotai-scope"
import { useSetAtom } from "jotai"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService"
import { LoadingState } from "../../ui/LoadingState"

type Props = {
    children?: ReactNode,
    leagueId?: string
}

export default function FantasyLeagueGroupDataProvider({ children, leagueId }: Props) {

    const atoms = [
        fantasyLeagueGroupAtom,
        fantasyLeagueGroupMembersAtom,
        fantasyLeagueGroupRoundsAtom,
        currGroupMemberAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <Fetcher leagueId={leagueId} >
                {children}
            </Fetcher>
        </ScopeProvider>
    )
}


function Fetcher({children, leagueId}: Props) {

    const setFantasyLeagueGroup = useSetAtom(fantasyLeagueGroupAtom);
    const setFantasyLeagueMembers = useSetAtom(fantasyLeagueGroupMembersAtom);
    const setFantasyLeagueGroupRounds = useSetAtom(fantasyLeagueGroupRoundsAtom);

    const key = leagueId ? swrFetchKeys.getFantasyLeagueGroupById(leagueId) : null;
    const {data: league, isLoading: loadingLeague} = useSWR(key, () => fantasyLeagueGroupsService.getGroupById(leagueId ?? ""));

    const membersKey = leagueId ? swrFetchKeys.getLeagueGroupMembers(leagueId) : null;
    const {data: members, isLoading: loadingMembers} = useSWR(membersKey, () => fantasyLeagueGroupsService.getGroupMembers(leagueId ?? ""));

    const roundsKey = leagueId ? swrFetchKeys.getLeagueGroupRounds(leagueId) : null;
    const {data: rounds, isLoading: loadingRounds} = useSWR(roundsKey, () => fantasyLeagueGroupsService.getGroupRounds(leagueId ?? ""))

    const isLoading = loadingLeague || loadingMembers || loadingRounds;

    useEffect(() => {

        if (league) setFantasyLeagueGroup(league);
        if (members) setFantasyLeagueMembers(members);
        if (rounds) setFantasyLeagueGroupRounds(rounds);

    }, [league, members, rounds]);

    if (isLoading) {
        return (
            <LoadingState />
        )
    }
    
    return (
        <>
            {children}
        </>
    )
}
