import useSWR from 'swr';
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService';
import { IProAthlete } from '../../../types/athletes';
import { swrFetchKeys } from '../../../utils/swrKeys';
import TabView, { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import PlayerMatchsPRList from './PlayerMatchsPRList';
import OverviewTab from './tabs/OverviewTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PowerRankingChartTab from './tabs/PRChartTab';
import StatsTab from './tabs/StatsTab';
import { LoadingState } from '../../ui/LoadingState';


type Props = {
  player: IProAthlete;
}

export function PlayerProfileModalTabContent({ player }: Props) {

  const key = swrFetchKeys.getAthleteAggregatedStats(player.tracking_id);
  const { data: fetchedActions, isLoading, error } = useSWR(key, () => djangoAthleteService.getAthleteSportsActions(player.tracking_id));


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

          {isLoading && <LoadingState />}

          {!isLoading && <StatsTab
            player={player}
            playerStats={fetchedActions ?? []}
          />}
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
