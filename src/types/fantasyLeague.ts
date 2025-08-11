import { IFantasyTeamAthlete } from './fantasyTeamAthlete';

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
