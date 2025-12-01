import useSWR from 'swr';
import { gamesService } from '../../services/gamesService';
import { LoadingState } from '../ui/LoadingState';
import FixtureCard from '../fixtures/FixtureCard';
import PickEmCard from '../fixtures/PickEmCard';
import PickEmCardSkeleton from '../fixtures/PickEmCardSkeleton';
import NoContentCard from '../shared/NoContentMessage';
import { searchProFixturePredicate } from '../../utils/fixtureUtils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { IFixture } from '../../types/games';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  getCurrentWeek,
  getWeekDateRange,
  formatWeekHeader,
  getFixturesForWeek,
  findClosestWeekWithFixtures,
  findNextWeekWithFixtures,
  findPreviousWeekWithFixtures,
} from '../../utils/fixtureUtils';
import SegmentedControl from '../ui/SegmentedControl';

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'fixtures' | 'pickem';
  onViewModeChange: (mode: 'fixtures' | 'pickem') => void;
};

export default function ProMatchCenter({ searchQuery, viewMode, onViewModeChange }: Props) {
  const key = 'pro-fixtures';
  let { data: fixtures, isLoading } = useSWR(key, () => gamesService.getAllSupportedGames());

  // Get current week on mount
  const currentWeek = getCurrentWeek();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek.weekNumber);
  const [selectedYear, setSelectedYear] = useState(currentWeek.year);

  // Update to closest week with fixtures when component mounts or fixtures load
  useEffect(() => {
    if (fixtures && fixtures.length > 0) {
      const current = getCurrentWeek();
      const closestWeek = findClosestWeekWithFixtures(fixtures, current.weekNumber, current.year);
      if (closestWeek) {
        setSelectedWeek(closestWeek.weekNumber);
        setSelectedYear(closestWeek.year);
      }
    }
  }, [fixtures?.length]); // Only run when fixtures are loaded

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

  fixtures = fixtures ?? [];

  // Filter by search first
  const searchedFixtures = fixtures.filter(f => {
    return searchQuery ? searchProFixturePredicate(searchQuery, f) : true;
  });

  // If searching, show all fixtures across all weeks (latest first)
  // Otherwise, show only fixtures for the selected week
  const displayFixtures = searchQuery
    ? searchedFixtures.sort((a, b) => {
        const aDate = new Date(a.kickoff_time ?? new Date());
        const bDate = new Date(b.kickoff_time ?? new Date());
        return bDate.valueOf() - aDate.valueOf(); // Sort descending (latest first)
      })
    : getFixturesForWeek(searchedFixtures, selectedWeek, selectedYear);

  // Get date range for header
  const dateRange = getWeekDateRange(selectedWeek, selectedYear);
  const weekHeader = formatWeekHeader(selectedWeek, dateRange);

  // Check if we're on current week
  const isCurrentWeek =
    selectedWeek === currentWeek.weekNumber && selectedYear === currentWeek.year;

  // Check if there are any fixtures at all (for edge case handling)
  const hasAnyFixtures = fixtures.length > 0;

  const handlePreviousWeek = () => {
    const previousWeek = findPreviousWeekWithFixtures(searchedFixtures, selectedWeek, selectedYear);
    if (previousWeek) {
      setSelectedWeek(previousWeek.weekNumber);
      setSelectedYear(previousWeek.year);
    }
  };

  const handleNextWeek = () => {
    const nextWeek = findNextWeekWithFixtures(searchedFixtures, selectedWeek, selectedYear);
    if (nextWeek) {
      setSelectedWeek(nextWeek.weekNumber);
      setSelectedYear(nextWeek.year);
    }
  };

  const handleJumpToCurrentWeek = () => {
    const current = getCurrentWeek();
    setSelectedWeek(current.weekNumber);
    setSelectedYear(current.year);
  };

  const handleJumpToNextFixtures = () => {
    const nextWeek = findNextWeekWithFixtures(searchedFixtures, selectedWeek, selectedYear);
    if (nextWeek) {
      setSelectedWeek(nextWeek.weekNumber);
      setSelectedYear(nextWeek.year);
    }
  };

  // Check if navigation buttons should be disabled
  const hasPreviousWeek =
    findPreviousWeekWithFixtures(searchedFixtures, selectedWeek, selectedYear) !== null;
  const hasNextWeek =
    findNextWeekWithFixtures(searchedFixtures, selectedWeek, selectedYear) !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Week Navigation and Mode Toggle */}
      <div className="flex flex-col gap-2">
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

      {/* Fixtures List */}
      <div className="flex flex-col gap-3 w-full">
        {!hasAnyFixtures && !searchQuery && <NoContentCard message="No fixtures available" />}
        {displayFixtures.length === 0 && !searchQuery && hasAnyFixtures && (
          <div className="flex flex-col gap-3 items-center">
            <NoContentCard message="No fixtures found for this week" />
            {findNextWeekWithFixtures(searchedFixtures, selectedWeek, selectedYear) && (
              <button
                onClick={handleJumpToNextFixtures}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <span>View Next Fixtures</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {displayFixtures.length === 0 && searchQuery && (
          <NoContentCard message="No fixtures match your search" />
        )}
        {displayFixtures.map((fixture, index) => {
          return (
            <FixtureItem
              fixture={fixture}
              key={`${viewMode}-${index}`}
              viewMode={viewMode}
              className="rounded-xl border w-full min-h-full dark:border-slate-700 flex-1"
            />
          );
        })}
      </div>
    </div>
  );
}

type FixtureItemProps = {
  fixture: IFixture;
  viewMode: 'fixtures' | 'pickem';
  className?: string;
};

function FixtureItem({ fixture, viewMode, className }: FixtureItemProps) {
  return (
    <>
      {viewMode === 'fixtures' && (
        <FixtureCard fixture={fixture} showLogos showCompetition className={className} />
      )}
      {viewMode === 'pickem' && <PickEmCard fixture={fixture} className={className} />}
    </>
  );
}
