import { addDays, eachDayOfInterval } from "date-fns";
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import useSWR from "swr";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import { Calendar } from "lucide-react";
import { useRouter } from "../../hooks/useRoter";
import GroupedFixturesList from "../fixtures/GroupedFixturesList";
import RoundedCard from "../shared/RoundedCard";

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


  return (
    <RoundedCard className="p-6 flex flex-col gap-4" >

      <div className="flex flex-row items-center justify-between gap-2" >
        <div className="flex flex-row items-center gap-2" >
          <Calendar className="text-primary-500" />
          <p className="text-xl font-bold" >Upcoming Fixtures</p>
        </div>

        <button
          onClick={() => push("/fixtures#upcoming-matches")}
          className="text-blue-500"
        >
          View All Fixtures
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <GroupedFixturesList fixtures={sortedFixtures} />
      </div>

      <div className="w-full flex items-center justify-center">
        <button
          onClick={() => push("/fixtures#upcoming-matches")}
          className="text-blue-500"
        >
          View All Fixtures
        </button>
      </div>
    </RoundedCard>
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
