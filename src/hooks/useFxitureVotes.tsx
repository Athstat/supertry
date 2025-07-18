import useSWR from "swr";
import { sbrService } from "../services/sbrService";
import { ISbrFixture, ISbrFixtureVote } from "../types/sbr";
import { useAuthUser } from "./useAuthUser";
import { useEffect, useState, useTransition } from "react";

export function useSbrFixtureVotes(fixture: ISbrFixture) {

    const user = useAuthUser();

    const key = `sbr/${fixture.fixture_id}/votes`;
    const { data, isLoading, error } = useSWR(key, () => sbrService.getFixtureVotes(fixture.fixture_id));

    const [userVote, setUserVote] = useState<ISbrFixtureVote>();

    const [_, startTransition] = useTransition();
    const votes = data ?? [];


    useEffect(() => {

        startTransition(() => {
            votes.forEach((v) => {
                if (v.user_id === user.kc_id) {
                    setUserVote(v);
                }
            })
        });

    }, [votes]);

    const homeVotes = votes.filter((v) => {
        return v.vote_for === "home_team";
    });

    const awayVotes = votes.filter((v) => {
        return v.vote_for === "away_team";
    });

    return { userVote, votes, homeVotes, awayVotes, isLoading, error }

}