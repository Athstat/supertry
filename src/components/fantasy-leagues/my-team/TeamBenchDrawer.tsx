import { CirclePlus, Coins } from "lucide-react";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { formatPosition } from "../../../utils/athleteUtils";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";
import BottomSheetHandle from "../../ui/BottomSheetHandle";
import { useFantasyLeagueTeam } from "./FantasyLeagueTeamProvider";
import { twMerge } from "tailwind-merge";


type Props = {
  superSubSlot: IFantasyLeagueTeamSlot,
  leagueRound: IFantasyLeagueRound,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void
}

/** Renders a bottom drawer for team subs */
export default function TeamBenchDrawer({ superSubSlot, onPlayerClick }: Props) {

  const handlePlayerClick = () => {
    if (onPlayerClick && superSubSlot.athlete) {
      onPlayerClick(superSubSlot.athlete);
    }
  }

  const { athlete } = superSubSlot;
  const isSlotEmpty = athlete === undefined || athlete === null;

  return (
    <div className={twMerge(
      "max-h-[130px] fixed bottom-0 left-0 w-full min-h-[130px] flex flex-col items-center justify-center",
      isSlotEmpty && "max-h-[150px]"
    )} >
      <div className="lg:max-w-[40%] md:max-w-[50%]  w-full bg-white dark:bg-[#0D0D0D] rounded-t-2xl drop-shadow-2xl shadow-[0_-8px_20px_rgba(0,0,0,0.3)]">

        <div className="w-full flex flex-col gap-2 p-3" >
          <BottomSheetHandle className="bg-slate-800" />

          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Super Subsitute
          </p>

          {athlete && (
            <SubPlayerCard
              player={athlete}
              onClick={handlePlayerClick}
            />
          )}

          {isSlotEmpty && (
            <EmptySuperSubSlot
              slot={superSubSlot}
            />
          )}

        </div>
      </div>
    </div>
  )
}


type SubPlayerProps = {
  player: IFantasyTeamAthlete,
  onClick: () => void
}

function SubPlayerCard({ player, onClick }: SubPlayerProps) {

  const { position_class, purchase_price } = player;


  return (
    <div
      className="w-full border-none p-2 flex flex-row items-center justify-between"
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-2">

        <PlayerMugshot
          url={player.image_url}
        />

        <div className="flex flex-col items-start justify-center" >
          <p className="text font-semibold" >{player.player_name}</p>
          <SecondaryText className="text-xs" >{position_class ? formatPosition(position_class) : 'Substitute'}</SecondaryText>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 mr-2" >
        <div className="flex flex-row items-center gap-1" >
          <Coins className="w-4 h-4 text-yellow-500" />
          <p className="text-sm" >{purchase_price}</p>
        </div>
      </div>

    </div>
  )
}

type EmptySlotProps = {
  slot: IFantasyLeagueTeamSlot
}

function EmptySuperSubSlot({ slot }: EmptySlotProps) {

  const { initateSwapOnEmptySlot } = useFantasyLeagueTeam();

  const handleClick = () => {
    initateSwapOnEmptySlot(slot);
  }

  return (
    <div
      className="w-full cursor-pointer border-4 rounded-xl dark:text-slate-600 border-dotted border-slate-100 dark:border-slate-700/80 p-2.5 flex flex-col items-center justify-center"
      onClick={handleClick}
    >
      <div>
        <CirclePlus />
      </div>

      <p className="text-sm font-semibold" >Super Sub</p>
    </div>
  )
}