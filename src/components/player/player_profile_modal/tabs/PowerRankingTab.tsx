import React from 'react';

interface PowerRankingTabProps {
  player: any;
}

export const PowerRankingTab: React.FC<PowerRankingTabProps> = ({ player }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-1">
        {player.power_rank_rating?.toFixed(1) || 'N/A'}
      </div>
      <div className="text-gray-600 dark:text-gray-400">
        Overall Power Ranking
      </div>
    </div>
  );
};

export default PowerRankingTab;
