import { IFantasyLeague } from "../../types/fantasyLeague";
import { gamesService } from "../../services/gamesService";
import useSWR from "swr";
import { LoadingSpinner } from "../team-creation/player-list/LoadingSpinner";
import { ErrorState } from "../ui/ErrorState";
import FixtureCard from "../fixtures/FixtureCard";
import { IFixture } from "../../types/games";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface FixturesListProps {
  league: IFantasyLeague;
}

export function FantasyLeagueFixturesList({ league }: FixturesListProps) {
  const competitionId = league.official_league_id;

  const {
    data: allFixtures,
    error,
    isLoading,
  } = useSWR(competitionId, gamesService.getGamesByCompetitionId);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorState message={"Error fetching matches"} />;

  if (!allFixtures)
    return (
      <div>
        <p>There are no fixtures available</p>
      </div>
    );

  const fixtures = filterMatchesForRound(allFixtures, league);

  // Group fixtures by day
  const fixturesByDay: Record<string, IFixture[]> = {};

  fixtures.forEach((fixture) => {
    if (fixture.kickoff_time) {
      const dayKey = format(new Date(fixture.kickoff_time), "yyyy-MM-dd");
      if (!fixturesByDay[dayKey]) {
        fixturesByDay[dayKey] = [];
      }
      fixturesByDay[dayKey].push(fixture);
    }
  });

  // Get sorted day keys
  const sortedDays = Object.keys(fixturesByDay).sort();

  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:border-dark-600">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Calendar size={24} className="text-primary-500" />
          Upcoming Fixtures
        </h2>
      </div>

      <div className="divide-y divide-gray-300 dark:divide-slate-800/50">
        {sortedDays.map((dayKey) => (
          <div key={dayKey}>
            {/* Day header */}
            <div className="px-4 py-2 bg-gray-100 dark:bg-dark-700/70 font-medium text-gray-800 dark:text-gray-200">
              {format(new Date(dayKey), "EEEE, MMMM d, yyyy")}
            </div>

            {/* Fixtures for this day */}
            <div className="divide-y divide-gray-200 dark:divide-slate-800/50 px-3">
              {fixturesByDay[dayKey].map((fixture, index) => (
                <FixtureCard showLogos fixture={fixture} key={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const filterMatchesForRound = (
  fixtures: IFixture[],
  league: IFantasyLeague
) => {
  return fixtures
    .filter((f) => {
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
