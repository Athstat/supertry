import { useLocation, useParams } from "react-router-dom";
import FantasyLeagueGroupDataProvider from "../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../hooks/leagues/useFantasyLeagueGroup";
import PageView from "./PageView";
import { ErrorState } from "../components/ui/ErrorState";
import { StatCard } from "../components/shared/StatCard";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import NoContentCard from "../components/shared/NoContentMessage";
import { LeagueStandings } from "../components/fantasy-league/LeagueStandings";
import LeagueInfoTab from "../components/fantasy-league/LeagueInfoTab";
import LeagueFixturesTab from "../components/fantasy-league/LeagueFixturesTab";
import JoinLeagueButton from "../components/fantasy-league/buttons/JoinLeagueButton";
import LeagueCommissionerTab from "../components/fantasy-league/commissioner/LeagueCommissionerTab";


export function FantasyLeagueScreen() {
  const { leagueId } = useParams();

  return (
    <FantasyLeagueGroupDataProvider leagueId={leagueId} >
      <Content />
    </FantasyLeagueGroupDataProvider>
  )
}

function Content() {

  const { league, members, userMemberRecord, currentRound, isMember } = useFantasyLeagueGroup();
  const {state} = useLocation();

  if (!league) {
    return <ErrorState error="Whoops" message="Fantasy League was not found" />
  }


  const headerItems: TabViewHeaderItem[] = [

    {
      label: "Standings",
      tabKey: "standings",
      className: "flex-1"

    },

    {
      label: "My Team",
      tabKey: 'my-team',
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
      className: "flex-1",
      disabled: !userMemberRecord || userMemberRecord.is_admin == false
    },

    {
      label: "Info",
      tabKey: 'info',
      className: "flex-1"
    }
  ]

  return (
    <PageView className="dark:text-white p-4 flex flex-col gap-4" >
      <div className="flex flex-row items-center justify-between gap-2" >

        <div className="flex flex-row items-center gap-2" >
          <p className="font-bold text-xl" >{league?.title}</p>
        </div>

        <div>
          {!isMember && <JoinLeagueButton
            league={league}
          />}
        </div>

      </div>

      {/* <div onClick={navigateToLeagues} className="flex flex-row hover:text-blue-500 cursor-pointer items-center" >
        <ArrowLeft />
        Back to Leagues
      </div> */}

      <div className="flex flex-row flex-wrap overflow-hidden items-center gap-2" >
        <StatCard
          label="Members"
          value={members?.length ?? "-"}
          className="flex-1"
        />

        <StatCard
          label="Round"
          value={currentRound?.title}
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

        <TabViewPage tabKey="info" >
          <LeagueInfoTab />
        </TabViewPage>

        <TabViewPage tabKey="fixtures" >
          <LeagueFixturesTab />
        </TabViewPage>

        <TabViewPage tabKey="commissioner" >
          <LeagueCommissionerTab />
        </TabViewPage>
      </TabView>

    </PageView>
  )
}
