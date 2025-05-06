export type IFixture = {
    game_id: string,
    team_score?: number,
    opposition_score?: number,
    venue?: string,
    kickoff_time?: Date,
    competition_name?: string,
    team_id: string,
    opposition_team_id: string,
    is_knockout?: boolean,
    is_league_managed?: boolean,
    location?: string,
    extra_info?: string,
    hidden?: boolean,
    league_id: string,
    network?: string,
    game_status?: GameStatus,
    game_clock?: string,
    result?: string,
    source_id?: string,
    data_source?: string,
    is_test?: boolean,
    round: number,
    team_name: string,
    team_image_url?: string,
    opposition_team_name: string,
    opposition_image_url: string
}

export type GameStatus = string | "completed" | "in_progress" | "not_started";

export type IFullFixture = any;