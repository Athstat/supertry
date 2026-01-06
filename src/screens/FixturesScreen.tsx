import PageView from './PageView';
import { useQueryState } from '../hooks/useQueryState';
import ProMatchCenterList from '../components/fixtures/ProMatchCenterList';
import { Fragment, useState, useEffect } from 'react';
import { useProFixtures } from '../hooks/fixtures/useProFixtures';
import { useFixtureCursor } from '../hooks/fixtures/useFixtureCursor';
import PickEmCardSkeleton from '../components/pickem/PickEmCardSkeleton';
import { LoadingState } from '../components/ui/LoadingState';
import FixtureSearchResults from '../components/fixtures/FixtureSearchResults';
import ProMatchCenterHeader from '../components/fixtures/ProMatchCenterHeader';
import { useDebounced } from '../hooks/useDebounced';
import FloatingSearchBar from '../components/players/FloatingSearchBar';

/** Renders Pro Rugby Fixtures Screen */
export default function ProFixturesScreen() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const defferedSearchQuery = useDebounced(searchQuery, 200);

  const [viewParam] = useQueryState<string>('view', { init: '' });

  const [viewMode, setViewMode] = useState<'fixtures' | 'pickem'>(
    viewParam === 'pickem' ? 'pickem' : 'fixtures'
  );

  const { fixtures, isLoading } = useProFixtures();

  const {
    handleJumpToCurrentWeek, handleNextWeek, handlePreviousWeek,
    weekStart, weekHeader, hasAnyFixtures, isCurrentWeek,
    weekFixtures
  } = useFixtureCursor({
    fixtures, isLoading
  });

  // Scroll to top when date range changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [weekStart]);

  if (isLoading) {
    // Show different loading states based on view mode
    if (viewMode === 'pickem') {
      return (
        <div className="flex flex-col gap-3 w-full">
          {[...Array(5)].map((_, index) => (
            <PickEmCardSkeleton
              key={index}
              className="rounded-xl border w-full dark:border-slate-700"
            />
          ))}
        </div>
      );
    }
    return <LoadingState />;
  }

  return (
    <Fragment>
      <PageView className="dark:text-white lg:w-[60%] p-4 md:p-6 flex flex-col gap-4 pb-28 md:pb-32">

        <ProMatchCenterHeader
          viewMode={viewMode}
          onMoveNextWeek={handleNextWeek}
          onMovePreviousWeek={handlePreviousWeek}
          onMoveToCurrentWeek={handleJumpToCurrentWeek}
          hasAnyFixtures={hasAnyFixtures}
          isCurrentWeek={isCurrentWeek}
          onChangeViewMode={setViewMode}
          weekHeader={weekHeader}
          searchQuery={defferedSearchQuery}
        />

        {!defferedSearchQuery && <div className="w-full mx-auto">
          <ProMatchCenterList
            searchQuery={defferedSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onMoveNextWeek={handleNextWeek}
            displayFixtures={weekFixtures}
            hasAnyFixtures={hasAnyFixtures}
          />
        </div>}

        {defferedSearchQuery && <FixtureSearchResults
          searchQuery={defferedSearchQuery}
          viewMode={viewMode}
        />}

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

