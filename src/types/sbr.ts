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
    away_votes: number
}