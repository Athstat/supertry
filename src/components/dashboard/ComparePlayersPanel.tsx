import React, { useState } from 'react';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { useAthletes } from '../../contexts/AthleteContext';
import { PlayerGameCard } from '../player/PlayerGameCard';
import PlayerCompareModal from '../players/compare/PlayerCompareModal';
import { twMerge } from 'tailwind-merge';
import { PlayerSearch } from '../players/PlayerSearch';

const ComparePlayersPanel = () => {
  const { athletes } = useAthletes();
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

  // Filter players by search query
  const filteredPlayers = athletes.filter(player => {
    const query = searchQuery.toLowerCase();
    return (
      player.player_name?.toLowerCase().includes(query) ||
      player.team_name?.toLowerCase().includes(query) ||
      player.position_class?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="rounded-xl bg-gray-900 text-white overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-medium">COMPARE PLAYERS</h3>
        </div>

        {/* Player Search */}
        <div className="mb-4">
          <PlayerSearch searchQuery={searchQuery} onSearch={setSearchQuery} />
        </div>

        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">
            {selectedPlayers.length === 0
              ? 'Select two players to compare'
              : `Selected ${selectedPlayers.length}/2 players`}
          </p>
          {selectedPlayers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedPlayers.map(player => (
                <div
                  key={player.tracking_id}
                  className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{player.player_name}</span>
                  <button
                    onClick={() => onRemovePlayerFromSelectedPlayers(player)}
                    className="text-gray-400 hover:text-white"
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
                'hover:ring-2 hover:ring-primary-500',
                selectedPlayers.some(p => p.tracking_id === player.tracking_id) &&
                  'ring-2 ring-primary-500'
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
  );
};

export default ComparePlayersPanel;
