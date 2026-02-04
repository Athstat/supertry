import { Fragment, useState, useEffect, Activity, useMemo } from 'react';
import FixtureSearchResults from '../../components/fixtures/FixtureSearchResults';
import ProMatchCenterHeader from '../../components/fixtures/ProMatchCenterHeader';
import ProMatchCenterList from '../../components/fixtures/ProMatchCenterList';
import FloatingSearchBar from '../../components/players/FloatingSearchBar';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFixtureCursor } from '../../hooks/fixtures/useFixtureCursor';
import { useProFixtures } from '../../hooks/fixtures/useProFixtures';
import { useDebounced } from '../../hooks/web/useDebounced';
import { useQueryState } from '../../hooks/web/useQueryState';
import FixturesProPickemView from '../../components/fixtures/pro_match_center/ProPickemView';
import WeekCursor from '../../components/fixtures/WeekCursor';
import { searchFixturesPredicate } from '../../utils/fixtureUtils';

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
    handleNextWeek, weekStart, hasAnyFixtures,
    weekFixtures, handlePreviousWeek,
    weekHeader
  } = useFixtureCursor({
    fixtures, isLoading
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [weekStart]);

  const displayFixtures = useMemo(() => {

    if (defferedSearchQuery) {
      return fixtures.filter((f) => {
        return searchFixturesPredicate(f, defferedSearchQuery);
      })
    }

    return weekFixtures;

  }, [defferedSearchQuery, fixtures, weekFixtures]);

  const round = displayFixtures.at(0)?.round;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Fragment>
      <PageView className="dark:text-white flex flex-col gap-4 pb-28 md:pb-32">

        <ProMatchCenterHeader
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
        />

        <WeekCursor 
          weekHeader={weekHeader}
          onNext={handleNextWeek}
          onPrevious={handlePreviousWeek}
          roundNumber={round}
          className='px-6'
        />

        {!defferedSearchQuery && <div className="w-full mx-auto">
          <Activity mode={viewMode === "fixtures" ? "visible" : "hidden"} >
            <ProMatchCenterList
              searchQuery={defferedSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onMoveNextWeek={handleNextWeek}
              displayFixtures={displayFixtures}
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
