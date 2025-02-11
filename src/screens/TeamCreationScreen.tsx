import React from "react";
import { Zap, AlertCircle, ChevronRight, X } from "lucide-react";
import { TeamHeader } from "../components/team-creation/TeamHeader";
import { TeamStats } from "../components/team-creation/TeamStats";
import { PositionGroup } from "../components/team-creation/PositionGroup";
import { useTeamCreation } from "../hooks/useTeamCreation";
import { positionGroups } from "../data/positionGroups";
import { Player } from "../types/player";
import { PlayerListModal } from "../components/team-creation/PlayerListModal";
import { PlayerDetailsModal } from "../components/team-creation/PlayerDetailsModal";
import { useLocation, useNavigate } from "react-router-dom";

export function TeamCreationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const league = location.state?.league;

  // Add useEffect to scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleComplete = async (
    players: Record<string, Player>,
    teamName: string,
    isFavorite: boolean
  ) => {
    try {
      // Navigate on success
      navigate("/my-teams", {
        state: {
          teamCreated: true,
          teamName,
          players,
          isFavorite,
        },
      });
    } catch (error) {
      console.error("Failed to save team:", error);
    }
  };

  const handleReview = () => {
    if (teamName.trim() === "") {
      alert("Please enter a team name");
      return;
    }
    if (Object.keys(selectedPlayers).length !== 5) {
      alert("Please select all 5 players");
      return;
    }
    if (currentBudget < 0) {
      alert("You have exceeded the budget");
      return;
    }

    navigate("/review-team", {
      state: {
        players: selectedPlayers,
        teamName,
        isFavorite,
        league,
      },
    });
  };

  const {
    selectedPlayers,
    isFavorite,
    setIsFavorite,
    teamName,
    setTeamName,
    selectedPosition,
    showPlayerList,
    setShowPlayerList,
    showPlayerModal,
    setShowPlayerModal,
    selectedPlayerForModal,
    searchQuery,
    setSearchQuery,
    currentBudget,
    handlePositionClick,
    handlePlayerSelect,
    handleAddPlayer,
    handleRemovePlayer,
    handleReset,
    handleAutoGenerate,
  } = useTeamCreation(1000, handleComplete);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
            Create Your Team
          </h1>

          <TeamHeader
            teamName={teamName}
            setTeamName={setTeamName}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
          />

          <TeamStats
            league={league}
            currentBudget={currentBudget}
            selectedPlayersCount={Object.keys(selectedPlayers).length}
            totalPositions={5}
          />

          <button
            onClick={handleAutoGenerate}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mt-5"
          >
            <Zap size={20} />
            Auto Pick Team
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {positionGroups.map((group) => (
            <PositionGroup
              key={group.name}
              name={group.name}
              positions={group.positions}
              selectedPlayers={selectedPlayers}
              onPositionClick={handlePositionClick}
              onRemovePlayer={handleRemovePlayer}
            />
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reset Selection
          </button>
        </div>

        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertCircle size={20} />
              <span className="text-sm">
                Select all 5 players to complete your team
              </span>
            </div>
            <button
              onClick={handleReview}
              disabled={currentBudget < 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review & Submit Team
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {showPlayerList && selectedPosition && (
          <PlayerListModal
            position={selectedPosition}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowPlayerList(false)}
            onSelectPlayer={handlePlayerSelect}
          />
        )}

        {showPlayerModal && selectedPlayerForModal && (
          <PlayerDetailsModal
            player={selectedPlayerForModal}
            onClose={() => setShowPlayerModal(false)}
            onAdd={handleAddPlayer}
          />
        )}
      </div>
    </main>
  );
}
