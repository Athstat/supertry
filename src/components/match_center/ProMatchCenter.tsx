import useSWR from "swr"
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import { AFRICA_CUP, ERPC_COMPETITION_ID, INVESTEC_CHAMPIONSHIP_CUP, URC_COMPETIION_ID } from "../../types/constants";
import { LoadingState } from "../ui/LoadingState";
import FixtureCard from "../fixtures/FixtureCard";
import { subHours } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useQueryState } from "../../hooks/useQueryState";
import NoContentCard from "../shared/NoContentMessage";
import MatchSeasonFilterBar from "./MatcheSeasonFilterBar";
import MatchCenterSearchBar from "./MatchCenterSearchBar";
import { searchFixturesPredicate, searchProFixturePredicate } from "../../utils/fixtureUtils";

export default function ProMatchCenter() {

    const key = 'pro-fixtures';
    let { data: fixtures, isLoading } = useSWR(key, () => fetcher(competitionIds));

    const [season, setSeason] = useQueryState('pcid', { init: 'all' });
    const [search, setSearch] = useQueryState('proq');

    if (isLoading) {
        return <LoadingState />
    }

    fixtures = fixtures ?? [];

    const seasons: { name: string, id: string }[] = [];

    fixtures.forEach((f) => {
        if (!seasons.some((c) => c.id === f.league_id) && f.competition_name && f.league_id) {
            seasons.push({ name: f.competition_name, id: f.league_id });
        }
    });

    const filteredFixtures = fixtures.filter((f) => {
        const seasonMatches = (!season || season === 'all') ? 
            true : f.league_id === season;

        const searchMatches = search ? searchProFixturePredicate(search, f) : true;

        return searchMatches && seasonMatches;

    })

    const pastFixtures = filteredFixtures.filter((f) => {
        const kickoff = f.kickoff_time

        if (kickoff) {
            const now = subHours(new Date(), 2).valueOf();
            return now > new Date(kickoff).valueOf();
        }

        return false;
    });

    const upcomingFixtures = filteredFixtures.filter((f) => {
        const kickoff = f.kickoff_time

        if (kickoff) {
            const now = subHours(new Date(), 2).valueOf();
            return now < new Date(kickoff).valueOf();
        }

        return false;
    });

    return (
        <div className="flex flex-col gap-4" >
            <h1 className="font-bold text-lg" >Pro Games</h1>
            
            <MatchCenterSearchBar 
                value={search}
                onChange={setSearch}
            />

            <MatchSeasonFilterBar 
                seasons={seasons}
                onChange={setSeason}
                value={season}
            />

            <div className="flex flex-col gap-4" >
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-semibold text-lg" >Upcoming Fixtures</p>
                    <ArrowRight />
                </div>

                <div className="flex flex-row items-center gap-3 overflow-x-auto" >
                    {upcomingFixtures.map((fixture, index) => {
                        return <FixtureCard
                            fixture={fixture}
                            key={index}
                            showLogos
                            className="rounded-xl border min-w-96 h-full dark:border-slate-700 flex-1"
                        />
                    })}
                </div>

                {upcomingFixtures.length === 0 && <NoContentCard message="There are no upcoming fixtures" />}

            </div>

            <div className="flex flex-col gap-4" >
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-semibold text-lg" >Past Fixtures</p>
                    <ArrowRight />
                </div>

                <div className="flex flex-col items-center gap-3 w-full" >
                    {pastFixtures.map((fixture, index) => {
                        return <FixtureCard
                            fixture={fixture}
                            key={index}
                            showLogos
                            className="rounded-xl border w-full h-full dark:border-slate-700 flex-1"
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
