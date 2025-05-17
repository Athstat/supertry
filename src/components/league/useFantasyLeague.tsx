import { useEffect, useState } from "react";
import { IFantasyLeague, IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { LeagueInfo, RankedFantasyTeam } from "../../types/league";
import { authService } from "../../services/authService";
import { useLocation, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { leagueService } from "../../services/leagueService";
import { isLeagueLocked } from "../../utils/leaguesUtils";
import { useAuthUser } from "../../hooks/useAuthUser";

/** Hook for fetching league information on league screen */
export function useFantasyLeague(leagueFromParam?: IFantasyLeague) {
  const { state } = useLocation();
  const { leagueId } = useParams();

  const league =
    leagueFromParam ?? state.league
      ? (state.league as IFantasyLeague)
      : undefined;

  const {
    data: teams,
    isLoading: loadingTeams,
    error: teamsError,
  } = useFetch(
    "participating-teams",
    league?.id ?? "fall-back-id",
    teamsFetcher
  );

  console.log("teams", teams);

  const [isLoadingUserTeam, setIsUserTeamLoading] = useState(false);
  const [userTeam, setUserTeam] = useState<RankedFantasyTeam>();

  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo>({
    name: "Loading...",
    type: "Public",
    currentGameweek: 0,
    totalGameweeks: 0,
    totalTeams: 0,
    prizePool: "$0",
  });

  const user = authService.getUserInfo();

  useEffect(() => {
    setIsUserTeamLoading(true);

    let userTeamTemp: RankedFantasyTeam | undefined;

    if (teams && user) {
      teams.forEach((t) => {
        if (t.userId === user.id) {
          userTeamTemp = t;
        }
      });
    }

    setLeagueInfo({
      name: league?.title || "League",
      type: league?.is_private ? "Private" : "Public",
      currentGameweek: league?.current_gameweek || 0,
      totalGameweeks: league?.total_gameweeks || 0,
      totalTeams: teams?.length ?? 0,
      prizePool: formatPrizePool(league),
      userRank: userTeamTemp?.rank,
      joinDeadline: league?.join_deadline,
    });

    setUserTeam(userTeamTemp);

    setIsUserTeamLoading(false);
  }, [leagueId, league, teams]);

  const isLocked = isLeagueLocked(league?.join_deadline);

  return {
    userTeam,
    isLoading: isLoadingUserTeam || loadingTeams,
    leagueInfo,
    league,
    teams: teams ?? [],
    error: teamsError,
    isLocked,
  };
}

export async function teamsFetcher(
  leagueId: string | number
): Promise<RankedFantasyTeam[]> {
  const teams = await leagueService.fetchParticipatingTeams(leagueId);

  //console.log("Fantasy League teams returned ", teams);

  const user = authService.getUserInfo();

  return teams.map((team, index) => {
    const rankedTeam: RankedFantasyTeam = {
      team_id: team.team_id.toString() ?? "",
      rank: team.rank,
      teamName: team.team_name || `Team ${index + 1}`,
      managerName: team.first_name + " " + team.last_name,
      overall_score: team.overall_score,
      weeklyPoints: team.overall_score,
      lastRank: team.rank, // TODO: update this
      isUserTeam: user ? user.id === team.user_id : false,
      userId: team.user_id,
    };

    return rankedTeam;
  });
}

const formatPrizePool = (league: any): string => {
  if (!league) return "$0";
  if (league.reward_description) return league.reward_description;
  return league.reward_type === "cash"
    ? `$${(league.entry_fee || 0) * (league.participants_count || 0)}`
    : "N/A";
};

/** Hook that gets the users team in a league */
export function useUserFantasyTeam(league: IFantasyLeague) {
  // get teams participating in league
  // Get user using use auth
  // get users team

  let userTeam: IFantasyLeagueTeam | undefined;
  let rankedUserTeam: RankedFantasyTeam | undefined;

  const user = useAuthUser();
  const { data, isLoading, error } = useFetch(
    "teams",
    league.id,
    leagueService.fetchParticipatingTeams
  );

  const teams = data ?? [];

  teams.forEach((team, index) => {
    if (team.user_id === user.id) {
      rankedUserTeam = {
        team_id: team.team_id.toString() ?? "",
        rank: team.rank,
        teamName: team.team_name || `Team ${index + 1}`,
        managerName: team.first_name + " " + team.last_name,
        overall_score: team.overall_score,
        weeklyPoints: team.overall_score,
        lastRank: team.rank, // TODO: update this
        isUserTeam: user ? user.id === team.user_id : false,
        userId: team.user_id,
      };

      userTeam = team;
    }
  });

  return { isLoading, userTeam, rankedUserTeam, error };
}
