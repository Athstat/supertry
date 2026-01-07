import { DjangoUserMinimal } from "./auth"

/** Represents the API response for sending a inmate in jail */
export type PickemOverallRankingItem = {
    id: number,
    user_id: string,
    user: DjangoUserMinimal
    predictions_made: number,
    correct_predictions: number,
    wrong_predictions: number,
    pending_predictions: number,
    score: number,
    rank: number,
    last_rank?: null | number | undefined,
    season_id: string,
    created_at?: Date,
    updated_at: Date
}