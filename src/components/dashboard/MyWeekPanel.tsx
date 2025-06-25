import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuthUser } from '../../hooks/useAuthUser';
import { leagueService } from '../../services/leagueService';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../ui/LoadingState';
import { IFantasyLeague, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { activeLeaguesFilter } from '../../utils/leaguesUtils';

const MyWeekPanel = () => {
  const user = useAuthUser();
  const navigate = useNavigate();
  const { data: leagues, isLoading: isLoadingLeagues } = useFetch(
    'all-leagues',
    null,
    leagueService.getAllLeagues
  );

  // Get the first active league
  const activeLeague = activeLeaguesFilter(leagues || [])[0];

  // Fetch teams for the active league if we have one
  const { data: leagueTeams, isLoading: isLoadingTeams } = useFetch(
    'user-teams',
    activeLeague?.id,
    () =>
      activeLeague ? leagueService.fetchParticipatingTeams(activeLeague.id) : Promise.resolve([])
  );

  // Debug output
  console.log('MyWeekPanel debug:');
  console.log('user.id:', user?.id);
  console.log('leagues:', leagues);
  console.log('activeLeague:', activeLeague);
  console.log('leagueTeams:', leagueTeams);

  if (isLoadingLeagues || isLoadingTeams) {
    return <LoadingState />;
  }

  if (!activeLeague || !leagueTeams) {
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
    if (team.user_id === user.id) {
      userTeam = team;
      teamRank = index + 1;
      points = team.overall_score || 0;
    }
  });

  if (!userTeam) {
    // Show prompt to create a team
    return (
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-xl font-bold mb-2">{activeLeague.title}</h2>
        <p className="mb-4">You haven't picked your team for {activeLeague.title} yet</p>
        <button
          className="bg-gradient-to-r from-white to-gray-200 via-gray-50 text-primary-800 hover:bg-opacity-90 hover:cursor-pointer font-semibold px-6 py-2 rounded-lg transition-colors"
          onClick={() =>
            navigate(`/${activeLeague.official_league_id}/create-team`, {
              state: { league: activeLeague },
            })
          }
        >
          Pick Your Team
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="bg-blue-700/50 text-white text-sm font-semibold rounded-full px-3 py-1">
            #{teamRank}
          </div>
          <div className="bg-yellow-500/90 text-white text-sm font-semibold rounded-full px-3 py-1">
            {points} pts
          </div>
          <div className="text-white text-sm">{userTeam.athletes?.length || 0}/15</div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <h2 className="text-xl font-bold">{userTeam.team_name}</h2>
            <p className="text-sm opacity-90">{activeLeague.title}</p>
          </div>
          <div className="text-green-300 font-semibold flex items-center">
            <span className="mr-1">↑</span> {teamRank}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWeekPanel;
