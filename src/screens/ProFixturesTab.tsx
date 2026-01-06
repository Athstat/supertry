import React, { useState } from 'react';
import { Calendar, FileX2, XIcon } from 'lucide-react';
import useSWR from 'swr';
import { IFixture } from '../types/games';
import { gamesService } from '../services/gamesService';
import {
  ERPC_COMPETITION_ID,
  INVESTEC_CHAMPIONSHIP_CUP,
  URC_COMPETIION_ID,
} from '../types/constants';
import { LoadingState } from '../components/ui/LoadingState';
import { useAtom, useAtomValue } from 'jotai';
import { fixturesDateRangeAtom } from '../components/fixtures/calendar/fixtures_calendar.atoms';
import {
  filterFixturesByDateRange,
  filterPastFixtures,
  filterUpcomingFixtures,
} from '../utils/fixtureUtils';
import FixturesListScreenActionBar from '../components/fixtures/FixtureListScreenActionBar';
import FixtureCard from '../components/fixture/FixtureCard';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

const competitionIds = [
  ERPC_COMPETITION_ID,
  INVESTEC_CHAMPIONSHIP_CUP,
  URC_COMPETIION_ID,
];

async function fetcher(competitionIds: string[]) {
  let matches: IFixture[] = [];

  const fetchMatches = async (compId: string) => {
    const res = await gamesService.getGamesByCompetitionId(compId);
    matches = [...matches, ...res];
  };

  const promises = competitionIds.map(compId => {
    return fetchMatches(compId);
  });

  await Promise.all(promises);

  return matches;
}

export default function ProFixturesTab() {
  const { data, isLoading } = useSWR(competitionIds, fetcher);
  const selectedDateRange = useAtomValue(fixturesDateRangeAtom);
  const [, setSelectedDateRange] = useAtom(fixturesDateRangeAtom);
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'past'>('upcoming');

  if (isLoading) return <LoadingState message="Loading Fixtures" />;

  const fixtures = data ?? [];
  const fixturesInRange = selectedDateRange
    ? filterFixturesByDateRange(fixtures, selectedDateRange)
    : fixtures;

  const pastFixtures = filterPastFixtures(fixturesInRange, 30);
  const upcomingFixtures = filterUpcomingFixtures(fixturesInRange);

  // Get fixtures based on active filter
  const displayFixtures = activeFilter === 'past' ? pastFixtures : upcomingFixtures;

  // Group fixtures by day
  const groupFixturesByDay = (fixtures: IFixture[]) => {
    const fixturesByDay: Record<string, IFixture[]> = {};

    fixtures.forEach((fixture: IFixture) => {
      if (fixture.kickoff_time) {
        const dayKey = format(new Date(fixture.kickoff_time), 'yyyy-MM-dd');
        if (!fixturesByDay[dayKey]) {
          fixturesByDay[dayKey] = [];
        }
        fixturesByDay[dayKey].push(fixture);
      }
    });

    return fixturesByDay;
  };

  const onClearFilter = () => {
    setSelectedDateRange(undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-2">
          <Calendar className="" />
          <h1 className="font-bold text-xl lg:text-2xl">Professional Fixtures</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={twMerge(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={twMerge(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeFilter === 'past'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            )}
          >
            Past
          </button>
        </div>
      </div>

      {displayFixtures.length === 0 && (
        <NoFixturesMessage
          selectedDateRange={selectedDateRange}
          onClearFilter={onClearFilter}
          activeFilter={activeFilter}
        />
      )}

      {displayFixtures.length > 0 && <GroupedFixturesList fixtures={displayFixtures} />}

      <FixturesListScreenActionBar />
    </div>
  );
}

function GroupedFixturesList({ fixtures }: { fixtures: IFixture[] }) {
  const fixturesByDay = groupFixturesByDay(fixtures);
  const sortedDays = Object.keys(fixturesByDay).sort();

  return (
    <div className="flex flex-col gap-2">
      {sortedDays.map(dayKey => (
        <div key={dayKey}>
          <div className="px-4 py-2 bg-gray-100 dark:bg-dark-800/40 border border-slate-100 dark:border-slate-800 font-medium text-gray-800 dark:text-gray-200 rounded-lg mb-2">
            {format(new Date(dayKey), 'EEEE, MMMM d, yyyy')}
          </div>
          <div className="flex flex-col gap-2">
            {fixturesByDay[dayKey].map((fixture, index) => (
              <FixtureCard
                fixture={fixture}
                key={index}
                showLogos={true}
                showCompetition={true}
                className="border border-gray-200 dark:border-gray-700 rounded-lg"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  function groupFixturesByDay(fixtures: IFixture[]) {
    const fixturesByDay: Record<string, IFixture[]> = {};

    fixtures.forEach((fixture: IFixture) => {
      if (fixture.kickoff_time) {
        const dayKey = format(new Date(fixture.kickoff_time), 'yyyy-MM-dd');
        if (!fixturesByDay[dayKey]) {
          fixturesByDay[dayKey] = [];
        }
        fixturesByDay[dayKey].push(fixture);
      }
    });

    return fixturesByDay;
  }
}

function NoFixturesMessage({
  selectedDateRange,
  onClearFilter,
  activeFilter,
}: {
  selectedDateRange: any;
  onClearFilter: () => void;
  activeFilter?: 'upcoming' | 'past';
}) {
  return (
    <div className="w-full p-5 mt-10 flex flex-col items-center gap-5 text-slate-700 dark:text-slate-400">
      <FileX2 className="w-20 h-20" />
      <p>No {activeFilter} fixtures were found</p>

      {selectedDateRange && (
        <button
          onClick={onClearFilter}
          className="bg-slate-200 dark:bg-slate-800 rounded-xl px-2 py-1 flex flex-row items-center justify-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-700"
        >
          Clear Filters
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
