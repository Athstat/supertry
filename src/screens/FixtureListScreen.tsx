import { Calendar } from "lucide-react";
import useSWR from "swr";
import { IFixture } from "../types/games";
import { gamesService } from "../services/gamesService";
import { INVESTEC_CHAMPIONSHIP_CUP, URC_COMPETIION_ID } from "../types/constants";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import FixtureCard from "../components/fixtures/FixtureCard";

const competitionIds = [
    URC_COMPETIION_ID,
    INVESTEC_CHAMPIONSHIP_CUP
]

export default function FixtureListScreen() {

    
    const {data: fixtures, error, isLoading} = useSWR(competitionIds, fetcher);

    if (isLoading) return <LoadingState message="Loading Fixtures" />

    if (!fixtures) return <ErrorState message={error} />

    return (
        <div className="dark:text-white p-4 flex flex-col gap-5" >
            <div className="flex flex-row items-center justify-start gap-2" >
                <Calendar className="c" />
                <h1 className="font-bold text-xl lg:text-2xl" >Fixtures</h1>
            </div>

            <div className=" grid grid-cols-1 gap-3 " >
                {fixtures.map((fixture, index) => {
                    return <FixtureCard className="dark:bg-gray-800 dark:hover:bg-gray-800/80 bg-gray-200 hover:bg-gray-300 rounded-xl" fixture={fixture} key={index} />
                })}
            </div>

        </div>
    )
}

async function fetcher(competitionIds: string[]) {
    let matches: IFixture[] = [];

    const fetchMatches = async (compId: string) => {
        const res = await gamesService.getGamesByCompetitionId(compId);
        matches = [...matches, ...res];
    } 

    const promises = competitionIds.map((compId) => {
        return fetchMatches(compId);
    });

    await Promise.all(promises);

    return matches;
}
