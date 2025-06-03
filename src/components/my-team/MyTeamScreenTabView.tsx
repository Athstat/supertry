import { useAtomValue } from "jotai";
import { fantasyLeagueAtom, fantasyLeagueLockedAtom } from "../../state/fantasyLeague.atoms";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { TabButton } from "../shared/TabButton";
import { EditFantasyTeamView } from "./EditFantasyTeamView";
import { Lock } from "lucide-react";
import { MyTeamPitchView } from "./MyTeamPitchView";
export type MyTeamScreenTabType = "edit-team" | "view-pitch";

type Props = {
  activeTab: MyTeamScreenTabType;
  setActiveTab: React.Dispatch<React.SetStateAction<MyTeamScreenTabType>>;
  league?: IFantasyLeague;
}

/** Renders My Team Screen Tab View Area */
export function MyTeamScreenTabView({activeTab, setActiveTab}: Props) {
  const league = useAtomValue(fantasyLeagueAtom);
  const isEditLocked = useAtomValue(fantasyLeagueLockedAtom);

  return (
    <>
      {/* Tabbed Interface */}
      
      <div className="mt-8">
        <div className="flex space-x-2 border-b-0">
          {!isEditLocked && (
            <TabButton
              active={activeTab === "edit-team"}
              onClick={() => setActiveTab("edit-team")}
            >
              <div className="flex items-center gap-1">
                <span>Edit Team</span>
              </div>
            </TabButton>
          )}

          {isEditLocked && (
            <TabButton
              active={activeTab === "edit-team"}
              onClick={() => setActiveTab("edit-team")}
            >
              <div className="flex items-center dark:text-slate-600 gap-2 flex-row">
                <span>Edit Team</span>
                <Lock className="w-4 h-4" />
              </div>
            </TabButton>
          )}

          <TabButton
            active={activeTab === "view-pitch"}
            onClick={() => setActiveTab("view-pitch")}
          >
            <div className="flex items-center gap-1">
              <span>View Pitch</span>
            </div>
          </TabButton>
        </div>
      </div>
      

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "edit-team" ? (
          <EditFantasyTeamView/>
        ) : (
          <MyTeamPitchView
          />
        )}
      </div>
    </>
  )
};