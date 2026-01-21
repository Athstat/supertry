import useSWR from "swr";
import { leagueService } from "../../services/leagueService";
import { isLeagueRoundLocked, isSeasonRoundLocked } from "../../utils/leaguesUtils";
import { swrFetchKeys } from "../../utils/swrKeys";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { fantasySeasonTeamService } from "../../services/fantasy/fantasySeasonTeamService";
import { useAuth } from "../../contexts/AuthContext";

// TODO: Delete Component
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

/** Returns a summary of a user round scoring  */
export function useRoundScoringSummaryV2(seasonRound?: ISeasonRound) {

    const {authUser} = useAuth();

    const key = seasonRound ? swrFetchKeys.getLeagueRoundScoringOverview(seasonRound?.id) : null;
    const { data: scoringOverview, isLoading } = useSWR(key, () => fantasySeasonTeamService.getRoundScoringSummary(seasonRound?.season || '',  authUser?.kc_id || '',  seasonRound?.round_number || ""));
    const isLocked = seasonRound && isSeasonRoundLocked(seasonRound);

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