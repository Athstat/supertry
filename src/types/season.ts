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
    competition_id: number
}