import { IFixture } from "./games"

/** Represents a single matches power ranking */
export type SingleMatchPowerRanking = {
    game: IFixture
    updated_power_ranking: number,
    athlete_id: string,
    team_id: string
}