import { IFantasyLeagueRound } from "../../types/fantasyLeague";

export interface ActiveLeaguesSectionProps {
  leagues: IFantasyLeagueRound[];
  isLoading: boolean;
  onViewLeague: (league: IFantasyLeagueRound) => void;
}
