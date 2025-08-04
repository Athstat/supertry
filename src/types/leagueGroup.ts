import { IFantasyLeague } from './fantasyLeague';

export interface IUserLeagueGroup {
  id: string;
  name: string;
  description?: string;
  creator: {
    kc_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  fantasy_league: string; // Fantasy league ID
  invite_code: string;
  is_public: boolean;
  member_count: number;
  is_admin: boolean;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
}

export interface ICreateLeagueGroup {
  name: string;
  description?: string;
  fantasy_league_id: string;
  is_public: boolean;
}

export interface ILeagueGroupMember {
  user: {
    kc_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  team_id: number;
  team_name: string;
  is_admin: boolean;
  is_creator: boolean;
  overall_score: number;
  rank?: number;
}

export interface IJoinLeagueGroup {
  invite_code: string;
}

export interface ILeagueGroupJoinError {
  error: string;
  fantasy_league_id?: string;
  official_league_id?: string;
}
