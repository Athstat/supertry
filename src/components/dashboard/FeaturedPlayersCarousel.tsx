import { useState, useEffect } from 'react';
import { Users, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlayerGameCard } from '../player/PlayerGameCard';
import PlayerProfileModal from '../player/PlayerProfileModal';
import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
import { IProAthlete } from '../../types/athletes';

// type TabType = 'top-picks' | 'hot-streak' | 'by-position';

const FeaturedPlayersCarousel = () => {
  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState<TabType>('top-picks');
  const [players, setPlayers] = useState<IProAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const handleClosePlayerModal = () => {
    setPlayerModalPlayer(undefined);
    setShowPlayerModal(false);
  };

  const handlePlayerClick = (player: IProAthlete) => {
    setPlayerModalPlayer(player);
    setShowPlayerModal(true);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Specific athlete IDs for featured players
        const featuredPlayerIds = [
          'ec778da5-62ff-532b-ab6f-ac60eff2bca7', // Jordie Barrett
          '897ab081-62b8-5b42-95ef-c7c3f150759c', // Andre Esterhuizen
          '57054090-6c0c-57d9-bdb9-0f209f7b61d9', // Vincent Tshituka
          'dd86410c-80fa-539e-9bd1-af3c52d0b090', // Dan Sheehan
          'fc883a37-8b03-53f9-a6cb-7f2ee70638e9', // Negri
        ];

        // Fetch each player by their specific ID
        const playerPromises = featuredPlayerIds.map(id => djangoAthleteService.getAthleteById(id));

        const fetchedPlayers = await Promise.all(playerPromises);

        // Filter out any undefined results (in case some players aren't found)
        const validPlayers = fetchedPlayers.filter(player => player !== undefined);

        setPlayers(validPlayers);
      } catch (error) {
        console.error('Error fetching featured players:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // const sortedAthletes = useMemo(() => {
  //   return players.sort((a, b) => {
  //     return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0);
  //   })
  // }, [players])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Users className="w-4 h-4 text-primary-500" />
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
          {/* Filter tabs - commented out as requested */}
          {/* <div className="flex space-x-2 mb-4 overflow-x-auto px-4 sm:px-0 -mx-4 sm:mx-0">
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
          </div> */}

          {/* Player cards carousel - showing featured players only */}
          <div className="flex space-x-3 h-[230px] items-center justify-start overflow-x-auto -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
            {players.map(player => (
              <div key={player.tracking_id} className="pl-1 flex-shrink-0">
                <PlayerGameCard
                  player={player}
                  onClick={() => handlePlayerClick(player)}
                  className="w-[140px] sm:w-[160px] h-[200px] sm:h-[220px]"
                  blockGlow={true}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {playerModalPlayer && (
        <PlayerProfileModal
          onClose={handleClosePlayerModal}
          player={playerModalPlayer}
          isOpen={playerModalPlayer !== undefined && showPlayerModal}
        />
      )}
    </div>
  );
};

export default FeaturedPlayersCarousel;
