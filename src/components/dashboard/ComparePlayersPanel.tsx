import { useState } from 'react';
import { BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { useAthletes } from '../../contexts/AthleteContext';
import { PlayerGameCard } from '../player/PlayerGameCard';
import PlayerCompareModal from '../players/compare/PlayerCompareModal';
import { twMerge } from 'tailwind-merge';
import { PlayerSearch } from '../players/PlayerSearch';
import { Infinity } from 'lucide-react';

const ComparePlayersPanel = () => {
  const navigate = useNavigate();
  let { athletes } = useAthletes();
  const [selectedPlayers, setSelectedPlayers] = useState<RugbyPlayer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Always in compare mode
  const clearSelections = () => setSelectedPlayers([]);

  const handlePlayerClick = (player: RugbyPlayer) => {
    const isSelectedAlready = selectedPlayers.find(p => p.tracking_id === player.tracking_id);
    if (isSelectedAlready) {
      const newList = selectedPlayers.filter(p => p.tracking_id !== player.tracking_id);
      setSelectedPlayers(newList);
    } else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const onRemovePlayerFromSelectedPlayers = (player: RugbyPlayer) => {
    const newList = selectedPlayers.filter(p => p.tracking_id !== player.tracking_id);
    setSelectedPlayers(newList);
  };

  const onClear = () => {
    clearSelections();
  };

  // Shuffle athletes array deterministically every 5 hours using a seeded shuffle
  function seededRandom(seed: number) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function seededShuffle<T>(array: T[], seed: number): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Use the current 5-hour window as the seed
  const now = Date.now();
  const fiveHourWindow = Math.floor(now / (1000 * 60 * 60 * 5));
  athletes = seededShuffle(athletes, fiveHourWindow);

  // Filter players by search query
  const [manualShuffleSeed, setManualShuffleSeed] = useState<number | null>(null);

  // Compute the seed: use manual if set, else default 5-hour window
  const effectiveSeed = manualShuffleSeed !== null ? manualShuffleSeed : fiveHourWindow;
  const shuffledAthletes = seededShuffle(athletes, effectiveSeed);

  // Shuffle button handler
  const handleShufflePlayers = () => {
    setManualShuffleSeed(Date.now());
  };

  const filteredPlayers = shuffledAthletes.filter(player => {
    const query = searchQuery.toLowerCase();
    return (
      player.player_name?.toLowerCase().includes(query) ||
      player.team_name?.toLowerCase().includes(query) ||
      player.position_class?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <BarChart className="w-4 h-4 text-primary-700 dark:text-primary-400" />
          COMPARE PLAYERS
        </h3>
        <div className="flex gap-2">

          <button
            onClick={handleShufflePlayers}
            className="text-xs px-3 py-1 flex flex-row items-center gap-1 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 border border-primary-200 dark:border-primary-700 transition"
            title="Shuffle Players"
          >
            Shuffle
            <Infinity />
          </button>

          <button
            onClick={() => navigate('/players?tab=compare')}
            className="text-sm text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            View All
          </button>
          
        </div>
      </div>

      <div className="rounded-xl bg-white  dark:bg-gray-900 overflow-hidden shadow-md dark:shadow-none border border-gray-200 dark:border-slate-700">
        <div className="p-4">
          {/* Player Search */}
          <div className="mb-4">
            <PlayerSearch searchQuery={searchQuery} onSearch={setSearchQuery} />
          </div>

          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {selectedPlayers.length === 0
                ? 'Select two players to compare'
                : `Selected ${selectedPlayers.length}/2 players`}
            </p>
            {selectedPlayers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map(player => (
                  <div
                    key={player.tracking_id}
                    className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-gray-900 dark:text-white">
                      {player.player_name}
                    </span>
                    <button
                      onClick={() => onRemovePlayerFromSelectedPlayers(player)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPlayers.slice(0, 6).map(player => (
              <PlayerGameCard
                key={player.tracking_id}
                player={player}
                onClick={() => handlePlayerClick(player)}
                className={twMerge(
                  'h-[200px] cursor-pointer transition-all',
                  'hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400',
                  selectedPlayers.some(p => p.tracking_id === player.tracking_id) &&
                    'ring-2 ring-primary-500 dark:ring-primary-400'
                )}
              />
            ))}
          </div>

          <PlayerCompareModal
            selectedPlayers={selectedPlayers}
            open={selectedPlayers.length >= 2}
            onClose={onClear}
            onRemove={onRemovePlayerFromSelectedPlayers}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparePlayersPanel;
