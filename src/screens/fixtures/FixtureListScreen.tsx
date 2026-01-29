import { useAtomValue, useAtom } from 'jotai';
import { Calendar, FileX2, XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fixturesDateRangeAtom } from '../../components/fixtures/calendar/fixtures_calendar.atoms';
import FixturesListScreenActionBar from '../../components/fixtures/FixtureListScreenActionBar';
import GroupedFixturesList from '../../components/fixtures/GroupedFixturesList';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useSectionNavigation } from '../../hooks/web/useSectionNavigation';
import { gamesService } from '../../services/gamesService';
import { ERPC_COMPETITION_ID, INVESTEC_CHAMPIONSHIP_CUP, URC_COMPETIION_ID } from '../../types/constants';
import { IFixture } from '../../types/games';
import { filterFixturesByDateRange, filterPastFixtures, filterUpcomingFixtures } from '../../utils/fixtureUtils';

const competitionIds = [
  ERPC_COMPETITION_ID,
  INVESTEC_CHAMPIONSHIP_CUP,
  URC_COMPETIION_ID,
  'test-1',
];

export default function FixtureListScreen() {
  const { data, isLoading } = useSWR(competitionIds, fetcher);
  const [search] = useState('');
  const selectedDateRange = useAtomValue(fixturesDateRangeAtom);

  const sectionId = 'upcoming_matches';
  const { scrollToSection } = useSectionNavigation([sectionId]);

  useEffect(() => {
    scrollToSection(sectionId);
  }, [scrollToSection]);

  if (isLoading) return <LoadingIndicator message="Loading Fixtures" />;

  const fixtures = data ?? [];
  const fixturesInRange = selectedDateRange
    ? filterFixturesByDateRange(fixtures, selectedDateRange)
    : fixtures;

  const pastFixtures = filterPastFixtures(fixturesInRange, 30);
  const upcomingFixtures = filterUpcomingFixtures(fixturesInRange);

  return (
    <PageView className="dark:text-white  p-4 flex flex-col items-center justify-start">
      <div className="flex flex-col gap-2 w-full lg:w-3/4">
        <div className="flex flex-row items-center justify-start gap-2 ">
          <Calendar className="" />
          <h1 className="font-bold text-xl lg:text-2xl">Fixtures</h1>
        </div>

        {fixturesInRange.length === 0 && <NoFixturesMessage />}

        {pastFixtures.length > 0 && <GroupedFixturesList viewMode='fixtures' fixtures={pastFixtures} search={search} />}

        {upcomingFixtures.length > 0 && (
          <>
            <section id={sectionId} className="w-full h-10"></section>

            <h2 className="text-xl font-bold">Upcoming Fixtures</h2>

            <GroupedFixturesList viewMode='fixtures' fixtures={upcomingFixtures} search={search} />
          </>
        )}
      </div>

      <FixturesListScreenActionBar />
    </PageView>
  );
}

function NoFixturesMessage() {
  const [selectedDateRange, setSelectedDateRange] = useAtom(fixturesDateRangeAtom);

  const onClearFilter = () => {
    setSelectedDateRange(undefined);
  };

  return (
    <div className="w-full p-5  mt-10 flex flex-col items-center gap-5 text-slate-700 dark:text-slate-400">
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
