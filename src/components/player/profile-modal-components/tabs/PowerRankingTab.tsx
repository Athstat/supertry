import React from 'react';

interface PowerRankingTabProps {
  player: any;
}

export const PowerRankingTab: React.FC<PowerRankingTabProps> = ({ player }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="text-5xl font-bold text-green-600 dark:text-green-500 mb-4">
        {player.power_rank_rating?.toFixed(1) || 'N/A'}
      </div>
      <div className="text-gray-600 dark:text-gray-400">
        Overall Power Ranking
      </div>
    </div>
  );
};

export default PowerRankingTab;
