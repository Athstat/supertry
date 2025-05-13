import React from "react";
import { motion } from "framer-motion";
import { Loader, Lock } from "lucide-react";
import { Player } from "../../types/team";
import { Position } from "../../types/position";
import { TabButton } from "../shared/TabButton";
import { TeamFormation } from "../team/TeamFormation";
import { isLeagueLocked } from "../../utils/leaguesUtils";
import { IFantasyLeague } from "../../types/fantasyLeague";

interface TeamTabsContentProps {
  activeTab: "edit-team" | "view-pitch";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"edit-team" | "view-pitch">
  >;
  positionList: Position[];
  players: Player[];
  formation: string;
  handlePositionSelect: (position: Position) => void;
  handlePlayerClick: (player: Player) => void;
  fetchingMarketPlayers: boolean;
  handleViewStats: (player: Player) => void;
  handleSwapPlayer: (player: Player) => void;
  league?: IFantasyLeague
}

export const TeamTabsContent: React.FC<TeamTabsContentProps> = ({
  activeTab,
  setActiveTab,
  positionList,
  players,
  formation,
  handlePositionSelect,
  handlePlayerClick,
  fetchingMarketPlayers,
  handleViewStats,
  handleSwapPlayer,
  league
}) => {

  const isLocked = isLeagueLocked(league?.join_deadline);

  return (
    <>
      {/* Tabbed Interface */}
      <div className="mt-8">
        <div className="flex space-x-2 border-b-0">
          
          {!isLocked && <TabButton
            active={activeTab === "edit-team"}
            onClick={() => setActiveTab("edit-team")}
          >
            <div className="flex items-center gap-1">
              <span>Edit Team</span>
            </div>
          </TabButton>}

          {isLocked && <TabButton
            active={activeTab === "edit-team"}
            onClick={() => {}}
          >
            <div className="flex items-center dark:text-slate-600 cursor-not-allowed gap-2 flex-row">
              <span>Edit Team</span>
              <Lock className="w-4 h-4" />
            </div>
          </TabButton>}

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
          <EditTeamView
            positionList={positionList}
            handlePositionSelect={handlePositionSelect}
            fetchingMarketPlayers={fetchingMarketPlayers}
            handleViewStats={handleViewStats}
            handleSwapPlayer={handleSwapPlayer}
          />
        ) : (
          <ViewPitchContent
            players={players}
            formation={formation}
            handlePlayerClick={handlePlayerClick}
          />
        )}
      </div>
    </>
  );
};

interface EditTeamViewProps {
  positionList: Position[];
  handlePositionSelect: (position: Position) => void;
  fetchingMarketPlayers: boolean;
  handleViewStats: (player: Player) => void;
  handleSwapPlayer: (player: Player) => void;
}

