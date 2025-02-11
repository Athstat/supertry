import React, { useState } from "react";
import { Trophy, Users, ArrowLeftRight, X, ChevronLeft } from "lucide-react";
import { Player, Team } from "../types/team";
import { PlayerSubstitutionModal } from "../components/team/PlayerSubstitutionModal";
import { TeamFormation } from "../components/team/TeamFormation";
import { TeamStats } from "../components/team/TeamStats";
import { mockTeam } from "../data/team";
import { useNavigate } from "react-router-dom";

export function MyTeamScreen() {
  const navigate = useNavigate();
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Use mock data from data file
  const team = mockTeam;

  // Add useEffect to scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate("/my-teams");
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowSubModal(true);
  };

  const handleSubstitution = (oldPlayer: Player, newPlayer: Player) => {
    // Implement substitution logic
    setShowSubModal(false);
    setSelectedPlayer(null);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Team Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-gray-100">
              {team.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Trophy size={20} className="text-yellow-500" />
                <span>Rank {team.rank}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Users
                  size={20}
                  className="text-primary-700 dark:text-primary-500"
                />
                <span>{team.players.length} Players</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Points Earned
            </div>
            <div className="text-3xl font-bold text-primary-700 dark:text-primary-500">
              {team.totalPoints}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:dark:text-primary-500 mb-6 group transition-colors"
          aria-label="Back to My Teams"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-sm font-medium">Back to My Teams</span>
        </button>

        {/* Team Stats */}
        <TeamStats team={team} />

        {/* Team Formation */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Team Formation
          </h2>
          <TeamFormation
            players={team.players}
            formation={team.formation}
            onPlayerClick={handlePlayerClick}
          />
        </div>

        {/* Substitutes */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Substitutes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {team.players
              .filter((player) => player.isSubstitute)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4 border-2 border-gray-700 dark:border-dark-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold dark:text-gray-100">
                      {player.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                      {player.position}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-bold">
                      {player.team}
                    </span>
                    <span className="text-primary-700 dark:text-primary-500 font-bold">
                      {player.points} pts
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Substitution Modal */}
      {showSubModal && selectedPlayer && (
        <PlayerSubstitutionModal
          player={selectedPlayer}
          onClose={() => setShowSubModal(false)}
          onSubstitute={handleSubstitution}
        />
      )}
    </main>
  );
}
