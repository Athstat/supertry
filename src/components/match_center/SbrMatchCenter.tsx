import useSWR from 'swr';
import { sbrService } from '../../services/sbr/sbrService';
import { LoadingState } from '../ui/LoadingState';
import SbrFixtureCard from '../sbr/SbrFixtureCard';
import PilledSeasonFilterBar from './MatcheSeasonFilterBar';
import { useQueryState } from '../../hooks/useQueryState';
import { SeasonFilterBarItem } from '../../types/games';
import { Maximize2, Minimize2 } from 'lucide-react';
import NoContentCard from '../shared/NoContentMessage';
import MatchCenterSearchBar from './MatchCenterSearchBar';
import { searchSbrFixturePredicate } from '../../utils/sbrUtils';
import { twMerge } from 'tailwind-merge';

export default function SbrMatchCenter() {
  const key = 'sbr-fixtures';
  let { data: fixtures, isLoading } = useSWR(key, () => sbrService.getAllFixtures());
  const [season, setSeason] = useQueryState<string | undefined>('sbrcs', { init: 'all' });
  const [search, setSearch] = useQueryState<string | undefined>('proq');
  const [focus, setFocus] = useQueryState<string | undefined>('sbrfcs');

  const toggleFocus = () => {
    if (focus === 'upcoming') {
      setFocus('');
      return;
    }

    setFocus('upcoming');
  };

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

  const upcomingFixtures = filteredFixtures
    .filter(f => {
      const kickoff = f.kickoff_time ? new Date(f.kickoff_time) : undefined;

      if (kickoff) {
        const now = new Date().valueOf();
        return kickoff.valueOf() > now;
      }

      return false;
    })
    .sort((a, b) => {
      const aE = new Date(a.kickoff_time ?? new Date());
      const bE = new Date(b.kickoff_time ?? new Date());

      return aE.valueOf() - bE.valueOf();
    });

  const pastFixtures = filteredFixtures
    .filter(f => {
      const kickoff = f.kickoff_time ? new Date(f.kickoff_time) : undefined;

      if (kickoff) {
        const now = new Date();
        return now.valueOf() > kickoff.valueOf();
      }

      return false;
    })
    .sort((a, b) => {
      const aE = new Date(a.kickoff_time ?? new Date());
      const bE = new Date(b.kickoff_time ?? new Date());

      return bE.valueOf() - aE.valueOf();
    });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-lg">School Boy Rugby</h1>

      <MatchCenterSearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search SBR games, seasons ..."
      />

      <PilledSeasonFilterBar seasons={seasons} onChange={setSeason} value={season} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <p className="font-semibold text-lg">Upcoming Fixtures</p>
          <button onClick={toggleFocus}>
            {focus === 'upcoming' && <Minimize2 />}
            {focus !== 'upcoming' && <Maximize2 />}
          </button>
        </div>

        <div
          className={twMerge(
            'flex flex-row gap-2 overflow-y-hidden overflow-x-auto',
            focus === 'upcoming' && 'flex flex-col gap-2 overflow-x-hidden'
          )}
        >
          {upcomingFixtures.map((fixture, index) => {
            return (
              <SbrFixtureCard
                fixture={fixture}
                key={index}
                showLogos
                showCompetition
                showKickOffTime
                className={twMerge('min-w-96', focus === 'upcoming' && 'min-w-full')}
              />
            );
          })}
        </div>

        {upcomingFixtures.length === 0 && (
          <NoContentCard message="No upcoming fixtures were found" />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <p className="font-semibold text-lg">Past Fixtures</p>
        </div>

        <div className="flex flex-col gap-2 max-h-62 overflow-y-hidden overflow-x-auto ">
          {pastFixtures.map((fixture, index) => {
            return (
              <SbrFixtureCard
                fixture={fixture}
                key={index}
                showLogos
                className="min-w-[350px] max-h-[300px]"
                showKickOffTime
                showCompetition
              />
            );
          })}
        </div>

        {pastFixtures.length === 0 && <NoContentCard message="No past fixtures were found" />}
      </div>
    </div>
  );
}
