import TabView, { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import OverviewTab from './tabs/OverviewTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PowerRankingChartTab from './tabs/PRChartTab';
import StatsTab from './tabs/StatsTab';


type Props = {
  player: any;
  playerStats: any;
  isLoading: boolean;
  error: string;
}

export function PlayerProfileModalTabContent({player, playerStats, isLoading,error}: Props) {
  
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
          <PowerRankingChartTab player={player} />
        </TabViewPage>

      </TabView>
    </div>
  )
};

export default PlayerProfileModalTabContent;
