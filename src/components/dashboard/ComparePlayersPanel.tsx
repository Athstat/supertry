import React, { useState } from 'react';

// Sample player data
const players = [
  {
    id: 1,
    name: 'S. Kolisi',
    team: 'SHK',
    position: 'FL',
    stats: { tries: 3, assists: 2, tackles: 24 },
  },
  {
    id: 2,
    name: 'C. Reinach',
    team: 'BUL',
    position: 'SH',
    stats: { tries: 5, assists: 8, tackles: 12 },
  },
  {
    id: 3,
    name: 'E. Etzebeth',
    team: 'STO',
    position: 'LO',
    stats: { tries: 1, assists: 0, tackles: 18 },
  },
];

const ComparePlayersPanel = () => {
  const [selectedPlayer1, setSelectedPlayer1] = useState<number | null>(1);
  const [selectedPlayer2, setSelectedPlayer2] = useState<number | null>(null);

  const getPlayer = (id: number | null) => {
    if (!id) return null;
    return players.find(player => player.id === id) || null;
  };

  const player1 = getPlayer(selectedPlayer1);
  const player2 = getPlayer(selectedPlayer2);
  const canCompare = player1 && player2;

  return (
    <div className="rounded-xl bg-gray-900 text-white overflow-hidden">
      <div className="p-4">
        <h3 className="text-base font-medium mb-4">COMPARE PLAYERS</h3>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Player 1 selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">First Player</label>
            <select
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={selectedPlayer1 || ''}
              onChange={e => setSelectedPlayer1(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Select player</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.team}) - {player.position}
                </option>
              ))}
            </select>
          </div>

          {/* Player 2 selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Second Player</label>
            <select
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              value={selectedPlayer2 || ''}
              onChange={e => setSelectedPlayer2(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Select player</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.team}) - {player.position}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats comparison */}
        {player1 && (
          <div className="mt-4 border-t border-gray-800 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-bold">{player1.name}</h4>
                <p className="text-sm text-gray-400">{player1.team}</p>
                <div className="mt-2">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Tries</span>
                    <span className="font-medium">{player1.stats.tries}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Assists</span>
                    <span className="font-medium">{player1.stats.assists}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Tackles</span>
                    <span className="font-medium">{player1.stats.tackles}</span>
                  </div>
                </div>
              </div>

              {player2 ? (
                <div>
                  <h4 className="text-lg font-bold">{player2.name}</h4>
                  <p className="text-sm text-gray-400">{player2.team}</p>
                  <div className="mt-2">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Tries</span>
                      <span className="font-medium">{player2.stats.tries}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Assists</span>
                      <span className="font-medium">{player2.stats.assists}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Tackles</span>
                      <span className="font-medium">{player2.stats.tackles}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">Select second player to compare</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <button
            className={`px-6 py-2 rounded-md font-medium ${
              canCompare
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canCompare}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparePlayersPanel;
