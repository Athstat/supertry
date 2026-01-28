import { Fragment, useState, useEffect, Activity } from 'react';
import FixtureSearchResults from '../../components/fixtures/FixtureSearchResults';
import ProMatchCenterHeader from '../../components/fixtures/ProMatchCenterHeader';
import ProMatchCenterList from '../../components/fixtures/ProMatchCenterList';
import PickEmCardSkeleton from '../../components/pickem/PickEmCardSkeleton';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFixtureCursor } from '../../hooks/fixtures/useFixtureCursor';
import { useProFixtures } from '../../hooks/fixtures/useProFixtures';
import { useDebounced } from '../../hooks/web/useDebounced';
import { useQueryState } from '../../hooks/web/useQueryState';
import FixturesProPickemView from '../../components/fixtures/pro_match_center/ProPickemView';
import RoundedScreenHeader from '../../components/ui/containers/RoundedScreenHeader';
import SearchInput from '../../components/ui/forms/SearchInput';
import { FixtureListViewMode } from '../../types/fixtures';
import { FixtureViewModeSwitcher } from '../../components/fixtures/FixtureViewModeSwitcher';

/** Renders Pro Rugby Fixtures Screen */
export default function ProFixturesScreen() {

  const [searchQuery, setSearchQuery] = useState<string>('');
  const defferedSearchQuery = useDebounced(searchQuery, 200);

  const [viewParam] = useQueryState<string>('view', { init: '' });

  const [viewMode, setViewMode] = useState<FixtureListViewMode>(
    viewParam === 'pickem' ? 'pickem' : 'fixtures'
  );

  const { fixtures, isLoading } = useProFixtures();

  const {
    handleJumpToCurrentWeek, handleNextWeek, handlePreviousWeek,
    weekStart, weekHeader, hasAnyFixtures,
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
    return <LoadingIndicator />;
  }

  const displayRound = weekFixtures.at(0)?.round;

  return (
    <Fragment>
      <PageView className="dark:text-white bg-[#F0F3F7] flex flex-col gap-4 pb-28 md:pb-32">

        <RoundedScreenHeader
          title='Fixtures (Pro)'
          trailingSlot={(
            <FixtureViewModeSwitcher
              viewMode={viewMode}
              onChange={setViewMode}
            />
          )}

          leadingIcon={(
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.625 6.25V3.75M9.375 6.25V3.75M4.0625 10H25.9375M3.75 12.555C3.75 9.91125 3.75 8.58875 4.295 7.57875C4.78781 6.67788 5.55249 5.95563 6.48 5.515C7.55 5 8.95 5 11.75 5H18.25C21.05 5 22.45 5 23.52 5.515C24.4613 5.9675 25.225 6.69 25.705 7.5775C26.25 8.59 26.25 9.9125 26.25 12.5563V18.6962C26.25 21.34 26.25 22.6625 25.705 23.6725C25.2122 24.5734 24.4475 25.2956 23.52 25.7363C22.45 26.25 21.05 26.25 18.25 26.25H11.75C8.95 26.25 7.55 26.25 6.48 25.735C5.55268 25.2947 4.78801 24.5729 4.295 23.6725C3.75 22.66 3.75 21.3375 3.75 18.6937V12.555Z" stroke="#011E5C" stroke-width="1.30814" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          )}

        >
          <SearchInput
            placeholder='Search pro fixtures'
            value={searchQuery}
            onChange={(s) => setSearchQuery(s || '')}
            inputCn={'dark:bg-[#F0F3F7] dark:text-[#63686E]'}
          />

        </RoundedScreenHeader>

        <div className='px-6 flex flex-col gap-6' >

          {searchQuery && <h2 className="font-semibold text-base md:text-lg">
            {searchQuery ? `Search Results for '${searchQuery}'` : weekHeader}
          </h2>}

          <ProMatchCenterHeader
            onMoveNextWeek={handleNextWeek}
            onMovePreviousWeek={handlePreviousWeek}
            onMoveToCurrentWeek={handleJumpToCurrentWeek}
            hasAnyFixtures={hasAnyFixtures}
            weekHeader={weekHeader}
            searchQuery={defferedSearchQuery}
            round={displayRound}
          />

          {!defferedSearchQuery && <div className="w-full mx-auto">
            <Activity mode={viewMode === "fixtures" ? "visible" : "hidden"} >
              <ProMatchCenterList
                searchQuery={defferedSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onMoveNextWeek={handleNextWeek}
                displayFixtures={weekFixtures}
                hasAnyFixtures={hasAnyFixtures}
              />
            </Activity>

            <Activity mode={viewMode === "pickem" ? "visible" : "hidden"} >
              <FixturesProPickemView
                searchQuery={defferedSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onMoveNextWeek={handleNextWeek}
                displayFixtures={weekFixtures}
                hasAnyFixtures={hasAnyFixtures}
              />
            </Activity>
          </div>}

          {defferedSearchQuery && <FixtureSearchResults
            searchQuery={defferedSearchQuery}
            viewMode={viewMode}
          />}

        </div>

      </PageView>

      {/* <FloatingSearchBar
        value={searchQuery ?? ''}
        onChange={setSearchQuery}
        placeholder="Search fixtures..."
        showFilterButton={false}
        showCompareButton={false}
      /> */}
    </Fragment>
  );
}
