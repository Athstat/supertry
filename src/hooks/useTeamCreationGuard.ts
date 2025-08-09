import { leagueService } from '../services/leagueService';
import { IFantasyLeague, IFantasyLeagueTeam } from '../types/fantasyLeague';
import { RankedFantasyTeam } from '../types/league';
import { calculateJoinDeadline, isLeagueLocked } from '../utils/leaguesUtils';
import { useAuthUser } from './useAuthUser';
import { useFetch } from './useFetch';

type ResProps = {
  hasCreatedTeam: boolean;
  isTeamCreationLocked: boolean;
  rankedUserTeam?: RankedFantasyTeam;
  userTeam?: IFantasyLeagueTeam;
  isLoading: boolean;
};

/** Hook that can be used as a guard for team creation */
export function useTeamCreationGuard(league?: IFantasyLeague): ResProps {
  const user = useAuthUser();
  const isLocked = isLeagueLocked(league?.join_deadline);

  if (!league) {
    return {
      hasCreatedTeam: false,
      isTeamCreationLocked: isLocked,
      rankedUserTeam: undefined,
      isLoading: false,
    };
  }

  const { data, isLoading, error } = useFetch(
    'participating-teams',
    league.id,
    leagueService.fetchParticipatingTeams
  );

  const participatingTeams = data ?? [];
  let rankedUserTeam: RankedFantasyTeam | undefined;
  let userTeam: IFantasyLeagueTeam | undefined;

  participatingTeams
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .forEach((t, index) => {
      if (t.user_id === user?.kc_id) {
        rankedUserTeam = {
          userId: t.user_id,
          teamName: t.team_name ?? 'Unkown Team',
          team_id: t.team_id,
          rank: index + 1,
          overall_score: t.score ?? 0,
          weeklyPoints: t.score ?? 0,
          managerName: t.first_name + ' ' + t.last_name,
          lastRank: index + 1,
        };

        userTeam = t;
      }
    });

  return {
    hasCreatedTeam: userTeam !== undefined,
    rankedUserTeam,
    isTeamCreationLocked: isLocked,
    isLoading: isLoading,
    userTeam,
  };
}
