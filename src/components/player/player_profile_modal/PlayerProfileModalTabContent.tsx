import { TabViewHeaderItem, TabViewPage } from '../../ui/tabs/TabView';
import PlayerOverviewTab from './tabs/PlayerOverviewTab';
import PilledTabView from '../../ui/tabs/PilledTabView';
import PlayerMatchesTab from './tabs/PlayerStatsTab';
import { RoundAvailabilityText } from '../../players/availability/AvailabilityIcon';
import { usePlayerData } from '../../../providers/PlayerDataProvider';
import PlayerSeasonStatsTab from './tabs/PlayerSeasonStatsTab';

/** Renders the tab view for the player profile modal */
export function PlayerProfileModalTabContent() {

  const { player } = usePlayerData();

  const tabItems: TabViewHeaderItem[] = [
    {
      label: 'Overview',
      tabKey: 'overview',
    },

    {
      label: 'Season Stats',
      tabKey: 'season-stats',
    },

    {
      label: 'Matches',
      tabKey: 'matches',
    },
  ];

  if (!player) return null;

  return (
    <div className='flex flex-col gap-4'>

      <div>
        <RoundAvailabilityText athlete={player} />
      </div>

      <PilledTabView tabHeaderItems={tabItems}>
        <TabViewPage tabKey="overview">
          <PlayerOverviewTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey="season-stats">
          <PlayerSeasonStatsTab player={player} />
        </TabViewPage>

        <TabViewPage tabKey="matches">
          <PlayerMatchesTab player={player} />
        </TabViewPage>
      </PilledTabView>
    </div>
  );
}

export default PlayerProfileModalTabContent;
