export interface TeamStats {
  id: string;
  rank: number;
  teamName: string;
  managerName: string;
  totalPoints: number;
  weeklyPoints: number;
  lastRank: number;
  isUserTeam?: boolean;
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
}