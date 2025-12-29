import { Fragment, useState, useEffect, useCallback } from 'react';
import PageView from './PageView';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryState } from '../hooks/useQueryState';
import ProMatchCenter from '../components/match_center/ProMatchCenter';
import FloatingSearchBar from '../components/players/ui/FloatingSearchBar';
import SegmentedControl from '../components/ui/SegmentedControl';
import { format } from 'date-fns';
import { findNextWeekPivotWithFixtures, findPreviousWeekPivotWithFixtures, formatWeekHeader } from '../utils/fixtureUtils';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../types/constants';
import { useWeekCursor } from '../hooks/navigation/useWeekCursor';
import { useProFixtures } from '../hooks/fixtures/useProFixtures';

export default function FixturesScreen() {

  const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });
  const [viewParam] = useQueryState<string>('view', { init: '' });
  const [viewMode, setViewMode] = useState<'fixtures' | 'pickem'>(
    viewParam === 'pickem' ? 'pickem' : 'fixtures'
  );

  const {
    weekEnd, weekStart, isCurrentWeek,
    moveNextWeek, movePreviousWeek, reset, pivotDate,
    switchPivot
  } = useWeekCursor();

  const {fixtures, isLoading} = useProFixtures();

  const weekHeader = formatWeekHeader(0, {
    start: weekStart, end: weekEnd
  });

  const handlePreviousWeek = useCallback(() => {

    const previousPivot = findPreviousWeekPivotWithFixtures(fixtures, pivotDate, 114);

    if (previousPivot) {
      switchPivot(previousPivot);
      return;
    }

    movePreviousWeek();
  }, [fixtures, movePreviousWeek, pivotDate, switchPivot])

  const handleNextWeek = useCallback(() => {
    const nextPivot = findNextWeekPivotWithFixtures(fixtures, pivotDate, 114);

    if (nextPivot) {
      switchPivot(nextPivot);
      return;
    }

    moveNextWeek()
  }, [fixtures, moveNextWeek, pivotDate, switchPivot])

  const handleJumpToCurrentWeek = () => {
    reset();
  };

  // Check if navigation buttons should be disabled
  // const hasPreviousWeek =
  //   findPreviousWeekWithFixtures(fixtures, selectedWeek, selectedYear) !== null;
  // const hasNextWeek = findNextWeekWithFixtures(fixtures, selectedWeek, selectedYear) !== null;

  const hasPreviousWeek = true;
  const hasNextWeek = true;

  const hasAnyFixtures = fixtures.length > 0;

  // Scroll to top when date range changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [weekStart]);

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

        {/* Sticky Date Header */}
        <div className={twMerge(
          "sticky top-14 z-10 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-white/80 backdrop-blur-sm shadow-none border-slate-200 dark:border-slate-800",
          AppColours.BACKGROUND
        )}>
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-base md:text-lg">
                {searchQuery ? 'Search Results' : weekHeader}
              </h2>
              {!searchQuery && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Today: {format(new Date(), 'EEE, d MMM yyyy')}
                </p>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              {!searchQuery && hasAnyFixtures && (
                <>
                  <button
                    onClick={handleJumpToCurrentWeek}
                    disabled={isCurrentWeek}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Jump to current week"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Today</span>
                  </button>
                  <button
                    onClick={handlePreviousWeek}
                    disabled={!hasPreviousWeek}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={handleNextWeek}
                    disabled={!hasNextWeek}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto">
          <ProMatchCenter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            weekEnd={weekEnd}
            weekStart={weekStart}
            onMoveNextWeek={handleNextWeek}
            isLoading={isLoading}
            fixtures={fixtures}
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
