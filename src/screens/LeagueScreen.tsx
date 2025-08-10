import { useParams } from "react-router-dom";
import FantasyLeagueGroupDataProvider from "../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../hooks/leagues/useFantasyLeagueGroup";
import PageView from "./PageView";
import { ErrorState } from "../components/ui/ErrorState";
import { Trophy } from "lucide-react";
import { StatCard } from "../components/shared/StatCard";


export function FantasyLeagueScreen() {
  const { leagueId } = useParams();

  return (
    <FantasyLeagueGroupDataProvider leagueId={leagueId} >
      <Content />
    </FantasyLeagueGroupDataProvider>
  )
}

function Content() {

  const { league, members, rounds } = useFantasyLeagueGroup();

  if (!league) {
    return <ErrorState error="Whoops" message="Fantasy League was not found" />
  }

  return (
    <PageView className="dark:text-white p-4 flex flex-col gap-4" >
      <div className="flex flex-row items-center gap-2" >
        <Trophy />
        <p className="font-bold text-xl" >{league?.title}</p>
      </div>

      <div className="flex flex-row flex-wrap overflow-hidden items-center gap-2" >
        <StatCard
          label="Members"
          value={members?.length ?? "-"}
          className="flex-1"
        />

        <StatCard
          label="Rounds"
          value={rounds?.length ?? "-"}
          className="flex-1"
        />
      </div>

    </PageView>
  )
}
