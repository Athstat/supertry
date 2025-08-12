import useSWR from 'swr';
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService';
import { IProAthlete } from '../../../types/athletes';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import PlayerMatchsPRList from './PlayerMatchsPRList';
import PlayerOverviewTab from './tabs/PlayerOverviewTab';
import PowerRankingTab from './tabs/PowerRankingTab';
import PowerRankingChartTab from './tabs/PRChartTab';
import { LoadingState } from '../../ui/LoadingState';
import PilledTabView from '../../shared/tabs/PilledTabView';
import PlayerStatsTab from './tabs/PlayerStatsTab';


type Props = {
  player: IProAthlete;
}

export function PlayerProfileModalTabContent({ player }: Props) {

  const key = swrFetchKeys.getAthleteAggregatedStats(player.tracking_id);
  const { data: fetchedActions, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteSportsActions(player.tracking_id));


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
    <div className=''>

      <PilledTabView tabHeaderItems={tabItems}>
        <TabViewPage tabKey='overview'>
          <PlayerOverviewTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey='stats'>

          {isLoading && <LoadingState />}

          {!isLoading && <PlayerStatsTab
            player={player}
          />}
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
