import { Calendar } from "lucide-react";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { gamesService } from "../../services/gamesService";
import useSWR from 'swr';
import { LoadingSpinner } from "../team-creation/player-list/LoadingSpinner";
import { ErrorState } from "../ui/ErrorState";

interface FixturesListProps {
  league: IFantasyLeague
}

export function FantasyLeagueFixturesList({ league }: FixturesListProps) {

  const competitionId = league.official_league_id;

  const { data: allFixtures, error, isLoading } = useSWR(competitionId,gamesService.getGamesByCompetitionId);

  if (isLoading) return <LoadingSpinner />

  if (error) return <ErrorState message={"Error fetching matches"} />
  console.log("Error fetching matches", error);

  if (!allFixtures) return <div>
    <p>There are no fixtures available</p>
  </div>

  console.log("League Start", league.start_round, league.end_round);

  const fixtures = allFixtures.filter(f => {

    const start_round = league.start_round;
    const end_round = league.end_round;
    
    return start_round && end_round ? f.round >= start_round && f.round <= end_round : true;
  }).sort((a, b) => new Date(b.kickoff_time ?? new Date()).valueOf() - new Date(a.kickoff_time ?? new Date()).valueOf() )

  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm ">
      <div className="p-4 border-b border-gray-700 dark:border-dark-600">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Calendar size={24} className="text-primary-500" />
          Upcoming Fixtures
        </h2>
      </div>

      <div className="divide-y divide-gray-700 dark:divide-dark-600 px-3">
        {fixtures.map((fixture, index) => (
          <div
            key={index}
            className="p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {fixture.competition_name}
              </span>
             { <span className="text-sm font-medium dark:text-gray-300">
                {fixture.kickoff_time && new Date(fixture.kickoff_time).toLocaleDateString()}
              </span>}
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium dark:text-gray-100">
                {fixture.team_name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">vs</div>
              <div className="font-medium dark:text-gray-100">
                {fixture.opposition_team_name}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              {/* <span>{fixture.time}</span> */}
              <span>{fixture.venue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
