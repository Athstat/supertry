import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../../types/fantasyLeague";

export interface MyTeamsSectionProps {
  teams: IFantasyClubTeam[];
  teamsWithAthletes: Map<string, IFantasyTeamAthlete[]>;
  isLoading: boolean;
  error: string | null;
}

export interface ActiveLeaguesSectionProps {
  leagues: IFantasyLeague[];
  isLoading: boolean;
  onViewLeague: (league: IFantasyLeague) => void;
}
