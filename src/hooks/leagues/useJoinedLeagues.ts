import { useMemo } from "react";
import useSWR from "swr";
import { fantasyLeagueGroupsService } from "../../services/fantasy/fantasyLeagueGroupsService";
import { useAuth } from "../../contexts/AuthContext";

/** Hook that fetches a user's joined leagues */
export function useJoinedLeagues(fantasySeasonId?: string) {

    const {authUser} = useAuth();

    const key = fantasySeasonId ? `/user-joined-leagues/${fantasySeasonId}` : null;

    const { data: fetchedLeagues, isLoading: loadingUserLeagues, error } = useSWR(
        key, () => fantasyLeagueGroupsFetcher(fantasySeasonId || ""), {
        revalidateOnFocus: false,
        revalidateIfStale: true
    });

    const leagues = useMemo(() => (fetchedLeagues ?? []), [fetchedLeagues]);
    const isLoading = loadingUserLeagues;


    const publicLeagues = useMemo(() => {
        return leagues.filter((l) => {
            return l.is_private === false;
        })
    }, [leagues])

    const privateLeagues = useMemo(() => {
        return leagues.filter((l) => {
            return l.is_private === true;
        })
    }, [leagues]);

    const officialLeagues = useMemo(() => {
        return leagues.filter((l) => {
            return l.type === "official_league";
        })
    }, [leagues]);

    const userCreatedLeagues =  useMemo(() => {
        return leagues.filter((l) => {
            return l.creator_id === authUser?.kc_id;
        })
    }, [authUser?.kc_id, leagues]);

    return {
        leagues,
        isLoading,
        error,
        privateLeagues,
        officialLeagues,
        userCreatedLeagues,
        publicLeagues
    }
}


async function fantasyLeagueGroupsFetcher(seasonId: string) {
    const joinedLeagues = await fantasyLeagueGroupsService.getJoinedLeagues(seasonId);
    const mineLeagues = await fantasyLeagueGroupsService.getMyCreatedLeagues(seasonId);

    const aggregate = [...mineLeagues, ...joinedLeagues];

    return aggregate;
}
