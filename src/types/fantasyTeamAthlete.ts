export type IFantasyTeamAthlete = {
  id: number,
  team_id: number,
  athlete_id: string,
  purchase_price: number,
  purchase_date?: Date,
  is_starting?: boolean,
  slot: number,
  score?: number,
  tracking_id: string,
  player_name: string,
  nick_name?: string,
  birth_country?: string,
  date_of_birth?: Date,
  abbr?: string,
  athstat_name?: string,
  athstat_firstname?: string,
  athstat_lastname?: string,
  athstat_middleinitial?: string,
  athlete_team_id?: string,
  height?: number,
  weight?: number,
  hidden?: boolean,
  gender?: "M" | "F",
  price?: number,
  power_rank_rating?: number,
  region?: string,
  position_class?: string,
  position?: string,
  image_url?: string,
  team_name?: string,
  team_logo?: string,
  incrowed_team_id?: string,
  incrowed_season_id?: string,
  incrowed_competition_id?: string,
  points_kicking?: number,
  tackling?: number,
  infield_kicking?: number,
  strength?: number,
  playmaking?: number,
  ball_carrying?: number,
  total_points?: number
}

export interface IFantasyTeamSubmission {
  clubId: string;
  leagueId: string;
  name: string;
  team: IFantasyTeamAthlete[];
}

export interface IFantasyClubTeam {
  id: string;
  name: string;
  club_id: string;
  league_id: number;
  official_league_id?: string; // Add the official_league_id field that exists on the team object
  created_at: Date;
  updated_at: Date;
  athletes: IFantasyTeamAthlete[];
  round_score?: number; // Current round score for the team
  rank?: number; // Team's rank in the league
  balance?: number; // Team's available budget
}


export type IUpdateFantasyTeamItem = {
  id?: string;
  team_id: string;
  athlete_id: string;
  purchase_price: number;
  purchase_date: Date;
  is_starting: boolean;
  slot: number;
  score: number;
}