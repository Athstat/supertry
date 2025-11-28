import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import { FantasyLeagueGroup, FantasyLeagueGroupStanding } from '../../types/fantasyLeagueGroups';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';

type TeamCheckResult = {
  hasTeam: boolean;
  isLoading: boolean;
  leagueGroupId?: string;
  currentRoundId?: string;
  currentGameweek?: number;
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

  const currentRound = useMemo(() => {
    if (!rounds || rounds.length === 0) return undefined;

    const sortedRounds = [...rounds].sort((a, b) => {
      return (a.start_round ?? 0) - (b.start_round ?? 0);
    });

    // Find first open round or last ended round
    const openRounds = sortedRounds.filter(r => r.is_open === true);
    if (openRounds.length > 0) return openRounds[0];

    const endedRounds = sortedRounds.filter(r => r.has_ended === true);
    if (endedRounds.length > 0) return endedRounds[endedRounds.length - 1];

    return sortedRounds[0];
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

  const userStanding = useMemo(() => {
    if (!standings || !authUser?.kc_id) return undefined;
    return standings.find(standing => standing.user_id === authUser.kc_id);
  }, [standings, authUser]);

  const userStats = useMemo(() => {
    if (!userStanding || !standings) return undefined;

    const totalUsers = standings.length;
    const rank = userStanding.rank;
    const localRankPercentile = totalUsers > 0 ? (rank / totalUsers) * 100 : 0;

    return {
      rank: rank,
      totalPoints: userStanding.total_score ?? 0,
      localRankPercentile: Math.round(localRankPercentile),
    };
  }, [userStanding, standings]);

  const hasTeam = !!userStanding;

  return {
    hasTeam,
    isLoading,
    leagueGroupId: officialLeague?.id,
    currentRoundId: currentRound?.id,
    currentGameweek: currentRound?.current_gameweek,
    userStats,
  };
}
