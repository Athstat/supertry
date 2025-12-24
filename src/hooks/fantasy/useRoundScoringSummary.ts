import useSWR from "swr";
import { leagueService } from "../../services/leagueService";
import { isLeagueRoundLocked } from "../../utils/leaguesUtils";
import { swrFetchKeys } from "../../utils/swrKeys";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";

/** Returns a summary of a user round scoring  */
export function useRoundScoringSummary(leagueRound?: IFantasyLeagueRound) {
    const key = leagueRound ? swrFetchKeys.getLeagueRoundScoringOverview(leagueRound?.id) : null;
    const { data: scoringOverview, isLoading } = useSWR(key, () => leagueService.getRoundScoringOverview(leagueRound?.id || ""));
    const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

    const highestPointsScored = scoringOverview?.highest_points_scored;
    const averagePointsScored = scoringOverview?.average_points_scored;
    const userScore = scoringOverview?.user_score;

    return {
        userScore,
        averagePointsScored,
        highestPointsScored,
        isLoading,
        isLocked
    }
}