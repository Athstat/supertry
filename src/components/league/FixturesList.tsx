import { IFantasyLeague } from "../../types/fantasyLeague";
import { gamesService } from "../../services/gamesService";
import useSWR from 'swr';
import { LoadingSpinner } from "../team-creation/player-list/LoadingSpinner";
import { ErrorState } from "../ui/ErrorState";
import FixtureCard from "../fixtures/FixtureCard";
import { IFixture } from "../../types/games";
import { Calendar } from "lucide-react";

interface FixturesListProps {
  league: IFantasyLeague
}

export function FantasyLeagueFixturesList({ league }: FixturesListProps) {

  const competitionId = league.official_league_id;

  const { data: allFixtures, error, isLoading } = useSWR(competitionId, gamesService.getGamesByCompetitionId);

  if (isLoading) return <LoadingSpinner />

  if (error) return <ErrorState message={"Error fetching matches"} />

  if (!allFixtures) return <div>
    <p>There are no fixtures available</p>
  </div>

  const fixtures = filterMatchesForRound(allFixtures, league);
  

  return (
    <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm ">

      <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:border-dark-600">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Calendar size={24} className="text-primary-500" />
          Upcoming Fixtures
        </h2>
      </div>

      <div className="divide-y divide-gray-300 dark:divide-slate-800/50 px-3">
        {fixtures.map((fixture, index) => (
          <FixtureCard fixture={fixture} key={index} />
        ))}
      </div>
    </div>
  );
}

const filterMatchesForRound = (fixtures: IFixture[], league: IFantasyLeague) => {
  
  return fixtures.filter(f => {

    const start_round = league.start_round;
    const end_round = league.end_round;
    
    if (start_round && end_round) {

      return f.round >= start_round && f.round <= end_round;
    }

    return true;

  }).sort((a, b) => new Date(b.kickoff_time ?? new Date()).valueOf() - new Date(a.kickoff_time ?? new Date()).valueOf())

}