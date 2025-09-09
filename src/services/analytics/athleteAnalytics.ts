import { analytics } from "./anayticsService"

export const athleteAnalytics = {
    trackPlayerSortApplied: (field: string, direction: string) => {
        analytics.track('Player_Sort_Applied', {
            sortField: field,
            direction
        });
    },

    trackPlayerFilterApplied: (field: string, value: string) => {
        analytics.track('Player_Filter_Applied', {
            filterField: field,
            value: value
        });
    },

    trackPointsBreakdownViewed: (playerId: string) => {
        analytics.track('View_Points_Breakdown', {
            playerId: playerId
        })
    }
}