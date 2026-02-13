import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { RugbyPitch3DRaster } from '../ui/containers/RugbyPitch';
import { twMerge } from 'tailwind-merge';
import { useMyTeam } from '../../hooks/fantasy/my_team/useMyTeam';
import { MyTeamSlotCard } from './pitch_card/MyTeamSlotCard';
import MyTeamSlotProvider from '../../contexts/fantasy/my_team/MyTeamSlotContext';

interface TeamFormationProps {
  onPlayerClick: (player: IFantasyTeamAthlete) => void;
  marginCN?: string,
  firstRowMargin?: string,
  className?: string
}

/** Renders a 3 Dimensional-looking pitch view */
export function FantasyTeamFormation3D({ onPlayerClick, marginCN, firstRowMargin, className }: TeamFormationProps) {

  const { slots } = useMyTeam();

  const slotPositions = [
    { x: 20, y: 10, slot: 1 },
    { x: 80, y: 10, slot: 2 },
    { x: 50, y: 28, slot: 3 },
    { x: 35, y: 45, slot: 4 },
    { x: 80, y: 50, slot: 5 },
  ]


  return (
    <div className={twMerge(
      "relative w-full  flex flex-col justify-center",
      className
    )}>

      <RugbyPitch3DRaster className={twMerge(
        'mt-12',
        marginCN,
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
              <MyTeamSlotProvider
                slot={slot}
                key={`${slot.slotNumber}/${slot.athlete?.athlete_id}`}
              >
                <MyTeamSlotCard
                  slot={slot}
                  position={pos}
                  onPlayerClick={onPlayerClick}
                />
              </MyTeamSlotProvider>
            )

          })}
        </div>
      </div>

    </div>
  );
}
