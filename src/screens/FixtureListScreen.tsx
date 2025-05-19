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
import { useEffect, useState } from "react";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import GroupedFixturesList from "../components/fixtures/GroupedFixturesList";
import PageView from "./PageView";
import FixtureListScreenHeader from "../components/fixtures/FixtureListScreenHeader";
import { fixturesDateRangeAtom } from "../components/fixtures/calendar/fixtures_calendar.atoms";
import { useAtomValue } from "jotai";
import { filterFixturesByDateRange, filterPastFixtures, filterUpcomingFixtures } from "../utils/fixtureUtils";

const competitionIds = [
  ERPC_COMPETITION_ID,
  INVESTEC_CHAMPIONSHIP_CUP,
  URC_COMPETIION_ID,
];

export default function FixtureListScreen() {
  const { data, error, isLoading } = useSWR(competitionIds, fetcher);
  const [search, setSearch] = useState("");
  const selectedDateRange = useAtomValue(fixturesDateRangeAtom);

  const sectionId = "upcoming_matches";
  const { scrollToSection } = useSectionNavigation(["upcoming_matches"]);

  useEffect(() => {
    scrollToSection(sectionId);
  }, []);

  if (isLoading) return <LoadingState message="Loading Fixtures" />;

  const fixtures = data ?? [];
  const fixturesInRange = selectedDateRange ? 
    filterFixturesByDateRange(fixtures, selectedDateRange)
    : fixtures;

  const pastFixtures = filterPastFixtures(fixturesInRange, 30);
  const upcomingFixtures = filterUpcomingFixtures(fixturesInRange);

  return (
    <PageView className="dark:text-white  p-4 flex flex-col items-center justify-start">
        <FixtureListScreenHeader />
        
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
          <GroupedFixturesList
            fixtures={pastFixtures}
            search={search}
          />
          <section id={sectionId} className="w-full h-10"></section>
          <h2 className="text-xl font-bold">Upcoming Fixtures</h2>
          <GroupedFixturesList
            fixtures={upcomingFixtures}
            search={search}
          />
        </div>
        <div
          onClick={() => scrollToSection(sectionId)}
          className="bg-primary-600 hover:bg-primary-600 items-center text-white justify-center flex w-10 h-10 rounded-full bottom-0 mb-20 mr-3 right-0 fixed"
        >
          <ChevronDown />
        </div>
    </PageView>
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
