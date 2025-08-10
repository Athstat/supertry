import { useNavigate, useParams } from "react-router-dom";
import FantasyLeagueGroupDataProvider from "../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../hooks/leagues/useFantasyLeagueGroup";
import PageView from "./PageView";
import { ErrorState } from "../components/ui/ErrorState";
import { ArrowLeft, Trophy } from "lucide-react";
import { StatCard } from "../components/shared/StatCard";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import NoContentCard from "../components/shared/NoContentMessage";
import { LeagueStandings } from "../components/fantasy-league/LeagueStandings";


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
  const navigate = useNavigate();

  if (!league) {
    return <ErrorState error="Whoops" message="Fantasy League was not found" />
  }


  const headerItems: TabViewHeaderItem[] = [
    {
      label: "My Team",
      tabKey: 'my-team',
      className: "flex-1"
    },

    {
      label: "Standings",
      tabKey: "standings",
      className: "flex-1"

    },

    {
      label: "Fixtures",
      tabKey: 'fixtures',
      className: "flex-1"
    },

    {
      label: "Commissioner",
      tabKey: 'commissioner',
      className: "flex-1"
    },

    {
      label: "Info",
      tabKey: 'info',
      className: "flex-1"
    }
  ]

  const navigateToLeagues = () => {
    navigate('/leagues');
  }

  return (
    <PageView className="dark:text-white p-4 flex flex-col gap-4" >
      <div className="flex flex-row items-center gap-2" >
        <Trophy />
        <p className="font-bold text-xl" >{league?.title}</p>
      </div>

      <div onClick={navigateToLeagues} className="flex flex-row hover:text-blue-500 cursor-pointer items-center" >
        <ArrowLeft />
        Back to Leagues
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

      <TabView
        tabHeaderItems={headerItems}
      >
        <TabViewPage tabKey="my-team" >
          <NoContentCard
            message="My Team is comming soon!"
          />
        </TabViewPage>

        <TabViewPage tabKey="standings" >
          <LeagueStandings />
        </TabViewPage>
      </TabView>

    </PageView>
  )
}
