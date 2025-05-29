import { IFantasyLeague } from "../../types/fantasyLeague";
import { useTeamActions } from "./TeamActions";
import { useTeamData } from "./TeamDataProvider";
import { TeamTabsContent } from "./TeamTabsContent";

export type MyTeamScreenTabType = "edit-team" | "view-pitch";

type Props = {
  activeTab: MyTeamScreenTabType;
  setActiveTab: React.Dispatch<React.SetStateAction<MyTeamScreenTabType>>;
  league?: IFantasyLeague;
}

/** Renders My Team Screen Tab View Area */
export function MyTeamScreenTabView({ activeTab, setActiveTab, league }: Props) {

  const { positionList, players, formation } = useTeamData();

  console.log("Players: ", players);

  const {
    handlePlayerClick,
    handlePositionSelect,
    handleViewStats,
    handleSwapPlayer,
  } = useTeamActions();

  return (
    <TeamTabsContent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      positionList={positionList}
      players={players}
      formation={formation}
      handlePositionSelect={handlePositionSelect}
      handlePlayerClick={handlePlayerClick}
      fetchingMarketPlayers={false} // Always pass false to prevent loading state on buttons
      handleViewStats={handleViewStats}
      handleSwapPlayer={handleSwapPlayer}
      league={league}
    />
  );
};