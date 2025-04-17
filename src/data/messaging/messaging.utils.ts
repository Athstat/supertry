import { LeagueFromState } from "../../types/league";

export function getLeagueChatChannelUrl(league: LeagueFromState) {
    return `sendbird_league_open_channel_league_${league.id}`;
}

export function getLeagueChannelName(league: LeagueFromState) {
    return league.title + " Chat";
}