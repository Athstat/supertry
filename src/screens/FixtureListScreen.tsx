import { Calendar, ChevronDown } from "lucide-react";
import useSWR from "swr";
import { IFixture } from "../types/games";
import { gamesService } from "../services/gamesService";
import {
  ERPC_COMPETITION_ID,
  INVESTEC_CHAMPIONSHIP_CUP,
  URC_COMPETIION_ID,
} from "../types/constants";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import FixtureCard from "../components/fixtures/FixtureCard";
import { useEffect, useState } from "react";
import { searchFixturesPredicate } from "../utils/fixtureUtils";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { format } from "date-fns";

const competitionIds = [
  ERPC_COMPETITION_ID,
  INVESTEC_CHAMPIONSHIP_CUP,
  URC_COMPETIION_ID,
];

export default function FixtureListScreen() {
  const { data: fixtures, error, isLoading } = useSWR(competitionIds, fetcher);
  const [search, setSearch] = useState("");

  const sectionId = "upcoming_matches";
  const { scrollToSection } = useSectionNavigation(["upcoming_matches"]);

  useEffect(() => {
    scrollToSection(sectionId);
  }, []);

  if (isLoading) return <LoadingState message="Loading Fixtures" />;
  if (!fixtures) return <ErrorState message={error} />;

  const dateNow = new Date();

  const pastFixtures = fixtures
    .filter((f) => {
      if (f.kickoff_time) {
        return (
          f.game_status === "complete" ||
          new Date(f.kickoff_time).valueOf() < dateNow.valueOf()
        );
      }

      return false;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() -
          new Date(b.kickoff_time).valueOf()
        : 0
    )
    .reverse()
    .splice(0, 30)
    .reverse();

  const upcomingFixtures = fixtures
    .filter((f) => {
      if (f.kickoff_time) {
        return new Date(f.kickoff_time).valueOf() > dateNow.valueOf();
      }

      return false;
    })
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() -
          new Date(b.kickoff_time).valueOf()
        : 0
    )
    .splice(0, 20);

  return (
    <div className="dark:text-white  p-4 flex flex-col items-center justify-start">
      <div className="flex flex-col gap-5 w-full lg:w-3/4">
        <div className="flex flex-row items-center justify-start gap-2 ">
          <Calendar className="" />
          <h1 className="font-bold text-xl lg:text-2xl">Fixtures</h1>
        </div>

        {/* <div className="flex flex-row w-full" >
                    <input
                        placeholder="Search Fixtures..."
                        className="bg-gray-800 outline-none p-3 flex-1 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div> */}

        <div className=" grid grid-cols-1 gap-3 ">
          {pastFixtures.map((fixture, index) => {
            if (searchFixturesPredicate(fixture, search)) {
              return (
                <FixtureCard
                  showLogos
                  showCompetition
                  className="dark:bg-gray-800/40 dark:hover:bg-gray-800/60 border border-gray-300 dark:border-gray-700 bg-white  hover:bg-slate-50 rounded-xl"
                  fixture={fixture}
                  key={index}
                />
              );
            }
          })}
        </div>

        <section id={sectionId} className="w-full h-10"></section>
        <h2 className="text-xl font-bold">Upcoming Fixtures</h2>

        <div className="grid grid-cols-1 gap-3">
          {(() => {
            // Group fixtures by day
            const fixturesByDay: Record<string, IFixture[]> = {};

            upcomingFixtures.forEach((fixture) => {
              if (
                fixture.kickoff_time &&
                searchFixturesPredicate(fixture, search)
              ) {
                const dayKey = format(
                  new Date(fixture.kickoff_time),
                  "yyyy-MM-dd"
                );
                if (!fixturesByDay[dayKey]) {
                  fixturesByDay[dayKey] = [];
                }
                fixturesByDay[dayKey].push(fixture);
              }
            });

            // Get sorted day keys
            const sortedDays = Object.keys(fixturesByDay).sort();

            return sortedDays.map((dayKey) => (
              <div key={dayKey} className="mb-4">
                {/* Day header */}
                <div className="px-4 py-2 mb-3 bg-gray-100 dark:bg-gray-800 font-medium text-gray-800 dark:text-gray-200 rounded-lg">
                  {format(new Date(dayKey), "EEEE, MMMM d, yyyy")}
                </div>

                {/* Fixtures for this day */}
                <div className="grid grid-cols-1 gap-3">
                  {fixturesByDay[dayKey].map((fixture, index) => (
                    <FixtureCard
                      showLogos
                      showCompetition
                      className="dark:bg-gray-800/40 dark:hover:bg-gray-800/60 border border-gray-300 dark:border-gray-700 bg-white hover:bg-slate-50 rounded-xl"
                      fixture={fixture}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      <div
        onClick={() => scrollToSection(sectionId)}
        className="bg-primary-500 hover:bg-primary-600 items-center text-white justify-center flex w-10 h-10 rounded-full bottom-0 mb-20 mr-3 right-0 fixed"
      >
        <ChevronDown />
      </div>
    </div>
  );
}

async function fetcher(competitionIds: string[]) {
  let matches: IFixture[] = [];

  const fetchMatches = async (compId: string) => {
    const res = await gamesService.getGamesByCompetitionId(compId);
    matches = [...matches, ...res];
  };

  const promises = competitionIds.map((compId) => {
    return fetchMatches(compId);
  });

  await Promise.all(promises);

  return matches;
}
