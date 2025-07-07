export type ProPredictionsRanking = {
    user_id: string,
    username: string,
    email: string,
    predictions_made: number,
    correct_predictions: number,
    score: number,
    rank?: number
}

export type ProGameVote = {
    id: number,
    game_id: string,
    user_id: string,
    vote_for: string,
    created_at: Date,
    updated_at?: Date
}