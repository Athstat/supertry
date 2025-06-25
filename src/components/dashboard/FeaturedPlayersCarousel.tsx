import React, { useState, useEffect } from 'react';
import { Users, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { athleteService } from '../../services/athleteService';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { leagueService } from '../../services/leagueService';
import { activeLeaguesFilter } from '../../utils/leaguesUtils';
import { PlayerGameCard } from '../player/PlayerGameCard';

type TabType = 'top-picks' | 'hot-streak' | 'by-position';

const FeaturedPlayersCarousel = () => {
  const navigate = useNavigate();
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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-700" />
          FEATURED PLAYERS
        </h3>
        <button onClick={() => navigate('/players')} className="text-sm text-primary-700">
          View All
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-col py-12">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="mt-3 text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex space-x-2 mb-4 overflow-x-auto px-4 sm:px-0 -mx-4 sm:mx-0">
            <button
              className={`px-3 py-1.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === 'top-picks'
                  ? 'bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('top-picks')}
            >
              Top Picks
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeTab === 'hot-streak'
                  ? 'bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('hot-streak')}
            >
              Hot Streak
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
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
          <div className="flex space-x-3 overflow-x-auto -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
            {players.slice(0, 5).map(player => (
              <div key={player.id} className="pl-1 flex-shrink-0">
                <PlayerGameCard
                  player={player}
                  className="w-[140px] sm:w-[160px] h-[200px] sm:h-[220px]"
                  blockGlow={true}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedPlayersCarousel;
