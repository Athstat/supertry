import { IProAthlete } from '../../../types/athletes';
import TabView, { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import PlayerMatchsPRList from './PlayerMatchsPRList';
import OverviewTab from './tabs/OverviewTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PowerRankingChartTab from './tabs/PRChartTab';
import StatsTab from './tabs/StatsTab';


type Props = {
  player: IProAthlete;
}

export function PlayerProfileModalTabContent({player}: Props) {

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
          />
        </TabViewPage>

        <TabViewPage tabKey='power-ranking'>
          <PowerRankingTab player={player} />
          <PowerRankingChartTab player={player} />
          <PlayerMatchsPRList player={player} />
        </TabViewPage>

      </TabView>
    </div>
  )
};

export default PlayerProfileModalTabContent;
