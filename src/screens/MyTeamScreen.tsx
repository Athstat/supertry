import React, { useState, useEffect } from "react";
import { Trophy, Users, ChevronLeft, Loader } from "lucide-react";
import { Player, Team } from "../types/team";
import { PlayerActionModal } from "../components/team/PlayerActionModal";
import { SwapConfirmationModal } from "../components/team/SwapConfirmationModal";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayerProfile } from "../hooks/usePlayerProfile";
import PlayerSelectionModal from "../components/team-creation/PlayerSelectionModal";
import { Position } from "../types/position";
import { TeamFormation } from "../components/team/TeamFormation";
import { TeamStats } from "../components/team/TeamStats";
import { mockTeam } from "../data/team";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../types/fantasyTeamAthlete";
import { teamService } from "../services/teamService";

export function MyTeamScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams<{ teamId: string }>();
  const { team: locationTeam, athletes: locationAthletes } =
    location.state || {};

  const [team, setTeam] = useState<IFantasyClubTeam | null>(
    locationTeam || null
  );
  const [athletes, setAthletes] = useState<IFantasyTeamAthlete[]>(
    locationAthletes || []
  );
  const [isLoading, setIsLoading] = useState(
    !locationTeam || !locationAthletes
  );
  const [error, setError] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Player | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [positionToSwap, setPositionToSwap] = useState<string>("");
  const [teamUpdating, setTeamUpdating] = useState(false);
  const [teamBudget, setTeamBudget] = useState<number>(0);

  // Fetch team and athletes if not provided in location state
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) {
        setError("Team ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching team data for ID:", teamId);

        // First try to fetch team athletes directly
        const teamAthletes = await teamService.fetchTeamAthletes(
          teamId as string
        );
        console.log("Team athletes:", teamAthletes);

        if (teamAthletes && teamAthletes.length > 0) {
          // If we have athletes, we can fetch the team details
          // Use type assertion to handle the function call
          const userTeams = await (teamService.fetchUserTeams as any)();
          console.log("User teams:", userTeams);

          let currentTeam = userTeams.find((t: any) => t.id == teamId);

          console.log("currentTeam", currentTeam);

          // If team not found in user teams, create a minimal team object from athlete data
          if (!currentTeam && teamAthletes.length > 0) {
            console.log(
              "Team not found in user teams, creating from athlete data"
            );
            // Get team info from the first athlete
            const firstAthlete = teamAthletes[0] as any;
            currentTeam = {
              id: teamId,
              name: "My Team", // Default name
              club_id: firstAthlete.club_id || "",
              league_id: firstAthlete.league_id || "",
              created_at: new Date(),
              updated_at: new Date(),
              athletes: teamAthletes,
              rank: 0,
              matches_played: 0,
            } as IFantasyClubTeam;
          }

          if (currentTeam) {
            setTeam(currentTeam);
            setAthletes(teamAthletes);
            setError(null);
          } else {
            throw new Error("Team not found");
          }
        } else {
          throw new Error("No athletes found for this team");
        }
      } catch (err) {
        console.error("Failed to fetch team data:", err);
        setError("Failed to load team data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, locationTeam, locationAthletes]);

  // Calculate team budget
  useEffect(() => {
    if (athletes.length > 0) {
      const totalTeamValue = athletes.reduce(
        (sum, athlete: any) => sum + (athlete.price || 0),
        0
      );
      // Assume max budget is 200 for now, adjust as needed
      const maxBudget = 200;
      setTeamBudget(maxBudget - totalTeamValue);
    }
  }, [athletes]);

  // Add useEffect to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate("/my-teams");
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowActionModal(true);
  };

  // Get the player profile hook
  const { showPlayerProfile } = usePlayerProfile();

  const handleViewStats = (player: Player) => {
    // Open the player profile modal
    console.log("View stats for player:", player);
    setShowActionModal(false);
    // Convert to the format expected by the profile modal
    const playerForProfile = {
      tracking_id: player.id,
      player_name: player.name,
      team_name: player.team,
      position_class: player.position,
      price: player.price,
      power_rank_rating: player.form,
      image_url: player.image,
      ball_carrying: 7,
      tackling: 6,
      points_kicking: 5,
    };

    showPlayerProfile(playerForProfile);
  };

  const handleSwapPlayer = (player: Player) => {
    // When swapping a player, set the position based on whether it's a super sub
    setPositionToSwap(player.is_super_sub ? "any" : player.position);
    setIsSwapping(true);
    setSelectedPlayer(player); // Ensure selected player is set
    setShowActionModal(false);
  };

  const handlePlayerSelect = (player: Player) => {
    setNewPlayer(player);
    setShowSwapModal(true);
  };

  const handleConfirmSwap = async () => {
    if (!selectedPlayer || !newPlayer || !teamId) return;

    try {
      setTeamUpdating(true);

      // Find the player to replace in athletes
      const updatedAthletes = [...athletes];
      const playerIndex = updatedAthletes.findIndex(
        (a: any) =>
          a.athlete_id === selectedPlayer.id || a.id === selectedPlayer.id
      );

      if (playerIndex === -1) {
        console.error("Player not found in team");
        return;
      }

      // Create an updated athlete object for the new player
      const replacementAthlete = {
        ...updatedAthletes[playerIndex],
        athlete_id: newPlayer.id,
        player_name: newPlayer.name,
        position_class: selectedPlayer.is_super_sub
          ? selectedPlayer.position
          : newPlayer.position,
        team_name: newPlayer.team,
        price: newPlayer.price,
        power_rank_rating: newPlayer.form,
        image_url: newPlayer.image,
        is_super_sub: selectedPlayer.is_super_sub,
        is_starting: !selectedPlayer.is_super_sub, // Super Sub is not a starting player
      };

      // Replace the old athlete with the new one
      updatedAthletes[playerIndex] = replacementAthlete;

      // Send the update to the server
      await teamService.updateTeamAthletes(updatedAthletes, teamId);

      // Update local state
      setAthletes(updatedAthletes);

      // Reset UI state
      setShowSwapModal(false);
      setSelectedPlayer(null);
      setNewPlayer(null);
      setIsSwapping(false);
    } catch (error) {
      console.error("Failed to swap player:", error);
      // Here you might want to show an error notification
    } finally {
      setTeamUpdating(false);
    }
  };

  const cancelSwap = () => {
    setShowSwapModal(false);
    setNewPlayer(null);
  };

  const closeAllModals = () => {
    setShowActionModal(false);
    setShowSwapModal(false);
    setShowStatsModal(false);
    setIsSwapping(false);
    setSelectedPlayer(null);
    setNewPlayer(null);
  };

  // Convert IFantasyTeamAthlete to Player format for the TeamFormation component
  const convertToPlayerFormat = (athletes: IFantasyTeamAthlete[]): Player[] => {
    return athletes.map((athlete) => {
      // Handle the TypeScript type issues with any assertions where needed
      const athleteAny = athlete as any;

      return {
        id: athleteAny.athlete_id || "",
        name: athleteAny.player_name || "Unknown Player",
        position: athleteAny.position_class || "Unknown Position",
        team: athleteAny.athlete?.team?.name || "Unknown Team",
        points: athleteAny.price || 0,
        form: athleteAny.power_rank_rating || 0,
        isSubstitute: !athleteAny.is_starting,
        // Set is_super_sub based on is_starting field being false
        is_super_sub: athleteAny.is_starting === false,
        image: athleteAny.image_url,
        price: athleteAny.price || 0,
        nextFixture: "", // Add required property with default value
      };
    });
  };

  const players = convertToPlayerFormat(athletes);

  console.log("players", players);

  // Determine formation based on positions for rugby
  const determineFormation = (players: Player[]): string => {
    // Simple formation detection - count players by position for rugby
    const starters = players.filter((p) => !p.isSubstitute);
    const frontRow = starters.filter((p) =>
      p.position.includes("Front Row")
    ).length;
    const secondRow = starters.filter((p) =>
      p.position.includes("Second Row")
    ).length;
    const backRow = starters.filter((p) =>
      p.position.includes("Back Row")
    ).length;
    const halfbacks = starters.filter((p) =>
      p.position.includes("Halfback")
    ).length;
    const backs = starters.filter((p) => p.position.includes("Back")).length;

    return `${frontRow}-${secondRow}-${backRow}-${halfbacks}-${backs}`;
  };

  const formation = determineFormation(players);

  // Calculate average PR
  const calculateAveragePR = (players: Player[]): number => {
    if (!players.length) return 0;
    const totalPR = players.reduce(
      (sum, player) => sum + (player.form || 0),
      0
    );
    return totalPR / players.length;
  };

  const averagePR = calculateAveragePR(players);

  // Calculate total points
  const totalPoints = athletes.reduce(
    (sum, athlete) => sum + (athlete.score || 0),
    0
  );

  // Calculate matches played
  const teamAny = team as any;
  const matchesPlayed = teamAny?.matches_played || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          {error || "Team not found"}
        </div>
        <button
          onClick={handleBack}
          className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:dark:text-primary-500"
        >
          <ChevronLeft size={20} />
          <span>Back to My Teams</span>
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-500 mb-6 group transition-colors"
          aria-label="Back to My Teams"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleBack()}
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-sm font-medium">My Teams</span>
        </button>
        {/* Team Header */}
        <div className="bg-white dark:bg-dark-800/40 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Team Name and Stats */}
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold dark:text-gray-100">
                {team.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Trophy size={18} className="text-yellow-500 shrink-0" />
                  <span className="whitespace-nowrap">
                    {(team as any).rank
                      ? `Rank ${(team as any).rank}`
                      : "Not ranked yet"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Users
                    size={18}
                    className="text-primary-700 dark:text-primary-500 shrink-0"
                  />
                  <span className="whitespace-nowrap">
                    {athletes.length} Players
                  </span>
                </div>
              </div>
            </div>

            {/* Points Display */}
            <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 bg-gray-50 dark:bg-dark-700/40 p-2 sm:p-3 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Game Coins
              </div>
              <div className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-500 flex items-center">
                <svg
                  className="w-5 h-5 mr-1.5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 7.13a1 1 0 011.95-.26c.112.84.234 1.677.357 2.514.234-.705.469-1.412.704-2.119a1 1 0 011.857.737 1 1 0 01.027.063c.234.705.469 1.412.704 2.119.121-.84.242-1.678.351-2.516a1 1 0 011.954.262c-.16 1.192-.32 2.383-.48 3.575 0 .004-.003.005-.005.006l-.008.032-.006.025-.008.028-.008.03-.01.03a1 1 0 01-1.092.698.986.986 0 01-.599-.28l-.01-.008a.997.997 0 01-.29-.423c-.272-.818-.543-1.635-.815-2.453-.272.818-.544 1.635-.816 2.453a1 1 0 01-1.953-.331c-.156-1.167-.312-2.334-.468-3.502a1 1 0 01.744-1.114z" />
                </svg>
                {totalPoints}
              </div>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <TeamStats
          team={
            {
              ...team,
              totalPoints,
              players,
              formation,
              matchesPlayed,
              rank: (team as any).rank || 0,
            } as Team
          }
        />

        {/* Team Formation */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
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
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center">
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
                        <span className="font-semibold text-lg dark:text-gray-100">
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
      </div>

      {/* Player Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedPlayer && (
          <PlayerActionModal
            player={selectedPlayer}
            onClose={() => setShowActionModal(false)}
            onViewStats={handleViewStats}
            onSwapPlayer={handleSwapPlayer}
          />
        )}
      </AnimatePresence>

      {/* Player Selection Modal for Swapping */}
      {isSwapping && selectedPlayer && (
        <PlayerSelectionModal
          visible={isSwapping}
          selectedPosition={{
            id: positionToSwap === "any" ? "any" : positionToSwap,
            name: positionToSwap === "any" ? "Any Position" : positionToSwap,
            shortName:
              positionToSwap === "any"
                ? "ANY"
                : positionToSwap.substring(0, 2).toUpperCase(),
            x: "0",
            y: "0",
          }}
          players={athletes.map((a) => {
            const athlete = a as any; // Cast to any to handle the TypeScript issues
            return {
              id: athlete.athlete_id || athlete.id || "",
              tracking_id: athlete.athlete_id || athlete.id || "",
              player_name: athlete.player_name || "Unknown Player",
              team_name:
                athlete.team_name ||
                athlete.athlete?.team?.name ||
                "Unknown Team",
              position_class: athlete.position_class || "Unknown Position",
              price: athlete.price || 0,
              power_rank_rating: athlete.power_rank_rating || 0,
              image_url: athlete.image_url || "",
              ball_carrying: 5,
              tackling: 5,
              points_kicking: 5,
            };
          })}
          remainingBudget={
            selectedPlayer ? teamBudget + selectedPlayer.price : teamBudget
          }
          // Filter out the currently selected player to allow selecting new players
          selectedPlayers={players
            .filter((p) => p.id !== selectedPlayer?.id)
            .map((p) => ({
              id: p.id,
              name: p.name,
              team: p.team,
              position: p.position,
              price: p.price,
              points: p.points,
              image_url: p.image,
              power_rank_rating: p.form,
            }))}
          handlePlayerSelect={(p: any) => {
            // Convert from player.ts Player type to team.ts Player type
            const convertedPlayer: Player = {
              id: p.id,
              name: p.name,
              team: p.team,
              position: p.position,
              points: p.points,
              price: p.price,
              form: p.power_rank_rating || 0,
              image: p.image_url || "",
              nextFixture: "",
            };
            handlePlayerSelect(convertedPlayer);
          }}
          onClose={() => setIsSwapping(false)}
          roundId={1}
        />
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSwapModal && selectedPlayer && newPlayer && (
          <SwapConfirmationModal
            currentPlayer={selectedPlayer}
            newPlayer={newPlayer}
            onClose={cancelSwap}
            onConfirm={handleConfirmSwap}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
