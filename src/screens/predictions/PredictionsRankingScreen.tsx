/** Renders Pro Predcitions Rankings Screen */

import useSWR from "swr";
import { useAuthUser } from "../../hooks/useAuthUser"
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingState } from "../../components/ui/LoadingState";
import { IStatCard, TopicPageView } from "../PageView";
import ProPredictionsLeaderboard from "../../components/predictions/ProPredictionsLeaderboard";
import TabView, { TabViewHeaderItem, TabViewPage } from "../../components/shared/tabs/TabView";
import UserProPredictionsHistoryTab from "../../components/predictions/ProPredictionsHistory";

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

    ] : []

    const tabItems: TabViewHeaderItem[] = [
        {
            label: 'Leaderboard',
            tabKey: 'leaderboard'
        },

        {
            label: 'History',
            tabKey: 'history'
        }
    ]

    return (
        <TopicPageView
            title="Pro Predictions Ranking"
            statsCards={stats}
            className="p-4"
        >
            <TabView tabHeaderItems={tabItems} >
                <TabViewPage tabKey="leaderboard" >
                    <ProPredictionsLeaderboard />
                </TabViewPage>

                <TabViewPage tabKey="history" >
                    <UserProPredictionsHistoryTab />
                </TabViewPage>
            </TabView>

        </TopicPageView>
    )
}
