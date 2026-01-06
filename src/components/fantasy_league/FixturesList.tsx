import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { gamesService } from '../../services/gamesService';
import useSWR from 'swr';
import { LoadingSpinner } from '../team-creation/player-list/LoadingSpinner';
import { ErrorState } from '../ui/ErrorState';
import FixtureCard from '../fixture/FixtureCard';
import { IFixture } from '../../types/games';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { RankedFantasyTeam } from '../../types/league';
import { useFetch } from '../../hooks/useFetch';
import { fantasyTeamService } from '../../services/fantasyTeamService';

interface FixturesListProps {
  league: IFantasyLeagueRound;
  userTeam?: RankedFantasyTeam;
  getGamesByCompetitionId?: (competitionId: string) => any[];
}

const filterMatchesForRound = (fixtures: IFixture[], league: IFantasyLeagueRound) => {
  return fixtures
    .filter(f => {
      const start_round = league.start_round;
      const end_round = league.end_round;

      if (start_round && end_round) {
        return f.round >= start_round && f.round <= end_round;
      }

      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.kickoff_time ?? new Date()).valueOf() -
        new Date(b.kickoff_time ?? new Date()).valueOf()
    );
};

export function FantasyLeagueFixturesList({
  league,
  userTeam,
  getGamesByCompetitionId,
}: FixturesListProps) {
  const competitionId = league.official_league_id;

  // Use provided getGamesByCompetitionId function or fallback to direct API call
  const {
    data: allFixtures,
    error,
    isLoading,
  } = useSWR(
    getGamesByCompetitionId ? null : competitionId, // Only use SWR if no prop provided
    getGamesByCompetitionId ? null : gamesService.getGamesByCompetitionId
  );

  // Get fixtures from prop function if available
  const fixturesFromProp =
    getGamesByCompetitionId && competitionId ? getGamesByCompetitionId(competitionId) : null;
  const fixtures = fixturesFromProp || allFixtures;
  // Only fetch team athletes if userTeam is defined
  const { data, isLoading: isLoadingUserTeamAthletes } = useFetch(
    'user-team-athletes',
    userTeam?.team_id,
    fantasyTeamService.fetchTeamAthletes
  );

  // Show loading state if either fixtures are loading or we're waiting for user team data
  if (isLoading || (userTeam && isLoadingUserTeamAthletes)) return <LoadingSpinner />;

  if (error) return <ErrorState message={'Error fetching matches'} />;

  if (!fixtures)
    return (
      <div>
        <p>There are no fixtures available</p>
      </div>
    );

  const filteredFixtures = filterMatchesForRound(fixtures, league);

  // Group fixtures by day
  const fixturesByDay: Record<string, IFixture[]> = {};

  filteredFixtures.forEach((fixture: IFixture) => {
    if (fixture.kickoff_time) {
      const dayKey = format(new Date(fixture.kickoff_time), 'yyyy-MM-dd');
      if (!fixturesByDay[dayKey]) {
        fixturesByDay[dayKey] = [];
      }
      fixturesByDay[dayKey].push(fixture);
    }
  });

  // Get sorted day keys
  const sortedDays = Object.keys(fixturesByDay).sort();
  const userTeamAthletes = data ?? [];

  const generateFixtureMessage = (fixture: IFixture) => {
    const playersParticipating = userTeamAthletes.filter(a => {
      const isPlaying =
        fixture.team_id === a.athlete_team_id || fixture.opposition_team_id === a.athlete_team_id;
      return isPlaying;
    });

    const singularTense = !league.has_ended ? 'is playing' : 'played';
    const pluralTense = !league.has_ended ? 'are playing' : 'played';

    const count = playersParticipating.length;

    if (count === 0) {
      return undefined;
    }

    if (count === 1) {
      const onePlayer = playersParticipating[0];
      return `One of your players, ${onePlayer.player_name}, ${singularTense} in this match`;
    }

    if (count === 6) {
      return `All of your players ${pluralTense} in this match`;
    }

    if (count > 1) {
      return `${count} of your players ${pluralTense} in this match`;
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:border-dark-600">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Calendar size={24} className="text-primary-500" />
          Upcoming Fixtures
        </h2>
      </div>

      <div className="">
        {sortedDays.map(dayKey => (
          <div className="flex flex-col gap-2 mb-2" key={dayKey}>
            {/* Day header */}
            <div className="px-4 py-2 bg-gray-100 dark:bg-dark-800/40 border border-slate-100 dark:border-slate-800 font-medium text-gray-800 dark:text-gray-200">
              {format(new Date(dayKey), 'EEEE, MMMM d, yyyy')}
            </div>

            {/* Fixtures for this day */}
            <div className="divide-y flex flex-col gap-2 px-3">
              {fixturesByDay[dayKey].map((fixture, index) => (
                <FixtureCard
                  fixture={fixture}
                  key={index}
                  showCompetition
                  showLogos
                  className="rounded-xl border dark:border-slate-700"
                  message={generateFixtureMessage(fixture)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
