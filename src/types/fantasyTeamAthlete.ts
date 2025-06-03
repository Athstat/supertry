export interface IFantasyTeamAthlete {
  athlete_id: string;
  purchase_price: number;
  purchase_date: Date;
  is_starting: boolean;
  slot: number;
  score: number;
  team_id: number;
  team_name: string,
  team_logo: string,
  athlete_team_id: string,
  player_name?: string
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
