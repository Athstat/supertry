import React, { useEffect, useMemo } from "react";

import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { fantasyTeamService } from "../../services/fantasyTeamService";
import { leagueService } from "../../services/leagueService";
import { useFetch } from "../../hooks/useFetch";
import { useAtom } from "jotai";
import { fantasyTeamValueAtom, fantasyTeamAtom, fantasyTeamAthletesAtom, fantasyLeagueAtom } from "./my_team.atoms";
import { LoadingState } from "../ui/LoadingState";
import { calculateFantasyTeamValue } from "../../utils/athleteUtils";
import { ErrorState } from "../ui/ErrorState";
import { ScopeProvider } from "jotai-scope";

interface TeamDataContextType {
  team: IFantasyClubTeam | undefined;
  athletes: IFantasyTeamAthlete[];
  isLoading: boolean;
  error: string | null;
  leagueInfo: IFantasyLeague | undefined;
  fetchingLeague: boolean;
  teamBudget: number;
  teamAny: any;
  totalPoints: number;
}

export const TeamDataContext = React.createContext<
  TeamDataContextType | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
  teamId: string
}

/** Fetches data needed by the any screen showing a fantasy teams information */
export function TeamDataProvider({ children, teamId}: Props) {

  const [, setFantasyTeamValue] = useAtom(fantasyTeamValueAtom);
  const [, setFantasyTeam] = useAtom(fantasyTeamAtom);
  const [, setFantasyTeamAthletes] = useAtom(fantasyTeamAthletesAtom);
  const [, setFantasyLeague] = useAtom(fantasyLeagueAtom);

  // Step 1: Fetching Data
  const { data: athletes, isLoading: loadingAthletes, error: athletesError } = useFetch("team-athletes", teamId, fantasyTeamService.fetchTeamAthletes);
  const { data: team, isLoading: loadingTeam, error: teamError } = useFetch("fantasy-team", teamId, (teamId) => fantasyTeamService.getUserTeamById(teamId));
  const { data: league, isLoading: loadingLeague, error: leagueError } = useFetch("fantasy-league", team?.league_id ?? 0, leagueService.getLeagueById);

  const isLoading = loadingAthletes || loadingTeam || loadingLeague;
  const error = athletesError || teamError || leagueError;

  const calculatedTeamValue = useMemo(() => {
    return calculateFantasyTeamValue(athletes);
  }, [athletes]);

  useEffect(() => {

    if (team) setFantasyTeam(team);
    if (league) setFantasyLeague(league);

    setFantasyTeamAthletes(athletes ?? []);
    setFantasyTeamValue(calculatedTeamValue);

    console.log("Team ", team);
    console.log("League ", league);
    console.log("Athletes ", athletes);

  }, [team, athletes, league]);

  // useScrollToCordnates(0, 0);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error="Failed to fetch team" message={error} />

  // Convert athletes to position format for the Edit Team view
  // const positionList = useMemo(() => {
  //   if (!athletes?.length) return [];

  //   const positions: Position[] = [];

  //   // Add regular position players (non-super sub)

  //   athletes
  //     .filter((athlete: any) => !athlete.is_super_sub)
  //     .forEach((athlete) => {
  //       const athleteAny = athlete as any;

  //       positions.push({
  //         id: athlete.athlete_id || "",
  //         name: athleteAny.position_class || "Unknown Position",
  //         shortName: (athleteAny.position_class || "")
  //           .substring(0, 2)
  //           .toUpperCase(),
  //         x: "0",
  //         y: "0",
  //         player: athleteAny,
  //       });
  //     });

  //   // Add super sub at the end
  //   const superSub = athletes.find((athlete: any) => athlete.is_super_sub);
  //   if (superSub) {
  //     const superSubAny = superSub as any;
  //     positions.push({
  //       id: superSub.athlete_id || "",
  //       name: "Super Sub",
  //       shortName: "SS",
  //       x: "0",
  //       y: "0",
  //       isSpecial: true,
  //       player: {
  //         id: superSubAny.athlete_id || "",
  //         name: superSubAny.player_name || "Unknown Player",
  //         team: superSubAny.athlete?.team?.name || "Unknown Team",
  //         position: superSubAny.position_class || "Unknown Position",
  //         price: superSubAny.price || 0,
  //         points: superSubAny.score || 0,
  //         power_rank_rating: superSubAny.power_rank_rating || 0,
  //         image_url: superSubAny.image_url,
  //       },
  //     });
  //   }

  //   return positions;
  // }, [athletes]);

  const atoms = [fantasyLeagueAtom, fantasyTeamAtom, fantasyTeamAthletesAtom, fantasyTeamValueAtom];

  return (
    <ScopeProvider atoms={atoms}>
      {children}
    </ScopeProvider>
  );
};

export const useTeamData = () => {
  const context = React.useContext(TeamDataContext);
  if (context === undefined) {
    throw new Error("useTeamData must be used within a TeamDataProvider");
  }
  return context;
};
