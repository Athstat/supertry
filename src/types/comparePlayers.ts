import { IAthleteSeasonStarRatings, IProAthlete } from "./athletes"
import { SportAction } from "./sports_actions"

/** Represents a selected compare player's stats  */
export type IComparePlayerStats = {
    athlete: IProAthlete,
    stats: SportAction[]
}

/** Represents a selected compare player's season star ratings */
export type ICompareStarRatingsStats = {
    athlete: IProAthlete,
    stats: IAthleteSeasonStarRatings
}