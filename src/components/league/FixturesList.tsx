import { IFantasyLeague } from '../../types/fantasyLeague';
import { gamesService } from '../../services/gamesService';
import useSWR from 'swr';
import { LoadingSpinner } from '../team-creation/player-list/LoadingSpinner';
import { ErrorState } from '../ui/ErrorState';
import FixtureCard from '../fixtures/FixtureCard';
import { IFixture } from '../../types/games';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { RankedFantasyTeam } from '../../types/league';
import { useFetch } from '../../hooks/useFetch';
import { fantasyTeamService } from '../../services/fantasyTeamService';
import LeaguePredictionFixtureCard from './LeaguePredictionFixtureCard';
import GroupedFixturesList from '../fixtures/GroupedFixturesList';

interface FixturesListProps {
  league: IFantasyLeague;
  userTeam?: RankedFantasyTeam;
}

const filterMatchesForRound = (fixtures: IFixture[], league: IFantasyLeague) => {
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

export function FantasyLeagueFixturesList({ league, userTeam }: FixturesListProps) {
  const competitionId = league.official_league_id;

  const {
    data: allFixtures,
    error,
    isLoading,
  } = useSWR(competitionId, gamesService.getGamesByCompetitionId);
  const { data, isLoading: isLoadingUserTeamAthletes } = useFetch(
    'user-team-athletes',
    userTeam?.team_id ?? 'fall-back',
    fantasyTeamService.fetchTeamAthletes
  );

  if (isLoading || isLoadingUserTeamAthletes) return <LoadingSpinner />;

  if (error) return <ErrorState message={'Error fetching matches'} />;

  if (!allFixtures)
    return (
      <div>
        <p>There are no fixtures available</p>
      </div>
    );

  const fixtures = filterMatchesForRound(allFixtures, league);

  // Group fixtures by day
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

  // Get sorted day keys
  const sortedDays = Object.keys(fixturesByDay).sort();
  const userTeamAthletes = data ?? [];

  console.log('Team athletes ', userTeamAthletes);

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

      <div>
        <GroupedFixturesList fixtures={fixtures} />
      </div>
    </div>
  );
}
