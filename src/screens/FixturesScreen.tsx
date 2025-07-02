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
import { Calendar } from 'lucide-react';
import ToggleSwitch from '../components/shared/buttons/ToggleSwitch';
import { useQueryState } from '../hooks/useQueryState';
import ProMatchCenter from '../components/match_center/ProMatchCenter';
import SbrMatchCenter from '../components/match_center/SbrMatchCenter';

export default function FixturesScreen() {
  const sbrAtoms = [
    sbrFixturesPivotDateAtom,
    sbrFixturesWeekEndAtom,
    sbrFixturesWeekStartAtom,
    allSbrWeekFixturesAtom,
    sbrWeekFixturesAtom,
    sbrWeekFeatureGamesAtom,
  ];

  const [fixtureContext, setFixtureContext] = useQueryState('sc', { init: 'Pros' })

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

      <div className='flex flex-row justify-between' >
        <div className='flex flex-row items-center gap-2' >
          <Calendar />
          <p className='font-bold text-xl' >Match Center</p>
        </div>

        <div>
          <ToggleSwitch
            option1='Pros'
            option2='Sbr'
            value={fixtureContext}
            onChange={setFixtureContext}
          />
        </div>
      </div>

      <div className="w-full lg:w-3/4 mx-auto">
        {fixtureContext === "Pros" && <ProMatchCenter />}
        {fixtureContext === "Sbr" && <SbrMatchCenter />}
      </div>

    </PageView>
  );
}

function SbrFixturesContent() {
  const weekGames = useAtomValue(sbrWeekFixturesAtom);
  return <SbrFixturesTab fixtures={weekGames} />;
}
