export type UserRanking = {
    rank: number,
    total_score: number,
    user_id: string,
    first_name?: string,
    last_name?: string,
    email: string,
    updated_at: Date
}