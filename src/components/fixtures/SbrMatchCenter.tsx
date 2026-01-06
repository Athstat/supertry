import { LoadingIndicator } from '../ui/LoadingIndicator';
import SbrFixtureCard from '../sbr/SbrFixtureCard';
import PilledSeasonFilterBar from './MatcheSeasonFilterBar';
import { useQueryState } from '../../hooks/web/useQueryState';
import { SeasonFilterBarItem } from '../../types/games';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import NoContentCard from '../ui/typography/NoContentMessage';
import { searchSbrFixturePredicate } from '../../utils/sbrUtils';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  getCurrentWeek,
  getSbrFixturesForWeek,
  findClosestWeekWithSbrFixtures,
  findNextWeekWithSbrFixtures,
  findPreviousWeekWithSbrFixtures,
} from '../../utils/fixtureUtils';
import { useSbrFixtures } from '../../hooks/fixtures/useSbrFixtures';

type Props = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function SbrMatchCenter({ searchQuery }: Props) {
  const { fixtures, isLoading } = useSbrFixtures();
  const [season, setSeason] = useQueryState<string | undefined>('sbrcs', { init: 'all' });

  // Get current week on mount
  const currentWeek = getCurrentWeek();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek.weekNumber);
  const [selectedYear, setSelectedYear] = useState(currentWeek.year);

  // Update to closest week with fixtures when component mounts or fixtures load
  useEffect(() => {
    if (fixtures && fixtures.length > 0) {
      const current = getCurrentWeek();
      const closestWeek = findClosestWeekWithSbrFixtures(
        fixtures,
        current.weekNumber,
        current.year
      );
      if (closestWeek) {
        setSelectedWeek(closestWeek.weekNumber);
        setSelectedYear(closestWeek.year);
      }
    }
  }, [fixtures]); // Only run when fixtures are loaded

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const seasons: SeasonFilterBarItem[] = [];

  fixtures.forEach(f => {
    if (f.season && !seasons.some(s => s.id === f.season)) {
      seasons.push({ name: f.season, id: f.season });
    }
  });

  const filteredFixtures = fixtures.filter(f => {
    const seasonMatches = !season || season === 'all' ? true : f.season === season;
    const searchMatches = searchQuery ? searchSbrFixturePredicate(searchQuery ?? '', f) : true;
    return seasonMatches && searchMatches;
  });

  // If searching, show all fixtures across all weeks (latest first)
  // Otherwise, show only fixtures for the selected week
  const displayFixtures = searchQuery
    ? filteredFixtures.sort((a, b) => {
        const aDate = new Date(a.kickoff_time ?? new Date());
        const bDate = new Date(b.kickoff_time ?? new Date());
        return bDate.valueOf() - aDate.valueOf(); // Sort descending (latest first)
      })
    : getSbrFixturesForWeek(filteredFixtures, selectedWeek, selectedYear);

  // Get date range for header
  // const dateRange = getWeekDateRange(selectedWeek, selectedYear);
  // const weekHeader = formatWeekHeader(selectedWeek, dateRange);

  // Check if we're on current week
  const isCurrentWeek =
    selectedWeek === currentWeek.weekNumber && selectedYear === currentWeek.year;

  // Check if there are any fixtures at all (for edge case handling)
  const hasAnyFixtures = fixtures.length > 0;

  const handlePreviousWeek = () => {
    const previousWeek = findPreviousWeekWithSbrFixtures(
      filteredFixtures,
      selectedWeek,
      selectedYear
    );
    if (previousWeek) {
      setSelectedWeek(previousWeek.weekNumber);
      setSelectedYear(previousWeek.year);
    }
  };

  const handleNextWeek = () => {
    const nextWeek = findNextWeekWithSbrFixtures(filteredFixtures, selectedWeek, selectedYear);
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
    const nextWeek = findNextWeekWithSbrFixtures(filteredFixtures, selectedWeek, selectedYear);
    if (nextWeek) {
      setSelectedWeek(nextWeek.weekNumber);
      setSelectedYear(nextWeek.year);
    }
  };

  // Check if navigation buttons should be disabled
  const hasPreviousWeek =
    findPreviousWeekWithSbrFixtures(filteredFixtures, selectedWeek, selectedYear) !== null;
  const hasNextWeek =
    findNextWeekWithSbrFixtures(filteredFixtures, selectedWeek, selectedYear) !== null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-lg">School Boy Rugby</h1>

      <PilledSeasonFilterBar seasons={seasons} onChange={setSeason} value={season} />

      {/* Week Navigation */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-base md:text-lg">
              {/* {searchQuery ? 'Search Results' : weekHeader} */}
            </h2>
            {!searchQuery && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Today: Week {currentWeek.weekNumber}, {format(new Date(), 'EEE, d MMM yyyy')}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-2">
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
            {findNextWeekWithSbrFixtures(filteredFixtures, selectedWeek, selectedYear) && (
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
            <SbrFixtureCard
              fixture={fixture}
              key={index}
              showLogos
              showCompetition
              showKickOffTime
              className="rounded-xl border w-full dark:border-slate-700"
            />
          );
        })}
      </div>
    </div>
  );
}
