import React, { useState } from 'react';
import { Star, BarChart, Zap } from 'lucide-react';

type TabType = 'top-picks' | 'hot-streak' | 'by-position';

// Example player data
const featuredPlayers = [
  {
    id: 1,
    name: 'S. Kolisi',
    team: 'Sharks',
    position: 'FL',
    score: 85,
    status: 'hot', // hot, trending, explosive
  },
  {
    id: 2,
    name: 'C. Reinach',
    team: 'Bulls',
    position: 'SH',
    score: 72,
    status: 'trending',
  },
  {
    id: 3,
    name: 'E. Etzebeth',
    team: 'Stormers',
    position: 'LO',
    score: 68,
    status: 'explosive',
  },
  {
    id: 4,
    name: 'M. Mapimpi',
    team: 'Sharks',
    position: 'WG',
    score: 81,
    status: 'hot',
  },
];

const FeaturedPlayersCarousel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('top-picks');

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

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">FEATURED PLAYERS</h3>
        <button className="text-sm text-blue-500">View All</button>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'top-picks'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('top-picks')}
        >
          Top Picks
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'hot-streak'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('hot-streak')}
        >
          Hot Streak
        </button>
        <button
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            activeTab === 'by-position'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          onClick={() => setActiveTab('by-position')}
        >
          By Position
        </button>
      </div>

      {/* Player cards carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {featuredPlayers.map(player => (
          <div key={player.id} className="min-w-[150px] rounded-lg bg-gray-800 p-4 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">
                {player.position}
              </span>
              {getStatusIcon(player.status)}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center my-2">
              <div className="w-14 h-14 bg-gray-700 rounded-full mb-2"></div>
              <h4 className="text-white font-bold">{player.name}</h4>
              <p className="text-gray-400 text-sm">{player.team}</p>
            </div>

            <div className="text-center">
              <span className="text-2xl font-bold text-white">{player.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPlayersCarousel;
