import { ChevronRight } from 'lucide-react';
import WeekNavigator from '../calendar/WeekNavigator';
import SbrFixtureCard from '../../sbr/SbrFixtureCard';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { useQueryState } from '../../../hooks/web/useQueryState';
import NoContentCard from '../../ui/typography/NoContentMessage';
import { useSbrFixtures } from '../../../hooks/fixtures/useSbrFixtures';
import { useFixtureCursor } from '../../../hooks/fixtures/useFixtureCursor';
import { useMemo } from 'react';

type Props = {
  searchQuery: string;
};

export default function SbrMatchCenter({ searchQuery }: Props) {
  const { fixtures, isLoading } = useSbrFixtures();
  const [season,] = useQueryState<string | undefined>('sbrcs', { init: 'all' });

  const seasonFixtures = useMemo(() => {
    if (season === "all") {
      return fixtures;
    }

    return fixtures.filter((f) => {
      return f.season?.toLowerCase() === season?.toLowerCase();
    })
  }, [fixtures, season])

  // Get current week on mount
  const {
    weekHeader, handleNextWeek, handlePreviousWeek,
    weekFixtures: displayFixtures, hasAnyFixtures
  } = useFixtureCursor({ fixtures: seasonFixtures, isLoading });



  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col gap-8">


      <WeekNavigator
        onMoveNextWeek={handleNextWeek}
        onMovePreviousWeek={handlePreviousWeek}
        weekHeader={weekHeader}
        className='px-6'
      />

      {/* Fixtures List */}
      <div className="flex flex-col gap-3 w-full px-6">
        {!hasAnyFixtures && !searchQuery && <NoContentCard message="No fixtures available" />}

        {displayFixtures.length === 0 && !searchQuery && hasAnyFixtures && (
          <div className="flex flex-col gap-3 items-center">
            <NoContentCard message="No fixtures found for this week" />
            <button
              onClick={handleNextWeek}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span>View Next Fixtures</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
              hideVoting
              className="w-full dark:border-slate-700"
            />
          );
        })}
      </div>
    </div>
  );
}
