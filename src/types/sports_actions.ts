import { IProSeason } from "./season"

export type SportAction = {
    athlete_id: string,
    action: PlayerAggregateStatAction
    action_count: number,
    season_id: string,
    season: IProSeason,
    definition?: SportActionDefinition
}

export type PlayerAggregateStatAction = "Offloads" | "Passes" | "PenaltyConcededLineoutOffence" |
    "Points" | "PenaltiesConceded" | "TacklesMissed" | "Starts" | "TacklesMade" | "TackleSuccess" |
    "TurnoversConceded" | "TurnoversWon" | "LineoutsWonSteal" | "CarriesMadeGainLine" | "LineoutsWon" |
    "Tries" | "Carries" | "DefendersBeaten" | "Metres" | "MinutesPlayed" | "Assists" | "LineBreaks" |
    "LineoutSuccess" | "RetainedKicks" | "KicksFromHandMetres" | "KicksFromHand" |
    "RetainedKicks" | "PenaltyGoalsScored" | "ConversionsScored" | "RedCards" | "DropGoalsScored" | 'minutes_played_total' | string
    | ""

/** Helper function to get a stat */
export const getPlayerAggregatedStat = (key: PlayerAggregateStatAction, aggregatedStats?: SportAction[]) => {

    if (!aggregatedStats) {
        return undefined;
    }

    const filteredList = aggregatedStats.filter(stat => {
        return stat.definition?.action_name === key.toLowerCase();
    });

    if (filteredList.length > 0) {
        return filteredList[0];
    }

    return undefined;

}

export type SportActionDefinition = {
    action_name: string,
    display_name?: string,
    category?: string,
    tooltip?: string
    premium_feature?: boolean,
    show_on_ui?: boolean,
    group_as?: string,
    finesse_required?: boolean
}

export type PointsBreakdownItem = {
    action: string,
    action_count: number,
    score: number,
    round: number,
    game: string,
    athlete: string
}