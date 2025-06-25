import React from 'react';
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
import FixturesListScreenActionBar from '../components/fixtures/fixtures_list/FixtureListScreenActionBar';
import LeaguePredictionFixtureCard from '../components/league/LeaguePredictionFixtureCard';
import { format } from 'date-fns';

const competitionIds = [ERPC_COMPETITION_ID, INVESTEC_CHAMPIONSHIP_CUP, URC_COMPETIION_ID];

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

  if (isLoading) return <LoadingState message="Loading Fixtures" />;

  const fixtures = data ?? [];
  const fixturesInRange = selectedDateRange
    ? filterFixturesByDateRange(fixtures, selectedDateRange)
    : fixtures;

  const pastFixtures = filterPastFixtures(fixturesInRange, 30);
  const upcomingFixtures = filterUpcomingFixtures(fixturesInRange);

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
      <div className="flex flex-row items-center justify-start gap-2">
        <Calendar className="" />
        <h1 className="font-bold text-xl lg:text-2xl">Professional Fixtures</h1>
      </div>

      {fixturesInRange.length === 0 && (
        <NoFixturesMessage selectedDateRange={selectedDateRange} onClearFilter={onClearFilter} />
      )}

      {pastFixtures.length > 0 && (
        <>
          <h2 className="text-lg font-semibold">Past Fixtures</h2>
          <GroupedFixturesList fixtures={pastFixtures} />
        </>
      )}

      {upcomingFixtures.length > 0 && (
        <>
          <h2 className="text-lg font-semibold">Upcoming Fixtures</h2>
          <GroupedFixturesList fixtures={upcomingFixtures} />
        </>
      )}

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
              <LeaguePredictionFixtureCard fixture={fixture} key={index} />
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
}: {
  selectedDateRange: any;
  onClearFilter: () => void;
}) {
  return (
    <div className="w-full p-5 mt-10 flex flex-col items-center gap-5 text-slate-700 dark:text-slate-400">
      <FileX2 className="w-20 h-20" />
      <p>No fixtures were found</p>

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
