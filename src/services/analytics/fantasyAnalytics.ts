import { analytics } from "./anayticsService"

export const fantasyAnalytics = {
    trackJoinedLeagueByCode: (leagueGroupId: string) => {
        analytics.track('Joined_League_By_Code', {
            leagueGroupId
        })
    },

    trackAttemptedJoinLeagueByCode: () => {
        analytics.track('Attempted_Join_League_By_Code');
    }
}