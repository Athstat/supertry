import React, { useEffect, useMemo } from "react";

import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../../types/fantasyTeamAthlete";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { fantasyTeamService } from "../../services/fantasyTeamService";
import { leagueService } from "../../services/leagueService";
import { useAtom } from "jotai";
import { LoadingState } from "../ui/LoadingState";
import { calculateFantasyTeamValue } from "../../utils/athleteUtils";
import { ErrorState } from "../ui/ErrorState";
import { 
  fantasyTeamValueAtom, 
  fantasyTeamAtom, 
  fantasyTeamAthletesAtom, 
  teamCaptainIdAtom 
} from "../../state/myTeam.atoms";
import useSWR from "swr";
import { fantasyLeagueAtom } from "../../state/fantasy/fantasyLeague.atoms";

interface TeamDataContextType {
  team: IFantasyClubTeam | undefined;
  athletes: IFantasyTeamAthlete[];
  isLoading: boolean;
  error: string | null;
  leagueInfo: IFantasyLeagueRound | undefined;
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
  const [, setTeamCaptainId] = useAtom(teamCaptainIdAtom);

  // Step 1: Fetching Data
  const { data: athletes, isLoading: loadingAthletes, error: athletesError } = useSWR(`team-athletes/${teamId}`, () => fantasyTeamService.fetchTeamAthletes(teamId));
  const { data: team, isLoading: loadingTeam, error: teamError } = useSWR(`fantasy-team/${teamId}`, () => fantasyTeamService.getUserTeamById(teamId));
  const { data: league, isLoading: loadingLeague, error: leagueError } = useSWR(`fantasy-league/${team?.league_id}`, () => leagueService.getLeagueById(team?.league_id ?? 0));

  const isLoading = loadingAthletes || loadingTeam || loadingLeague;
  const error = athletesError || teamError || leagueError;

  const calculatedTeamValue = useMemo(() => {
    return calculateFantasyTeamValue(athletes);
  }, [athletes]);

  useEffect(() => {

    if (team) setFantasyTeam(team);
    if (league) setFantasyLeague(league);

    const sortedTeamAthletes = (athletes ?? []).sort((a, b) => {
      return a.slot - b.slot;
    });
    setFantasyTeamAthletes(sortedTeamAthletes);
    setFantasyTeamValue(calculatedTeamValue);

    // Find and set the team captain
    const captain = sortedTeamAthletes.find(athlete => athlete.is_captain);
    setTeamCaptainId(captain?.tracking_id || null);

    console.log("Team ", team);
    console.log("League ", league);
    console.log("Athletes ", athletes);
    console.log("Team Captain", captain?.player_name, captain?.tracking_id);

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


  return (
    <>
      {children}
    </>
  );
};

export const useTeamData = () => {
  const context = React.useContext(TeamDataContext);
  if (context === undefined) {
    throw new Error("useTeamData must be used within a TeamDataProvider");
  }
  return context;
};
