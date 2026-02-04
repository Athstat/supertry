import SbrFixtureCard from '../sbr/fixture/card/SbrFixtureCard';
import { ChevronRight } from 'lucide-react';
import NoContentCard from '../ui/typography/NoContentMessage';
import { ISbrFixture } from '../../types/sbr';
import { twMerge } from 'tailwind-merge';

type Props = {
  fixtures: ISbrFixture[],
  searchQuery?: string,
  onNextWeek?: () => void,
  className?: string
};

export default function SbrMatchCenter({ fixtures, searchQuery, onNextWeek, className }: Props) {

  const displayFixtures = fixtures;
  const hasAnyFixtures = displayFixtures.length > 0;


  return (
    <div className={twMerge(
      "flex flex-col gap-4",
      className
    )}>

      {/* Fixtures List */}
      <div className="flex flex-col gap-3 w-full">

        {!hasAnyFixtures && !searchQuery && <NoContentCard message="No fixtures available" />}

        {displayFixtures.length === 0 && !searchQuery && hasAnyFixtures && (
          <div className="flex flex-col gap-3 items-center">
            <NoContentCard message="No fixtures found for this week" />

            <button
              onClick={onNextWeek}
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
              className="rounded-xl border w-full dark:border-slate-700"
              hideVoting
            />
          );
        })}
      </div>
    </div>
  );
}
