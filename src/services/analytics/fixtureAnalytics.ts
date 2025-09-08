import { IFixture } from "../../types/games";
import { analytics } from "./anayticsService";

export const fixtureAnalytics = {
    trackViewedTeamLineups: (fixture: IFixture) => {
        analytics.track('Viewed_Team_Lineups', {
            game_id: fixture.game_id
        })
    },

    trackViewedBoxscore: (fixture: IFixture) => {
        analytics.track('Viewed_Fixture_Boxscore', {
            game_id: fixture.game_id
        })
    },

    trackPlacedMotmVote: (fixture: IFixture, playerId: string) => {
        analytics.track('Placed_Motm_Vote', {
            votedForPlayerId: playerId,
            fixtureId: fixture.game_id
        })
    },

    trackMadeFixturePrediction: (fixture: IFixture, side: string, teamId: string) => {
        analytics.track('Made_Fixture_Prediction', {
            game_id: fixture.game_id,
            side, teamId
        })
    }
}