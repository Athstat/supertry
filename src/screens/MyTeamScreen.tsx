import { useState } from "react";
import { useParams } from "react-router-dom";
import { TeamStats } from "../components/team/TeamStats";
import { TeamHeader } from "../components/my-team/TeamHeader";
import { TeamDataProvider } from "../components/my-team/TeamDataProvider";
import AthletesAvailabilityWarning from "../components/team/AthletesAvailabilityWarning";
import { MyTeamScreenTabType, MyTeamScreenTabView } from "../components/my-team/MyTeamScreenTabView";
import { ErrorState } from "../components/ui/ErrorState";
import { useAtomValue } from "jotai";
import { fantasyTeamAtom } from "../components/my-team/my_team.atoms";

export function MyTeamScreen() {

  const { teamId } = useParams<{ teamId: string }>();
  if (!teamId) return <ErrorState error="Error Fetching Team" message="We could not find this team" />

  return (

    <TeamDataProvider teamId={teamId}>
      <MyTeamScreenContent />
    </TeamDataProvider>
  );
}


/** Actual consumer content on my screen that consumes data from team data provider */
function MyTeamScreenContent() {

  const [activeTab, setActiveTab] = useState<MyTeamScreenTabType>("view-pitch");

  return (
    <main className="container mx-auto px-4 py-6">

      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <TeamHeader />
        <TeamStats />
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