import { sbrService } from "../services/sbrService";
import { ISbrFixture, ISbrFixtureVote } from "../types/sbr";
import { useAuthUser } from "./useAuthUser";
import { useFetch } from "./useFetch";

export function useFixtureVotes(fixture: ISbrFixture) {

    const user = useAuthUser();

    const { data, isLoading, error } = useFetch(
        "fixture-votes",
        fixture.fixture_id,
        sbrService.getFixtureVotes
    );

    const votes = data ?? [];

    let userVote: ISbrFixtureVote | undefined;

    votes.forEach((v) => {
        if (v.user_id === user.id) {
            userVote = v;
        }
    });

    const homeVotes = votes.filter((v) => {
        return v.vote_for === "home_team";
    })

    const awayVotes = votes.filter((v) => {
        return v.vote_for === "away_team";
    })

    return { userVote, votes, homeVotes, awayVotes, isLoading, error }

}