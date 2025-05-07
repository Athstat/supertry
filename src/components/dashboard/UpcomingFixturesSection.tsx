import { addDays, eachDayOfInterval } from "date-fns";
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
        end: nextDayWeek
    });

    const {data: fixtures, isLoading, error} = useSWR(dates, fetcher);
    const {push} = useRouter();

    if (isLoading) return <LoadingState />

    if (!fixtures || error) {
        return <ErrorState message="Failed to fetch upcoming matches" />
    }

    const shortList = fixtures
    .sort((a, b) => a.kickoff_time && b.kickoff_time ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf() : 0)
    .slice(0, 3)

    return (
        <TitledCard icon={Calendar} title="Upcoming Matches">

            <div className="grid grid-cols-1 gap-3 divide-y dark:divide-slate-800 divide-slate-200  " >
                {shortList.map((fixture, index) => {
                    return <FixtureCard showLogos className="" fixture={fixture} key={index} />
                })}
            </div>

            <div className="w-full flex items-center justify-center" >
                <button onClick={() => push("/fixtures#upcoming-matches")} className="text-blue-500" >View All Fixtures</button>
            </div>
        </TitledCard>
    )
}

async function fetcher(dates: Date[]) {
    let matches: IFixture[] = [];

    const fetchMatches = async (date: Date) => {
        const res = await gamesService.getGamesByDate(date);
        matches = [...matches, ...res];
    }

    const promises = dates.map((date) => {
        return fetchMatches(date);
    });

    await Promise.all(promises);

    return matches;
}

