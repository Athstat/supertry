import { Lock } from "lucide-react";
import { useMyTeamSlot } from "../../../hooks/fantasy/my_team/useMyTeamSlot";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { IFantasyLeagueTeamSlot, SlotCardPosition } from "../../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { EmptySlotPitchCard } from "./EmptySlotPitchCard";
import { PlayerPitchCard } from "./PlayerPitchCard";

type SlotCardProps = {
  slot: IFantasyLeagueTeamSlot,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void,
  round?: IFantasyLeagueRound,
  className?: string,
  position: SlotCardPosition
}

/** Renders a single slot on a fantasy team */
export function MyTeamSlotCard({ slot, onPlayerClick, position }: SlotCardProps) {

  const { isShowPlayerLock, slotType } = useMyTeamSlot();
  const { athlete } = slot;

  if (slotType === "empty" || !athlete) {
    return (
      <div
        className="absolute"
        style={{
          left: `${position.x}%`,
          top: `${position.y + 4}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <EmptySlotPitchCard
          slot={slot}
        />
      </div>
    )
  };

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className='relative' >
        <PlayerPitchCard
          player={athlete}
          onClick={onPlayerClick}
          key={slot.slotNumber}
        />

        {isShowPlayerLock && (
          <div className='absolute bg-yellow-500 p-1 rounded-md z-[30] top-5 left-0' >
            <Lock  className='w-4 h-4 text-black' />
          </div>
        )}
      </div>

    </div>
  )
}