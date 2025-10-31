import { Coins, Lock } from "lucide-react";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import PlayerMugshot from "../shared/PlayerMugshot";
import AvailabilityIcon from "../players/availability/AvailabilityIcon";
import BottomSheetView from "../ui/BottomSheetView";
import CloseButton from "../shared/buttons/CloseButton";
import SecondaryText from "../shared/SecondaryText";
import QuickActionButton from "../ui/QuickActionButton";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import RoundedCard from "../shared/RoundedCard";
import SuperSubPill from "./SuperSubPill";
import { useFantasyLeagueTeam } from "../fantasy-leagues/my-team/FantasyLeagueTeamProvider";
import { useMemo } from "react";
import { CaptainsArmBand } from "../fixtures/FixtureRosterList";
import { isLeagueRoundLocked } from "../../utils/leaguesUtils";
import { twMerge } from "tailwind-merge";

type PlayerActionModalProps = {
  player: IFantasyTeamAthlete;
  onClose: () => void;
  onViewProfile: (player: IFantasyTeamAthlete) => void;
  league?: IFantasyLeagueRound,
  onViewPointsBreakdown: (player: IFantasyTeamAthlete) => void,
}

export function PlayerActionModal({
  player,
  onClose,
  onViewProfile,
  onViewPointsBreakdown,
  league
}: PlayerActionModalProps) {

  // const key = swrFetchKeys.getAthleteById(player.tracking_id);
  // const { data: info, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteById(player.tracking_id));

  const { initiateSwap, removePlayerAtSlot, setTeamCaptainAtSlot, slots, teamCaptain } = useFantasyLeagueTeam();
  const isSub = !player.is_starting;

  const playerSlot = useMemo(() => {
    return slots.find((s) => {
      return s.athlete?.tracking_id === player.tracking_id
    })
  }, [slots, player]);

  const isTeamCaptain = teamCaptain?.tracking_id === player.tracking_id;
  const isLocked = league && isLeagueRoundLocked(league);

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

    if (playerSlot && !isLocked) {
      onClose();
      initiateSwap(playerSlot);
    }
  }

  const handleRemovePlayer = () => {
    if (playerSlot && !isLocked) {
      onClose();
      removePlayerAtSlot(playerSlot.slotNumber);
    }
  }

  const handleMakePlayerCaptain = () => {
    if (playerSlot && !isLocked) {
      setTeamCaptainAtSlot(playerSlot.slotNumber);
    }
  }

  

  return (
    <BottomSheetView
      className="min-h-[400px] py-4 px-6"
      key={player.tracking_id}
    >
      <div className="flex flex-col gap-4" >

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2" >

            <AvailabilityIcon
              athlete={player}
            />

            <p className="text-lg font-bold" >{player.player_name}</p>

            {isSub && <SuperSubPill />}
          </div>

          <CloseButton
            highlight
            onClick={onClose}
          />

        </div>

        <div className="flex flex-row items-center justify-between" >
          <div>
            <PlayerMugshot
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-800"
              url={player.image_url}
            />
          </div>

          <div className="flex flex-col items-center justify-center" >
            <div className="flex flex-row items-center gap-1" >
              <Coins className="text-yellow-500 w-6 h-6" />
              <p className="text-lg" >{player.purchase_price}</p>
            </div>
            <SecondaryText>
              Purchase Price
            </SecondaryText>
          </div>

          <div className="flex flex-col items-center justify-end" >
            <p className="text-xl font-bold" >{player.power_rank_rating}</p>
            <SecondaryText>Power Ranking</SecondaryText>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2" >
          <QuickActionButton
            onClick={handleViewProfile}
            className="items-center justify-center"
          >
            Full Profile
          </QuickActionButton>

          <QuickActionButton
            onClick={handleViewPointsBreak}
            className="items-center justify-center"
          >
            Points Breakdown
          </QuickActionButton>
        </div>

      </div>

      {/* <div>
        <PowerRankingChartTab 
          player={player}
        />
      </div> */}
      <div className="mt-3" >
        <p>Quick Actions</p>
      </div>

      <div className={twMerge(
        "flex flex-row items-center justify-center gap-2",
        isLocked && "opacity-60"
      )} >
        <PrimaryButton
          className="bg-purple-100 text-purple-700 dark:text-purple-300 dark:bg-purple-900/30 dark:hover:bg-purple-900 dark:border-purple-500/50"
          onClick={handleInitSwap}
        >
          Swap
          {isLocked && <Lock className="w-4 h-4" />}
        </PrimaryButton>
        <PrimaryButton
          className="bg-red-100 text-red-700 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900 dark:border-red-500/40"
          onClick={handleRemovePlayer}
        >
          Remove
          {isLocked && <Lock className="w-4 h-4" />}
        </PrimaryButton>
      </div>

      <div className={twMerge(
        isLocked && "opacity-60"
      )} >
        {!isTeamCaptain && <RoundedCard
          className={
            "border-none hover:dark:text-slate-300 cursor-pointer  bg-slate-800 dark:text-slate-400 p-2.5 items-center justify-center flex flex-row gap-1"
          }
          onClick={handleMakePlayerCaptain}
        >
          Make Captain
          {isLocked && <Lock className="w-4 h-4" />}
        </RoundedCard>}

        {isTeamCaptain && <div
          className={
            "bg-transparent  dark:bg-transparent cursor-pointer dark:text-slate-400 border dark:border-slate-700 rounded-xl p-2.5 items-center justify-center gap-1 flex flex-row"
          }
        >
          Team Captain
          {isLocked && <Lock className="w-4 h-4" />}
          <CaptainsArmBand />
        </div>}
      </div>


    </BottomSheetView>
  );
}
