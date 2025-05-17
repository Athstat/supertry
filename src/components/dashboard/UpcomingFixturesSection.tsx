import { addDays, eachDayOfInterval, format } from "date-fns";
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import useSWR from "swr";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import TitledCard from "../shared/TitledCard";
import { Calendar } from "lucide-react";
import FixtureCard from "../fixtures/FixtureCard";
import { useRouter } from "../../hooks/useRoter";

export default function UpcomingFixturesSection() {
  const today = new Date();
  const nextDayWeek = addDays(today, 7);
  const dates = eachDayOfInterval({
    start: today,
    end: nextDayWeek,
  });

  const { data: fixtures, isLoading, error } = useSWR(dates, fetcher);
  const { push } = useRouter();

  if (isLoading) return <LoadingState />;

  if (!fixtures || error) {
    return <ErrorState message="Failed to fetch upcoming matches" />;
  }

  // Sort fixtures by date and time
  const sortedFixtures = fixtures
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() -
          new Date(b.kickoff_time).valueOf()
        : 0
    )
    .filter(f => {
      return f.game_status !== "completed"
    })
    .slice(0, 5); // Show up to 5 fixtures instead of just 3

  // Group fixtures by day
  const fixturesByDay: Record<string, IFixture[]> = {};

  sortedFixtures.forEach((fixture) => {
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
    <TitledCard icon={Calendar} title="Fixtures">
      <div className="grid grid-cols-1 gap-2">
        {sortedDays.map((dayKey) => (
          <div key={dayKey} className="mb-2">
            {/* Day header */}
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 px-1">
              {format(new Date(dayKey), "EEEE, MMMM d")}
            </div>

            {/* Fixtures for this day */}
            <div className="grid grid-cols-1 gap-2 divide-y dark:divide-slate-800 divide-slate-200">
              {fixturesByDay[dayKey].map((fixture, index) => (
                <FixtureCard
                  showLogos
                  className=""
                  fixture={fixture}
                  key={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center">
        <button
          onClick={() => push("/fixtures#upcoming-matches")}
          className="text-blue-500"
        >
          View All Fixtures
        </button>
      </div>
    </TitledCard>
  );
}

async function fetcher(dates: Date[]) {
  let matches: IFixture[] = [];

  const fetchMatches = async (date: Date) => {
    const res = await gamesService.getGamesByDate(date);
    matches = [...matches, ...res];
  };

  const promises = dates.map((date) => {
    return fetchMatches(date);
  });

  await Promise.all(promises);

  return matches;
}
