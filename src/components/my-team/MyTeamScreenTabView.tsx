import { IFantasyLeague } from "../../types/fantasyLeague";
export type MyTeamScreenTabType = "edit-team" | "view-pitch";

type Props = {
  activeTab: MyTeamScreenTabType;
  setActiveTab: React.Dispatch<React.SetStateAction<MyTeamScreenTabType>>;
  league?: IFantasyLeague;
}

/** Renders My Team Screen Tab View Area */
export function MyTeamScreenTabView({}: Props) {

  // const league = useAtomValue(fantasyLeagueAtom);

  return (
    // <TeamTabsContent
    //   activeTab={activeTab}
    //   setActiveTab={setActiveTab}
    //   positionList={positionList}
    //   players={players}
    //   formation={formation}
    //   handlePositionSelect={handlePositionSelect}
    //   handlePlayerClick={handlePlayerClick}
    //   fetchingMarketPlayers={false} // Always pass false to prevent loading state on buttons
    //   handleViewStats={handleViewStats}
    //   handleSwapPlayer={handleSwapPlayer}
    //   league={league}
    // />

    <></>
  )
};