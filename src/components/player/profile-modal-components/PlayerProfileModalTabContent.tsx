import { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import PlayerMatchsPRList from './PlayerMatchsPRList';
import PlayerOverviewTab from './tabs/PlayerOverviewTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PowerRankingChartTab from './tabs/PRChartTab';
import PilledTabView from '../../shared/tabs/PilledTabView';
import PlayerStatsTab from './tabs/PlayerStatsTab';
import { usePlayerData } from '../provider/PlayerDataProvider';


type Props = {
}

export function PlayerProfileModalTabContent({}: Props) {

  const {player} = usePlayerData();

  const tabItems: TabViewHeaderItem[] = [
    {
      label: "Overview",
      tabKey: "overview"
    },

    {
      label: "Stats",
      tabKey: "stats"
    },

    {
      label: "Power Ranking",
      tabKey: "power-ranking"
    }
  ]

  if (!player) return;

  return (
    <div className=''>

      <PilledTabView tabHeaderItems={tabItems}>
        <TabViewPage tabKey='overview'>
          <PlayerOverviewTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey='stats'>
          <PlayerStatsTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey='power-ranking'>
          <PowerRankingTab player={player} />
          <PowerRankingChartTab player={player} />
          <PlayerMatchsPRList player={player} />
        </TabViewPage>

      </PilledTabView>
    </div>
  )
};

export default PlayerProfileModalTabContent;
