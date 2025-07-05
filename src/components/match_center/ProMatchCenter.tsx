import useSWR from "swr"
import { gamesService } from "../../services/gamesService";
import { LoadingState } from "../ui/LoadingState";
import FixtureCard from "../fixtures/FixtureCard";
import { subHours } from "date-fns";
import { useQueryState } from "../../hooks/useQueryState";
import NoContentCard from "../shared/NoContentMessage";
import MatchSeasonFilterBar from "./MatcheSeasonFilterBar";
import MatchCenterSearchBar from "./MatchCenterSearchBar";
import { searchProFixturePredicate } from "../../utils/fixtureUtils";
import { twMerge } from "tailwind-merge";
import { Maximize2, Minimize2 } from "lucide-react";

export default function ProMatchCenter() {

    const key = 'pro-fixtures';
    let { data: fixtures, isLoading } = useSWR(key, () => gamesService.getAllSupportedGames());

    const [season, setSeason] = useQueryState('pcid', { init: 'all' });
    const [search, setSearch] = useQueryState('proq');
    const [focus, setFocus] = useQueryState('focus');

    const toggleFocus = () => {

        if (focus === 'upcoming') {
            setFocus('');
            return;
        }

        setFocus('upcoming')
    }

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
            const now = (new Date()).valueOf();
            return now > new Date(kickoff).valueOf();
        }

        return false;
    }).sort((a, b) => {
        const aE = new Date(a.kickoff_time ?? new Date());
        const bE = new Date(b.kickoff_time ?? new Date());

        return bE.valueOf() - aE.valueOf();
    });

    const upcomingFixtures = filteredFixtures.filter((f) => {
        const kickoff = f.kickoff_time

        if (kickoff) {
            const now = subHours(new Date(), 2).valueOf();
            return now < new Date(kickoff).valueOf();
        }

        return false;
    }).sort((a, b) => {
        const aE = new Date(a.kickoff_time ?? new Date());
        const bE = new Date(b.kickoff_time ?? new Date());

        return aE.valueOf() - bE.valueOf();
    });

    return (
        <div className="flex flex-col gap-4" >
            <h1 className="font-bold text-lg" >Pro Games</h1>
            
            <MatchCenterSearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Search Pro Games, Seasons ..."
            />

            <MatchSeasonFilterBar 
                seasons={seasons}
                onChange={setSeason}
                value={season}
            />

            <div className="flex flex-col gap-4" >
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-semibold text-lg" >Upcoming Fixtures</p>
                    <button className="cursor-pointer p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/40 " onClick={toggleFocus} >
                        {focus !== "upcoming" && <Maximize2 />}
                        {focus === "upcoming" && <Minimize2 />}
                    </button>
                </div>

                <div className={twMerge(
                    "flex flex-row items-center gap-3 overflow-x-auto",
                    focus === 'upcoming' && 'flex flex-col gap-2 overflow-x-hidden'
                )} >
                    {upcomingFixtures.map((fixture, index) => {
                        return <FixtureCard
                            fixture={fixture}
                            key={index}
                            showLogos
                            className={twMerge(
                                "rounded-xl border min-w-96 max-h-[250px] min-h-[250px] dark:border-slate-700 flex-1",
                                focus === 'upcoming' && 'w-full'
                            )}
                            showCompetition
                        />
                    })}
                </div>

                {upcomingFixtures.length === 0 && <NoContentCard message="There are no upcoming fixtures" />}

            </div>

            <div className="flex flex-col gap-4" >
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-semibold text-lg" >Past Fixtures</p>
                </div>

                <div className="flex flex-col items-center gap-3 w-full" >
                    {pastFixtures.map((fixture, index) => {
                        return <FixtureCard
                            fixture={fixture}
                            key={index}
                            showLogos
                            showCompetition
                            className="rounded-xl border w-full min-h-full dark:border-slate-700 flex-1"
                        />
                    })}
                </div>

            </div>

        </div>
    )
}