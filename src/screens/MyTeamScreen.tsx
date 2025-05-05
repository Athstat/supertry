import React, { useState, useEffect } from "react";
import { Trophy, Users, ChevronLeft, Loader } from "lucide-react";
import { Player, Team } from "../types/team";
import { PlayerSubstitutionModal } from "../components/team/PlayerSubstitutionModal";
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
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

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
        is_super_sub: athleteAny.is_super_sub || false,
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
            players={players.filter(
              (player) => !player.isSubstitute && !(player as any).is_super_sub
            )}
            formation={formation}
            onPlayerClick={() => {}} // Disable player click functionality
          />
        </div>

        {/* Super Substitute */}
        {players.find((player) => (player as any).is_super_sub) && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100 flex items-center">
              <span>Super Substitute</span>
              <span className="ml-2 text-orange-500 text-sm bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                Special
              </span>
            </h2>
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800/30 max-w-md">
              {players
                .filter((player) => (player as any).is_super_sub)
                .map((player) => (
                  <div key={player.id} className="flex items-center gap-4">
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
                  </div>
                ))}
            </div>
          </div>
        )}
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
