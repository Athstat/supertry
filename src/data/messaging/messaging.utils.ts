import { LeagueFromState } from "../../types/league";

export function getLeagueChatChannelUrl(league: LeagueFromState) {
    return `leagues-open-chats-${league.official_league_id}`;
}

export function getLeagueChatName(league: LeagueFromState) {
    return league.title + " Chat";
}