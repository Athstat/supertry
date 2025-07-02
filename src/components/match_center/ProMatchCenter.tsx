import useSWR from "swr"
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import { AFRICA_CUP, ERPC_COMPETITION_ID, INVESTEC_CHAMPIONSHIP_CUP, URC_COMPETIION_ID } from "../../types/constants";
import { LoadingState } from "../ui/LoadingState";
import FixtureCard from "../fixtures/FixtureCard";


export default function ProMatchCenter() {

    const key = 'pro-fixtures';
    let { data: fixtures, isLoading } = useSWR(key, () => fetcher(competitionIds));

    if (isLoading) {
        return <LoadingState />
    }

    fixtures = fixtures ?? [];

    return (
        <div className="flex flex-col gap-4" >
            <h1 className="font-bold text-lg" >Pro Games</h1>

            <div className="flex flex-col gap-3" >
                {fixtures.map((fixture, index) => {
                    return <FixtureCard
                        fixture={fixture}
                        key={index} 
                        showLogos
                        className="rounded-xl"
                    />
                })}
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
