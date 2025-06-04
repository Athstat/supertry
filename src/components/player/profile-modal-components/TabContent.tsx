import React from 'react';
import OverviewTab from './tabs/OverviewTab';
import StatsTab from './tabs/StatsTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PRChartTab from './tabs/PRChartTab';
import TabView, { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import PlayerStatsContextInfo from './PlayerStatsContextInfo';

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
  // switch (activeTab) {
  //   case 0: // Overview
  //     return <OverviewTab player={player} />;

  //   case 1: // Stats
  //     return (
  //       <StatsTab 
  //         player={player} 
  //         playerStats={playerStats}
  //         isLoading={isLoading}
  //         error={error}
  //       />
  //     );

  //   case 2: // Power Ranking
  //     return <PowerRankingTab player={player} />;

  //   case 3: // PR Chart
  //     return <PRChartTab player={player} />;

  //   default:
  //     return null;
  // }

  const tabItems: TabViewHeaderItem[] = [
    {
      label: "Overview",
      tabKey: "overview",
      className: "flex-1"
    },

    {
      label: "Stats",
      tabKey: "stats",
      className: "flex-1"
    },

    {
      label: "Power Ranking",
      tabKey: "power-ranking",
      className: "flex-1"
    }
  ]

  return (
    <div className='p-2'>

      <TabView tabHeaderItems={tabItems}>
        <TabViewPage tabKey='overview'>
          <OverviewTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey='stats'>
          <StatsTab
            player={player}
            playerStats={playerStats}
            isLoading={isLoading}
            error={error}
          />
        </TabViewPage>

        <TabViewPage tabKey='power-ranking'>
          <PowerRankingTab player={player} />
          <PRChartTab player={player} />
        </TabViewPage>

      </TabView>
    </div>
  )
};

export default TabContent;
