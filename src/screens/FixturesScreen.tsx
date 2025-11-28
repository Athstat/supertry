import { Fragment, useState } from 'react';
import PageView from './PageView';
import { Calendar } from 'lucide-react';
import { useQueryState } from '../hooks/useQueryState';
import ProMatchCenter from '../components/match_center/ProMatchCenter';
import FloatingSearchBar from '../components/players/ui/FloatingSearchBar';
import SegmentedControl from '../components/ui/SegmentedControl';

export default function FixturesScreen() {
  const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });
  const [viewParam] = useQueryState<string>('view', { init: '' });
  const [viewMode, setViewMode] = useState<'fixtures' | 'pickem'>(
    viewParam === 'pickem' ? 'pickem' : 'fixtures'
  );

  return (
    <Fragment>
      <PageView className="dark:text-white lg:w-[60%] p-4 md:p-6 flex flex-col gap-4 pb-28 md:pb-32">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-2">
            <Calendar />
            <p className="font-bold text-xl">Pro Rugby</p>
          </div>
          <SegmentedControl
            options={[
              { value: 'fixtures', label: 'Fixtures' },
              { value: 'pickem', label: "Pick'Em" },
            ]}
            value={viewMode}
            onChange={value => setViewMode(value as 'fixtures' | 'pickem')}
          />
        </div>

        <div className="w-full mx-auto">
          <ProMatchCenter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
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
