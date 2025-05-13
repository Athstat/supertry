import { IFantasyTeamAthlete } from "./fantasyTeamAthlete";

export interface IFantasyLeague {
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
  total_gameweeks?: number
  current_gameweek?: number
}


export type IFantasyLeagueTeam = {
  id: string,
  league_id: number,
  team_id: number,
  position?: number,
  position_change?: number,
  overall_score?: number,
  is_admin?: boolean,
  join_date?:Date,
  name?: string,
  kc_id: string,
  first_name: string,
  last_name: string,
  athletes : IFantasyTeamAthlete[]
}