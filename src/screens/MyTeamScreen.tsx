import { useState } from "react";
import { useParams } from "react-router-dom";
import { FantasyTeamStats } from "../components/team/FantasyTeamStats";
import { TeamHeader } from "../components/my-team/TeamHeader";
import { TeamDataProvider } from "../components/my-team/TeamDataProvider";
import AthletesAvailabilityWarning from "../components/team/AthletesAvailabilityWarning";
import { MyTeamScreenTabType, MyTeamScreenTabView } from "../components/my-team/MyTeamScreenTabView";
import { ErrorState } from "../components/ui/ErrorState";
import { ScopeProvider } from "jotai-scope";
import { fantasyLeagueAtom, fantasyTeamAtom, fantasyTeamAthletesAtom, fantasyTeamValueAtom, fantasyTeamPointsAtom } from "../components/my-team/my_team.atoms";

export function MyTeamScreen() {

  const { teamId } = useParams<{ teamId: string }>();
  if (!teamId) return <ErrorState error="Error Fetching Team" message="We could not find this team" />

  const atoms = [
    fantasyLeagueAtom, fantasyTeamAtom, fantasyTeamAthletesAtom,
    fantasyTeamValueAtom, fantasyTeamPointsAtom
  ];

  return (
    <ScopeProvider atoms={atoms}>
      <TeamDataProvider teamId={teamId}>
        <MyTeamScreenContent />
      </TeamDataProvider>
    </ScopeProvider>
  );
}


/** Actual consumer content on my screen that consumes data from team data provider */
function MyTeamScreenContent() {

  const [activeTab, setActiveTab] = useState<MyTeamScreenTabType>("view-pitch");

  return (
    <main className="container mx-auto px-4 py-6">

      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <TeamHeader />
        <FantasyTeamStats />
        <AthletesAvailabilityWarning />

        <MyTeamScreenTabView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* <TeamActions/> */}

      </div>
    </main>
  );
};