import useSWR from "swr";
import { isSeasonRoundLocked } from "../../utils/leaguesUtils";
import { swrFetchKeys } from "../../utils/swrKeys";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { fantasySeasonTeamService } from "../../services/fantasy/fantasySeasonTeamService";
import { useAuth } from "../../contexts/AuthContext";

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