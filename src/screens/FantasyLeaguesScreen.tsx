import PageView from "./PageView";
import { Trophy } from "lucide-react";
import FantasyLeaguesScreenDataProvider from "../components/fantasy-leagues/FantasyLeaguesScreenDataProvider";
import FantasySeasonSelector from "../components/fantasy-seasons/FantasySeasonSelector";
import { useFantasyLeaguesScreen } from "../hooks/fantasy/useFantasyLeaguesScreen";
import { FantasySeasonDashboard } from "../components/fantasy-seasons/FantasySeasonDashboard";
import FantasySeasonsOverview from "../components/fantasy-seasons/FantasySeasonsOverview";


export function FantasyLeaguesScreen() {

  return (
    <FantasyLeaguesScreenDataProvider>
      <InnnerScreen />
    </FantasyLeaguesScreenDataProvider>
  )
}

function InnnerScreen() {

  const { selectedSeason } = useFantasyLeaguesScreen();

  return (
    <PageView className="px-4 flex flex-col gap-3" >

      <div>
        <div className="flex flex-row items-center gap-2" >
          <Trophy className="w-5 h-5" />
          <h1 className="font-bold text-md" >Fantasy Leagues</h1>
        </div>
      </div>

      <FantasySeasonSelector />


      {selectedSeason && (
        <FantasySeasonDashboard fantasySeason={selectedSeason} />
      )}

      {!selectedSeason && (
        <FantasySeasonsOverview />
      )}
    </PageView>
  )
}