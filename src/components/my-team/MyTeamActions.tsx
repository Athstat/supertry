import { useState, createContext, useContext, ReactNode } from "react";
import { Loader } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Player } from "../../types/team";
import { FantasyTeamPosition, Position } from "../../types/position";
import { PlayerActionModal } from "../team/PlayerActionModal";
import { SwapConfirmationModal } from "../team/SwapConfirmationModal";
import PlayerSelectionModal from "../team-creation/PlayerSelectionModal";
import { usePlayerProfile } from "../../hooks/usePlayerProfile";
import { fantasyTeamService } from "../../services/fantasyTeamService";
import { athleteService } from "../../services/athleteService";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import { useAtom, useAtomValue } from "jotai";
import { fantasyTeamAthletesAtom, fantasyTeamAtom, remainingTeamBudgetAtom } from "../../state/myTeam.atoms";
import { IFantasyTeamAthlete, IUpdateFantasyTeamItem } from "../../types/fantasyTeamAthlete";
import { fantasyLeagueAtom } from "../../state/fantasyLeague.atoms";
import { playerToSwapInAtom, playerToSwapOutAtom, positionToSwapAtom } from "../../state/playerSwap.atoms";
import { useFetch } from "../../hooks/useFetch";
import { useSWRConfig } from "swr";
import { convertPositionNameToPositionObject } from "../../utils/athleteUtils";

// Define the context type
interface TeamActionsContextType {
  handlePlayerClick: (player: IFantasyTeamAthlete) => void;
  handlePositionSelect: (position: FantasyTeamPosition) => void;
  handleViewStats: (player: IFantasyTeamAthlete) => void;
  handleSwapPlayer: (player: IFantasyTeamAthlete) => void;
  fetchingMarketPlayers: boolean;
}

// Create the context
const TeamActionsContext = createContext<TeamActionsContextType | null>(null);

// Create a hook to use the context
export const useMyTeamScreenActions = () => {
  const context = useContext(TeamActionsContext);
  if (!context) {
    throw new Error("useTeamActions must be used within a TeamActionsProvider");
  }
  return context;
};

type Props = {
  children?: ReactNode
}

