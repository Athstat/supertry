import { ArrowLeftRight, Coins } from "lucide-react";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { formatPosition } from "../../../utils/athleteUtils";
import PlayerMugshot from "../../shared/PlayerMugshot";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import BottomSheetHandle from "../../ui/BottomSheetHandle";
import { EmptyPlayerCard } from "./EditableTeamSlotItem";


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

  return (
    <div className="max-h-[130px] min-h-[130px] fixed bottom-0 left-0 w-full bg-white dark:bg-[#0D0D0D] rounded-t-2xl drop-shadow-2xl shadow-[0_-8px_20px_rgba(0,0,0,0.3)]">

      <div className="w-full flex flex-col gap-1 p-3" >
        <BottomSheetHandle className="bg-slate-800" />

        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Super Substitute
        </p>

        <div className="">
          {superSubSlot.athlete ? (
            <SubPlayerCard
              player={superSubSlot.athlete}
              onClick={handlePlayerClick}
            />
          ) : (
            <EmptyPlayerCard
              slot={superSubSlot}
              className='h-[100px]'
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
    <RoundedCard
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
        <div>
          <button className="w-7 h-7 bg-blue-100 hover:bg-blue-200 flex items-center justify-center rounded-md" >
            <ArrowLeftRight className="w-5 h-5 text-blue-600 " />
          </button>
        </div>
      </div>

    </RoundedCard>
  )
}