import { Fragment, ReactNode, useEffect, useState } from "react"
import { currGroupMemberAtom, fantasyLeagueGroupAtom, fantasyLeagueGroupMembersAtom, fantasyLeagueGroupRoundsAtom } from "../../../state/fantasy/fantasyLeagueGroup.atoms"
import { ScopeProvider } from "jotai-scope"
import { useSetAtom } from "jotai"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService"
import { LoadingState } from "../../ui/LoadingState"
import { useLocation } from "react-router-dom"
import RoundedCard from "../../shared/RoundedCard"

type Props = {
    children?: ReactNode,
    leagueId?: string,
    loadingFallback?: ReactNode
}

export default function FantasyLeagueGroupDataProvider({ children, leagueId, loadingFallback }: Props) {

    const atoms = [
        fantasyLeagueGroupAtom,
        fantasyLeagueGroupMembersAtom,
        fantasyLeagueGroupRoundsAtom,
        currGroupMemberAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <Fetcher
                leagueId={leagueId}
                loadingFallback={loadingFallback}
            >
                {children}
            </Fetcher>
        </ScopeProvider>
    )
}


function Fetcher({ children, leagueId, loadingFallback }: Props) {

    const setFantasyLeagueGroup = useSetAtom(fantasyLeagueGroupAtom);
    const setFantasyLeagueMembers = useSetAtom(fantasyLeagueGroupMembersAtom);
    const setFantasyLeagueGroupRounds = useSetAtom(fantasyLeagueGroupRoundsAtom);

    const { state } = useLocation();

    const key = leagueId ? swrFetchKeys.getFantasyLeagueGroupById(leagueId) : null;
    const { data: league, isLoading: loadingLeague } = useSWR(key, () => fantasyLeagueGroupsService.getGroupById(leagueId ?? ""));

    const membersKey = leagueId ? swrFetchKeys.getLeagueGroupMembers(leagueId) : null;
    const { data: members, isLoading: loadingMembers, mutate } = useSWR(membersKey, () => fantasyLeagueGroupsService.getGroupMembers(leagueId ?? ""));

    const roundsKey = leagueId ? swrFetchKeys.getLeagueGroupRounds(leagueId) : null;
    const { data: rounds, isLoading: loadingRounds } = useSWR(roundsKey, () => fantasyLeagueGroupsService.getGroupRounds(leagueId ?? ""))

    const [isMutating, setMutate] = useState<boolean>(false);
    const isLoading = loadingLeague || loadingMembers || loadingRounds || isMutating;

    useEffect(() => {

        if (league) setFantasyLeagueGroup(league);
        if (members) setFantasyLeagueMembers(members);
        if (rounds) setFantasyLeagueGroupRounds(rounds);

    }, [league, members, rounds, setFantasyLeagueGroup, setFantasyLeagueGroupRounds, setFantasyLeagueMembers]);

    useEffect(() => {

        const reloadMembers = async () => {
            if (state?.reloadApp === true) {
                setMutate(true);
                await mutate(() => fantasyLeagueGroupsService.getGroupMembers(leagueId ?? ""));
                setMutate(false);
            }
        }

        reloadMembers();

    }, [leagueId, mutate, state]);

    if (isLoading) {
        return (
            <Fragment>
                {loadingFallback ? (
                    <Fragment>
                        <RoundedCard className="h-[100px] w-full rounded-xl border-none animate-pulse" >
                        </RoundedCard>
                    </Fragment>
                ) : <LoadingState />}
            </Fragment>
        )
    }

    return (
        <>
            {children}
        </>
    )
}
