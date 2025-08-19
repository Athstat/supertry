import { useFetch } from '../../hooks/useFetch';
import { useAuthUser } from '../../hooks/useAuthUser';
import { leagueService } from '../../services/leagueService';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../ui/LoadingState';
import { IFantasyLeagueTeam } from '../../types/fantasyLeague';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { useEffect, useMemo, useState } from 'react';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import BlueGradientCard from '../shared/BlueGradientCard';

const MyWeekPanel = () => {
  const user = useAuthUser();
  const navigate = useNavigate();
  const { data: leagues, isLoading: isLoadingLeagues } = useFetch(
    'all-leagues',
    null,
    leagueService.getAllLeagues
  );

  const featuredLeagueId: string = import.meta.env.VITE_FEATURE_LEAGUE_GROUP_ID ?? '';

  const groupKey = swrFetchKeys.getFantasyLeagueGroupById(featuredLeagueId);
  const { data: league, isLoading: loadingGroup } = useSWR(groupKey, () =>
    fantasyLeagueGroupsService.getGroupById(featuredLeagueId)
  );

  const [rounds, setRounds] = useState<IFantasyLeagueRound[]>([]);

  // Fetch rounds for the active league if we have one
  useEffect(() => {
    if (!league) return;

    const loadRounds = async () => {
      try {
        const response = await fantasyLeagueGroupsService.getGroupRounds(league.id);
        setRounds(response);
      } catch (e) {
        // Optionally handle/log error
      }
    };

    loadRounds();
  }, [league]);

  const currentRound = useMemo(() => {
    const openRounds = rounds.filter(r => {
      return r.is_open === true;
    });

    if (openRounds.length > 0) {
      return openRounds[0];
    }

    const endedRounds = rounds.filter(r => {
      return r.has_ended === true;
    });

    if (endedRounds.length === rounds.length) {
      return endedRounds[endedRounds.length - 1];
    }

    return undefined;
  }, [rounds]);

  // Fetch teams for the active league+round only when ready
  const canFetchTeams = !!league && !!currentRound?.id;
  const { data: leagueTeams, isLoading: isLoadingTeams } = useFetch<IFantasyLeagueTeam[]>(
    'user-teams',
    canFetchTeams ? `${league!.id}:${currentRound!.id}` : undefined,
    () => leagueService.fetchParticipatingTeams(currentRound!.id)
  );

  // Wait until group loaded, round determined, and teams fetched
  if (isLoadingLeagues || loadingGroup || !canFetchTeams || isLoadingTeams) {
    return <LoadingState />;
  }

  // If we still have no leagueTeams after loading, show the CTA to browse leagues
  if (!leagueTeams) {
    return (
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 via-primary-800 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold mb-2">No Active League</h2>
        <p className="mb-4 text-center text-slate-300">
          Join a league to start competing and track your team's performance
        </p>
        <button
          className="w-full bg-white text-primary-800 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={() => navigate('/leagues')}
        >
          Browse Leagues
        </button>
      </div>
    );
  }

  // Find user's team and rank
  let userTeam: IFantasyLeagueTeam | undefined;
  let teamRank = 0;
  let points = 0;

  leagueTeams.forEach((team, index) => {
    const uid = (user as any)?.kc_id ?? (user as any)?.id;
    if (team.user_id === uid) {
      userTeam = team;
      teamRank = index + 1;
      points = team.overall_score || 0;
    }
  });

  if (!userTeam) {
    // Show prompt to create a team
    return (
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold mb-2">{league?.title}</h2>
        <p className="mb-4 text-center">You haven't picked your team for {league?.title} yet</p>
        <button
          className="bg-gradient-to-r from-white to-gray-200 via-gray-50 text-primary-800 hover:bg-opacity-90 hover:cursor-pointer font-semibold px-6 py-2 rounded-lg transition-colors"
          onClick={() =>
            navigate(`/league/${league?.id}?journey=team-creation`, {
              state: { league: league },
            })
          }
        >
          Pick Your Team
        </button>
      </div>
    );
  }

  return (
    <BlueGradientCard>
      <div onClick={() => navigate(`/league/${league?.id}`)} className="cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="bg-blue-700/50 text-white text-sm font-semibold rounded-full py-1 px-4">
            #{teamRank}
          </div>

          <div className="bg-yellow-500/90 text-white text-sm font-semibold rounded-full py-1 px-4">
            {points} pts
          </div>
          <div className="text-white text-sm">{userTeam.athletes?.length || 0}/6</div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <h2 className="text-xl font-bold">{userTeam.team_name}</h2>
            <p className="text-sm opacity-90">{league?.title}</p>
          </div>
          {/* <div className="text-green-300 font-semibold flex items-center">
          <span className="mr-1">↑</span> {teamRank}
        </div> */}
        </div>
      </div>
    </BlueGradientCard>
  );
};

export default MyWeekPanel;
