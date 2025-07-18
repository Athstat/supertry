import useSWR from "swr";
import { sbrService } from "../services/sbr/sbrService";
import { ISbrFixture } from "../types/sbr";
import { useAuthUser } from "./useAuthUser";
import { useMemo } from "react";

export function useSbrFixtureVotes(fixture: ISbrFixture, shouldFetch: boolean = true) {

    const user = useAuthUser();

    const key = shouldFetch ? `sbr/${fixture.fixture_id}/votes` : null;
    const { data, isLoading, error } = useSWR(key, () => sbrService.getFixtureVotes(fixture.fixture_id));
    const votes = data ?? [];

    const userVote = useMemo(() => {
        return votes.find((v) => {
            return v.user_id === user.kc_id
        })
    }, [votes]);

    const homeVotes = votes.filter((v) => {
        return v.vote_for === "home_team";
    });

    const awayVotes = votes.filter((v) => {
        return v.vote_for === "away_team";
    });

    return { userVote, votes, homeVotes, awayVotes, isLoading, error }

}