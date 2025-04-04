import React, { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  ArrowLeftRight,
  X,
  ChevronLeft,
  Loader,
} from "lucide-react";
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
        const teamAthletes = await teamService.fetchTeamAthletes(teamId);
        console.log("Team athletes:", teamAthletes);

        if (teamAthletes && teamAthletes.length > 0) {
          // If we have athletes, we can fetch the team details
          const userTeams = await teamService.fetchUserTeams();
          console.log("User teams:", userTeams);

          let currentTeam = userTeams.find((t) => t.id == teamId);

          console.log("currentTeam", currentTeam);

          // If team not found in user teams, create a minimal team object from athlete data
          if (!currentTeam && teamAthletes.length > 0) {
            console.log(
              "Team not found in user teams, creating from athlete data"
            );
            // Get team info from the first athlete
            const firstAthlete = teamAthletes[0];
            currentTeam = {
              id: teamId,
              name: "My Team", // Default name
              club_id: firstAthlete.club_id || "",
              league_id: firstAthlete.league_id || "",
              created_at: new Date(),
              updated_at: new Date(),
              athletes: teamAthletes,
            };
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
    return athletes.map((athlete) => ({
      id: athlete.athlete_id,
      name: athlete.player_name,
      position: athlete.position_class,
      team: athlete.athlete?.team?.name || "Unknown Team",
      points: athlete.price,
      form: athlete.power_rank_rating, // Add form for PR calculation
      isSubstitute: !athlete.is_starting,
      image: athlete.image_url,
      price: athlete.price,
    }));
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
  const matchesPlayed = team?.matches_played || 0;

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
                    {team.rank ? `Rank ${team.rank}` : "Not ranked yet"}
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
                Total Game Points
              </div>
              <div className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-500">
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
              rank: team.rank || 0,
            } as Team
          }
        />

        {/* Team Formation */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Team Formation
          </h2>
          <TeamFormation
            players={players}
            formation={formation}
            onPlayerClick={() => {}} // Disable player click functionality
          />
        </div>

        {/* Substitutes */}
        {/* <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
            Substitutes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {players
              .filter((player) => player.isSubstitute)
              .map((player) => (
                <div
                  key={player.id}
                  className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4 border-2 border-gray-200 dark:border-dark-600"
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
                </div>
              ))}
          </div>
        </div> */}
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
