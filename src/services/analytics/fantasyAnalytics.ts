import { analytics } from "./anayticsService"

export const fantasyAnalytics = {
    trackJoinedLeagueByCode: (leagueGroupId: string) => {
        analytics.track('Joined_League_By_Code', {
            leagueGroupId
        })
    },

    trackAttemptedJoinLeagueByCode: () => {
        analytics.track('Attempted_Join_League_By_Code');
    },

    trackVisitedEditTeamTab: (leagueGroupId?: string, leagueRoundId?: string | number) => {
        analytics.track('Visited_Edit_Team_Tab', {
            leagueRound: leagueRoundId,
            leagueGroupId: leagueGroupId
        })
    },

    trackUsedSwapPlayerFeature: () => {
        analytics.track('Used_Swaps_Player');
    },

    trackCanceledTeamEdits: () => {
        analytics.track('Canceled_Team_Edits');
    },

    trackSaveTeamEdits: () => {
        analytics.track('Save_Team_Edits');
    },

    trackVisitedMyTeamsTab: () => {
        analytics.track('Visited_My_Teams_Tab');
    },

    trackVisitedTeamPitchView: () => {
        analytics.track('Visited_Team_Pitch_View');
    },

    trackClearedTeamSlot: () => {
        analytics.track('Cleared_Team_Slot');
    },

    trackViewedStandingsTab: () => {
        analytics.track('Viewed_Standings_Tab');
    },

    trackStandings_Week_Filter_Applied: () => {
        analytics.track('Standings_Week_Filter_Applied');
    },

    trackViewedLeagueInfo: () => {
        analytics.track('Viewed_League_Info');
    },

    trackVisitedLeagueOverviewScreen: (leagueGroupId?: string) => {
        analytics.track('Visited_League_Overview_Screen', {
            leagueGroupId
        });
    },

    trackVisitedLeagueScreen: (leagueGroupId?: string) => {
        analytics.track('Visited_League_Screen', {
            leagueGroupId
        })
    },

    trackClickedRowOnLeagueStandings: () => {
        analytics.track('Clicked_User_Record_On_Standings');
    }
}