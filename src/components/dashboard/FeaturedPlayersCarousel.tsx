import React, { useState, useEffect } from 'react';
import { Star, BarChart, Zap } from 'lucide-react';
import { athleteService } from '../../services/athleteService';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { leagueService } from '../../services/leagueService';
import { activeLeaguesFilter } from '../../utils/leaguesUtils';

type TabType = 'top-picks' | 'hot-streak' | 'by-position';

const FeaturedPlayersCarousel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('top-picks');
  const [players, setPlayers] = useState<RugbyPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const leagues = await leagueService.getAllLeagues();
        // const activeLeague = activeLeaguesFilter(leagues)[0];
        // if (!activeLeague) {
        //   console.error('No active league found');
        //   setLoading(false);
        //   return;
        // }
        // const athletes = await athleteService.getRugbyAthletesByCompetition(
        //   activeLeague.official_league_id.toString()
        // );
        const athletes = await athleteService.getRugbyAthletesByCompetition(
          leagues[0].official_league_id.toString()
        );
        setPlayers(athletes);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'trending':
        return <BarChart className="w-4 h-4 text-blue-400" />;
      case 'explosive':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">FEATURED PLAYERS</h3>
        <button className="text-sm text-primary-700">View All</button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'top-picks'
              ? 'bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('top-picks')}
        >
          Top Picks
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'hot-streak'
              ? 'bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('hot-streak')}
        >
          Hot Streak
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'by-position'
              ? 'bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('by-position')}
        >
          By Position
        </button>
      </div>

      {/* Player cards carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {players.slice(0, 4).map(player => (
          <div key={player.id} className="min-w-[150px] rounded-lg bg-gray-800 p-4 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                {player.position || player.position_class}
              </span>
              {getStatusIcon('hot')}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center my-2">
              <div className="w-14 h-14 bg-gray-700 rounded-full mb-2">
                <img
                  src={player.image_url}
                  alt={player.player_name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="text-white font-bold whitespace-nowrap">{player.player_name}</h4>
              <p className="text-gray-400 text-sm">{player.team_name}</p>
            </div>

            <div className="text-center">
              <span className="text-2xl font-bold text-white">{player.power_rank_rating || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlayersCarousel;
