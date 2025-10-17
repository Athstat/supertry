import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";

/** Returns true if a league group has ended */
export function hasLeagueGroupEnded(leagueGroup: FantasyLeagueGroup) {
    const dateNowEpoch = new Date().valueOf();
    const dateEndEpoch = new Date(leagueGroup.end_date ?? new Date()).valueOf();

    return dateNowEpoch >= dateEndEpoch;
}