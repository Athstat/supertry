import { useState } from 'react';
import FantasyPointsScoredPlayerList from './rankings/FantasyPointsPlayerList';
import MostSelectedPlayersList from './rankings/MostSelectedPlayersList';
import SportActionRankingsList from './rankings/SportActionRankingCard';
import { IProSeason } from '../../types/season';

type TabType = 'fantasy-points' | 'most-selected' | 'tries-scored';

type Props = {
  season?: IProSeason;
};

export default function WeeklyLeaderboards({ season }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('most-selected');

  const tabs = [
    { id: 'most-selected' as TabType, label: 'Most Selected Players' },
    { id: 'fantasy-points' as TabType, label: 'Fantasy Points Scored' },
    { id: 'tries-scored' as TabType, label: 'Tries Scored' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg">Weekly Leaderboards</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-xs transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === 'fantasy-points' && <FantasyPointsScoredPlayerList season={season} />}
        {activeTab === 'most-selected' && <MostSelectedPlayersList season={season} />}
        {activeTab === 'tries-scored' && (
          <SportActionRankingsList
            season={season}
            actionName="tries"
            title="Tries Scored"
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}
