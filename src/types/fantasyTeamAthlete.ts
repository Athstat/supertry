export interface IFantasyTeamAthlete {
  athlete_id: string;
  purchase_price: number;
  purchase_date: Date;
  is_starting: boolean;
  slot: number;
  score: number;
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
  league_id: string;
  created_at: Date;
  updated_at: Date;
  athletes: IFantasyTeamAthlete[];
}
