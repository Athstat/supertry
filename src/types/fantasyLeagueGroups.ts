import { DjangoAuthUser } from "./auth";
import { IProSeason } from "./season";

export type FantasyLeagueGroupType = "user_created" | "system_created";

export type FantasyLeagueGroup = {
    id: string,
    title?: string,
    season_id?: string,
    creator_id?: string,
    is_private?: boolean,
    type?: FantasyLeagueGroupType,
    created_at?: Date,
    entry_code?: string,
    is_hidden?: boolean,
    description?: string,
    start_date?: Date,
    end_date?: Date,
    season: IProSeason
}

export type FantasyLeagueGroupMember = {
    user_id: string,
    fantasy_league_group_id: string,
    joined_at?: Date,
    is_admin?: boolean,
    user: DjangoAuthUser
}