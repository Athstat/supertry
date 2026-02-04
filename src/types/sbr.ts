import { BaseFixture } from "./games"
import { ISbrTeam } from "./sbrTeam"

export type ISbrFixture = BaseFixture & {
    home_team_id: string,
    away_team_id: string,
    home_team: ISbrTeam
    away_team: ISbrTeam
    fixture_id: string,
    home_score?: number,
    away_score?: number,
    status?: "completed" | "not_started",
    season?: string,
    country?: string,
    is_feature_game?: boolean
}

export type ISbrFixtureStatsStatus = {
    has_timeline: boolean,
    has_boxscore: boolean
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

export type SbrFixtureEventType = 'Kick-Off' | 'Catch' | 'Kick' | 'Ball In Touch' | 'Lineout' |
    'Lineout Won' | 'Kick Directly To Touch Outside 22' | 'Try' |
    'Kick At Goal Position' | 'Conversion' | 'Knock On' | 'Advantage' |
    'Advantage Over' | 'Penalty For Dangerous Tackle' |
    'Option: Kick At Goal' | 'Penalty Kick Scored' |
    'Penalty For Offside' | 'Option: Kick' | 'Kick To Touch' |
    'Penalty For Offside At Kick' | 'Penalty For Not Releasing Ball' |
    'Scrum' | 'Scrum Won' | 'Penalty For Ruck Offence' | 'Turn Over' |
    'Conversion Missed' | 'Kick-Off Not 10 Meters' | 'Option: Scrum' |
    'Kick Missed' | '22 Drop-Out' | 'Penalty For Not Releasign Player' |
    'Option: Tap And Go' | 'Kick 50-22' | 'Penalty For Lineout' |
    'Half-Time' | 'Kick To Touch From Inside 22' | 'Penalty' |
    'Penalty For Violent/Foul Play' | 'Yellow Card' | 'Maul Formed' |
    'Maul Incomplete' | 'Full-Time'