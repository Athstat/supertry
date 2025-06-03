import React, { useState, useEffect } from "react";
import { Coins, Loader, Lock } from "lucide-react";
import { Player } from "../../types/team";
import { Position } from "../../types/position";
import { TabButton } from "../shared/TabButton";
import { isLeagueLocked } from "../../utils/leaguesUtils";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { useTeamData } from "./TeamDataProvider";
import { leagueService } from "../../services/leagueService";
import { IGamesLeagueConfig } from "../../types/leagueConfig";
import { MyTeamPitchView } from "./MyTeamPitchView";
import { useLeagueConfig } from "../../hooks/useLeagueConfig";

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
  league?: IFantasyLeague;
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
  league,
}) => {
  
  const isLocked = isLeagueLocked(league?.join_deadline);
  const { team } = useTeamData();

  const leagueConfig = useLeagueConfig(league);

  return (
    <>
      {/* Tabbed Interface */}
      
      <div className="mt-8">
        <div className="flex space-x-2 border-b-0">
          {!isLocked && (
            <TabButton
              active={activeTab === "edit-team"}
              onClick={() => setActiveTab("edit-team")}
            >
              <div className="flex items-center gap-1">
                <span>Edit Team</span>
              </div>
            </TabButton>
          )}

          {isLocked && (
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
          <EditTeamView
            positionList={positionList}
            handlePositionSelect={handlePositionSelect}
            fetchingMarketPlayers={fetchingMarketPlayers}
            handleViewStats={handleViewStats}
            handleSwapPlayer={handleSwapPlayer}
            isEditLocked={isLocked}
            teamBalance={team?.balance || 0}
            teamBudget={leagueConfig?.team_budget || 0}
          />
        ) : (
          <MyTeamPitchView
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
  isEditLocked?: boolean;
  teamBudget: number;
  teamBalance: number;
}

const EditTeamView: React.FC<EditTeamViewProps> = ({
  positionList,
  handlePositionSelect,
  fetchingMarketPlayers,
  handleViewStats,
  handleSwapPlayer,
  isEditLocked,
  teamBudget,
  teamBalance,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Edit Your Team
        </h2>
        <div className="flex items-center gap-1">
          <Coins size={14} className="text-yellow-500 dark:text-yellow-400" />
          <span className="text-xs font-medium whitespace-nowrap dark:text-gray-400">
            {teamBalance} / {teamBudget}
          </span>
        </div>
      </div>

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
                        {position.name
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
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
                      {position.player.player_name}
                    </p>

                    {/* Team & price */}
                    <div className="flex justify-between w-full text-xs mb-3">
                      <span className="text-gray-500 dark:text-gray-400">
                        {position.player.team_name}
                      </span>
                      <span className="font-bold dark:text-gray-200 flex items-center">
                        <Coins
                          size={14}
                          className="text-yellow-500 dark:text-yellow-400 mr-1"
                        />
                        {position.player.price}
                      </span>
                    </div>

                    {/* Action buttons - now properly placed */}
                    <div className="w-full flex flex-col gap-2">
                      <button
                        onClick={() => {
                          handleViewStats(position.player);
                        }}
                        className="w-full py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        View Stats
                      </button>

                      {!isEditLocked && (
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
                              team_name: position.player.team_name,
                              nextFixture: "",
                              athlete_id: position.player.tracking_id,
                              player_name: position.player.player_name
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
                      )}

                      {isEditLocked && (
                        <button className="w-full py-1.5 flex flex-row items-center justify-center gap-1 opacity-45 cursor-not-allowed bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                          Swap
                          <Lock className="w-3 h-3" />
                        </button>
                      )}
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