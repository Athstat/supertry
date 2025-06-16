export type ISbrFixture = {
    fixture_id: string,
    home_team: string,
    away_team: string,
    home_score?: number,
    away_score?: number,
    status?: string,
    kickoff_time?: Date,
    round: number,
    winner?: string,
    voting?: boolean,
    season?: string,
    home_votes: number,
    away_votes: number,
    country?: string,
    is_feature_game?: boolean,
    home_team_id?: string,
    away_team_id?: string
}

export type ISbrBoxscoreItem = {
    action: string,
    count: number,
    team_id: number
}

export type ISbrFixtureVote = {
    user_id: string,
    fixture_id: string,
    vote_for: "home_team" | "away_team"
}

export type UserPredictionsRanking = {
    kc_id: string,
    first_name: string,
    email: string,
    predictions_made: string,
    correct_predictions: string,
    wrong_predictions: string,
    predictions_perc: number,
    user_rank: string
}

/** Represents a single item in an sbr fixture roster */
export type ISbrFixtureRosterItem = {
    fixture_id: string,
    team_id: string,
    athlete_id: string,
    position?: string,
    jersey_number?: number,
    is_captain?: boolean,
    is_substitute?: boolean,
    team_name?: string,
    athlete_first_name?: string,
    athlete_last_name?: string
}

export type ISbrMotmVote = {
    fixture_id: string,
    athlete_id: string,
    team_id: string,
    user_id: string,
    created_at?: Date,
    athlete_first_name?: string,
    athlete_last_name?: string,
    team_name?: string,
    user_email?: string,
    username?: string
}

export type INewSbrMotmVoteReq = {
    userId: string,
    teamId: string,
    athleteId: string
}

export type IEditSbrMotmVoteReq = {
    teamId: string,
    athleteId: string
}

export type ISbrFixtureEvent = {
    event_name: string,
    fixture_id: string,
    team_id: number,
    team_scrummy_id?: string,
    event_timestamp: number,
    x_position?: number
    y_position?: number
}