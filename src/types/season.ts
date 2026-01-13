import { IProTeam } from "./team"

export type IProSeason = {
    id: string,
    name: string,
    start_date: Date,
    end_date: Date,
    games_supported?: boolean,
    hidden?: boolean,
    data_source?: string,
    source_id?: string,
    web_supported?: boolean,
    competition_id: number,
    fantasy_supported?: boolean,
    priority?: number
}

/** Represents the response from the team season record api */
export type TeamSeasonRecord = {
    total_games_played: number,
    wins: number,
    losses: number,
    draws: number
}


export type SeasonStandingsItem = {
    total_games_played: number,
    wins: number,
    losses: number,
    draws: number,
    traditional_points: number,
    team: IProTeam
    team_id: string,
    rank: number
}