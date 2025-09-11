import { useAuthUser } from '../../hooks/useAuthUser';
import { leagueService } from '../../services/leagueService';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../ui/LoadingState';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { useMemo } from 'react';
import type { IFantasyLeagueRound } from '../../types/fantasyLeague';
import type { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';

const MyWeekPanel = () => {
  const user = useAuthUser();
  const navigate = useNavigate();

  // 1) Fetch public leagues and joined leagues (distinct keys)
  const { data: publicLeagues, isLoading: loadingPublicLeagues } = useSWR(
    swrFetchKeys.getAllPublicFantasyLeagues(),
    fantasyLeagueGroupsService.getAllPublicLeagues
  );

  const { data: joinedLeagues, isLoading: loadingJoinedLeagues } = useSWR(
    swrFetchKeys.getJoinedFantasyLeagueGroups(),
    fantasyLeagueGroupsService.getJoinedLeagues
  );

  // Intersection: joined public leagues only
  const joinedPublicLeagues = useMemo<FantasyLeagueGroup[] | undefined>(() => {
    if (!publicLeagues || !joinedLeagues) return undefined;
    const pubSet = new Set(publicLeagues.map(l => String(l.id)));
    return joinedLeagues.filter(l => pubSet.has(String(l.id)));
  }, [publicLeagues, joinedLeagues]);

  // 2) Batch-fetch rounds for all joined public leagues
  const joinedPublicLeagueIds = useMemo(
    () => (joinedPublicLeagues ?? []).map(l => String(l.id)),
    [joinedPublicLeagues]
  );

  const roundsKey =
    joinedPublicLeagueIds.length > 0
      ? `fantasy-league-groups/rounds/batch/${joinedPublicLeagueIds.join('-')}`
      : null;

  const { data: roundsByLeague, isLoading: loadingRounds } = useSWR<
    Record<string, IFantasyLeagueRound[]>
  >(roundsKey, async () => {
    const entries = await Promise.all(
      joinedPublicLeagueIds.map(async id => {
        const rounds = await fantasyLeagueGroupsService.getGroupRounds(id);
        return [id, rounds] as const;
      })
    );
    return Object.fromEntries(entries) as Record<string, IFantasyLeagueRound[]>;
  });

  // Helper to compute "current" round per your existing logic
  const currentRoundByLeague = useMemo(() => {
    const result: Record<string, IFantasyLeagueRound | undefined> = {};
    if (!roundsByLeague) return result;

    for (const [leagueId, rounds] of Object.entries(roundsByLeague)) {
      const openRounds = rounds.filter(r => r.is_open === true);
      if (openRounds.length > 0) {
        result[leagueId] = openRounds[0];
        continue;
      }

      const endedRounds = rounds.filter(r => r.has_ended === true);
      if (endedRounds.length === rounds.length && endedRounds.length > 0) {
        result[leagueId] = endedRounds[endedRounds.length - 1];
        continue;
      }

      result[leagueId] = undefined;
    }
    return result;
  }, [roundsByLeague]);

  // 3) For each joined public league, check if user has a team for the current round
  const userId = (user as any)?.kc_id ?? (user as any)?.id;

  const teamStatusKey =
    userId && joinedPublicLeagueIds.length > 0
      ? `fantasy-league-groups/user-round-team/batch/${userId}/${joinedPublicLeagueIds
          .map(id => `${id}:${currentRoundByLeague[id]?.id ?? 'none'}`)
          .join(',')}`
      : null;

  const { data: hasTeamByLeague, isLoading: loadingUserTeamStatus } = useSWR<
    Record<string, boolean>
  >(teamStatusKey, async () => {
    const entries = await Promise.all(
      joinedPublicLeagueIds.map(async leagueId => {
        const round = currentRoundByLeague[leagueId];
        if (!round?.id) return [leagueId, false] as const;
        const team = await leagueService.getUserRoundTeam(round.id, String(userId));
        return [leagueId, !!team] as const;
      })
    );
    return Object.fromEntries(entries) as Record<string, boolean>;
  });

  // Identify a joined public league with an open round where the user has no team
  const targetLeagueToPrompt = useMemo<FantasyLeagueGroup | undefined>(() => {
    if (!joinedPublicLeagues || !hasTeamByLeague) return undefined;
    for (const league of joinedPublicLeagues) {
      const lId = String(league.id);
      const current = currentRoundByLeague[lId];
      if (current?.is_open === true && hasTeamByLeague[lId] === false) {
        return league;
      }
    }
    return undefined;
  }, [joinedPublicLeagues, hasTeamByLeague, currentRoundByLeague]);

  // Readiness flags
  const ctaDataReady =
    !loadingPublicLeagues &&
    !loadingJoinedLeagues &&
    (!roundsKey || !loadingRounds) &&
    (!teamStatusKey || !loadingUserTeamStatus);

  // 4) Render priority:
  //    a) If CTA data ready and there is a joined public league with an open round and no team -> show CTA
  //    b) Else show prompt to discover/join/create leagues
  //    c) Else show loading
  if (!ctaDataReady) {
    return <LoadingState />;
  }

  if (targetLeagueToPrompt) {
    return (
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold mb-2">{targetLeagueToPrompt.title}</h2>
        <p className="mb-4 text-center">
          You haven't picked your team for {targetLeagueToPrompt.title} yet
        </p>
        <button
          className="bg-gradient-to-r from-white to-gray-200 via-gray-50 text-primary-800 hover:bg-opacity-90 hover:cursor-pointer font-semibold px-6 py-2 rounded-lg transition-colors"
          onClick={() =>
            navigate(`/league/${targetLeagueToPrompt.id}?journey=team-creation`, {
              state: { league: targetLeagueToPrompt },
            })
          }
        >
          Pick Your Team
        </button>
      </div>
    );
  }

  // No leagues need action -> prompt to create or join new leagues
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 via-primary-800 text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-xl font-bold mb-2">All Set!</h2>
      <p className="mb-4 text-center text-slate-300">
        You've created teams for all your joined leagues. Create or join more leagues to keep
        playing.
      </p>
      <button
        className="w-full bg-white text-primary-800 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
        onClick={() => navigate('/leagues?active_tab=discover')}
      >
        Browse Leagues
      </button>
    </div>
  );
};

export default MyWeekPanel;
