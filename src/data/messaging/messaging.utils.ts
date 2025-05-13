import { IFantasyLeague } from "../../types/fantasyLeague";

export function getLeagueChatChannelUrl(league: IFantasyLeague) {
    return `sendbird_league_open_channel_league_${league.id}`;
}

export function getLeagueChannelName(league: IFantasyLeague) {
    return league.title + " Chat";
}