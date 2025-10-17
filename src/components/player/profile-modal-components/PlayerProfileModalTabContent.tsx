import { TabViewHeaderItem, TabViewPage } from '../../shared/tabs/TabView';
import PlayerMatchsPRList from './PlayerMatchsPRList';
import PlayerOverviewTab from './tabs/PlayerOverviewTab';
import PilledTabView from '../../shared/tabs/PilledTabView';
import PlayerStatsTab from './tabs/PlayerStatsTab';
import { usePlayerData } from '../provider/PlayerDataProvider';
import { AvailabilityText } from '../../players/availability/AvailabilityIcon';

/** Renders the tab view for the player profile modal */
export function PlayerProfileModalTabContent() {

  const { player } = usePlayerData();

  const tabItems: TabViewHeaderItem[] = [
    {
      label: 'Overview',
      tabKey: 'overview',
    },

    {
      label: 'Stats',
      tabKey: 'stats',
    },
  ];

  if (!player) return;

  return (
    <div className='flex flex-col gap-4'>

      <div>
        <AvailabilityText athlete={player} />
      </div>

      <PilledTabView tabHeaderItems={tabItems}>
        <TabViewPage tabKey="overview">
          <PlayerOverviewTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey="stats">
          <PlayerStatsTab player={player} />
          <PlayerMatchsPRList player={player} />
        </TabViewPage>
      </PilledTabView>
    </div>
  );
}

export default PlayerProfileModalTabContent;
