export type SportAction = {
    athlete_id: string,
    action: PlayerAggregateStatAction
    action_count: number,
    season_id: string
}

type PlayerAggregateStatAction = "Offloads" | "Passes" | "PenaltyConcededLineoutOffence" |
    "Points" | "PenaltiesConceded" | "TacklesMissed" | "Starts" | "TacklesMade" | "TackleSuccess" |
    "TurnoversConceded" | "TurnoversWon" | "LineoutsWonSteal" | "CarriesMadeGainLine" | "LineoutsWon" |
    "Tries" | "Carries" | "DefendersBeaten" | "Metres" | "MinutesPlayed" | "Assists" | "LineBreaks" |
    "LineoutSuccess" | "RetainedKicks" | "KicksFromHandMetres" | "KicksFromHand" | "RetainedKicks"

/** Helper function to get a stat */
export const getPlayerAggregatedStat = (key: PlayerAggregateStatAction, aggregatedStats: SportAction[]) => {
    const filteredList = aggregatedStats.filter(stat => {
        return stat.action.toLowerCase() === key.toLowerCase();
    });

    if (filteredList.length > 0) {
        return filteredList[0];
    }

    return undefined;

}