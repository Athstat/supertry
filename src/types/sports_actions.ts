export type AthleteSportsActionAggregated = {
    id: string,
    athlete_id: string,
    action: PlayerAggregateStatAction
    action_count: number,
    season_id: string
}

type PlayerAggregateStatAction = "Offloads" | "Passes" | "PenaltyConcededLineoutOffence" |
    "Points" | "PenaltiesConceded" | "TacklesMissed" | "Starts" | "TacklesMade" | "TackleSuccess" |
    "TurnoversConceded" | "TurnoversWon" | "LineoutsWonSteal" | "CarriesMadeGainLine" | "LineoutsWon" |
    "Tries" | "Carries" | "DefendersBeaten" | "Metres" | "MinutesPlayed"