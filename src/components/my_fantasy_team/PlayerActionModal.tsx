import { Coins, Lock } from "lucide-react";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import PlayerMugshot from "../player/PlayerMugshot";
import AvailabilityIcon, { RoundAvailabilityText } from "../players/availability/AvailabilityIcon";
import CloseButton from "../ui/buttons/CloseButton";
import SecondaryText from "../ui/typography/SecondaryText";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SuperSubPill from "./SuperSubPill";
import { Activity, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import MatchPrCard from "../rankings/MatchPrCard";
import QuickActionButton from "../ui/buttons/QuickActionButton";
import RoundedCard from "../ui/cards/RoundedCard";
import BottomSheetView from "../ui/modals/BottomSheetView";
import { usePlayerSeasonTeam } from "../../hooks/seasons/useSeasonTeams";
import WarningCard from "../ui/cards/WarningCard";
import { useMyTeam } from "../../hooks/fantasy/my_team/useMyTeam";
import { useMyTeamActions } from "../../hooks/fantasy/my_team/useMyTeamActions";
import { useMyTeamModals } from "../../hooks/fantasy/my_team/useMyTeamModals";
import { formatPosition } from "../../utils/athletes/athleteUtils";
import { isSeasonRoundStarted } from "../../utils/leaguesUtils";
import { CaptainsArmBand } from "../player/CaptainsArmBand";

type PlayerActionModalProps = {
  player: IFantasyTeamAthlete;
  onClose: () => void;
  onViewProfile: (player: IFantasyTeamAthlete) => void;
  onViewPointsBreakdown?: (player: IFantasyTeamAthlete) => void,
}

export function PlayerActionModal({
  player,
  onClose,
  onViewProfile,
  onViewPointsBreakdown,
}: PlayerActionModalProps) {

  const { seasonTeam } = usePlayerSeasonTeam(player.athlete);
  const { isPlayerLocked, isShowPlayerLock, round, teamCaptain, isReadOnly } = useMyTeam();
  const { initiateSwap, removePlayer, setCaptain, slots, substituteIn, subOutCandidate } = useMyTeamActions();
  const { handleCloseActionModal } = useMyTeamModals();

  const isSub = !player.is_starting;

  const playerSlot = useMemo(() => {
    return slots.find((s) => {
      return s.athlete?.tracking_id === player.tracking_id
    })
  }, [slots, player]);

  const isTeamCaptain = teamCaptain?.athlete?.athlete?.tracking_id === player.tracking_id;

  const isSlotLocked = isPlayerLocked(player.athlete);
  const showSlotLockedWarning = isShowPlayerLock(player.athlete);
  const isTeamCaptainSlotLocked = isPlayerLocked(teamCaptain?.athlete?.athlete);

  const isTeamCaptainLocked = round && isSeasonRoundStarted(round) && isTeamCaptainSlotLocked && (teamCaptain !== undefined);

  const hideControls = isReadOnly || isSlotLocked;

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(player);
    }
  }

  const handleViewPointsBreak = () => {
    if (onViewPointsBreakdown) {
      onViewPointsBreakdown(player);
    }
  }

  const handleInitSwap = () => {

    if (playerSlot && !isSlotLocked) {
      onClose();
      initiateSwap(playerSlot);
    }
  }

  const handleRemovePlayer = () => {
    if (playerSlot && !isSlotLocked) {
      onClose();
      removePlayer(playerSlot.slotNumber);
    }
  }

  const handleMakePlayerCaptain = () => {
    if (playerSlot && !isSlotLocked && !isTeamCaptainLocked && !isTeamCaptain) {
      setCaptain(playerSlot.slotNumber);
    }
  }

  const handleSubIn = () => {
    substituteIn();
    handleCloseActionModal();
  }

  return (
    <BottomSheetView
      className={twMerge(
        "max-h-[640px] text-sm min-h-[200px] py-4 px-6 border-t dark:border-slate-700",
        isReadOnly && "max-h-[300px] min-h-[260px]"
      )}
      hideHandle
      key={player.tracking_id}
      onClickOutside={onClose}
    >
      <div className="flex flex-col gap-4" >

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2" >

            {player.athlete && <AvailabilityIcon
              athlete={player.athlete}
            />}

            <p className="text-lg font-bold text-nowrap truncate" >{player.player_name}</p>
            <SecondaryText>{formatPosition(player.position_class)}</SecondaryText>

            {isSub && <SuperSubPill />}
          </div>

          <CloseButton
            highlight
            onClick={onClose}
          />

        </div>

        <div className="flex flex-row items-center justify-between" >
          <div className="" >
            {<PlayerMugshot
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-800"
              url={player.image_url}
              teamId={seasonTeam?.athstat_id}
            />}
          </div>

          <div className="flex flex-col items-center justify-center" >
            <div className="flex flex-row items-center gap-1" >
              <p className="text-lg" >{player.purchase_price}</p>
              <Coins className="text-yellow-500 w-4 h-4" />
            </div>

            <SecondaryText className="text-xs" >
              Purchase Price
            </SecondaryText>
            <SecondaryText className="text-xs" >(Scrum Coins)</SecondaryText>

          </div>

          <div className="flex flex-col items-center justify-end gap-1" >
            <MatchPrCard className="text-xl w-10 h-10" pr={player.power_rank_rating} />
            <SecondaryText className="text-xs" >Power Ranking</SecondaryText>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2" >
          <QuickActionButton
            onClick={handleViewProfile}
            className="items-center justify-center"
          >
            Full Profile
          </QuickActionButton>

          {onViewPointsBreakdown && <QuickActionButton
            onClick={handleViewPointsBreak}
            className="items-center justify-center"
          >
            Points Breakdown
          </QuickActionButton>}
        </div>

      </div>

      {round && player.athlete && (
        <RoundAvailabilityText
          round={round}
          athlete={player.athlete}
        />
      )}

      {/* <div>
        <PowerRankingChartTab 
          player={player}
        />
      </div> */}

      {showSlotLockedWarning && (
        <WarningCard className="text-sm lg:text-sm" >
          <p>
            <strong>{player.player_name}{player.player_name.endsWith('s') ? "'" : "'s"}</strong> slot is locked, therefore you can't remove or swap {player.gender === "F" ? 'her' : 'him'} out of your team, until the round ends
          </p>
        </WarningCard>
      )}

      <Activity mode={(hideControls) ? "hidden" : "visible"} >

        <div className="mt-3" >
          <p>Quick Actions</p>
        </div>

        <div className={twMerge(
          "flex flex-row items-center justify-center gap-2",
          isSlotLocked && "opacity-60"
        )} >
          <PrimaryButton
            className="bg-purple-100 text-purple-700 py-4 dark:text-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-900 dark:border-purple-500/50 border-purple-500 hover:bg-purple-200"
            onClick={handleInitSwap}
          >
            Swap
            {isSlotLocked && <Lock className="w-4 h-4" />}
          </PrimaryButton>
          <PrimaryButton
            className="bg-red-100 text-red-700 py-4 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900 dark:border-red-500/40 border-red-500 hover:bg-red-200"
            onClick={handleRemovePlayer}
          >
            Remove
            {isSlotLocked && <Lock className="w-4 h-4" />}
          </PrimaryButton>
        </div>

      </Activity>


      <Activity mode={(hideControls) ? "hidden" : "visible"} >
        <div className={twMerge(
          isSlotLocked && "opacity-60"
        )} >

          {!isSub && !isTeamCaptainLocked && (
            <RoundedCard
              className={
                "border-none hover:dark:text-slate-300 cursor-pointer  bg-slate-200 dark:bg-slate-700 dark:text-slate-200 p-2.5 py-4 items-center justify-center flex flex-row gap-1"
              }
              onClick={handleMakePlayerCaptain}
            >
              {isTeamCaptain ? "Team Captain" : "Make Team Captain"}
              {isTeamCaptain && <CaptainsArmBand className="h-4" />}
              {isTeamCaptainLocked && <Lock className="w-4 h-4" />}
            </RoundedCard>
          )}

          {isSub && subOutCandidate?.athlete && (
            <RoundedCard
              className={
                "border-none hover:dark:text-slate-300 cursor-pointer  bg-slate-200 dark:bg-slate-700 dark:text-slate-200 p-2.5 py-4 items-center justify-center flex flex-row gap-1"
              }
              onClick={handleSubIn}
            >
              Subsitute In for {subOutCandidate?.athlete?.athstat_lastname}
              {isSlotLocked && <Lock className="w-4 h-4" />}
            </RoundedCard>
          )}

        </div>
      </Activity>

    </BottomSheetView>
  );
}
