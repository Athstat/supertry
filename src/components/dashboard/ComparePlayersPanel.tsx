import { useState } from 'react';
import { BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlayerGameCard } from '../player/PlayerGameCard';
import PlayerProfileModal from '../player/PlayerProfileModal';
// import PlayerCompareModal from '../players/compare/PlayerCompareModal'; // old compare modal
import { twMerge } from 'tailwind-merge';
import { PlayerSearch } from '../players/PlayerSearch';
import { Infinity } from 'lucide-react';
// import { X } from 'lucide-react'; // used in old selectedPlayers pill list
import { IProAthlete } from '../../types/athletes';
import { LoadingState } from '../ui/LoadingState';
import { useAthletes } from '../../contexts/AthleteContext';
import PlayerCompareProvider from '../players/compare/PlayerCompareProvider';
import { usePlayerCompareActions } from '../../hooks/usePlayerCompare';
import { useAtomValue } from 'jotai';
import { comparePlayersAtomGroup } from '../../state/comparePlayers.atoms';
// import PrimaryButton from '../shared/buttons/PrimaryButton'; // old compare button
// import { ArrowLeftRight } from 'lucide-react'; // old compare button icon
import { useDeterministicShuffle } from '../../hooks/useShuffle';

export default function ComparePlayersPanel() {
  return (
    <PlayerCompareProvider>
      <PanelContent />
    </PlayerCompareProvider>
  );
}

function PanelContent() {
  const navigate = useNavigate();
  const minimumRatings = 85;
  let { athletes, isLoading } = useAthletes();

  const selectedPlayers = useAtomValue(comparePlayersAtomGroup.comparePlayersAtom);

  // const { clearSelections, addOrRemovePlayer, removePlayer, showCompareModal } = usePlayerCompareActions(); // old compare logic
  const { clearSelections } = usePlayerCompareActions();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [activePlayer, setActivePlayer] = useState<IProAthlete | null>(null);

  let { shuffledArr: shuffledAthletes, triggerShuffle } = useDeterministicShuffle(athletes);

  shuffledAthletes = shuffledAthletes.filter(f => {
    return (f.power_rank_rating ?? 0) > minimumRatings;
  });

  const handlePlayerClick = (player: IProAthlete) => {
    // addOrRemovePlayer(player); // old compare selection behavior
    setActivePlayer(player);
    setProfileOpen(true);
  };

  const handleShuffle = () => {
    triggerShuffle();
    clearSelections();
  };

  const filteredPlayers = shuffledAthletes.filter(player => {
    const query = searchQuery.toLowerCase();
    return (
      player.player_name?.toLowerCase().includes(query) ||
      player.team.athstat_name?.toLowerCase().includes(query) ||
      player.position_class?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <BarChart className="w-4 h-4 text-primary-700 dark:text-primary-400" />
          Players
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleShuffle}
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

          {/* <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {selectedPlayers.length === 0
                ? 'Select players to compare'
                : `Selected ${selectedPlayers.length} players`}
            </p>

            {selectedPlayers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPlayers.map(player => (
                  <div
                    key={player.tracking_id}
                    className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full"
                  >
                    <span className="text-xs lg:text-sm text-gray-900 dark:text-white">
                      {player.player_name}
                    </span>
                    <button
                      onClick={() => removePlayer(player)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-lg font-bold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* {selectedPlayers.length > 0 && (
            <PrimaryButton className="mb-4" onClick={showCompareModal}>
              Compare
              <ArrowLeftRight className="w-4 h-4" />
            </PrimaryButton>
          )} */}

          {isLoading && <LoadingState />}

          <div className="grid grid-cols-2 md:grid-cols-3">
            {filteredPlayers.slice(0, 6).map(player => (
              <PlayerGameCard
                key={player.tracking_id}
                player={player}
                onClick={() => handlePlayerClick(player)}
                className={twMerge(
                  'h-[260px] cursor-pointer transition-all',
                  selectedPlayers.some(p => p.tracking_id === player.tracking_id) &&
                    'ring-2 ring-primary-500 dark:ring-primary-400'
                )}
                priceClassName="top-14 left-5"
                teamLogoClassName="top-8 right-2"
                frameClassName="object-contain object-center"
                detailsClassName="px-6 pb-12"
              />
            ))}
          </div>
          {/* <PlayerCompareModal /> */}

          {activePlayer && (
            <PlayerProfileModal
              player={activePlayer}
              isOpen={profileOpen}
              onClose={() => setProfileOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