export function MyTeamScreenActionsProvider({ children }: Props) {

  const team = useAtomValue(fantasyTeamAtom);
  const [athletes] = useAtom(fantasyTeamAthletesAtom);
  const league = useAtomValue(fantasyLeagueAtom);
  const remainingTeamBudget = useAtomValue(remainingTeamBudgetAtom);

  const { mutate } = useSWRConfig()

  const { data: marketPlayersData, isLoading: loadingMarketPlayers } =
    useFetch("market-players", league?.official_league_id ?? "fall-back", athleteService.getRugbyAthletesByCompetition);

  const marketPlayers = marketPlayersData ?? [];

  const [showActionModal, setShowActionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete>();

  const [isSwapping, setIsSwapping] = useState(false);
  const [positionToSwap, setPositionToSwap] = useAtom(positionToSwapAtom);
  const [playerToSwapIn, setPlayerToSwapIn] = useAtom(playerToSwapInAtom);
  const [playerToSwapOut, setPlayerToSwapOut] = useAtom(playerToSwapOutAtom);

  const [teamUpdating, setTeamUpdating] = useState(false);

  // Get the player profile hook
  const { showPlayerProfile } = usePlayerProfile();

  const handlePlayerClick = (player: IFantasyTeamAthlete) => {
    console.log("Player clicked:", player);
    setSelectedPlayer(player);
    setShowActionModal(true);
  };

  const handleTeamAthleteViewStats = (player: IFantasyTeamAthlete) => {
    setShowActionModal(false);
    showPlayerProfile(player);
  };

  /** Starts player swap flow */
  const handleStartPlayerSwap = async (playerToBeReplaced: IFantasyTeamAthlete) => {

    setPlayerToSwapOut(playerToBeReplaced);
    const isSub = !playerToBeReplaced.is_starting;
    let newPositionToSwap = "any";


    // Map positions to the exact required format for position matching
    if (!isSub) {

      // if (toSwapOut.position.toLowerCase().includes("front-row")) {
      //   newPositionToSwap = "front-row";
      // } else if (toSwapOut.position.toLowerCase().includes("second-row")) {
      //   newPositionToSwap = "second-row";
      // } else if (toSwapOut.position.toLowerCase().includes("back-row")) {
      //   newPositionToSwap = "back-row";
      // } else if (toSwapOut.position.toLowerCase().includes("half-back")) {
      //   newPositionToSwap = "half-back";
      // } else if (toSwapOut.position.toLowerCase().includes("back")) {
      //   newPositionToSwap = "back";
      // }

      newPositionToSwap = playerToBeReplaced.position_class ?? "any";
    }


    console.log(
      "Position to swap set to:",
      newPositionToSwap,
      "Is super sub?",
      isSub
    );

    setPositionToSwap(newPositionToSwap);
    setIsSwapping(true);
    setSelectedPlayer(playerToBeReplaced); // Ensure selected player is set
    setShowActionModal(false);
  };

  /** Handle selecting a player on the player list modal */
  const handlePlayerListModalSelect = (player: RugbyPlayer) => {

    if (isSwapping) {
      setPlayerToSwapIn(player);
      setShowSwapModal(true);
      return;
    }

  };

  console.log(athletes);

  const handleConfirmSwap = async () => {
    const teamId = team?.id;
    const cannotSwap = !playerToSwapIn || !playerToSwapIn.price || !teamId
      || !playerToSwapOut || !playerToSwapIn.tracking_id;

    if (cannotSwap) return;

    try {

      setTeamUpdating(true);

      const updatedTeamAthletes: IUpdateFantasyTeamItem[] = athletes.map((a) => {
        return {
          team_id: teamId,
          athlete_id: a.tracking_id ?? "fall-back",
          purchase_price: a.price ?? 0,
          purchase_date: a.purchase_date ?? new Date(),
          is_starting: a.is_starting ?? false,
          slot: a.slot,
          score: a.score ?? 0
        }
      });

      /** Index to place swap player */
      const swapIndex = athletes.findIndex(
        (a) =>
          a.id === playerToSwapOut.id
      );

      if (swapIndex === -1) {
        console.error("Player not found in team");
        return;
      }

      // Create an update fantasy team item that the api can
      // understand

      const replacementAthlete: IUpdateFantasyTeamItem = {
        team_id: teamId,
        athlete_id: playerToSwapIn.tracking_id ?? "fall-back",
        purchase_price: playerToSwapIn.price ?? 0,
        purchase_date: new Date(),
        is_starting: playerToSwapOut.is_starting ?? false,
        slot: playerToSwapOut.slot,
        score: playerToSwapOut.score ?? 0
      }

      updatedTeamAthletes[swapIndex] = replacementAthlete;

      // Send the update to the server
      await fantasyTeamService.updateTeamAthletes(updatedTeamAthletes, teamId);

      console.log("Whats the team id ", team.id);
      await mutate(`team-athletes/${team.id}`);

      // Reset UI state
      setShowSwapModal(false);
      setSelectedPlayer(undefined);
      setIsSwapping(false);

    } catch (error) {
      console.error("Failed to swap player:", error);
    } finally {
      setTeamUpdating(false);
    }
  };

  const cancelSwap = () => {
    setShowSwapModal(false);
    setPlayerToSwapIn(undefined);
  };

  const closeAllModals = () => {
    setShowActionModal(false);
    setShowSwapModal(false);
    setIsSwapping(false);
    setSelectedPlayer(undefined);
    setPlayerToSwapOut(undefined);
  };

  // Handle position selection from the Edit Team view
  const handlePositionSelect = (position: Position) => {
    const playerId = position.player?.id;

    // Convert position to player format for the PlayerActionModal
    const playerForPosition: Player = {
      id: playerId?.toString() ?? '',
      name: position.player?.player_name || "",
      position: position.player?.position || "",
      position_class: position.player?.position || "",
      team: position.player?.team_name || "",
      points: position.player?.score || 0,
      form: position.player?.power_rank_rating || 0,
      price: position.player?.price || 0,
      is_super_sub: position.isSpecial || false,
      is_starting: !position.isSpecial,
      image: position.player?.image_url || "",
      nextFixture: "",
      athlete_id: position.player?.tracking_id ?? "fall-back",
      team_name: position.player?.team_name,
      tracking_id: position.player?.tracking_id ?? "fall-back",
      player_name: position.player?.player_name ?? 'fall-back'
    };

    // handlePlayerClick(playerForPosition);
  };

  // Create the context value
  const contextValue: TeamActionsContextType = {
    handlePlayerClick,
    handlePositionSelect,
    handleViewStats: handleTeamAthleteViewStats,
    handleSwapPlayer: handleStartPlayerSwap,
    fetchingMarketPlayers: loadingMarketPlayers,
  };

  return (
    <TeamActionsContext.Provider value={contextValue}>
      {/* Render children components that can access the context */}
      {children}

      {/* Player Action Modal */}
      <AnimatePresence>

        {showActionModal && selectedPlayer && (
          <PlayerActionModal
            player={selectedPlayer}
            onClose={() => setShowActionModal(false)}
            onViewStats={handleTeamAthleteViewStats}
            onSwapPlayer={handleStartPlayerSwap}
            league={league}
          />
        )}

      </AnimatePresence>

      {/* Loading indicator when fetching market players but not yet showing modal */}
      {loadingMarketPlayers && isSwapping && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader size={32} className="text-primary-500 animate-spin mb-4" />
            <p className="text-gray-800 dark:text-gray-200">
              Loading players...
            </p>
          </div>
        </div>
      )}

      {/* Player Selection Modal for Swapping */}
      {isSwapping && selectedPlayer && !loadingMarketPlayers && (
        <PlayerSelectionModal
          visible={isSwapping}
          selectedPosition={convertPositionNameToPositionObject(positionToSwap)}
          players={marketPlayers}
          remainingBudget={remainingTeamBudget + (playerToSwapOut?.purchase_price ?? 0)}
          selectedPlayers={athletes}
          handlePlayerSelect={handlePlayerListModalSelect}
          competitionId={league?.official_league_id ?? team?.official_league_id}
          onClose={() => setIsSwapping(false)}
          roundId={league?.start_round ?? 1}
          roundStart={league?.start_round ?? undefined}
          roundEnd={league?.end_round ?? undefined}
        />
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSwapModal && playerToSwapIn && playerToSwapOut && (
          <SwapConfirmationModal
            onClose={cancelSwap}
            onConfirm={handleConfirmSwap}
            isUpdating={teamUpdating}
          />
        )}
      </AnimatePresence>
    </TeamActionsContext.Provider>
  );
};
