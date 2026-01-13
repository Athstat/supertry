import { IProSeason } from "../season";

/** Represents a fantasy season */
export type IFantasySeason = IProSeason;

export type ISeasonRound = {
    id: string,
    round_number: number,
    round_title: string,
    build_up_start: Date,
    games_start: Date,
    games_end: Date,
    coverage_end: Date,
    created_at: Date,
    season: string,
    priority?: number
}