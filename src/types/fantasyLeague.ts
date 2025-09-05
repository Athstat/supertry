import { IProAthlete } from './athletes';
import { IFantasyTeamAthlete } from './fantasyTeamAthlete';
import { IProTeam } from './team';

export interface ISeason {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
}

export interface IFantasyLeagueRound {
  season: string;
  season_name: string;
  season_id: string;
  id: string;
  type: string;
  official_league_id: string;
  title: string;
  created_date: Date;
  entry_code: string | null;
  entry_fee: number | null;
  is_private: boolean;
  reward_type: string | null;
  reward_description: string | null;
  end_round: number | null;
  start_round: number | null;
  is_open: boolean;
  join_deadline: Date | null;
  disclaimer: string | null;
  has_ended: boolean;
  duration_type: string;
  status: string;
  participants_count: number;
  total_gameweeks?: number;
  current_gameweek?: number;
  fantasy_league_group_id: string;
}

export type IFantasyLeagueTeam = {
  id: string | number;
  rank: number;
  overall_score: number;
  team_id: string;
  league_id: number;
  position?: number;
  position_change?: number;
  score?: number;
  is_admin?: boolean;
  join_date?: Date;
  team_name?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  athletes: IFantasyTeamAthlete[];
};


export type FantasyLeagueTeamWithAthletes = {
  id: 1,
  team: {
    id: number,
    user_id: string,
    manager_name: string,
    club_id: number,
    league_id: string,
    official_league_id: string,
    created_at: Date,
    updated_at: Date
    name: string,
    created_date: string,
    team_value: number,
    balance: number,
    club: number,
    official_league: string
  },
  fantasyLeague: IFantasyLeagueRound,
  team_id: number,
  athletes: IDetailedFantasyAthlete[]
  position?: string,
  position_change: number,
  overall_score: number,
  is_admin?: boolean,
  join_date?: Date,
  rank: number,
  league: number
}

export type IDetailedFantasyAthlete = {
  id: number,
  team_id: number,
  athlete: IProAthlete,
  purchase_date?: Date,
  purchase_price: number,
  is_starting: boolean,
  slot: number,
  score: number,
  is_captain: boolean,
  is_super_sub: boolean
}