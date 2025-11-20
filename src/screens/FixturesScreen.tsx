import { Fragment } from 'react';
import PageView from './PageView';
import { Calendar } from 'lucide-react';
import ToggleSwitch from '../components/shared/buttons/ToggleSwitch';
import { useQueryState } from '../hooks/useQueryState';
import ProMatchCenter from '../components/match_center/ProMatchCenter';
import SbrMatchCenter from '../components/match_center/SbrMatchCenter';
import FloatingSearchBar from '../components/players/ui/FloatingSearchBar';

export default function FixturesScreen() {
  const fixtureOptions = ['PRO', 'SBR'];
  const [fixtureContext, setFixtureContext] = useQueryState<string | undefined>('sc', {
    init: fixtureOptions[0],
  });
  const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });

  return (
    <Fragment>
      <PageView className="dark:text-white lg:w-[60%] p-4 md:p-6 flex flex-col gap-4 pb-28 md:pb-32">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <Calendar />
            <p className="font-bold text-xl">Match Center</p>
          </div>

          <div>
            <ToggleSwitch
              option1={fixtureOptions[0]}
              option2={fixtureOptions[1]}
              value={fixtureContext}
              onChange={setFixtureContext}
            />
          </div>
        </div>

        <div className="w-full mx-auto">
          {fixtureContext === fixtureOptions[0] && (
            <ProMatchCenter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          )}
          {fixtureContext === fixtureOptions[1] && (
            <SbrMatchCenter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          )}
        </div>
      </PageView>

      <FloatingSearchBar
        value={searchQuery ?? ''}
        onChange={setSearchQuery}
        placeholder="Search fixtures..."
        showFilterButton={false}
        showCompareButton={false}
      />
    </Fragment>
  );
}
