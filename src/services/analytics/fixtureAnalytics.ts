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
            gameId: fixture.game_id
        })
    },

    trackPlacedMotmVote: (fixtureId: string, playerId: string) => {
        analytics.track('Placed_Motm_Vote', {
            votedForPlayerId: playerId,
            gameId: fixtureId
        })
    },

    trackMadeFixturePrediction: (fixture: IFixture, side: string, teamId: string) => {
        analytics.track('Made_Fixture_Prediction', {
            gameId: fixture.game_id,
            side, teamId
        })
    }
}