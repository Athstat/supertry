import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useAuthUser } from '../../hooks/useAuthUser';
import { leagueService } from '../../services/leagueService';
import { useNavigate } from 'react-router-dom';
import { LoadingState } from '../ui/LoadingState';
import { IFantasyLeague, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { activeLeaguesFilter } from '../../utils/leaguesUtils';

const MyWeekPanel = () => {
  const navigate = useNavigate();

  // Dummy league and team data
  const dummyLeague = {
    id: 'dummy-league-1',
    title: 'Rugby Africa Cup 2025',
    official_league_id: 'africa-cup-2025',
  };

  const dummyUserTeam = {
    team_name: 'Lions Pride',
    overall_score: 287,
    athletes: new Array(13).fill(null), // 13 out of 15 players selected
    user_id: 'current-user',
  };

  const teamRank = 3;
  const points = 287;

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <div className="bg-blue-700/50 text-white text-sm font-semibold rounded-full px-3 py-1">
            #{teamRank}
          </div>
          <div className="bg-yellow-500/90 text-white text-sm font-semibold rounded-full px-3 py-1">
            {points} pts
          </div>
          <div className="text-white text-sm">{dummyUserTeam.athletes?.length || 0}/15</div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            <h2 className="text-xl font-bold">{dummyUserTeam.team_name}</h2>
            <p className="text-sm opacity-90">{dummyLeague.title}</p>
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
