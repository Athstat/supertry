export interface RankedFantasyTeam {
  id: string;
  rank: number;
  teamName: string;
  managerName: string;
  totalPoints: number;
  weeklyPoints: number;
  lastRank: number;
  isUserTeam?: boolean;
  userId: string
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export interface LeagueInfo {
  name: string;
  type: string;
  currentGameweek: number;
  totalGameweeks: number;
  totalTeams: number;
  prizePool: string;
  userRank?: number;
  joinDeadline?: Date | null
}

export type LeagueFromState = {
  id: number,
  type: string,
  official_league_id: string,
  title: string,
  created_date: Date,
  entry_code: string,
  entry_fee: number,
  is_private?: boolean,
  reward_type: string,
  reward_description: string,
  end_round: number,
  is_open: boolean,
  join_deadline?: Date,
  disclaimer: string,
  has_ended: boolean,
  duration_type: string,
  start_round: number,
  is_hidden: boolean
}