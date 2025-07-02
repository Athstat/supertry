import useSWR from "swr"
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import { AFRICA_CUP, ERPC_COMPETITION_ID, INVESTEC_CHAMPIONSHIP_CUP, URC_COMPETIION_ID } from "../../types/constants";
import { LoadingState } from "../ui/LoadingState";
import FixtureCard from "../fixtures/FixtureCard";
import { subHours } from "date-fns";
import { ArrowRight } from "lucide-react";
import RoundedCard from "../shared/RoundedCard";
import { useQueryState } from "../../hooks/useQueryState";
import { twMerge } from "tailwind-merge";


export default function ProMatchCenter() {

    const key = 'pro-fixtures';
    let { data: fixtures, isLoading } = useSWR(key, () => fetcher(competitionIds));

    const [currCompetiton, setCurrentCompetiton] = useQueryState('pcid', { init: 'all' });

    if (isLoading) {
        return <LoadingState />
    }

    fixtures = fixtures ?? [];

    const competitions: { name: string, id: string }[] = [];

    fixtures.forEach((f) => {
        if (!competitions.some((c) => c.id === f.league_id) && f.competition_name && f.league_id) {
            competitions.push({ name: f.competition_name, id: f.league_id });
        }
    });

    const filteredFixtures = fixtures.filter((f) => {
        if (!currCompetiton || currCompetiton === 'all') {return true}
        return f.league_id === currCompetiton;
    })

    const pastFixtures = filteredFixtures.filter((f) => {
        const kickoff = f.kickoff_time

        if (kickoff) {
            const now = subHours(new Date(), 2).valueOf();
            return now > new Date(kickoff).valueOf();
        }

        return false;
    });


    return (
        <div className="flex flex-col gap-4" >
            <h1 className="font-bold text-lg" >Pro Games</h1>

            <div className="flex flex-row items-center overflow-y-auto gap-2" >

                <RoundedCard
                    className={twMerge(
                        "w-fit px-4 cursor-pointer text-nowrap py-2 rounded-lg",
                        currCompetiton === 'all' && "bg-blue-500 hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                    )}
                    onClick={() => setCurrentCompetiton('all')}
                >
                    {'All'}
                </RoundedCard>

                {competitions.map((c) => {
                    return (
                        <RoundedCard
                            className={twMerge(
                                "w-fit px-4 cursor-pointer text-nowrap py-2 rounded-lg",
                                currCompetiton === c.id && "bg-blue-500 hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                            )}
                            onClick={() => setCurrentCompetiton(c.id)}
                        >
                            {c.name}
                        </RoundedCard>
                    )
                })}
            </div>

            <div className="flex flex-col gap-4" >
                <div className="flex flex-row items-center justify-between" >
                    <p>Past Fixtures</p>
                    <ArrowRight />
                </div>

                <div className="flex flex-row items-center gap-3 overflow-x-auto" >
                    {pastFixtures.map((fixture, index) => {
                        return <FixtureCard
                            fixture={fixture}
                            key={index}
                            showLogos
                            className="rounded-xl border min-w-96 h-full dark:border-slate-700 flex-1"
                        />
                    })}
                </div>

            </div>

        </div>
    )
}

const competitionIds = [
    ERPC_COMPETITION_ID,
    INVESTEC_CHAMPIONSHIP_CUP,
    URC_COMPETIION_ID,
    AFRICA_CUP,
    'test-1',
];

async function fetcher(competitionIds: string[]) {
    let matches: IFixture[] = [];

    const fetchMatches = async (compId: string) => {
        const res = await gamesService.getGamesByCompetitionId(compId);
        matches = [...matches, ...res];
    };

    const promises = competitionIds.map(compId => {
        return fetchMatches(compId);
    });

    await Promise.all(promises);

    return matches;
}
