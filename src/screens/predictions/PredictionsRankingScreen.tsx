/** Renders Pro Predcitions Rankings Screen */

import useSWR from "swr";
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import { IStatCard, TopicPageView } from "../PageView";
import ProPredictionsLeaderboard from "../../components/pickem/ProPredictionsLeaderboard";
import TabView, { TabViewHeaderItem, TabViewPage } from "../../components/ui/tabs/TabView";
import UserProPredictionsHistoryTab from "../../components/pickem/ProPredictionsHistory";
import { useAuth } from "../../contexts/AuthContext";

export default function PredictionsRankingScreen() {

    const {authUser: user} = useAuth();

    const key = `pro-predictions-rankings/${user?.kc_id}`
    const { data: userRanking, isLoading: loadingUserRanking } = useSWR(
        key, () => proPredictionsRankingService.getUserRanking(user?.kc_id)
    );

    if (loadingUserRanking) {
        return <LoadingIndicator />
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
