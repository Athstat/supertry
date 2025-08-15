import { useMemo } from 'react';
import { useAsync } from './useFetch';
import { useAuthUser } from './useAuthUser';
import { fantasyLeagueGroupsService } from '../services/fantasy/fantasyLeagueGroupsService';
import { leagueService } from '../services/leagueService';
import { IFantasyLeagueRound } from '../types/fantasyLeague';
import { isLeagueLocked } from '../utils/leaguesUtils';

export type LeaguesNeedingTeamResult = {
  needingTeamLeagues: IFantasyLeagueRound[];
  firstNeedingTeam?: IFantasyLeagueRound;
  isLoading: boolean;
  error?: string;
};

/**
 * Finds leagues (rounds) within the user's joined groups where the user has not yet created a team
 * and the league is open for team creation.
 */
export function useLeaguesNeedingTeam(): LeaguesNeedingTeamResult {
  const user = useAuthUser();
  const userId = (user as any)?.kc_id ?? (user as any)?.id;

  const fetcher = useMemo(() => {
    return async (): Promise<LeaguesNeedingTeamResult> => {
      if (!userId) {
        return { needingTeamLeagues: [], firstNeedingTeam: undefined, isLoading: false };
      }

      try {
        // 1) Joined groups
        const groups = await fantasyLeagueGroupsService.getJoinedLeagues();
        const createdGroups = await fantasyLeagueGroupsService.getMyCreatedLeagues();

        if (!groups || groups.length === 0 || !createdGroups || createdGroups.length === 0) {
          return { needingTeamLeagues: [], firstNeedingTeam: undefined, isLoading: false };
        }

        console.log('groups: ', groups);
        console.log('createdGroups: ', createdGroups);

        // 2) Rounds per group (parallel)
        const groupRoundsArrays = await Promise.all(
          groups.map(g => fantasyLeagueGroupsService.getGroupRounds(g.id))
        );
        const createdGroupRoundsArrays = await Promise.all(
          createdGroups.map(g => fantasyLeagueGroupsService.getGroupRounds(g.id))
        );

        const allRounds = groupRoundsArrays.flat().concat(createdGroupRoundsArrays.flat());

        // 3) Filter rounds that are open/available for team creation
        const openRounds = allRounds.filter(r => {
          return r.is_open && !r.is_hidden;
        });

        if (openRounds.length === 0) {
          return { needingTeamLeagues: [], firstNeedingTeam: undefined, isLoading: false };
        }

        console.log('openRounds: ', openRounds);

        // 4) For each open round, fetch teams and remove where user already has a team
        const teamsPerRound = await Promise.all(
          openRounds.map(r => leagueService.fetchParticipatingTeams(r.id))
        );

        console.log('teamsPerRound: ', teamsPerRound);

        const needingTeamRounds: IFantasyLeagueRound[] = [];

        openRounds.forEach((round, idx) => {
          const teams = teamsPerRound[idx] || [];
          console.log('teams: ', teams);
          const hasTeam = teams.some(t => t.user_id === userId);
          if (!hasTeam) needingTeamRounds.push(round);
        });

        console.log('needingTeamRounds: ', needingTeamRounds);

        // 5) Sort by most recent created date
        const sorted = needingTeamRounds.sort((a, b) => {
          const aCreated = a.created_date ? new Date(a.created_date).getTime() : 0;
          const bCreated = b.created_date ? new Date(b.created_date).getTime() : 0;
          return bCreated - aCreated;
        });

        return {
          needingTeamLeagues: sorted,
          firstNeedingTeam: sorted[0],
          isLoading: false,
        };
      } catch (e) {
        const message = (e as Error)?.message ?? 'Failed to evaluate leagues needing team';
        return {
          needingTeamLeagues: [],
          firstNeedingTeam: undefined,
          isLoading: false,
          error: message,
        };
      }
    };
  }, [userId]);

  const { data, isLoading, error } = useAsync(fetcher);

  return {
    needingTeamLeagues: data?.needingTeamLeagues ?? [],
    firstNeedingTeam: data?.firstNeedingTeam,
    isLoading,
    error,
  };
}
