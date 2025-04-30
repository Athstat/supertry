import React from 'react';
import OverviewTab from './tabs/OverviewTab';
import StatsTab from './tabs/StatsTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PRChartTab from './tabs/PRChartTab';

interface TabContentProps {
  activeTab: number;
  player: any;
  playerStats: any;
  isLoading: boolean;
  error: string;
}

export const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  player, 
  playerStats, 
  isLoading, 
  error 
}) => {
  switch (activeTab) {
    case 0: // Overview
      return <OverviewTab player={player} />;
      
    case 1: // Stats
      return (
        <StatsTab 
          player={player} 
          playerStats={playerStats}
          isLoading={isLoading}
          error={error}
        />
      );
      
    case 2: // Power Ranking
      return <PowerRankingTab player={player} />;
      
    case 3: // PR Chart
      return <PRChartTab player={player} />;
      
    default:
      return null;
  }
};

export default TabContent;
