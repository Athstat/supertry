import { Calendar, ChevronDown } from "lucide-react";
import useSWR from "swr";
import { IFixture } from "../types/games";
import { gamesService } from "../services/gamesService";
import { ERPC_COMPETITION_ID, INVESTEC_CHAMPIONSHIP_CUP } from "../types/constants";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import FixtureCard from "../components/fixtures/FixtureCard";
import { useEffect, useState } from "react";
import { searchFixturesPredicate } from "../utils/fixtureUtils";
import { useSectionNavigation } from "../hooks/useSectionNavigation";

const competitionIds = [
    ERPC_COMPETITION_ID,
    INVESTEC_CHAMPIONSHIP_CUP
]

export default function FixtureListScreen() {


    const { data: fixtures, error, isLoading } = useSWR(competitionIds, fetcher);
    const [search, setSearch] = useState("");

    const sectionId = "upcoming_matches";
    const {scrollToSection} = useSectionNavigation(["upcoming_matches"])

    useEffect(() => {
        scrollToSection(sectionId);
    }, []);

    if (isLoading) return <LoadingState message="Loading Fixtures" />
    if (!fixtures) return <ErrorState message={error} />


    const dateNow = new Date();

    const pastFixtures = fixtures.filter((f) => {
        if (f.kickoff_time) {
            return f.game_status === "complete" || new Date(f.kickoff_time).valueOf() < dateNow.valueOf();
        }

        return false;
    })
    .sort((a, b) => a.kickoff_time && b.kickoff_time ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf() : 0)
    .reverse()
    .splice(0, 5);


    const upcomingFixtures = fixtures.filter((f) => {
        if (f.kickoff_time) {
            return new Date(f.kickoff_time).valueOf() > dateNow.valueOf();
        }

        return false;
    });

    return (
        <div className="dark:text-white  p-4 flex flex-col items-center justify-start" >
            <div className="flex flex-col gap-5 w-full lg:w-3/4" >

                <div className="flex flex-row items-center justify-start gap-2 " >
                    <Calendar className="" />
                    <h1 className="font-bold text-xl lg:text-2xl" >Fixtures</h1>
                </div>

                <div className="flex flex-row w-full" >
                    <input
                        placeholder="Search Fixtures..."
                        className="bg-gray-800 outline-none p-3 flex-1 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className=" grid grid-cols-1 gap-3 " >
                    {pastFixtures.map((fixture, index) => {

                        if (searchFixturesPredicate(fixture, search)) {

                            return <FixtureCard
                                showLogos
                                showCompetition
                                className="dark:bg-gray-800 dark:hover:bg-gray-800/80 border border-gray-300 dark:border-gray-700 bg-white  hover:bg-slate-50 rounded-xl"
                                fixture={fixture}
                                key={index}
                            />
                        }
                    })}
                </div>
                
                <section id={sectionId} ></section>
                <h2 className="text-xl font-bold" >Upcoming Fixtures</h2>

                <div  className=" grid grid-cols-1 gap-3 " >
                    {upcomingFixtures.map((fixture, index) => {

                        if (searchFixturesPredicate(fixture, search)) {

                            return <FixtureCard
                                showLogos
                                showCompetition
                                className="dark:bg-gray-800 dark:hover:bg-gray-800/80 border border-gray-300 dark:border-gray-700 bg-white  hover:bg-slate-50 rounded-xl"
                                fixture={fixture}
                                key={index}
                            />
                        }
                    })}
                </div>
            </div>
            
            <div onClick={() => scrollToSection(sectionId)} className="bg-primary-500 hover:bg-primary-600 items-center text-white justify-center flex w-10 h-10 rounded-full bottom-0 mb-20 mr-3 right-0 fixed" >
                <ChevronDown />
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

