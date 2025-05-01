import { IFantasyLeague } from "../../types/fantasyLeague";

export interface LeagueCardProps {
  league: IFantasyLeague;
  onLeagueClick: (league: IFantasyLeague) => void;
  teamCount?: number;
  isLoading?: boolean;
  custom?: number;
}
