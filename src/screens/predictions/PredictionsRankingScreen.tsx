/** Renders Pro Predcitions Rankings Screen */

import useSWR from "swr";
import { useAuthUser } from "../../hooks/useAuthUser"
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingState } from "../../components/ui/LoadingState";
import { IStatCard, TopicPageView } from "../PageView";
import ProPredictionsLeaderboard from "../../components/predictions/ProPredictionsLeaderboard";

export default function PredictionsRankingScreen() {

    const user = useAuthUser();

    const key = `pro-predictions-rankings/${user.id}`
    const { data: userRanking, isLoading: loadingUserRanking } = useSWR(
        key, () => proPredictionsRankingService.getUserRanking(user.id)
    );

    if (loadingUserRanking) {
        return <LoadingState />
    }

    const stats: IStatCard[] = userRanking ? [
        {
            title: 'Rank',
            value: userRanking.rank ?? 'Unranked'
        },

        {
            title: 'Predictions Made',
            value: userRanking.predictions_made ?? '-'
        },

        // {
        //     title: 'Score',
        //     value: userRanking.score ?? '-'
        // }

    ] : []

    return (
        <TopicPageView
            title="Pro Predictions Ranking"
            statsCards={stats}
        >
            
            <ProPredictionsLeaderboard />

        </TopicPageView>
    )
}
