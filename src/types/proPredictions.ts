export type ProPredictionsRanking = {
    user_id: string,
    username: string,
    email: string,
    predictions_made: number,
    correct_predictions: number,
    score: number,
    rank?: number
}