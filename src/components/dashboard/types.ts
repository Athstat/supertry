import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../../types/fantasyTeamAthlete";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";

export interface MyTeamsSectionProps {
  teams: IFantasyClubTeam[];
  teamsWithAthletes: Map<string, IFantasyTeamAthlete[]>;
  isLoading: boolean;
  error: string | null;
}

export interface ActiveLeaguesSectionProps {
  leagues: IFantasyLeagueRound[];
  isLoading: boolean;
  onViewLeague: (league: IFantasyLeagueRound) => void;
}
