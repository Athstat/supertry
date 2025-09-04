import { IFantasyLeagueRound } from "../types/fantasyLeague";
import { StandingsFilterItem } from "../types/standings";

/** Gets League Standings Filter Items */
export function getLeagueStandingsFilterItems(rounds: IFantasyLeagueRound[]): StandingsFilterItem[] {


    return [
        {
            lable: "Overall",
            id: 'overall'
        }
        , ...rounds.map((r) => {
            return {
                lable: r.title ?? '',
                id: r.id
            }
        })]
}