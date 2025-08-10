import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFixture } from "../../types/games";

export function getLeagueChatChannelUrl(league: IFantasyLeagueRound) {
    return `sendbird_league_open_channel_league_${league.id}`;
}

export function getLeagueChannelName(league: IFantasyLeagueRound) {
    return league.title + " Chat";
}

/** Returns the expected name of a fixture channel */
export function getFixtureChannelName(fixture: IFixture) {
    const homeTeamName = fixture.team.athstat_name;
    const awayTeamName = fixture.opposition_team.athstat_name;
    return `${homeTeamName} vs ${awayTeamName}`
}

/** Returns the expected url for a fixture channel */
export function getFixtureChannelUrl(fixture: IFixture) {

    // Need to replace `-` with `_`
    const sanitizedGameId = String(fixture.game_id).replace(/-/g, '_')
    return `sendbird_fixture_open_channel_${sanitizedGameId}`;
}