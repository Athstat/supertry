import React from 'react';
import PageView from './PageView';
import TabView, { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import { ScopeProvider } from 'jotai-scope';
import {
  allSbrWeekFixturesAtom,
  sbrFixturesPivotDateAtom,
  sbrFixturesWeekEndAtom,
  sbrFixturesWeekStartAtom,
  sbrWeekFeatureGamesAtom,
  sbrWeekFixturesAtom,
} from '../state/sbrFixtures.atoms';
import {
  fixturesDateRangeAtom,
  fixturesSelectedMonthIndexAtom,
} from '../components/fixtures/calendar/fixtures_calendar.atoms';
import SbrScreenDataProvider from '../components/sbr/SbrScreenDataProvider';
import SbrFixturesTab from '../components/sbr/fixtures/SbrFixturesTab';
import { useAtomValue } from 'jotai';
import ProFixturesTab from './ProFixturesTab';

export default function FixturesScreen() {
  const sbrAtoms = [
    sbrFixturesPivotDateAtom,
    sbrFixturesWeekEndAtom,
    sbrFixturesWeekStartAtom,
    allSbrWeekFixturesAtom,
    sbrWeekFixturesAtom,
    sbrWeekFeatureGamesAtom,
  ];

  const tabItems: TabViewHeaderItem[] = [
    {
      label: 'Professional',
      tabKey: 'professional',
      className: 'flex-1 text-sm lg:text-base',
    },
    {
      label: 'School Boy Rugby',
      tabKey: 'sbr',
      className: 'flex-1 text-sm lg:text-base',
    },
  ];

  return (
    <PageView className="dark:text-white p-2 md:p-6 flex flex-col gap-4">
      <div className="w-full lg:w-3/4 mx-auto">
        <TabView tabHeaderItems={tabItems}>
          <TabViewPage tabKey="professional">
            <ScopeProvider atoms={[fixturesDateRangeAtom, fixturesSelectedMonthIndexAtom]}>
              <ProFixturesTab />
            </ScopeProvider>
          </TabViewPage>

          <TabViewPage tabKey="sbr">
            <ScopeProvider atoms={sbrAtoms}>
              <SbrScreenDataProvider>
                <SbrFixturesContent />
              </SbrScreenDataProvider>
            </ScopeProvider>
          </TabViewPage>
        </TabView>
      </div>
    </PageView>
  );
}

function SbrFixturesContent() {
  const weekGames = useAtomValue(sbrWeekFixturesAtom);
  return <SbrFixturesTab fixtures={weekGames} />;
}
