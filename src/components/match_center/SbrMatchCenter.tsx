import useSWR from 'swr';
import { sbrService } from '../../services/sbr/sbrService';
import { LoadingState } from '../ui/LoadingState';
import SbrFixtureCard from '../sbr/SbrFixtureCard';
import PilledSeasonFilterBar from './MatcheSeasonFilterBar';
import { useQueryState } from '../../hooks/useQueryState';
import { SeasonFilterBarItem } from '../../types/games';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import NoContentCard from '../shared/NoContentMessage';
import MatchCenterSearchBar from './MatchCenterSearchBar';
import { searchSbrFixturePredicate } from '../../utils/sbrUtils';
import { useState, useEffect } from 'react';
import {
  getCurrentWeek,
  getWeekDateRange,
  formatWeekHeader,
  getSbrFixturesForWeek,
  findNextWeekWithSbrFixtures,
} from '../../utils/fixtureUtils';

export default function SbrMatchCenter() {
  const key = 'sbr-fixtures';
  let { data: fixtures, isLoading } = useSWR(key, () => sbrService.getAllFixtures());
  const [season, setSeason] = useQueryState<string | undefined>('sbrcs', { init: 'all' });
  const [search, setSearch] = useQueryState<string | undefined>('proq');

  // Get current week on mount
  const currentWeek = getCurrentWeek();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek.weekNumber);
  const [selectedYear, setSelectedYear] = useState(currentWeek.year);

  // Update to current week when component mounts
  useEffect(() => {
    const current = getCurrentWeek();
    setSelectedWeek(current.weekNumber);
    setSelectedYear(current.year);
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  fixtures = fixtures ?? [];
  const seasons: SeasonFilterBarItem[] = [];

  fixtures.forEach(f => {
    if (f.season && !seasons.some(s => s.id === f.season)) {
      seasons.push({ name: f.season, id: f.season });
    }
  });

  const filteredFixtures = fixtures.filter(f => {
    const seasonMatches = !season || season === 'all' ? true : f.season === season;
    const searchMatches = search ? searchSbrFixturePredicate(search ?? '', f) : true;
    return seasonMatches && searchMatches;
  });

  // If searching, show all fixtures across all weeks
  // Otherwise, show only fixtures for the selected week
  const displayFixtures = search
    ? filteredFixtures.sort((a, b) => {
        const aDate = new Date(a.kickoff_time ?? new Date());
        const bDate = new Date(b.kickoff_time ?? new Date());
        return aDate.valueOf() - bDate.valueOf();
      })
    : getSbrFixturesForWeek(filteredFixtures, selectedWeek, selectedYear);

  // Get date range for header
  const dateRange = getWeekDateRange(selectedWeek, selectedYear);
  const weekHeader = formatWeekHeader(selectedWeek, dateRange);

  // Check if we're on current week
  const isCurrentWeek =
    selectedWeek === currentWeek.weekNumber && selectedYear === currentWeek.year;

  // Find next week with fixtures (for empty week case)
  const nextWeekWithFixtures = findNextWeekWithSbrFixtures(
    filteredFixtures,
    selectedWeek,
    selectedYear
  );

  const handlePreviousWeek = () => {
    if (selectedWeek === 1) {
      setSelectedWeek(52);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedWeek(selectedWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (selectedWeek === 52) {
      setSelectedWeek(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  const handleJumpToCurrentWeek = () => {
    const current = getCurrentWeek();
    setSelectedWeek(current.weekNumber);
    setSelectedYear(current.year);
  };

  const handleJumpToNextFixtures = () => {
    if (nextWeekWithFixtures) {
      setSelectedWeek(nextWeekWithFixtures.weekNumber);
      setSelectedYear(nextWeekWithFixtures.year);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-lg">School Boy Rugby</h1>

      <MatchCenterSearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search SBR games, seasons ..."
      />

      <PilledSeasonFilterBar seasons={seasons} onChange={setSeason} value={season} />

      {/* Week Navigation */}
      <div className="flex flex-row items-center justify-between gap-2">
        <h2 className="font-semibold text-base md:text-lg">
          {search ? 'Search Results' : weekHeader}
        </h2>
        <div className="flex flex-row gap-2">
          {!search && (
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
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={handleNextWeek}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="text-sm hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fixtures List */}
      <div className="flex flex-col gap-3 w-full">
        {displayFixtures.length === 0 && !search && (
          <div className="flex flex-col gap-3 items-center">
            <NoContentCard message="No fixtures found for this week" />
            {nextWeekWithFixtures && (
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
        {displayFixtures.length === 0 && search && (
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
