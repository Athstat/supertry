import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { RugbyPitch3DRaster } from '../ui/containers/RugbyPitch';
import { PlayerPitchCard } from './pitch_card/PlayerPitchCard';
import { twMerge } from 'tailwind-merge';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IFantasyLeagueTeamSlot, SlotCardPosition } from '../../types/fantasyLeagueTeam';
import { useFantasyTeam } from '../../hooks/fantasy/useFantasyTeam';
import { EmptySlotPitchCard } from './pitch_card/EmptySlotPitchCard';

interface TeamFormationProps {
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  marginCN?: string,
  firstRowMargin?: string
}

/** Renders a 3 Dimensional-looking pitch view */
export function FantasyTeamFormation3D({ onPlayerClick, marginCN, firstRowMargin }: TeamFormationProps) {

  const { slots } = useFantasyTeam();

  const slotPositions = [
    { x: 20, y: 10, slot: 1 },
    { x: 80, y: 10, slot: 2 },
    { x: 50, y: 28, slot: 3 },
    { x: 35, y: 45, slot: 4 },
    { x: 80, y: 50, slot: 5 },
  ]


  return (
    <div className="relative w-full mt-10  flex flex-col justify-center">

      <RugbyPitch3DRaster className={twMerge(
        'mt-12',
        marginCN
      )} />

      <div className='top-0  left-0 absolute w-full p-3 flex flex-col items-center justify-center gap-0' >
        <div className={twMerge(
          'w-full h-full p-2 relative min-h-[750px] lg:min-h-[800px] md:min-w-[670px] lg:min-w-[450px] lg:max-w-[150px]',
          firstRowMargin
        )} >
          {slotPositions.map((pos) => {

            const slotNumber = pos.slot;
            const slot = slots.find((s) => s.slotNumber === slotNumber);

            if (!slot) {
              return null;
            }

            return (
              <SlotCard
                key={slot.slotNumber}
                slot={slot}
                position={pos}
                onPlayerClick={onPlayerClick}
              />
            )

          })}
        </div>
      </div>

    </div>
  );
}

type SlotCardProps = {
  slot: IFantasyLeagueTeamSlot,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void,
  round?: IFantasyLeagueRound,
  className?: string,
  position: SlotCardPosition
}

function SlotCard({ slot, onPlayerClick, position }: SlotCardProps) {

  const { athlete } = slot;

  if (!athlete) {
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

      <PlayerPitchCard
        player={athlete}
        onClick={onPlayerClick}
        key={slot.slotNumber}
      />

    </div>
  )
}