const EditTeamView: React.FC<EditTeamViewProps> = ({
  positionList,
  handlePositionSelect,
  fetchingMarketPlayers,
  handleViewStats,
  handleSwapPlayer,
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Edit Your Team
      </h2>

      {/* Position Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
        {positionList.map((position, index) => (
          <div key={position.id}>
            {/* Custom player card for My Team screen */}
            <div
              className={`bg-white dark:bg-dark-800 rounded-lg shadow-md p-4 transition hover:shadow-lg border ${
                position.isSpecial ||
                (index === positionList.length - 1 &&
                  position.name.toLowerCase().includes("second-row"))
                  ? "border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10"
                  : "border-gray-100 dark:border-gray-700"
              }`}
            >
              <div className="flex flex-col items-center">
                {position.player ? (
                  <>
                    {/* Player image */}
                    <div className="w-16 h-16 mb-2">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden ${
                          position.isSpecial ||
                          (index === positionList.length - 1 && position.player)
                            ? "bg-gray-300 border-2 border-orange-300 dark:border-orange-600"
                            : "bg-gray-300"
                        }`}
                      >
                        {position.player.image_url ? (
                          <img
                            src={position.player.image_url}
                            alt={position.player.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-lg">
                            {position.player.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Position name with badge for Super Sub */}
                    <div className="flex flex-col items-center">
                      <h3
                        className={`font-bold text-sm mb-1 ${
                          position.isSpecial
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-gray-800 dark:text-white"
                        }`}
                      >
                        {position.name}
                      </h3>
                      {(position.isSpecial ||
                        (index === positionList.length - 1 &&
                          position.player)) && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full mb-1">
                          Super Sub
                        </span>
                      )}
                    </div>

                    {/* Player name */}
                    <p className="text-xs text-center font-medium mb-1 text-gray-900 dark:text-gray-300">
                      {position.player.name}
                    </p>

                    {/* Team & price */}
                    <div className="flex justify-between w-full text-xs mb-3">
                      <span className="text-gray-500 dark:text-gray-400">
                        {position.player.team}
                      </span>
                      <span className="font-bold dark:text-gray-200 flex items-center">
                        <svg
                          className="w-3.5 h-3.5 mr-1 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                        </svg>
                        {position.player.price}
                      </span>
                    </div>

                    {/* Action buttons - now properly placed */}
                    <div className="w-full flex flex-col gap-2">
                      <button
                        onClick={() => {
                          const playerForPosition: Player = {
                            id: position.player?.id || "",
                            name: position.player?.name || "",
                            position: position.player?.position || "",
                            position_class: position.player?.position || "",
                            team: position.player?.team || "",
                            points: position.player?.points || 0,
                            form: position.player?.power_rank_rating || 0,
                            price: position.player?.price || 0,
                            is_super_sub: position.isSpecial || false,
                            is_starting: !position.isSpecial,
                            image: position.player?.image_url || "",
                            nextFixture: "",
                          };
                          handleViewStats(playerForPosition);
                        }}
                        className="w-full py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        View Stats
                      </button>
                      <button
                        onClick={() => {
                          const playerForPosition: Player = {
                            id: position.player?.id || "",
                            name: position.player?.name || "",
                            position: position.player?.position || "",
                            position_class: position.player?.position || "",
                            team: position.player?.team || "",
                            points: position.player?.points || 0,
                            form: position.player?.power_rank_rating || 0,
                            price: position.player?.price || 0,
                            is_super_sub: position.isSpecial || false,
                            is_starting: !position.isSpecial,
                            image: position.player?.image_url || "",
                            nextFixture: "",
                          };
                          handleSwapPlayer(playerForPosition);
                        }}
                        className="w-full py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        disabled={fetchingMarketPlayers}
                      >
                        {fetchingMarketPlayers ? (
                          <span className="flex items-center justify-center">
                            <Loader size={14} className="animate-spin mr-2" />
                            Loading...
                          </span>
                        ) : (
                          "Swap"
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                      <span className="text-2xl text-gray-500 dark:text-gray-300">
                        +
                      </span>
                    </div>
                    <h3
                      className={`font-bold text-sm mb-1 ${
                        position.isSpecial
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {position.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add {position.name}
                      {position.isSpecial && (
                        <span className="block text-orange-500 font-semibold mt-0.5">
                          Any Position
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => handlePositionSelect(position)}
                      className="mt-2 text-xs py-1 px-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                    >
                      Click to add
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ViewPitchContentProps {
  players: Player[];
  formation: string;
  handlePlayerClick: (player: Player) => void;
}

const ViewPitchContent: React.FC<ViewPitchContentProps> = ({
  players,
  formation,
  handlePlayerClick,
}) => {
  return (
    <>
      {/* Team Formation - View Pitch Tab */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Team Formation
        </h2>
        <TeamFormation
          players={players.filter((player) => !player.isSubstitute)}
          formation={formation}
          onPlayerClick={handlePlayerClick}
        />
      </div>

      {/* Super Substitute */}
      {players.some((player) => player.isSubstitute) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
            <span>Super Substitute</span>
            <span className="ml-2 text-orange-500 text-sm bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
              Special
            </span>
          </h2>
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800/30 max-w-md">
            {players
              .filter((player) => player.isSubstitute)
              .map((player) => (
                <motion.div
                  key={player.id}
                  className="flex items-center gap-4 cursor-pointer rounded-lg p-2"
                  onClick={() => handlePlayerClick(player)}
                  whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-orange-300 dark:border-orange-600">
                    {player.image ? (
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                        {player.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {player.name}
                      </span>
                      <span className="text-sm font-bold px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded-full text-gray-800 dark:text-gray-300">
                        {player.position}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {player.team}
                      </span>
                      <span className="text-primary-700 dark:text-primary-500 font-bold flex items-center">
                        <svg
                          className="w-3.5 h-3.5 mr-1 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 7.13a1 1 0 011.95-.26c.112.84.234 1.677.357 2.514.234-.705.469-1.412.704-2.119a1 1 0 011.857.737 1 1 0 01.027.063c.234.705.469 1.412.704 2.119.121-.84.242-1.678.351-2.516a1 1 0 011.954.262c-.16 1.192-.32 2.383-.48 3.575 0 .004-.003.005-.005.006l-.008.032-.006.025-.008.028-.008.03-.01.03a1 1 0 01-1.092.698.986.986 0 01-.599-.28l-.01-.008a.997.997 0 01-.29-.423c-.272-.818-.543-1.635-.815-2.453-.272.818-.544 1.635-.816 2.453a1 1 0 01-1.953-.331c-.156-1.167-.312-2.334-.468-3.502a1 1 0 01.744-1.114z" />
                        </svg>
                        {player.points}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                      Can substitute for any position
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
