import { subHours } from 'date-fns';
import { gamesService } from '../../services/gamesService';
import useSWR from 'swr';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { Calendar } from 'lucide-react';
import { useRouter } from '../../hooks/useRoter';
import { Fragment } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import SmallFixtureCard from '../fixtures/SmallFixtureCard';
import SecondaryText from '../shared/SecondaryText';
import { Tv } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type Props = {
  hideTitleBar?: boolean,
  hidePastFixtures?: boolean
}

export default function UpcomingFixturesSection({ hideTitleBar, hidePastFixtures }: Props) {
  const {
    data: fetchedFixtures,
    isLoading,
    error,
  } = useSWR('pro-fixtures', () => gamesService.getAllSupportedGames());
  const { push } = useRouter();

  // const seasonIds = [
  //   '695fa717-1448-5080-8f6f-64345a714b10',
  // ];

  // const { seasons, currSeason, setCurrSeason } = useSupportedSeasons({
  //   wantedSeasonsId: seasonIds,
  // });

  const [season,] = useQueryState('pcid', { init: 'all' });

  if (isLoading) return <LoadingState />;

  if (error) {
    return <ErrorState message="Failed to fetch upcoming matches" />;
  }

  const fixtures = fetchedFixtures ?? [];

  const seasons: { name: string; id: string }[] = [];

  fixtures.forEach(f => {
    if (!seasons.some(c => c.id === f.league_id) && f.competition_name && f.league_id) {
      seasons.push({ name: f.competition_name, id: f.league_id });
    }
  });

  fixtures
    .filter(f => {
      return !season || season === 'all' ? true : f.league_id === season;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf()
        : 0
    );

  const upcomingFixtures = fixtures
    .filter(f => {
      const kickoff = f.kickoff_time;

      if (kickoff) {
        const now = subHours(new Date(), 2).valueOf();
        return now < new Date(kickoff).valueOf();
      }

      return false;
    })
    .sort((a, b) => {
      const aE = new Date(a.kickoff_time ?? new Date());
      const bE = new Date(b.kickoff_time ?? new Date());

      return aE.valueOf() - bE.valueOf();
    })
    .slice(0, 5);

  const pastFixtures = fixtures
    .filter(f => {
      const kickoff = f.kickoff_time;

      if (kickoff) {
        const { game_status } = f;
        return game_status === 'completed' || game_status === 'result';
      }

      return false;
    })
    .sort((a, b) => {
      const aE = new Date(a.kickoff_time ?? new Date());
      const bE = new Date(b.kickoff_time ?? new Date());

      return bE.valueOf() - aE.valueOf();
    });

  const liveFixtures = fixtures
    .filter(f => {

      const kickoff = f.kickoff_time;

      if (kickoff) {
        const now = new Date().valueOf();
        const kickoffPassed = now > new Date(kickoff).valueOf();
        const { game_status } = f;
        return kickoffPassed && game_status === 'in_progress';
      }

      return false;
    })
    .sort((a, b) => {
      const aE = new Date(a.kickoff_time ?? new Date());
      const bE = new Date(b.kickoff_time ?? new Date());

      return bE.valueOf() - aE.valueOf();
    });

  const handleViewAllFixtures = () => {
    push('/fixtures#upcoming-matches')
  }

  return (
    <div className="flex flex-col gap-4">
      {!hideTitleBar && <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Calendar className="w-4 h-4 text-primary-700 dark:text-primary-400" />
          Fixtures
        </h3>
        <button
          onClick={handleViewAllFixtures}
          className="text-sm text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          View All
        </button>
      </div>}

      {/* <PilledSeasonFilterBar
        seasons={seasons}
        onChange={(sId?: string) => {
          const szn = seasons.find(f => f.id === sId);
          setCurrSeason(szn);
        }}
        value={currSeason?.id}
        sortDesc
        hideAllOption
      /> */}

      {liveFixtures.length > 0 && (
        <Fragment>
          <div className='flex flex-row bg-red-500 animate-pulse text-white w-fit px-2 py-0.5 rounded-xl items-center gap-2' >
            <Tv className="w-4 h-4" />
            <p>Live Fixtures </p>
          </div>

          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
            {liveFixtures.map(fixture => {
              return (
                <SmallFixtureCard
                  fixture={fixture}
                  key={fixture.game_id}
                  className='min-w-[85%]'
                  hideVotingBox
                />
              );
            })}
          </div>
        </Fragment>
      )}


      <div>
        <SecondaryText>Upcoming Fixtures</SecondaryText>
      </div>
      {upcomingFixtures.length > 0 && (
        <div className={twMerge(
          "flex space-x-4 overflow-x-auto no-scrollbar pb-2",
          hidePastFixtures && 'flex flex-col space-x-0 gap-4'
        )}>
          {upcomingFixtures.map(fixture => {
            return (
              <SmallFixtureCard
                fixture={fixture}
                key={fixture.game_id}
                className='min-w-[85%]'
                hideVotingBox
              />
            );
          })}
        </div>
      )}

      {!hidePastFixtures && pastFixtures.length > 0 && (
        <Fragment>
          <div>
            <SecondaryText>Past Fixtures</SecondaryText>
          </div>

          <div className="flex flex-col gap-2 pb-2">
            {[...pastFixtures].slice(0, 3).map(fixture => {
              return (
                <SmallFixtureCard
                  fixture={fixture}
                  key={fixture.game_id}
                  hideVotingBox
                />
              );
            })}
          </div>
        </Fragment>
      )}

      <div className='flex flex-row items-center justify-center' >
        <button onClick={handleViewAllFixtures} className='text-blue-500' >View All Fixtures</button>
      </div>
    </div>
  );
}

