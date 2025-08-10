import { IFantasyLeagueRound } from "../../types/fantasyLeague";

export interface LeagueCardProps {
  league: IFantasyLeagueRound;
  onLeagueClick: (league: IFantasyLeagueRound) => void;
  teamCount?: number;
  isLoading?: boolean;
  custom?: number;
  isJoined?: boolean;
}
