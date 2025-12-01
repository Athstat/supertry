import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { leagueService } from '../../services/leagueService';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import { FantasyLeagueGroup, FantasyLeagueGroupStanding } from '../../types/fantasyLeagueGroups';
import { IFantasyLeagueRound, FantasyLeagueTeamWithAthletes } from '../../types/fantasyLeague';
import { IFixture } from '../../types/games';

type TeamCheckResult = {
  hasTeam: boolean;
  isLoading: boolean;
  leagueGroupId?: string;
  currentRoundId?: string;
  currentGameweek?: number;
  nextDeadline?: Date;
  userStats?: {
    rank: number;
    totalPoints: number;
    localRankPercentile: number;
  };
};

/**
 * Hook to check if user has a team for a given season and get navigation info
 */
export function useDashboardTeamCheck(season?: IFantasySeason): TeamCheckResult {
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [officialLeague, setOfficialLeague] = useState<FantasyLeagueGroup | undefined>();
  const [rounds, setRounds] = useState<IFantasyLeagueRound[]>([]);
  const [standings, setStandings] = useState<FantasyLeagueGroupStanding[]>([]);
  const [currentRoundTeam, setCurrentRoundTeam] = useState<
    FantasyLeagueTeamWithAthletes | undefined
  >();
  const [currentRoundGames, setCurrentRoundGames] = useState<IFixture[]>([]);

  // Fetch official league for this season
  useEffect(() => {
    const fetchOfficialLeague = async () => {
      if (!season?.id) {
        setOfficialLeague(undefined);
        return;
      }

      setIsLoading(true);
      try {
        // Get all public leagues and filter for official league of this season
        const allLeagues = await fantasyLeagueGroupsService.getAllPublicLeagues();
        const official = allLeagues.find(
          league => league.season_id === season.id && league.type === 'official_league'
        );
        setOfficialLeague(official);
      } catch (error) {
        console.error('Error fetching official league:', error);
        setOfficialLeague(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfficialLeague();
  }, [season?.id]);

  // Fetch rounds for the official league
  useEffect(() => {
    const fetchRounds = async () => {
      if (!officialLeague?.id) {
        setRounds([]);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedRounds = await fantasyLeagueGroupsService.getGroupRounds(officialLeague.id);
        setRounds(fetchedRounds);
      } catch (error) {
        console.error('Error fetching rounds:', error);
        setRounds([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, [officialLeague?.id]);

  const { currentRound, nextRound } = useMemo(() => {
    if (!rounds || rounds.length === 0) return { currentRound: undefined, nextRound: undefined };

    const sortedRounds = [...rounds].sort((a, b) => {
      return (a.start_round ?? 0) - (b.start_round ?? 0);
    });

    // Find first open round or last ended round
    const openRounds = sortedRounds.filter(r => r.is_open === true);
    let current: IFantasyLeagueRound | undefined;

    if (openRounds.length > 0) {
      current = openRounds[0];
    } else {
      const endedRounds = sortedRounds.filter(r => r.has_ended === true);
      if (endedRounds.length > 0) {
        current = endedRounds[endedRounds.length - 1];
      } else {
        current = sortedRounds[0];
      }
    }

    // Find the next round after current
    let next: IFantasyLeagueRound | undefined;
    if (current) {
      const currentIndex = sortedRounds.findIndex(r => r.id === current!.id);
      if (currentIndex >= 0 && currentIndex < sortedRounds.length - 1) {
        next = sortedRounds[currentIndex + 1];
      }
    }

    return { currentRound: current, nextRound: next };
  }, [rounds]);

  // Fetch standings to check if user has a team
  useEffect(() => {
    const fetchStandings = async () => {
      if (!officialLeague?.id) {
        setStandings([]);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedStandings = await fantasyLeagueGroupsService.getGroupStandings(
          officialLeague.id
        );
        setStandings(fetchedStandings);
      } catch (error) {
        console.error('Error fetching standings:', error);
        setStandings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandings();
  }, [officialLeague?.id]);

  // Fetch user's team for the current round to determine if they have a team picked
  useEffect(() => {
    const fetchCurrentRoundTeam = async () => {
      if (!currentRound?.id || !authUser?.kc_id) {
        setCurrentRoundTeam(undefined);
        return;
      }

      setIsLoading(true);
      try {
        const team = await leagueService.getUserRoundTeam(currentRound.id, authUser.kc_id);
        setCurrentRoundTeam(team);
      } catch (error) {
        console.error('Error fetching current round team:', error);
        setCurrentRoundTeam(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentRoundTeam();
  }, [currentRound?.id, authUser?.kc_id]);

  // Fetch games for the current round to calculate deadline
  useEffect(() => {
    const fetchCurrentRoundGames = async () => {
      if (!officialLeague?.id || !currentRound?.id) {
        setCurrentRoundGames([]);
        return;
      }

      try {
        const games = await fantasyLeagueGroupsService.getGroupRoundGames(
          officialLeague.id,
          currentRound.id
        );
        setCurrentRoundGames(games);
        console.log('current round games: ', games);
      } catch (error) {
        console.error('Error fetching current round games:', error);
        setCurrentRoundGames([]);
      }
    };

    fetchCurrentRoundGames();
  }, [officialLeague?.id, currentRound?.id]);

  // Calculate deadline based on last game time + 24 hours
  const calculatedDeadline = useMemo(() => {
    if (!currentRoundGames || currentRoundGames.length === 0) return undefined;

    // Filter games with valid kickoff times and sort by kickoff time
    const gamesWithKickoff = currentRoundGames
      .filter(game => game.kickoff_time)
      .sort((a, b) => {
        const timeA = new Date(a.kickoff_time!).getTime();
        const timeB = new Date(b.kickoff_time!).getTime();
        return timeB - timeA; // Sort descending to get latest first
      });

    if (gamesWithKickoff.length === 0) return undefined;

    // Get the last (latest) game
    const lastGame = gamesWithKickoff[0];
    const lastGameTime = new Date(lastGame.kickoff_time!);

    // Add 24 hours
    const deadline = new Date(lastGameTime.getTime() + 24 * 60 * 60 * 1000);

    return deadline;
  }, [currentRoundGames]);

  const userStanding = useMemo(() => {
    if (!standings || !authUser?.kc_id) return undefined;
    return standings.find(standing => standing.user_id === authUser.kc_id);
  }, [standings, authUser]);

  const userStats = useMemo(() => {
    if (!userStanding || !standings) return undefined;

    const totalUsers = standings.length;
    const rank = userStanding.rank;
    const localRankPercentile = totalUsers > 0 ? (rank / totalUsers) * 100 : 0;

    // Use current round team points if available, otherwise use total score
    const roundPoints = currentRoundTeam?.overall_score ?? userStanding.total_score ?? 0;

    return {
      rank: rank,
      totalPoints: roundPoints,
      localRankPercentile: Math.round(localRankPercentile),
    };
  }, [userStanding, standings, currentRoundTeam]);

  // Check if user has a team for the CURRENT round (not just overall league participation)
  const hasTeam = !!currentRoundTeam;

  return {
    hasTeam,
    isLoading,
    leagueGroupId: officialLeague?.id,
    currentRoundId: currentRound?.id,
    currentGameweek: currentRound?.start_round ?? currentRound?.current_gameweek,
    nextDeadline: calculatedDeadline ?? nextRound?.join_deadline ?? undefined,
    userStats,
  };
}
